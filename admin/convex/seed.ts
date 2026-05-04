import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Add some Projects
    await ctx.db.insert("projects", {
      title: "SaaS Platform for Real Estate",
      description: "A high-performance platform for real estate agents to manage listings and leads.",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      projectUrl: "https://example.com",
      category: "SaaS Development",
      order: 1,
    });

    await ctx.db.insert("projects", {
      title: "E-commerce Optimization Engine",
      description: "Custom WaaS solution for high-volume retailers to scale their operations.",
      imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=800&q=80",
      projectUrl: "https://example.com",
      category: "E-commerce",
      order: 2,
    });

    // 2. Add some Blogs
    await ctx.db.insert("content", {
      type: "blog",
      title: "The Future of AI in Digital Marketing",
      slug: "future-of-ai-marketing",
      body: "AI is not just a trend; it's a fundamental shift in how we approach data and customer engagement.",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      author: "Synergy Team",
      isPublished: true,
      publishedAt: Date.now(),
    });

    // 3. Add some Job Postings
    await ctx.db.insert("jobs", {
      title: "Senior Brand Strategist",
      location: "Remote / Hybrid",
      type: "Full-time",
      department: "Strategy",
      description: "We are looking for a visionary to lead our clients' branding journeys.",
      isActive: true,
      postedAt: Date.now(),
    });

    return "Seed successful!";
  },
});
