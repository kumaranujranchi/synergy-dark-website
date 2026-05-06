import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const anyApi = api as any;

// Helper to provide read-only in-memory fallbacks if database record doesn't exist yet
function getInMemoryFallback(page: string, now: number) {
  if (page === "home") {
    return {
      page: "home",
      metaTitle: "Synergy Brand Architect | Best Digital Marketing Agency in Patna, Bihar",
      metaDescription: "Synergy Brand Architect is Patna's premier digital marketing agency, offering world-class web design, brand strategy, SaaS platform engineering, SEO, and social media marketing.",
      keywords: ["Digital Marketing Agency Patna", "Web Design Patna", "SEO Agency Patna", "Synergy Brand Architect"],
      heroHeadline: "We Architect Brands That Scale At Antigravity Speeds",
      heroSubheadline: "Patna's premium digital marketing & SaaS development agency. We engineer custom high-converting web portals, high-performance SEO pipelines, and premium brand designs that convert.",
      marqueeKeywords: ["WEB DEVELOPMENT", "SEO OPTIMIZATION", "BRAND STRATEGY", "SOCIAL MEDIA MARKETING"],
      lastAnalyzed: now,
      lastUpdated: now,
      autoPilotEnabled: false,
    };
  } else if (page === "contact") {
    return {
      page: "contact",
      metaTitle: "Contact Us | Synergy Brand Architect Patna",
      metaDescription: "Get in touch with Synergy Brand Architect, the leading digital marketing and premium web agency in Patna. Schedule your free 1-on-1 strategy call today.",
      keywords: ["Contact Synergy Patna", "Digital Marketing Consultation Patna", "Web Design Bihar"],
      heroHeadline: "Let's Build Something Monumental Together",
      heroSubheadline: "Have a groundbreaking project or want to scale your business traffic? Drop us a line, and our marketing architects will create a free custom strategy plan for you.",
      marqueeKeywords: ["FREE CONSULTATION", "BRAND SCALE UP", "GET IN TOUCH", "STRATEGY CALL"],
      lastAnalyzed: now,
      lastUpdated: now,
      autoPilotEnabled: false,
    };
  } else if (page === "blog") {
    return {
      page: "blog",
      metaTitle: "Digital Marketing Blog & Insights | Synergy Patna",
      metaDescription: "Stay ahead of the curve with expert marketing blueprints, SEO hacks, social media design strategies, and conversion rate secrets from Synergy Brand Architect Patna.",
      keywords: ["Marketing Blog Patna", "SEO Tips India", "Social Media Trends", "Digital Marketing Ideas"],
      heroHeadline: "The Synergy Blueprint & Marketing Insights",
      heroSubheadline: "Fresh, unfiltered strategies, SaaS development patterns, and SEO case studies compiled by the lead architects of Synergy Brand Architect.",
      marqueeKeywords: ["SEO HACKS", "BRAND SECRETS", "MARKETING INSIGHTS", "CONVERSION TIPS"],
      lastAnalyzed: now,
      lastUpdated: now,
      autoPilotEnabled: false,
    };
  } else {
    return {
      page,
      metaTitle: `Synergy Brand Architect | Premium Digital Services`,
      metaDescription: "Synergy Brand Architect offers premium digital marketing, SEO, social media, and web design in Patna, Bihar.",
      keywords: ["Synergy Brand Architect", "Digital Marketing Patna"],
      heroHeadline: "Architecting Elite Digital Products & Brands",
      heroSubheadline: "We design and engineer bespoke web and brand assets tailored for rapid growth and conversions.",
      marqueeKeywords: ["DEVELOPMENT", "MARKETING", "DESIGN", "STRATEGY"],
      lastAnalyzed: now,
      lastUpdated: now,
      autoPilotEnabled: false,
    };
  }
}

// 1. Get active SEO config for a page (Pure Query - returns fallback if absent)
export const getActiveConfig = query({
  args: { page: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .first();

    if (config) return config;

    // Return virtual read-only fallback structure
    return {
      _id: "fallback" as any,
      _creationTime: Date.now(),
      ...getInMemoryFallback(args.page, Date.now()),
    };
  },
});

// 2. Ensure a config physically exists (Mutation to seed table on admin demand)
export const ensureConfig = mutation({
  args: { page: v.string() },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .first();

    if (config) return config;

    const now = Date.now();
    const seededConfig = getInMemoryFallback(args.page, now);
    const id = await ctx.db.insert("seo_configs", seededConfig);
    return { _id: id, ...seededConfig, _creationTime: now };
  },
});

// 3. List all SEO configs (Seeds on listing if missing to give Admin a persistent ID)
export const listConfigs = query({
  handler: async (ctx) => {
    const dbConfigs = await ctx.db.query("seo_configs").order("desc").collect();
    const requiredPages = ["home", "contact", "blog"];
    const now = Date.now();

    // Map existing ones or merge virtual defaults to prevent crashes or delays
    const mergedList = [...dbConfigs];
    for (const page of requiredPages) {
      if (!dbConfigs.some((c) => c.page === page)) {
        mergedList.push({
          _id: `virtual-${page}` as any,
          _creationTime: now,
          ...getInMemoryFallback(page, now),
        });
      }
    }
    return mergedList;
  },
});

// 4. Update active config manually (Handles upsert automatically!)
export const updateConfig = mutation({
  args: {
    id: v.string(), // Accepts virtual ID as string or physical Id type
    page: v.string(),
    metaTitle: v.string(),
    metaDescription: v.string(),
    keywords: v.array(v.string()),
    heroHeadline: v.string(),
    heroSubheadline: v.string(),
    marqueeKeywords: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, page, ...updates } = args;
    
    // Check if configuration already exists physically
    const existing = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", page))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...updates,
        lastUpdated: Date.now(),
      });
      return existing._id;
    } else {
      const now = Date.now();
      const newId = await ctx.db.insert("seo_configs", {
        page,
        ...updates,
        lastAnalyzed: now,
        lastUpdated: now,
        autoPilotEnabled: false,
      });
      return newId;
    }
  },
});

// 5. Toggle autopilot state
export const toggleAutoPilot = mutation({
  args: {
    id: v.string(),
    page: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        autoPilotEnabled: args.enabled,
      });
    } else {
      const now = Date.now();
      const fallback = getInMemoryFallback(args.page, now);
      await ctx.db.insert("seo_configs", {
        ...fallback,
        autoPilotEnabled: args.enabled,
      });
    }
  },
});

// 6. Approve pending AI SEO recommendations
export const approvePending = mutation({
  args: {
    id: v.string(),
    page: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .first();

    if (!existing || !existing.pendingReview) {
      throw new Error("No pending recommendations found for approval.");
    }

    const { metaTitle, metaDescription, heroHeadline, heroSubheadline, marqueeKeywords } = existing.pendingReview;

    await ctx.db.patch(existing._id, {
      metaTitle,
      metaDescription,
      heroHeadline,
      heroSubheadline,
      marqueeKeywords,
      lastUpdated: Date.now(),
      pendingReview: undefined, // Clear recommendation
    });
  },
});

// 7. Directly patch AI recommendations (Used internally by AI Action)
export const saveAIRecommendation = mutation({
  args: {
    page: v.string(),
    metaTitle: v.string(),
    metaDescription: v.string(),
    heroHeadline: v.string(),
    heroSubheadline: v.string(),
    marqueeKeywords: v.array(v.string()),
    reasoning: v.string(),
    applyImmediately: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { page, applyImmediately, reasoning, ...data } = args;
    const now = Date.now();

    const existing = await ctx.db
      .query("seo_configs")
      .withIndex("by_page", (q) => q.eq("page", page))
      .first();

    if (existing) {
      if (applyImmediately) {
        await ctx.db.patch(existing._id, {
          ...data,
          lastAnalyzed: now,
          lastUpdated: now,
          pendingReview: undefined,
        });
      } else {
        await ctx.db.patch(existing._id, {
          lastAnalyzed: now,
          pendingReview: {
            ...data,
            reasoning,
          },
        });
      }
    } else {
      const fallback = getInMemoryFallback(page, now);
      const insertData: any = {
        ...fallback,
        lastAnalyzed: now,
      };

      if (applyImmediately) {
        Object.assign(insertData, data);
        insertData.lastUpdated = now;
      } else {
        insertData.pendingReview = {
          ...data,
          reasoning,
        };
      }

      await ctx.db.insert("seo_configs", insertData);
    }
  },
});

// 8. Action: Run DeepSeek SEO Keyword Research & Recommendation Engine
export const generateSEORecommendations = action({
  args: {
    page: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error("DEEPSEEK_API_KEY is not configured on the Convex dashboard.");
    }

    // Retrieve active configuration
    const activeConfig = await ctx.runQuery(anyApi.seo.getActiveConfig, { page: args.page });
    const { page, metaTitle, metaDescription, keywords, heroHeadline, heroSubheadline, marqueeKeywords, autoPilotEnabled } = activeConfig;

    const systemPrompt = `You are "Synergy SEO Brain", an elite, senior Search Engine Optimization specialist and copywriter for "Synergy Brand Architect" (Patna's premier digital agency).
Your absolute priority is to perform a semantic keyword audit on the active page content, and generate highly optimized, click-magnetic, and top-ranking copy options.

You must return a valid JSON object matching the exact key structure. Do not output markdown code blocks (such as \`\`\`json), raw comments, or explanatory text outside the JSON object itself.

JSON Response Schema keys:
- "metaTitle": Click-enticing title tag under 60 characters with strong local keywords (e.g., "Best Digital Marketing Agency in Patna | Synergy").
- "metaDescription": Highly compelling description tag under 160 characters targeting Patna/Bihar clients, local search traffic, and CTR optimization.
- "heroHeadline": A premium, catchy, sales-focused main header in English or Hinglish that instantly hooks agency leads.
- "heroSubheadline": A results-oriented subheader explaining Synergy's 6+ years experience, 250+ projects, custom web design, organic SEO, or performance marketing.
- "marqueeKeywords": An array of exactly 4 short, styled keywords in uppercase to be used inside the scrolling marquee ticker (e.g. ["CONVERSION OPTIMIZED", "10X BUSINESS GROWTH", ...]).
- "reasoning": A 2-3 sentence technical SEO reasoning (in Hinglish) explaining why these adjustments will improve search rankings, targeting high search volume terms.`;

    const userPrompt = `Page Context: "${page}"
Active SEO Metadata:
- Title: "${metaTitle}"
- Description: "${metaDescription}"
- Main Focus Keywords: [${keywords.join(", ")}]
- Main Hero Headline: "${heroHeadline}"
- Hero Subheadline: "${heroSubheadline}"
- Marquee Ticker words: [${marqueeKeywords.join(", ")}]

Generate the absolute best SEO and keyword-ranking alternatives for this page. Target trending keywords like "best digital marketing agency in Patna", "web design in Patna", "premium brand strategist", and "lead generation marketing".

Return ONLY the JSON structure.`;

    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          response_format: { type: "json_object" }, // Forces JSON response
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`DeepSeek SEO recommendation request failed: ${errText}`);
      }

      const resData = await response.json();
      const content = resData.choices[0].message.content;

      // Extract JSON safely
      const parsedData = JSON.parse(content.trim());

      const result = {
        page: args.page,
        metaTitle: parsedData.metaTitle,
        metaDescription: parsedData.metaDescription,
        heroHeadline: parsedData.heroHeadline,
        heroSubheadline: parsedData.heroSubheadline,
        marqueeKeywords: parsedData.marqueeKeywords,
        reasoning: parsedData.reasoning,
        applyImmediately: autoPilotEnabled, // If autopilot is enabled, apply immediately!
      };

      // Call mutation to save in database
      await ctx.runMutation(anyApi.seo.saveAIRecommendation, result);

      return { success: true, applied: autoPilotEnabled, result };
    } catch (err: any) {
      console.error("DeepSeek SEO Action error:", err);
      throw new Error(`AI Search optimization failed: ${err.message}`);
    }
  },
});
