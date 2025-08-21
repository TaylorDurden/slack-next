import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    return ctx.db
      .query("workspaces")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getById = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found!");
    }

    if (workspace.userId !== userId) {
      throw new Error("Unauthorized access to workspace!");
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
      throw new Error("Unauthorized!");
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
      throw new Error("A workspace with this name already exists!");
    }

    // Generate a unique join code
    const joinCode = generateJoinCode();

    const workspaceId = await ctx.db.insert("workspaces", {
      name: trimmedName,
      userId,
      joinCode,
    });

    return workspaceId;
  },
});

export const update = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found!");
    }

    if (workspace.userId !== userId) {
      throw new Error("Unauthorized access to workspace!");
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
          q.and(
            q.eq(q.field("userId"), userId),
            q.eq(q.field("name"), trimmedName),
            q.neq(q.field("_id"), args.workspaceId)
          )
        )
        .first();

      if (existingWorkspace) {
        throw new Error("A workspace with this name already exists!");
      }

      updates.name = trimmedName;
    }

    if (Object.keys(updates).length === 0) {
      return args.workspaceId;
    }

    await ctx.db.patch(args.workspaceId, updates);
    return args.workspaceId;
  },
});

export const remove = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized!");
    }

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found!");
    }

    if (workspace.userId !== userId) {
      throw new Error("Unauthorized access to workspace!");
    }

    await ctx.db.delete(args.workspaceId);
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
