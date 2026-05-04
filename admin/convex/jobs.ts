import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Post a new job
export const postJob = mutation({
  args: {
    title: v.string(),
    department: v.string(),
    location: v.string(),
    type: v.string(),
    description: v.string(),
    salaryRange: v.optional(v.string()),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobs", {
      ...args,
      postedAt: Date.now(),
    });
  },
});

// List all jobs
export const listJobs = query({
  handler: async (ctx) => {
    return await ctx.db.query("jobs").order("desc").collect();
  },
});

// Toggle job status
export const toggleJobStatus = mutation({
  args: { id: v.id("jobs"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: args.isActive });
  },
});
