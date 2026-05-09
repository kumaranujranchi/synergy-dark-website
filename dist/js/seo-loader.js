// Synergy Brand Architect - Dynamic AI SEO Loader & Tag Injector
// Instantly updates: Page Title, Meta Description, Keywords, JSON-LD Structured Schema, Hero Content, and Scrolling Ticker Keywords.

(function () {
  // 1. Identify page slug dynamically
  let pageSlug = "home";
  const path = window.location.pathname;
  if (path.includes("contact")) {
    pageSlug = "contact";
  } else if (path.includes("blog")) {
    pageSlug = "blog";
  }

  // 2. Load SEO Configuration from Convex live API
  async function loadDynamicSEO() {
    // Ensure CONVEX_URL is loaded from global config
    const convexEndpoint = typeof CONVEX_URL !== "undefined" ? CONVEX_URL : "https://qualified-duck-586.convex.cloud";

    try {
      const response = await fetch(`${convexEndpoint}/api/run/seo/getActiveConfig`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageSlug }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch SEO config for ${pageSlug}`);
      }

      const result = await response.json();
      if (!result) return;

      // 3. Update Meta Search Headers
      updateMetaTags(result);

      // 4. Inject Dynamic JSON-LD Structured Schema (Google Rich Snippets)
      injectJSONLD(result);

      // 5. Update Hero Headlines & Marquee tickers (after DOM is parsed)
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => updateDOMContent(result));
      } else {
        updateDOMContent(result);
      }
    } catch (err) {
      console.warn("Synergy Dynamic SEO Loader bypassed (Using static fallback SEO):", err);
    }
  }

  function updateMetaTags(config) {
    // Page Title
    if (config.metaTitle) {
      document.title = config.metaTitle;
    }

    // Meta Description
    if (config.metaDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement("meta");
        descMeta.setAttribute("name", "description");
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute("content", config.metaDescription);
    }

    // Meta Keywords
    if (config.keywords && config.keywords.length > 0) {
      let keyMeta = document.querySelector('meta[name="keywords"]');
      if (!keyMeta) {
        keyMeta = document.createElement("meta");
        keyMeta.setAttribute("name", "keywords");
        document.head.appendChild(keyMeta);
      }
      keyMeta.setAttribute("content", config.keywords.join(", "));
    }
  }

  function injectJSONLD(config) {
    // Prevent duplicate schemas
    const existingSchema = document.getElementById("synergy-dynamic-seo-schema");
    if (existingSchema) existingSchema.remove();

    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.id = "synergy-dynamic-seo-schema";

    // Standard high-converting Local Business & Agency schema structure
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Synergy Brand Architect",
      "image": "https://synergybrandarchitect.com/images/logo.png",
      "@id": "https://synergybrandarchitect.com/#organization",
      "url": "https://synergybrandarchitect.com",
      "telephone": "+91 9525230232",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Fraser Road",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "800001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.6127,
        "longitude": 85.1376
      },
      "description": config.metaDescription,
      "headline": config.heroHeadline,
      "sameAs": [
        "https://linkedin.com/company/synergybrandarchitect",
        "https://instagram.com/synergybrandarchitect"
      ]
    };

    schemaScript.textContent = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);
  }

  function updateDOMContent(config) {
    // A. Dynamic Hero Headline
    if (config.heroHeadline) {
      const heroHeadlineEl = document.querySelector(".hero_title, .tv_hero_title");
      if (heroHeadlineEl) {
        // Look for span to keep gradient style if present
        if (heroHeadlineEl.querySelector("span") && config.heroHeadline.toLowerCase().includes("growth")) {
          // Keep default formatting fallback if growth is present
          const cleanText = config.heroHeadline.replace(/growth/i, "<span>Growth</span>");
          heroHeadlineEl.innerHTML = cleanText;
        } else {
          heroHeadlineEl.innerHTML = config.heroHeadline;
        }
      }
    }

    // B. Dynamic Hero Subheadline
    if (config.heroSubheadline) {
      const heroDescEl = document.querySelector(".hero-desc");
      if (heroDescEl) {
        heroDescEl.innerHTML = config.heroSubheadline;
      }
    }

    // C. Dynamic Marquee Keywords (Automatic Ticker updates!)
    if (config.marqueeKeywords && config.marqueeKeywords.length > 0) {
      const marqueeGroups = document.querySelectorAll(".marquee-group");
      if (marqueeGroups.length > 0) {
        marqueeGroups.forEach((group) => {
          let newHTML = "";
          config.marqueeKeywords.forEach((keyword) => {
            newHTML += `
              <div class="text">
                <img class="rotate" src="images/common/shapes/marque-shap.webp" alt="">
                <h2 class="title">${keyword}</h2>
              </div>
            `;
          });
          group.innerHTML = newHTML;
        });
      }
    }
  }

  // Trigger loader immediately on execution
  loadDynamicSEO();
})();
