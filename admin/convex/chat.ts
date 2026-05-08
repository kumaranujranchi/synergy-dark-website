import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

const anyApi = api as any;

export const ask = action({
  args: {
    message: v.string(),
    history: v.array(
      v.object({
        role: v.string(), // "user" or "assistant"
        content: v.string(),
      })
    ),
    turnstileToken: v.string(),
  },
  handler: async (ctx, args) => {
    // 0. Verify Cloudflare Turnstile token
    const TURNSTILE_SECRET_KEY = "0x4AAAAAADLkBTR0wwhKEoe-4fFpbIWDioA";
    
    try {
      const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: args.turnstileToken,
        }),
      });
      const turnstileData = await turnstileRes.json();

      if (!turnstileData.success) {
        console.error("Turnstile verification failed:", turnstileData);
        return "System: Security verification failed. Aap bot toh nahi hain? Please page refresh karein.";
      }
    } catch (e) {
      console.error("Turnstile error:", e);
      return "System: Security verification process failed.";
    }

    // 1. Fetch dynamic content from Convex queries in parallel
    const [blogs, news, projects, jobs, caseStudies] = await Promise.all([
      ctx.runQuery(anyApi.content.listPublished, { type: "blog" }),
      ctx.runQuery(anyApi.content.listPublished, { type: "news" }),
      ctx.runQuery(anyApi.projects.listProjects),
      ctx.runQuery(anyApi.jobs.listJobs),
      ctx.runQuery(anyApi.caseStudies.listCaseStudies),
    ]);

    // 2. Format database content for the AI's context window
    const blogsText = blogs
      .map((b: any) => `- Blog: "${b.title}" (Author: ${b.author || "Synergy Team"}, URL: blog-details.html?slug=${b.slug})`)
      .join("\n");

    const newsText = news
      .map((n: any) => `- News: "${n.title}" (Author: ${n.author || "Synergy Team"}, URL: news-details.html?slug=${n.slug})`)
      .join("\n");

    const projectsText = projects
      .map((p: any) => `- Portfolio Project: "${p.title}" (Category: ${p.category}) - Client: ${p.client || "Synergy Client"}. Description: ${p.description}`)
      .join("\n");

    const jobsText = jobs
      .filter((j: any) => j.isActive)
      .map((j: any) => `- Job Opening: "${j.title}" (${j.type}) - Department: ${j.department}, Location: ${j.location}. Description: ${j.description}`)
      .join("\n");

    const caseStudiesText = caseStudies
      .map((c: any) => `- Case Study: "${c.title}" for Client: ${c.client} (Category: ${c.category}). Summary: ${c.description}`)
      .join("\n");

    // 3. Construct Static + Dynamic context for the LLM
    const systemPrompt = `You are "Synergy AI Support", a highly elite, results-driven, and sales-focused virtual sales assistant for "Synergy Brand Architect" (our premier digital growth agency).
Your absolute, primary objective is to engage visitors, answer questions about our premium services, showcase our capability, and CONVERT them into hot business leads by guiding them to schedule a free consultation, contact our sales desk, or request a customized proposal. You are a sales strategist first and an informational agent second!

CRITICAL SALES-FOCUSED & BEHAVIORAL INSTRUCTIONS:
1. DEFAULT LANGUAGE IS HINGLISH: You must always reply in Hinglish (a natural, premium blend of Hindi and English written in Latin script) as your default.
2. CONVERSION FOCUS: Frame your answers to highlight how we drive business growth, leads, and high return on ad spend (ROAS). Proactively pitch our services and invite the user to schedule a "Free Consultation".
3. NO TEAM MEMBER NAMES: If a user asks about the team, our founders, or key players, do NOT mention any individual team member names (such as Aman, Kriti, Aditya, etc.). Instead, talk about our "highly specialized team of certified digital strategists, senior web developers, and performance marketing experts who coordinate to deliver 10x ROAS." Keep it strictly collective, elite, and professional.
4. OUR COMPLETED PROJECTS: We have successfully completed "250+" high-converting projects with "6+" years of professional experience.
5. EXCLUDE CAREER AND JOB HIRING CHATTER UNLESS EXPLICITLY ASKED: You are a sales representative, so steer the focus to business growth. If someone asks for a job, politely direct them to the Careers page without diluting the sales context.
6. SERVICES SYNERGY PROVIDES:
   - High-Performance Digital Marketing (Meta & Google Ads, Performance CAMPAIGNS with elite leads generation)
   - Search Engine Optimization (SEO) & Google Ranking Strategy
   - Modern, Ultra-Fast Website Design & Custom Web Development (premium UI/UX and lightning-fast speed)
   - Brand Building, Premium Positioning, and Workflow Automation.
7. COMMERCIAL INTENT RULE: Agar conversation ka intent strictly commercial ya requirement-oriented lagta hai (jaise customer quotation, pricing, ya service kharidne ki baat kar raha ho), toh conversation ko jyada lamba na kheeche. Sidhe taur par kahein ki "Humne aapki requirement le li hai, ab hamari team jald hi aapse sampark karegi." aur discussion wahin politely close kar dein.

REAL-TIME AGENCY DATABASE:
==================================
SERVICES & AGENCY STATS:
- Company: Synergy Brand Architect
- Experience: 6+ Years of digital excellence
- Completed Projects: 250+ high-ROI campaign success
- Description: Synergy Brand Architect is a modern high-end digital agency specializing in premium digital marketing, SEO, conversion-focused advertising, custom web development, premium branding, and automated business workflows. We help businesses 10x their sales and lead quality.

PORTFOLIO PROJECTS:
${projectsText || "No custom projects listed."}

PUBLISHED BLOGS & ARTICLES:
${blogsText || "No blog articles found."}

LATEST NEWS:
${newsText || "No recent news found."}

CLIENT CASE STUDIES:
${caseStudiesText || "No case studies published yet."}
==================================

Keep responses highly engaging, persuasive, and beautifully formatted with clean bullet points. Always end with a compelling call-to-action (CTA) to convert the user!`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY is not configured in the Convex Dashboard.");
      return "Hello! Please ask your administrator to configure the 'DEEPSEEK_API_KEY' environment variable in the Convex Dashboard to enable full AI responses.";
    }

    try {
      // Send API request to DeepSeek (using the cheapest deepseek-chat model)
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
            ...args.history.map((h: any) => ({
              role: h.role === "assistant" ? "assistant" : "user",
              content: h.content,
            })),
            { role: "user", content: args.message },
          ],
          temperature: 0.6,
          max_tokens: 800,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("DeepSeek API non-ok response:", errText);
        return "Dost, main abhi thoda slow respond kar raha hoon. Please ek baar phir se try karein!";
      }

      const resData = await response.json();
      return resData.choices[0].message.content;
    } catch (err) {
      console.error("Fetch error calling DeepSeek:", err);
      return "Oops! Mujhse connect karne me thodi dikkat aa rahi hai. Please check back in a moment.";
    }
  },
});

export const summarizeChat = action({
  args: {
    history: v.array(
      v.object({
        role: v.string(), // "user" or "assistant"
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.error("DEEPSEEK_API_KEY is not configured in the Convex Dashboard.");
      return "No summary generated. API Key is missing.";
    }

    try {
      const systemPrompt = `You are "Synergy Elite Sales Manager", an expert sales strategist.
Analyze the following client chat transcript and create a brief 2-3 bullet point summary containing:
1. What the customer is looking for (their primary needs/services).
2. Key goals or indicators of interest.
3. A highly actionable phone conversion strategy for our sales desk to pitch our custom marketing, website dev, or SEO packages and seal the deal during a telephone call.
Keep the summary in simple, highly professional Hinglish/English. No code blocks. No HTML formatting.`;

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
            { role: "user", content: JSON.stringify(args.history) },
          ],
          temperature: 0.4,
          max_tokens: 400,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("DeepSeek summary non-ok response:", errText);
        return "Summary could not be generated at this time.";
      }

      const resData = await response.json();
      return resData.choices[0].message.content;
    } catch (err) {
      console.error("Error summarizing chat:", err);
      return "Summary generation encountered an error.";
    }
  },
});
