import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a comment
export const addComment = mutation({
  args: {
    contentId: v.id("content"),
    name: v.string(),
    email: v.string(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("comments", {
      ...args,
      isApproved: true, // Default to true for now as requested, or false if moderation is needed
      createdAt: Date.now(),
    });
  },
});

// List comments for a post
export const listComments = query({
  args: { contentId: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_content", (q) => q.eq("contentId", args.contentId).eq("isApproved", true))
      .order("desc")
      .collect();
  },
});

// List latest comments (Global for Sidebar)
export const listRecentGlobal = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_content") // Assuming we want approved ones, might need to adjust index or filter
      .filter((q) => q.eq(q.field("isApproved"), true))
      .order("desc")
      .take(4);
  },
});
