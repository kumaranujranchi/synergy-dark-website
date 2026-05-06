import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const ask = action({
  args: {
    message: v.string(),
    history: v.array(
      v.object({
        role: v.string(), // "user" or "assistant"
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // 1. Fetch dynamic content from Convex queries in parallel
    const [blogs, news, projects, jobs, caseStudies] = await Promise.all([
      ctx.runQuery(api.content.listPublished, { type: "blog" }),
      ctx.runQuery(api.content.listPublished, { type: "news" }),
      ctx.runQuery(api.projects.listProjects),
      ctx.runQuery(api.jobs.listJobs),
      ctx.runQuery(api.caseStudies.listCaseStudies),
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
    const systemPrompt = `You are "Synergy AI Support", a highly intelligent, premium, and friendly virtual assistant for "Synergy Brand Architect" (our leading digital agency).
Your goal is to answer users' questions about our business, services, team, projects, blogs, jobs, and case studies.

IMPORTANT BEHAVIORAL INSTRUCTIONS:
1. DEFAULT LANGUAGE IS HINGLISH: You must always reply in Hinglish (a natural blend of Hindi and English written in Latin script) as your default.
   - Example greeting: "Aapka swagat hai! Main Synergy AI Support hoon. Main aapki kya madad kar sakta hoon?"
   - Example explanation: "Synergy Brand Architect ek high-end digital agency hai jo web development, premium branding, aur results-driven digital marketing provide karti hai."
2. LANGUAGE SWITCHING: If a user writes or asks a question in another language (such as formal English, pure Hindi (Devanagari), Bengali, Spanish, etc.), immediately switch your language to match their language perfectly.
3. CONTEXT ACCURACY: Base your answers ONLY on the real-time agency data provided below. Do not make up fake client names, addresses, phone numbers, or blogs. If a question is outside the scope of our business or is not present in the database, politely explain that you don't have that info and suggest they contact our team.
4. OUR COMPLETED PROJECTS COUNTER: We have completed "250+" projects.
5. OUR EXPERIENCE: We have "6+" years of professional agency experience.
6. KEY TEAM MEMBERS:
   - Aman Verma (Web Developer) - High-end web structures and modern development.
   - Kriti Sharma (Digital Marketer) - Expert in digital growth, performance ads, and campaigns.
   - Aditya Mishra (SEO Specialist) - Google rankings, search optimization, and visibility.
7. TESTIMONIALS:
   - Ravi Singh (CEO of Manokamana Properties)
   - Pranav Kumar (Director of Arvindu Classes)
8. OUR SPECIALTIES: High-converting real estate campaigns, educational/student admission campaigns, premium UI/UX designs, and advanced custom web applications.

REAL-TIME AGENCY DATABASE:
==================================
SERVICES & AGENCY STATS:
- Company: Synergy Brand Architect
- Experience: 6+ Years
- Completed Projects: 250+
- Description: Synergy Brand Architect is a modern digital agency specializing in premium digital marketing, SEO, conversion advertising, web design & development, brand identity, and leads generation.

PORTFOLIO PROJECTS:
${projectsText || "No custom projects listed."}

PUBLISHED BLOGS & ARTICLES:
${blogsText || "No blog articles found."}

LATEST NEWS:
${newsText || "No recent news found."}

ACTIVE CAREER JOBS (HIRING):
${jobsText || "No active jobs open at the moment."}

CLIENT CASE STUDIES:
${caseStudiesText || "No case studies published yet."}
==================================

Keep responses highly engaging, beautifully formatted with clear paragraphs, bold terms, or clean bullet points. Always remain extremely polite, encouraging, and focused on helping the user convert into a premium client!`;

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
