import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new lead (Called from the frontend contact form)
export const addLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const leadId = await ctx.db.insert("leads", {
      ...args,
      status: "new",
    });
    return leadId;
  },
});

// List all leads (For Admin Panel)
export const listLeads = query({
  handler: async (ctx) => {
    return await ctx.db.query("leads").order("desc").collect();
  },
});

// Update lead status (For Admin Panel)
export const updateLeadStatus = mutation({
  args: {
    id: v.id("leads"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});
