import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Add a new case study
export const addCaseStudy = mutation({
  args: {
    title: v.string(),
    client: v.string(),
    category: v.string(),
    description: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("caseStudies", {
      ...args,
      publishedAt: Date.now(),
    });
  },
});

// List all case studies
export const listCaseStudies = query({
  handler: async (ctx) => {
    const caseStudies = await ctx.db.query("caseStudies").order("desc").collect();
    return Promise.all(
      caseStudies.map(async (cs) => ({
        ...cs,
        imageUrl: cs.imageUrl.startsWith("http") 
          ? cs.imageUrl 
          : (await ctx.storage.getUrl(cs.imageUrl as any)) || cs.imageUrl,
      }))
    );
  },
});

// Delete a case study
export const deleteCaseStudy = mutation({
  args: { id: v.id("caseStudies") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
