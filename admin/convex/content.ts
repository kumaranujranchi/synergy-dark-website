import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add new content (Blog or News)
export const addContent = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    body: v.string(),
    imageUrl: v.optional(v.string()),
    imageAltText: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    author: v.string(),
    isPublished: v.boolean(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content", {
      ...args,
      publishedAt: Date.now(),
    });
  },
});

// Get content by slug (For main site)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

// List published content by type (For main site)
export const listPublished = query({
  args: { type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("content")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .collect();
  },
});

// List all (For Admin Panel)
export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("content").order("desc").collect();
  },
});

// Delete content
export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle publish status
export const togglePublish = mutation({
  args: { id: v.id("content"), isPublished: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPublished: args.isPublished });
  },
});

// Get Next/Prev content
export const getAdjacent = query({
  args: { currentId: v.id("content"), type: v.string() },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("content")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("isPublished"), true))
      .order("desc")
      .collect();

    const currentIndex = all.findIndex(item => item._id === args.currentId);
    
    return {
      prev: currentIndex > 0 ? all[currentIndex - 1] : null,
      next: currentIndex < all.length - 1 ? all[currentIndex + 1] : null,
    };
  },
});
