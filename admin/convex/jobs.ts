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
    customQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          required: v.boolean(),
        })
      )
    ),
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

// Get a job by ID
export const getJobById = query({
  args: { id: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Toggle job status
export const toggleJobStatus = mutation({
  args: { id: v.id("jobs"), isActive: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isActive: args.isActive });
  },
});

// Submit a job application
export const submitApplication = mutation({
  args: {
    jobId: v.id("jobs"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resumeUrl: v.optional(v.string()),
    portfolioUrl: v.optional(v.string()),
    message: v.optional(v.string()),
    answers: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("jobApplications", {
      ...args,
      status: "pending",
      appliedAt: Date.now(),
    });
  },
});

// List applications for a job
export const listApplications = query({
  args: { jobId: v.optional(v.id("jobs")) },
  handler: async (ctx, args) => {
    if (args.jobId) {
      return await ctx.db
        .query("jobApplications")
        .withIndex("by_job", (q) => q.eq("jobId", args.jobId!))
        .collect();
    }
    return await ctx.db.query("jobApplications").order("desc").collect();
  },
});

// Update job application status
export const updateApplicationStatus = mutation({
  args: {
    id: v.id("jobApplications"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { status: args.status });
  },
});

// Update job application notes
export const updateApplicationNotes = mutation({
  args: {
    id: v.id("jobApplications"),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, { notes: args.notes });
  },
});
