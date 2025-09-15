import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

/**
 * Retrieves user information from the database by user ID.
 */
const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

/**
 * Retrieves member information from the database by member ID.
 */
const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

/**
 * Retrieves all reactions associated with a specific message.
 */
const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

/**
 * Retrieves thread information for a message, including:
 * - Total count of replies
 * - Last reply author's image
 * - Last reply timestamp
 */
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  // Get all replies to the message
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  // Get information about the last reply
  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);
  if (!lastMessageMember) {
    return {
      count: messages.length,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage._creationTime,
  };
};

/**
 * Finds a member in a workspace by user ID.
 */
const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
  return ctx.db
    .query("members")
    .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .unique();
};

/**
 * Retrieves messages based on provided filters with pagination support.
 * @param ctx - The Convex context object
 * @param args - Query arguments
 * @param args.channelId - Optional ID of the channel to filter messages from
 * @param args.conversationId - Optional ID of the conversation to filter messages from
 * @param args.parentMessageId - Optional ID of the parent message to get replies for
 * @param args.paginationOpts - Pagination options for the query
 * @throws {Error} When user is not authenticated
 * @throws {Error} When parent message is not found (if parentMessageId is provided)
 * @returns Paginated results of messages matching the filter criteria
 */
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    // Verify user authentication
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Initialize conversation ID from args
    let _conversationId = args.conversationId;

    // If we're getting thread replies without channel/conversation context,
    // lookup the parent message to get its conversation ID
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    // Query messages using compound index for efficient filtering
    const results = await ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _conversationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            // Populate member and user information
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;

            if (!member || !user) {
              return null;
            }

            // Get reactions, thread info, and message image
            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const image = message.image ? await ctx.storage.getUrl(message.image) : undefined;

            // Count reactions and deduplicate them
            const reactionsCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((x) => x.value === reaction.value).length,
              };
            });

            // Group reactions by value and combine member IDs
            const dedupedReactions = reactionsCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find((r) => r.value === reaction.value);

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(new Set([...existingReaction.memberIds, reaction.memberId]));
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }

                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            // Remove memberId from final reaction objects
            const reactionWithoutMemberIdProperty = dedupedReactions.map(({ memberId, ...rest }) => rest);

            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timestamp,
            };
          })
        )
      ).filter((message): message is NonNullable<typeof message> => message !== null),
    };
  },
});

/**
 * Creates a new message in a channel, conversation, or thread.
 */
export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    // Verify user authentication and workspace membership
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("Not a member of this workspace");
    }

    // Handle thread replies in 1:1 conversations
    let _conversationId = args.conversationId;
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);
      if (!parentMessage) {
        throw new Error("Parent message not found");
      }
      _conversationId = parentMessage.conversationId;
    }

    // Create the new message
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _conversationId,
    });
    return messageId;
  },
});
