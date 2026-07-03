// Convex Fetch and Render Logic
let activeJobsList = [];

// Helper function to fetch data from Convex using the HTTP API
async function fetchFromConvex(funcName, args = {}) {
    // Replace colon with slash and use /api/run/ for the newer Convex HTTP API
    const formattedName = funcName.replace(':', '/');
    const url = `${CONVEX_URL}/api/run/${formattedName}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ args, format: "json" })
        });
        const result = await response.json();
        return result.value || [];
    } catch (error) {
        console.error(`Error fetching from Convex (${funcName}):`, error);
        return [];
    }
}

// Helper function to send mutations to Convex
async function mutationToConvex(funcName, args = {}) {
    const formattedName = funcName.replace(':', '/');
    const url = `${CONVEX_URL}/api/run/${formattedName}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ args, format: "json" })
        });
        const result = await response.json();
        return result.value;
    } catch (error) {
        console.error(`Error sending mutation to Convex (${funcName}):`, error);
        return null;
    }
}

function getSlugFromUrl() {
    const path = window.location.pathname;
    // Strip trailing slash if present
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const pathParts = cleanPath.split('/');
    
    // Check if the URL matches clean paths /blog/slug or /news/slug or sub-directories
    const isCleanPath = pathParts.includes('blog') || pathParts.includes('news') || pathParts.includes('blog-details') || pathParts.includes('news-details');
    if (isCleanPath) {
        const lastPart = pathParts[pathParts.length - 1];
        // Ensure it's not a static template file ending in .html or an empty path
        if (lastPart && !lastPart.endsWith('.html') && lastPart !== 'blog' && lastPart !== 'news') {
            return decodeURIComponent(lastPart);
        }
    }
    
    // Fallback to legacy query parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('slug');
}

// 1. Render Dynamic Blogs (Home Page - Limit 3)
async function renderDynamicBlogs() {
    const container = document.getElementById('dynamic-blogs-container');
    if (!container) return;

    try {
        const publishedBlogs = await fetchFromConvex('content/listPublished', { type: 'blog' });
        if (publishedBlogs.length === 0) return;

        container.innerHTML = publishedBlogs.slice(0, 3).map(blog => `
            <div class="news-block col-lg-4 col-md-6 wow fadeInUp">
                <div class="blog-single-box">
                    <div class="image-box">
                        <figure class="image">
                            <a href="/blog/${blog.slug}"><img src="${blog.imageUrl || '/images/pages/news/blog-fallback.webp'}" alt="${blog.imageAltText || blog.title}"></a>
                        </figure>
                    </div>
                    <div class="content-box">
                        <span class="date">${new Date(blog.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <h4 class="title">
                            <a href="/blog/${blog.slug}">${blog.title}</a>
                        </h4>
                        <div class="blog-author">
                            <span>By - <a href="#" class="read-more">${blog.author}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering blogs:", error);
    }
}

// 2. Render Dynamic Projects
async function renderDynamicProjects() {
    const container = document.getElementById('dynamic-projects-container');
    if (!container) return;

    try {
        const projects = await fetchFromConvex('projects/listProjects');
        const displayProjects = projects.filter(proj => proj.displayPage !== 'shopify');
        if (displayProjects.length === 0) return;

        container.innerHTML = displayProjects.map(proj => `
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 wow fadeInUp">
                <div class="premium-project-card">
                    <div class="image-wrapper">
                        <span class="category-badge">${proj.category}</span>
                        <img src="${proj.imageUrl}" alt="${proj.title}">
                    </div>
                    <div class="content">
                        <h3 class="title">${proj.title}</h3>
                        <p class="description">${proj.description}</p>
                        <ul class="features-list">
                            ${(proj.features && proj.features.length > 0 ? proj.features : ['Modern UI/UX Design', 'Full-stack Development', 'Performance Optimized']).map(f => `
                                <li><i class="fas fa-check-circle"></i> ${f}</li>
                            `).join('')}
                        </ul>
                        <a href="${proj.projectUrl || '#'}" target="_blank" class="visit-btn">
                            Visit Website <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering projects:", error);
    }
}

// 2.5 Render Shopify Headless Projects
async function renderShopifyProjects() {
    const container = document.getElementById('dynamic-shopify-projects-container');
    if (!container) return;

    try {
        const projects = await fetchFromConvex('projects/listProjects');
        const shopifyProjects = projects.filter(proj => proj.displayPage === 'shopify' || proj.displayPage === 'both');
        if (shopifyProjects.length === 0) return;

        container.innerHTML = shopifyProjects.map(proj => `
            <div class="col-xl-3 col-lg-3 col-md-6 col-sm-12 wow fadeInUp">
                <div class="premium-project-card">
                    <div class="image-wrapper">
                        <span class="category-badge">${proj.category}</span>
                        <img src="${proj.imageUrl}" alt="${proj.title}">
                    </div>
                    <div class="content">
                        <h3 class="title">${proj.title}</h3>
                        <p class="description">${proj.description}</p>
                        <ul class="features-list">
                            ${(proj.features && proj.features.length > 0 ? proj.features : ['Modern UI/UX Design', 'Full-stack Development', 'Performance Optimized']).map(f => `
                                <li><i class="fas fa-check-circle"></i> ${f}</li>
                            `).join('')}
                        </ul>
                        <a href="${proj.projectUrl || '#'}" target="_blank" class="visit-btn">
                            Visit Website <i class="fas fa-external-link-alt"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering shopify projects:", error);
    }
}

// 3. Render Dynamic Jobs (Careers Page)
async function renderDynamicJobs() {
    const container = document.getElementById('dynamic-jobs-container');
    if (!container) return;

    try {
        const jobs = await fetchFromConvex('jobs/listJobs');
        const activeJobs = jobs.filter(j => j.isActive);
        activeJobsList = activeJobs;
        
        if (activeJobs.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">No active openings at the moment. Stay tuned!</div>';
            return;
        }

        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-');        // Replace multiple - with single -
        };

        const getJobDetailsUrl = (job) => {
            const hasHtml = window.location.pathname.endsWith('.html');
            const slug = slugify(job.title);
            return hasHtml ? `job-details.html?slug=${slug}` : `/careers/${slug}`;
        };

        const render = (filtered) => {
            if (filtered.length === 0) {
                container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">No open positions match your search criteria.</div>';
                return;
            }
            container.innerHTML = filtered.map(job => `
                <div class="col-lg-4 col-md-6 wow fadeInUp" onclick="window.location.href = '${getJobDetailsUrl(job)}'" style="cursor: pointer;">
                    <div class="glowing-job-card-wrapper" style="height: 100%;">
                        <div class="job-card p-4 p-md-5" style="background: #1a1a1a; border-radius: 31px; transition: 0.3s; height: 100%; display: flex; flex-direction: column;">
                            <div class="d-flex justify-content-between align-items-start mb-4">
                                <div class="badge px-3 py-2" style="background: rgba(255, 94, 20, 0.1); color: #ff5e14; border-radius: 10px; font-weight: 600; font-size: 13px;">${job.department}</div>
                                <div class="text-white-50 small"><i class="fa-solid fa-location-dot me-1"></i> ${job.location}</div>
                            </div>
                            <h4 class="text-white mb-3" style="font-weight: 800; font-size: 24px; line-height: 1.2;">${job.title}</h4>
                            <p class="text-white-50 mb-5" style="font-size: 15px; line-height: 1.6; flex-grow: 1;">${job.description.substring(0, 120)}...</p>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <div class="text-white fw-bold">${job.type}</div>
                                <button onclick="event.stopPropagation(); openApplyModal('${job._id}')" class="btn p-0" style="color: #ff5e14; font-weight: 800; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Apply Now <i class="fa-solid fa-arrow-right ms-2"></i></button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        };

        render(activeJobs);

        // Event listeners for filtering
        const searchInput = document.getElementById('job-search-input');
        const deptFilter = document.getElementById('job-dept-filter');

        const handleFilter = () => {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            const selectedDept = deptFilter ? deptFilter.value : 'All';

            const filtered = activeJobs.filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchTerm) || job.description.toLowerCase().includes(searchTerm);
                
                let matchesDept = false;
                if (selectedDept === 'All') {
                    matchesDept = true;
                } else {
                    const jobDept = job.department.toLowerCase();
                    const filterDept = selectedDept.toLowerCase();
                    matchesDept = jobDept.includes(filterDept) || filterDept.includes(jobDept) ||
                        (filterDept === 'ops' && (jobDept.includes('operation') || jobDept.includes('ops'))) ||
                        (filterDept === 'development' && (jobDept.includes('tech') || jobDept.includes('dev') || jobDept.includes('eng') || jobDept.includes('ops')));
                }
                return matchesSearch && matchesDept;
            });
            render(filtered);
        };

        if (searchInput) searchInput.addEventListener('input', handleFilter);
        if (deptFilter) deptFilter.addEventListener('change', handleFilter);

    } catch (error) {
        console.error("Error rendering jobs:", error);
    }
}

// Modal handling
window.openApplyModal = (jobId) => {
    const job = activeJobsList.find(j => j._id === jobId);
    if (!job) return;

    document.getElementById('modal-job-title').innerText = job.title;
    document.getElementById('job-id-input').value = jobId;
    
    // Handle custom questions
    const questionsContainer = document.getElementById('custom-questions-container');
    if (questionsContainer && job.customQuestions) {
        questionsContainer.innerHTML = job.customQuestions.map((q, idx) => `
            <div class="col-12 mt-3">
                <label class="form-label small text-white-50">${q.question}${q.required ? '*' : ''}</label>
                <input type="text" class="form-control custom-q" data-question="${q.question}" ${q.required ? 'required' : ''} style="background: #0f0f0f; border: 1px solid #333; color: #fff; border-radius: 12px;">
            </div>
        `).join('');
    } else {
        questionsContainer.innerHTML = '';
    }

    const modal = new bootstrap.Modal(document.getElementById('applyModal'));
    modal.show();
};

// Form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('application-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-app-btn');
            submitBtn.innerText = 'Uploading Resume...';
            submitBtn.disabled = true;

            try {
                // 1. Handle Resume Upload
                let resumeUrl = "";
                const resumeFile = document.getElementById('app-resume').files[0];
                if (resumeFile) {
                    // Get upload URL
                    const uploadUrlResponse = await fetch(`${CONVEX_URL}/api/run/upload/generateUploadUrl`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ args: {}, format: "json" })
                    });
                    const uploadUrlResult = await uploadUrlResponse.json();
                    const uploadUrl = uploadUrlResult.value;

                    // Upload file
                    const uploadResponse = await fetch(uploadUrl, {
                        method: "POST",
                        headers: { "Content-Type": resumeFile.type },
                        body: resumeFile,
                    });
                    const { storageId } = await uploadResponse.json();

                    // Get public URL
                    const fileUrlResponse = await fetch(`${CONVEX_URL}/api/run/upload/generateFileUrl`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ args: { storageId }, format: "json" })
                    });
                    const fileUrlResult = await fileUrlResponse.json();
                    resumeUrl = fileUrlResult.value;
                }

                submitBtn.innerText = 'Submitting...';

                const customAnswers = [];
                document.querySelectorAll('.custom-q').forEach(input => {
                    customAnswers.push({
                        question: input.dataset.question,
                        answer: input.value
                    });
                });

                const applicationData = {
                    jobId: document.getElementById('job-id-input').value,
                    name: document.getElementById('app-name').value,
                    email: document.getElementById('app-email').value,
                    phone: document.getElementById('app-phone').value,
                    resumeUrl: resumeUrl,
                    portfolioUrl: document.getElementById('app-portfolio').value,
                    message: document.getElementById('app-message').value,
                    answers: customAnswers
                };

                const result = await mutationToConvex('jobs/submitApplication', applicationData);
                if (result) {
                    form.classList.add('d-none');
                    document.getElementById('app-success').classList.remove('d-none');
                }
            } catch (err) {
                console.error("Submission error:", err);
                alert("Failed to submit application. Please try again.");
                submitBtn.innerText = 'Submit Application';
                submitBtn.disabled = false;
            }
        });
    }
});

// 4. Render Dynamic Case Studies
async function renderDynamicCaseStudies() {
    const container = document.getElementById('dynamic-case-studies-container');
    if (!container) return;

    try {
        const caseStudies = await fetchFromConvex('caseStudies/listCaseStudies');
        if (!caseStudies || caseStudies.length === 0) {
            // Static case studies are already loaded on the page, so do nothing!
            return;
        }

        const dynamicHtml = caseStudies.map(cs => `
            <div class="col-lg-4 col-md-6 wow fadeInUp">
                <div class="case-study-card p-4 h-100" style="background: #1a1a1a; border-radius: 24px; border: 1px solid #333; display: flex; flex-direction: column; transition: transform 0.3s ease, border-color 0.3s ease;">
                    <img src="${cs.imageUrl}" alt="${cs.title}" style="width: 100%; height: 220px; object-fit: cover; border-radius: 16px; margin-bottom: 20px;">
                    <div class="badge mb-2 align-self-start" style="background: rgba(255, 94, 20, 0.1); color: #ff5e14; padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 13px;">${cs.category}</div>
                    <h4 class="text-white mb-3" style="font-weight: 700; font-size: 22px;">${cs.title}</h4>
                    <p class="text-white-50 small mb-4" style="line-height: 1.6; flex-grow: 1;">${cs.description}</p>
                    ${cs.projectUrl ? `
                        <a href="${cs.projectUrl}" target="_blank" class="theme-btn btn-style-one w-100 text-center mt-auto" style="padding: 10px 20px; font-size: 14px; border-radius: 12px;"><span class="btn-title">Visit Website <i class="fa-solid fa-external-link ms-2"></i></span></a>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Append dynamic studies after the static ones
        container.insertAdjacentHTML('beforeend', dynamicHtml);
    } catch (error) {
        console.error("Error rendering case studies:", error);
    }
}

// 5. Render Blogs Grid (blog.html)
async function renderBlogsGrid() {
    const container = document.getElementById('dynamic-blogs-grid');
    if (!container) return;

    try {
        const publishedBlogs = await fetchFromConvex('content/listPublished', { type: 'blog' });
        if (publishedBlogs.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">No blogs found. Check back later!</div>';
            return;
        }

        container.innerHTML = publishedBlogs.map(blog => `
            <div class="news-block col-lg-4 col-md-6 wow fadeInUp">
                <div class="blog-single-box">
                    <div class="image-box">
                        <figure class="image">
                            <a href="/blog/${blog.slug}"><img src="${blog.imageUrl || '/images/pages/news/blog-fallback.webp'}" alt="${blog.imageAltText || blog.title}"></a>
                        </figure>
                    </div>
                    <div class="content-box">
                        <span class="date">${new Date(blog.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <h4 class="title">
                            <a href="/blog/${blog.slug}">${blog.title}</a>
                        </h4>
                        <div class="blog-author">
                            <span>By - <a href="#" class="read-more">${blog.author}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering blogs grid:", error);
    }
}

// 6. Render News Grid (news-grid.html)
async function renderNewsGrid() {
    const container = document.getElementById('dynamic-news-grid');
    if (!container) return;

    try {
        const publishedNews = await fetchFromConvex('content/listPublished', { type: 'news' });
        if (publishedNews.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">No news updates found. Check back later!</div>';
            return;
        }

        container.innerHTML = publishedNews.map(news => `
            <div class="news-block col-lg-4 col-md-6 wow fadeInUp">
                <div class="blog-single-box">
                    <div class="image-box">
                        <figure class="image">
                            <a href="/news/${news.slug}"><img src="${news.imageUrl || '/images/pages/news/blog-fallback.webp'}" alt="${news.imageAltText || news.title}"></a>
                        </figure>
                    </div>
                    <div class="content-box">
                        <span class="date">${new Date(news.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <h4 class="title">
                            <a href="/news/${news.slug}">${news.title}</a>
                        </h4>
                        <div class="blog-author">
                            <span>By - <a href="#" class="read-more">${news.author}</a></span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering news grid:", error);
    }
}

// 7. Render Content Details (blog-details.html / news-details.html)
async function renderContentDetails() {
    const titleEl = document.getElementById('details-title');
    if (!titleEl) return;

    const slug = getSlugFromUrl();
    if (!slug) return;

    try {
        const response = await fetch(`${CONVEX_URL}/api/run/content/getBySlug`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ args: { slug }, format: "json" })
        });
        const result = await response.json();
        const content = result.value;

        if (!content) {
            titleEl.innerText = "Content not found";
            return;
        }

        // Update basic info
        titleEl.innerText = content.title;
        document.title = content.metaTitle || content.title;

        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle) breadcrumbTitle.innerText = content.title;

        const breadcrumbType = document.getElementById('breadcrumb-type');
        if (breadcrumbType) breadcrumbType.innerText = content.type.charAt(0).toUpperCase() + content.type.slice(1);
        
        const imgEl = document.getElementById('details-image');
        if (imgEl) imgEl.src = content.imageUrl || '/images/inner/news-details.jpg';

        const dateEl = document.getElementById('details-date');
        if (dateEl) {
            const date = new Date(content.publishedAt);
            dateEl.innerHTML = `
                <span class="day">${date.getDate()}</span>
                <span class="month">${date.toLocaleString('en-US', { month: 'short' })}</span>
            `;
        }

        const authorEl = document.getElementById('details-author');
        if (authorEl) authorEl.innerHTML = `<i class="fas fa-user-circle"></i> ${content.author}`;

        const bodyEl = document.getElementById('details-body');
        if (bodyEl) bodyEl.innerHTML = content.body;

        // Render tags
        const tagsEl = document.getElementById('details-tags');
        if (tagsEl) {
            if (content.tags && content.tags.length > 0) {
                tagsEl.innerHTML = `<span>Tags</span> ` + content.tags.map(t => `<a href="#">${t}</a>`).join(' ');
                tagsEl.style.display = 'block';
            } else {
                tagsEl.style.display = 'none';
            }
        }

        // Render sidebar
        renderSidebarLatestPosts(content.type);
        renderSidebarRecentComments();

        // Render adjacent posts
        renderAdjacentPosts(content._id, content.type);

        // Render comments
        renderComments(content._id);

        // Setup comment form
        setupCommentForm(content._id);

    } catch (error) {
        console.error("Error rendering content details:", error);
    }
}

// 8. Render Sidebar Latest Posts
async function renderSidebarLatestPosts(type) {
    const container = document.getElementById('sidebar-latest-posts');
    if (!container) return;

    try {
        const published = await fetchFromConvex('content/listPublished', { type });
        if (published.length === 0) return;

        container.innerHTML = published.slice(0, 3).map(item => `
            <li>
                <div class="sidebar__post-image"> <img src="${item.imageUrl || '/images/inner/news-23.jpg'}" alt="${item.title}"> </div>
                <div class="sidebar__post-content">
                    <h3> <span class="sidebar__post-content-meta"><i class="fas fa-user-circle"></i>${item.author}</span> <a href="${type === 'blog' ? '/blog/' : '/news/'}${item.slug}">${item.title}</a>
                    </h3>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error("Error rendering sidebar posts:", error);
    }
}

// 9. Render Adjacent Posts (Next/Prev)
async function renderAdjacentPosts(currentId, type) {
    const container = document.getElementById('nav-links');
    if (!container) return;

    try {
        const adjacent = await fetchFromConvex('content/getAdjacent', { currentId, type });
        if (!adjacent) return;

        let html = '';
        if (adjacent.prev) {
            html += `
                <div class="prev">
                    <a href="${type === 'blog' ? '/blog/' : '/news/'}${adjacent.prev.slug}" rel="prev">${adjacent.prev.title}</a>
                </div>
            `;
        }
        if (adjacent.next) {
            html += `
                <div class="next">
                    <a href="${type === 'blog' ? '/blog/' : '/news/'}${adjacent.next.slug}" rel="next">${adjacent.next.title}</a>
                </div>
            `;
        }
        container.innerHTML = html;
    } catch (error) {
        console.error("Error rendering adjacent posts:", error);
    }
}

// 10. Render Comments
async function renderComments(contentId) {
    const container = document.getElementById('comments-container');
    const countEl = document.getElementById('comments-count');
    if (!container) return;

    try {
        const comments = await fetchFromConvex('comments/listComments', { contentId });
        if (countEl) countEl.innerText = `${comments.length} Comments`;

        if (comments.length === 0) {
            container.innerHTML = '<p class="text-white-50">No comments yet. Be the first to comment!</p>';
            return;
        }

        container.innerHTML = comments.map(c => `
            <div class="comment-one__single">
                <div class="comment-one__image"> <img src="/images/inner/author-2.jpg" alt=""> </div>
                <div class="comment-one__content">
                    <h3>${c.name}</h3>
                    <p>${c.comment}</p>
                    <a href="#" class="theme-btn btn-style-one comment-one__btn"><span class="btn-title">Reply</span></a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering comments:", error);
    }
}

// 11. Setup Comment Form
function setupCommentForm(contentId) {
    const form = document.getElementById('comment-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {
            contentId,
            name: formData.get('form_name'),
            email: formData.get('form_email'),
            comment: formData.get('form_message'),
        };

        if (!data.name || !data.email || !data.comment) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="btn-title">Posting...</span>';
            btn.disabled = true;

            await fetchFromConvex('comments/addComment', data);
            
            alert("Comment posted successfully!");
            form.reset();
            renderComments(contentId);
            
            btn.innerHTML = originalText;
            btn.disabled = false;
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again.");
        }
    });
}

// 12. Render Sidebar Recent Comments
async function renderSidebarRecentComments() {
    const container = document.getElementById('sidebar-recent-comments');
    if (!container) return;

    try {
        const comments = await fetchFromConvex('comments/listRecentGlobal');
        if (comments.length === 0) {
            container.innerHTML = '<li><p class="text-white-50">No recent comments.</p></li>';
            return;
        }

        container.innerHTML = comments.map(c => `
            <li>
                <div class="sidebar__comments-icon"> <i class="fas fa-comments"></i> </div>
                <div class="sidebar__comments-text-box">
                    <p><span>${c.name}</span> on post:</p>
                    <h5>${c.comment.substring(0, 40)}${c.comment.length > 40 ? '...' : ''}</h5>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error("Error rendering sidebar comments:", error);
    }
}

// 13. Render Single Job Details (job-details.html)
async function renderSingleJobDetails() {
    const titleEl = document.getElementById('job-detail-title');
    if (!titleEl) return;

    // Get job ID or slug
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    const querySlug = urlParams.get('slug');
    
    let jobSlug = querySlug;
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (!jobSlug && pathParts.length >= 2 && pathParts[0] === 'careers') {
        jobSlug = pathParts[1].replace('.html', '');
    }

    if (!jobId && !jobSlug) {
        titleEl.innerText = "Job not found";
        return;
    }

    try {
        const response = await fetch(`${CONVEX_URL}/api/run/jobs/listJobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ args: {}, format: "json" })
        });
        const result = await response.json();
        const activeJobs = result.value || [];

        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-');
        };

        const job = activeJobs.find(j => {
            if (jobId) return j._id === jobId;
            if (jobSlug) return slugify(j.title) === jobSlug;
            return false;
        });

        if (!job) {
            titleEl.innerText = "Job not found";
            return;
        }

        // Set active job for modal handling
        activeJobsList = [job];

        // Update elements
        titleEl.innerText = job.title;
        document.title = `${job.title} | Careers at Synergy Brand Architect`;

        const deptBadge = document.getElementById('job-detail-dept');
        if (deptBadge) deptBadge.innerText = job.department;

        const locEl = document.getElementById('job-detail-location');
        if (locEl) locEl.innerText = job.location;

        const typeEl = document.getElementById('job-detail-type');
        if (typeEl) typeEl.innerText = job.type;

        const salaryEl = document.getElementById('job-detail-salary');
        if (salaryEl) {
            salaryEl.innerText = job.salaryRange || 'Not specified';
        }

        const dateEl = document.getElementById('job-detail-date');
        if (dateEl) {
            dateEl.innerText = new Date(job.postedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
        }

        const descEl = document.getElementById('job-detail-desc');
        if (descEl) {
            // Replace newlines with <br> or paragraphs to maintain formatting
            descEl.innerHTML = job.description.replace(/\n/g, '<br>');
        }

        // Set job ID in form
        const idInput = document.getElementById('job-id-input');
        if (idInput) idInput.value = jobId;

        // Custom application questions
        const questionsContainer = document.getElementById('custom-questions-container');
        if (questionsContainer && job.customQuestions) {
            questionsContainer.innerHTML = job.customQuestions.map((q, idx) => `
                <div class="col-12 mt-3">
                    <label class="form-label small text-white-50">${q.question}${q.required ? '*' : ''}</label>
                    <input type="text" class="form-control custom-q" data-question="${q.question}" ${q.required ? 'required' : ''} style="background: #0f0f0f; border: 1px solid #333; color: #fff; border-radius: 12px;">
                </div>
            `).join('');
        }

        // Setup apply button
        const applyBtn = document.getElementById('job-detail-apply-btn');
        if (applyBtn) {
            applyBtn.onclick = () => openApplyModal(job._id);
        }

    } catch (error) {
        console.error("Error rendering job details:", error);
    }
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    renderDynamicBlogs();
    renderDynamicProjects();
    renderShopifyProjects();
    renderDynamicJobs();
    renderDynamicCaseStudies();
    renderBlogsGrid();
    renderNewsGrid();
    renderContentDetails();
    renderSingleJobDetails();
    
    // Auto-inject AI Assistant globally across all pages
    if (!document.getElementById('synergy-ai-script') && !document.querySelector('script[src="js/ai-assistant.js"]') && !document.querySelector('script[src="/js/ai-assistant.js"]')) {
        const script = document.createElement('script');
        script.id = 'synergy-ai-script';
        script.src = '/js/ai-assistant.js';
        document.body.appendChild(script);
    }
});
