import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Generate upload URL for images
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

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
    const projects = await ctx.db.query("projects").order("asc").collect();
    return Promise.all(
      projects.map(async (project) => ({
        ...project,
        imageUrl: project.imageUrl.startsWith("http") 
          ? project.imageUrl 
          : (await ctx.storage.getUrl(project.imageUrl as any)) || project.imageUrl,
      }))
    );
  },
});

// Delete a project
export const deleteProject = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
