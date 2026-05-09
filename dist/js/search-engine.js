/**
 * Synergy Brand Architect - Premium Client-Side Website Search Engine
 * Real-time matching, category filters, responsive results layout, and high-end aesthetics.
 */

(function () {
    // 1. Comprehensive Search Index of Synergy Brand Architect Website
    const searchIndex = [
        // Main Pages
        {
            title: "Synergy Brand Architect - Home",
            url: "index.html",
            description: "The leading creative digital marketing agency and digital architect in Patna, Bihar. We engineer outstanding growth ecosystems.",
            keywords: "home, main, synergy, agency, creative digital marketing, brand architect, bihar, patna, portfolio, slider, contact, index",
            category: "Main Page",
            icon: "fa-house"
        },
        {
            title: "About Synergy Brand Architect",
            url: "about.html",
            description: "Discover our mission, core values, creative methodology, team culture, and our drive to build undisputed brand authorities.",
            keywords: "about us, about, team, mission, vision, values, agency, founders, story, team culture, patna, bihar",
            category: "Company",
            icon: "fa-circle-info"
        },
        {
            title: "Contact Synergy Brand Architect",
            url: "contact.html",
            description: "Get in touch with our team in Patna. Request a free brand audit, request a quote, or schedule a strategic consultation.",
            keywords: "contact, contact us, address, phone, email, office, free brand audit, quote, consult, map, support, phone number",
            category: "Company",
            icon: "fa-envelope"
        },
        {
            title: "Our Projects & Works Portfolio",
            url: "projects.html",
            description: "Explore our dynamic portfolio of high-performance websites, creative social campaigns, and digital brand transformations.",
            keywords: "projects, works, portfolio, showcase, details, web dev, branding, designs, live links",
            category: "Company",
            icon: "fa-briefcase"
        },
        {
            title: "Careers at Synergy",
            url: "page-careers.html",
            description: "Join Bihar's fastest-growing creative digital marketing team. Browse open positions for developers, designers, and marketers.",
            keywords: "careers, jobs, hiring, open positions, developer jobs, designer jobs, content writer, sales, applying, internship",
            category: "Company",
            icon: "fa-user-plus"
        },
        {
            title: "Client Success Stories & Case Studies",
            url: "page-case-study.html",
            description: "In-depth case studies illustrating real growth and brand transformations for companies like Biryani Mahal and The Helping Hand.",
            keywords: "case studies, case study, success stories, clients, results, growth, metrics, list",
            category: "Resources",
            icon: "fa-file-signature"
        },
        {
            title: "Our Full Technology Stack",
            url: "page-tech-stack.html",
            description: "An interactive list of our frontend, backend, automation, and design stack used to build premium digital ecosystems.",
            keywords: "technology stack, tech stack, tools, react, nextjs, nodejs, figma, wordpress, shopify, n8n, zapier, languages",
            category: "Resources",
            icon: "fa-layer-group"
        },
        {
            title: "Knowledge Base & Blogs",
            url: "blog.html",
            description: "Expert marketing strategies, website development guides, branding tips, and industry trends to help scale your business.",
            keywords: "blog, blogs, articles, guides, knowledge, learnings, tips, news, resources",
            category: "Resources",
            icon: "fa-newspaper"
        },

        // Services
        {
            title: "Brand Building Services",
            url: "page-brand-building.html",
            description: "Strategic branding, identity guidelines, professional logo design, psychological market profiling, and authority positioning.",
            keywords: "brand building, branding, logo, identity design, positioning, market research, brand guidelines, reputation, bihar, patna",
            category: "Service",
            icon: "fa-award"
        },
        {
            title: "Social Media Marketing (SMM)",
            url: "page-social-media.html",
            description: "Organic Instagram growth, viral reels, Facebook Page management, community engagement, and highly aesthetic creatives.",
            keywords: "social media marketing, smm, instagram, facebook, reels, content creation, social calendar, designs, posts, page management",
            category: "Service",
            icon: "fa-share-nodes"
        },
        {
            title: "Website & Mobile App Development",
            url: "page-website-dev.html",
            description: "High-performance websites, React & Next.js applications, custom portal developments, and native Android/iOS mobile apps.",
            keywords: "website development, app development, nextjs, react, mobile app, android, ios, custom website, web design, coding",
            category: "Service",
            icon: "fa-code"
        },
        {
            title: "Business Process Automation",
            url: "page-automation.html",
            description: "Intelligent CRM orchestrations, automated WhatsApp/SMS/Email trigger funnels, Zapier & n8n integrations, and system sync.",
            keywords: "automation, business automation, crm, zapier, n8n, triggers, sales funnels, workflow, bot logic, whatsapp api, triggers",
            category: "Service",
            icon: "fa-robot"
        },
        {
            title: "Performance Marketing (Paid Ads)",
            url: "page-performance-marketing.html",
            description: "ROI-focused Google Search Ads, Meta Ads (Facebook & Instagram), high-converting landing pages, and lead generation.",
            keywords: "performance marketing, paid ads, meta ads, google ads, ppc, lead generation, conversions, roas, ad budget, scaling",
            category: "Service",
            icon: "fa-chart-line"
        },
        {
            title: "Search Engine Optimization (SEO)",
            url: "page-seo.html",
            description: "Local SEO Google My Business mastery, technical site audit, backlinks, on-page optimization, and organic ranking.",
            keywords: "seo, search engine optimization, keywords, google rank, backlink, local seo, gmb, organic traffic, technical audit",
            category: "Service",
            icon: "fa-magnifying-glass-chart"
        },

        // Case Studies Detailed
        {
            title: "Case Study - Biryani Mahal Brand Transformation",
            url: "case-studies/biryani-mahal.html",
            description: "A comprehensive branding and social media marketing case study highlighting how we drove local authority and scaled sales.",
            keywords: "biryani mahal, restaurant marketing, local business, brand transformation, foodie reviews, local ads, success story, case study",
            category: "Case Study",
            icon: "fa-bowl-food"
        },
        {
            title: "Case Study - The Helping Hand NGO digital Visibility",
            url: "case-studies/the-helping-hand.html",
            description: "Enhancing digital outreach, local organic ranking, GMB optimization, and donor trust for a local healthcare initiative NGO.",
            keywords: "the helping hand, NGO, charity, donor, healthcare, organic seo, local search, visibility, trust, community, success story",
            category: "Case Study",
            icon: "fa-hand-holding-heart"
        },

        // Industries
        {
            title: "Real Estate Digital Marketing",
            url: "industry-real-estate.html",
            description: "High-quality lead generation funnels, virtual tours, Facebook lead campaigns, and high-trust social proof for builders.",
            keywords: "real estate, builders, property, flats, plots, lead generation, virtual tour, apartments, housing, construction",
            category: "Industry",
            icon: "fa-building"
        },
        {
            title: "Healthcare & Clinic Growth Marketing",
            url: "industry-healthcare.html",
            description: "Patient acquisition programs, Google Maps search domination, clinic video profiling, and medical reputation campaigns.",
            keywords: "healthcare, medical, doctor, clinic, hospital, patient acquisition, reputation management, maps rank, dental",
            category: "Industry",
            icon: "fa-user-doctor"
        },
        {
            title: "Education & Coaching Center Admissions",
            url: "industry-education.html",
            description: "High-volume student admission leads, localized branding campaigns, and trust-building topper testimonial videography.",
            keywords: "education, school, college, coaching, coaching institute, student admissions, leads, academy, training",
            category: "Industry",
            icon: "fa-graduation-cap"
        },
        {
            title: "E-commerce Sales Acceleration",
            url: "industry-ecommerce.html",
            description: "High-ROAS product catalog ads, Shopify store development, abandoned cart automation, and product-focused copywriting.",
            keywords: "ecommerce, store, shopify, shop, products, conversion rate, roas, catalogs, online store, checkout",
            category: "Industry",
            icon: "fa-cart-shopping"
        },
        {
            title: "Salons & Spas Appointment Bookings",
            url: "industry-local-salons.html",
            description: "Dynamic salon booking, social media reels, beauty influencer marketing, and local GMB visibility to scale bookings.",
            keywords: "salons, salon, spa, beauty parlor, booking, appt, haircut, bridal makeup, salon marketing",
            category: "Industry",
            icon: "fa-scissors"
        },
        {
            title: "Gyms & Fitness Centers Lead Funnels",
            url: "industry-local-gyms.html",
            description: "High-converting gym membership lead campaigns, trial passes, organic coach reels, and regional community outreach.",
            keywords: "gym, fitness, trainer, bodybuilding, membership, trial pass, health club, workout, personal trainer",
            category: "Industry",
            icon: "fa-dumbbell"
        },
        {
            title: "Restaurants & Cafes Local Food Reels",
            url: "industry-local-restaurants.html",
            description: "Social media reels showcasing culinary processes, Google Maps local reviews, and hyper-targeted location-based ads.",
            keywords: "restaurant, cafe, food, dining, menu, local business, maps, foodie, culinary, food reels",
            category: "Industry",
            icon: "fa-utensils"
        },
        {
            title: "Lawyers & Advocates Legal Branding",
            url: "industry-professional-lawyers.html",
            description: "Ethical lead generation, high-trust advocate profiling, local legal GMB seo, and professional content marketing.",
            keywords: "lawyers, advocate, legal, court, attorney, consultation, law firm, trust building, lawyer marketing",
            category: "Industry",
            icon: "fa-scale-balanced"
        },
        {
            title: "Chartered Accountants (CAs) Financial Authority",
            url: "industry-professional-ca.html",
            description: "Corporate client lead generation, high-authority tax updates, content funnels, and executive brand positioning for CAs.",
            keywords: "ca, chartered accountant, audit, tax, consulting, accountant, consulting, financial advisor, corporate",
            category: "Industry",
            icon: "fa-calculator"
        },
        {
            title: "SaaS Startups User Signups",
            url: "industry-startups-saas.html",
            description: "Product-led growth, SaaS signup marketing, product video walk-throughs, and targeted LinkedIn B2B campaigns.",
            keywords: "saas, software, product, startup, signups, b2b, software as a service, users, app download, trial",
            category: "Industry",
            icon: "fa-laptop-code"
        }
    ];

    // 2. DOM Ready - Search Engine Setup
    function initSearchEngine() {
        const searchPopups = document.querySelectorAll('.search-popup');
        if (searchPopups.length === 0) return;

        // Add custom styles for search results dropdown once
        if (!document.getElementById('search-engine-custom-styles')) {
            const style = document.createElement('style');
            style.id = 'search-engine-custom-styles';
            style.innerHTML = `
                .search-results-overlay {
                    margin-top: 25px;
                    max-height: 400px;
                    overflow-y: auto;
                    background: rgba(15, 15, 15, 0.96) !important;
                    border-radius: 20px !important;
                    border: 1px solid rgba(255, 94, 20, 0.15) !important;
                    padding: 20px;
                    display: none;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.7) !important;
                    backdrop-filter: blur(15px);
                    transition: all 0.3s ease;
                }
                .search-results-title {
                    color: #ff5e14 !important;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    padding-bottom: 10px;
                    margin-bottom: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .search-results-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .search-result-item {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 12px 18px;
                    border-radius: 14px;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.04);
                    text-decoration: none !important;
                    transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
                }
                .search-result-item:hover {
                    background: rgba(255, 94, 20, 0.08) !important;
                    border-color: rgba(255, 94, 20, 0.3) !important;
                    transform: translateX(4px);
                }
                .search-result-item:hover .result-item-title {
                    color: #ff5e14 !important;
                }
                .result-icon-wrapper {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: rgba(255, 94, 20, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ff5e14;
                    font-size: 18px;
                    flex-shrink: 0;
                    transition: all 0.25s ease;
                }
                .search-result-item:hover .result-icon-wrapper {
                    background: #ff5e14 !important;
                    color: #fff !important;
                    box-shadow: 0 4px 12px rgba(255, 94, 20, 0.3);
                }
                .result-content-wrapper {
                    flex-grow: 1;
                    min-width: 0;
                }
                .result-item-title {
                    color: #fff !important;
                    font-weight: 600 !important;
                    font-size: 16px !important;
                    transition: color 0.2s;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .result-item-badge {
                    font-size: 10px !important;
                    background: rgba(255,255,255,0.07);
                    color: #ccc !important;
                    padding: 3px 10px;
                    border-radius: 6px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .result-item-desc {
                    color: rgba(255,255,255,0.45) !important;
                    font-size: 13px !important;
                    line-height: 1.4 !important;
                    margin: 0 !important;
                    text-align: left;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                /* Custom Scrollbar for search results */
                .search-results-overlay::-webkit-scrollbar {
                    width: 6px;
                }
                .search-results-overlay::-webkit-scrollbar-track {
                    background: transparent;
                }
                .search-results-overlay::-webkit-scrollbar-thumb {
                    background: rgba(255, 94, 20, 0.3);
                    border-radius: 3px;
                }
                .search-results-overlay::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 94, 20, 0.5);
                }
                .search-no-results {
                    color: rgba(255,255,255,0.5) !important;
                    font-size: 14px;
                    text-align: center;
                    padding: 25px 0;
                }
            `;
            document.head.appendChild(style);
        }

        // Initialize search forms across all popup instances
        searchPopups.forEach(popup => {
            const inner = popup.querySelector('.search-inner');
            const form = popup.querySelector('form');
            const input = popup.querySelector('input[type="search"]');
            if (!inner || !form || !input) return;

            // Create and append results container if it doesn't exist
            let resultsContainer = inner.querySelector('.search-results-overlay');
            if (!resultsContainer) {
                resultsContainer = document.createElement('div');
                resultsContainer.className = 'search-results-overlay';
                resultsContainer.innerHTML = `
                    <div class="search-results-title">
                        <span>Search Results</span>
                        <span class="results-count">0 found</span>
                    </div>
                    <div class="search-results-list"></div>
                `;
                inner.appendChild(resultsContainer);
            }

            const resultsList = resultsContainer.querySelector('.search-results-list');
            const countBadge = resultsContainer.querySelector('.results-count');

            // 3. Search Engine Algorithm
            function performSearch(query) {
                query = query.trim().toLowerCase();
                if (query.length < 2) {
                    resultsContainer.style.display = 'none';
                    return;
                }

                // Filter pages on title, description or keywords matching query
                const matches = searchIndex.filter(page => {
                    return page.title.toLowerCase().includes(query) ||
                           page.description.toLowerCase().includes(query) ||
                           page.keywords.toLowerCase().includes(query);
                });

                // Clear previous list
                resultsList.innerHTML = '';

                if (matches.length === 0) {
                    resultsList.innerHTML = `<div class="search-no-results">No matches found for "<strong>${escapeHtml(query)}</strong>". Try other keywords.</div>`;
                    countBadge.textContent = '0 found';
                } else {
                    countBadge.textContent = `${matches.length} found`;
                    matches.forEach(item => {
                        const resultItem = document.createElement('a');
                        resultItem.href = item.url;
                        resultItem.className = 'search-result-item';
                        resultItem.innerHTML = `
                            <div class="result-icon-wrapper">
                                <i class="fa-solid ${item.icon || 'fa-magnifying-glass'}"></i>
                            </div>
                            <div class="result-content-wrapper">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; gap: 10px;">
                                    <span class="result-item-title">${escapeHtml(item.title)}</span>
                                    <span class="result-item-badge">${escapeHtml(item.category)}</span>
                                </div>
                                <p class="result-item-desc">${escapeHtml(item.description)}</p>
                            </div>
                        `;
                        resultsList.appendChild(resultItem);
                    });
                }

                resultsContainer.style.display = 'block';
            }

            // Hook input listener for Instant Live Search
            input.addEventListener('input', (e) => {
                performSearch(e.target.value);
            });

            // Prevent default form submit so page doesn't reload, but trigger search
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                performSearch(input.value);
            });

            // Optional: clear on escape or close
            const closeBtn = popup.querySelector('.close-search');
            const backdrop = popup.querySelector('.search-back-drop');
            const clearResults = () => {
                input.value = '';
                resultsContainer.style.display = 'none';
            };

            if (closeBtn) closeBtn.addEventListener('click', clearResults);
            if (backdrop) backdrop.addEventListener('click', clearResults);
        });
    }

    // Utility HTML Escaper
    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;");
    }

    // Run on DomContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchEngine);
    } else {
        initSearchEngine();
    }
})();
