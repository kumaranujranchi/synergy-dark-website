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
    chatSummary: v.optional(v.string()),
    chatTranscript: v.optional(v.string()),
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
    tags: v.optional(v.array(v.string())),
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
    features: v.optional(v.array(v.string())),
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
    customQuestions: v.optional(
      v.array(
        v.object({
          question: v.string(),
          required: v.boolean(),
        })
      )
    ),
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

  // Job Applications
  jobApplications: defineTable({
    jobId: v.id("jobs"),
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    resumeUrl: v.optional(v.string()), // For future use with file storage
    portfolioUrl: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.string(), // "pending", "reviewed", "interviewing", "hired", "rejected"
    appliedAt: v.number(),
    answers: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
  }).index("by_job", ["jobId"]),
  // Case Studies
  caseStudies: defineTable({
    title: v.string(),
    client: v.string(),
    category: v.string(), // e.g., "SEO", "Web Dev", "Branding"
    description: v.string(),
    imageUrl: v.string(),
    publishedAt: v.number(),
  }).index("by_category", ["category"]),
  // Comments Management
  comments: defineTable({
    contentId: v.id("content"),
    name: v.string(),
    email: v.string(),
    comment: v.string(),
    isApproved: v.boolean(),
    createdAt: v.number(),
  }).index("by_content", ["contentId", "isApproved"]),

  // Dynamic SEO Configurations & AI Tracking
  seo_configs: defineTable({
    page: v.string(), // "home", "contact", "blog", "careers", "about"
    metaTitle: v.string(),
    metaDescription: v.string(),
    keywords: v.array(v.string()),
    heroHeadline: v.string(),
    heroSubheadline: v.string(),
    marqueeKeywords: v.array(v.string()),
    lastAnalyzed: v.number(),
    lastUpdated: v.number(),
    autoPilotEnabled: v.boolean(),
    pendingReview: v.optional(
      v.object({
        metaTitle: v.string(),
        metaDescription: v.string(),
        heroHeadline: v.string(),
        heroSubheadline: v.string(),
        marqueeKeywords: v.array(v.string()),
        reasoning: v.string(),
      })
    ),
  }).index("by_page", ["page"]),
});
