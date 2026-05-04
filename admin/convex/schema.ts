import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Lead Management
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.optional(v.string()),
    message: v.string(),
    status: v.string(), // "new", "contacted", "qualified", "closed"
  }).index("by_status", ["status"]),

  // Email Subscribers
  subscribers: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),

  // Blog and News Management
  content: defineTable({
    title: v.string(),
    slug: v.string(),
    body: v.string(), // Markdown or HTML content
    imageUrl: v.optional(v.string()),
    imageAltText: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    type: v.string(), // "blog" or "news"
    author: v.string(),
    isPublished: v.boolean(),
    publishedAt: v.number(), // Timestamp
  })
    .index("by_type", ["type"])
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished", "publishedAt"]),

  // Project (Portfolio) Management
  projects: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    client: v.optional(v.string()),
    imageUrl: v.string(),
    projectUrl: v.optional(v.string()),
    order: v.number(), // For custom sorting
  }).index("by_order", ["order"]),

  // Job Posting (Careers)
  jobs: defineTable({
    title: v.string(),
    department: v.string(),
    location: v.string(),
    type: v.string(), // "Full-time", "Part-time", "Remote", "Internship"
    description: v.string(),
    salaryRange: v.optional(v.string()),
    isActive: v.boolean(),
    postedAt: v.number(),
  }).index("by_active", ["isActive", "postedAt"]),

  // Role Management & Users (Legacy)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    role: v.string(), // "super_admin", "editor", "viewer"
  }),

  // Authentication Sessions
  sessions: defineTable({
    token: v.string(),
    createdAt: v.number(),
  }).index("by_token", ["token"]),
});
