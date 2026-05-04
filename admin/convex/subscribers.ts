import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Add a new email subscriber
export const addSubscriber = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if already exists
    const existing = await ctx.db
      .query("subscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) return existing._id;

    return await ctx.db.insert("subscribers", {
      email: args.email,
    });
  },
});

// List all subscribers (For Admin Panel)
export const listSubscribers = query({
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});
