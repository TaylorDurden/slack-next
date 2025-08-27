import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const workspaceIds = members.map((member) => member.workspaceId);
    const workspaces = [];

    for (const workspaceId of workspaceIds) {
      const workspace = await ctx.db.get(workspaceId);
      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  },
});

export const getById = query({
  args: { id: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if (!member) {
      return null;
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      return null;
    }

    if (workspace.userId !== userId) {
      return null;
    }

    return workspace;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Validate workspace name
    const trimmedName = args.name.trim();
    if (!trimmedName) {
      throw new Error("Workspace name is required!");
    }

    if (trimmedName.length < 3) {
      throw new Error("Workspace name must be at least 3 characters!");
    }

    if (trimmedName.length > 50) {
      throw new Error("Workspace name must be less than 50 characters!");
    }

    // Check if user already has a workspace with the same name
    const existingWorkspace = await ctx.db
      .query("workspaces")
      .filter((q) => q.and(q.eq(q.field("userId"), userId), q.eq(q.field("name"), trimmedName)))
      .first();

    if (existingWorkspace) {
      return null;
    }

    // Generate a unique join code
    const joinCode = generateJoinCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: trimmedName,
      userId,
      joinCode,
    });

    await ctx.db.insert("members", {
      userId,
      workspaceId,
      role: "admin",
    });

    await ctx.db.insert("channels", {
      name: "General",
      workspaceId,
    });

    return workspaceId;
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if (!member || member.role !== "admin") {
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      return null;
    }

    if (workspace.userId !== userId) {
      return null;
    }

    const updates: { name?: string } = {};

    if (args.name !== undefined) {
      const trimmedName = args.name.trim();
      if (!trimmedName) {
        throw new Error("Workspace name is required!");
      }

      if (trimmedName.length < 3) {
        throw new Error("Workspace name must be at least 3 characters!");
      }

      if (trimmedName.length > 50) {
        throw new Error("Workspace name must be less than 50 characters!");
      }

      // Check if user already has another workspace with the same name
      const existingWorkspace = await ctx.db
        .query("workspaces")
        .filter((q) =>
          q.and(q.eq(q.field("userId"), userId), q.eq(q.field("name"), trimmedName), q.neq(q.field("_id"), args.id))
        )
        .first();

      if (existingWorkspace) {
        return null;
      }

      updates.name = trimmedName;
    }

    if (Object.keys(updates).length === 0) {
      return args.id;
    }

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const workspace = await ctx.db.get(args.id);
    if (!workspace) {
      return null;
    }

    if (workspace.userId !== userId) {
      return null;
    }

    const member = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_and_user_id", (q) => q.eq("workspaceId", args.id).eq("userId", userId))
      .unique();

    if (!member || member.role !== "admin") {
      return null;
    }

    await ctx.db.delete(args.id);
    // delete associated members
    const [members] = await Promise.all([
      ctx.db
        .query("members")
        .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
        .collect(),
    ]);
    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    return true;
  },
});

// Helper function to generate a unique join code
function generateJoinCode(): string {
  // Generate a 6-character alphanumeric code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
