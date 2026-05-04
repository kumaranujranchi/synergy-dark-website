import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a new project
export const addProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    imageUrl: v.string(),
    client: v.optional(v.string()),
    projectUrl: v.optional(v.string()),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});

// List all projects (Ordered)
export const listProjects = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("asc").collect();
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
