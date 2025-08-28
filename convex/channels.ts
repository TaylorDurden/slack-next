import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique();

    if (!member) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return channels;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", userId))
      .unique();

    if (!member || member.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // Validate channel name
    let trimmedName = args.name.trim();
    if (!trimmedName) {
      throw new Error("Channel name is required!");
    }

    if (trimmedName.length < 3) {
      throw new Error("Channel name must be at least 3 characters!");
    }

    if (trimmedName.length > 50) {
      throw new Error("Channel name must be less than 50 characters!");
    }
    trimmedName = trimmedName.replace(/\s+/g, "-").toLowerCase();

    // Check if user already has a channel with the same name
    const existingChannel = await ctx.db
      .query("channels")
      .filter((q) => q.and(q.eq(q.field("name"), args.name), q.eq(q.field("workspaceId"), args.workspaceId)))
      .first();

    if (existingChannel) {
      throw new Error("Channel with this name already exists!");
    }

    return await ctx.db.insert("channels", {
      name: args.name,
      workspaceId: args.workspaceId,
    });
  },
});
