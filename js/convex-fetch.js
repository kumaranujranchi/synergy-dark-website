/**
 * Synergy Brand Architect - Dynamic Content Fetching
 * Fetches Blogs, Projects, and Jobs from Convex
 */

async function fetchFromConvex(funcName) {
    const response = await fetch(`${CONVEX_URL}/api/query/${funcName}`);
    const result = await response.json();
    return result.value || [];
}

async function renderDynamicBlogs() {
    const container = document.getElementById('dynamic-blog-container');
    if (!container) return;

    try {
        const blogs = await fetchFromConvex('content/listAll');
        const publishedBlogs = blogs.filter(b => b.isPublished && b.type === 'blog');
        
        if (publishedBlogs.length === 0) return;

        container.innerHTML = publishedBlogs.map(blog => `
            <div class="news-block col-lg-4 col-md-6 col-sm-12 wow fadeInUp">
                <div class="blog-single-box">
                    <div class="image-box">
                        <figure class="image">
                            <a href="blog-details.html?slug=${blog.slug}"><img src="${blog.imageUrl || 'images/main-home/blog1.jpg'}" alt=""></a>
                        </figure>
                    </div>
                    <div class="content-box">
                        <span class="date">${new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        <h4 class="title">
                            <a href="blog-details.html?slug=${blog.slug}">${blog.title}</a>
                        </h4>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading blogs:", error);
    }
}

async function renderDynamicProjects() {
    const container = document.getElementById('dynamic-projects-container');
    if (!container) return;

    try {
        const projects = await fetchFromConvex('projects/listProjects');
        if (projects.length === 0) return;

        container.innerHTML = projects.map(proj => `
            <div class="project-block col-lg-4 col-md-6 col-sm-12">
                <div class="project-item">
                    <div class="image-box">
                        <figure class="image"><a href="${proj.imageUrl}" class="lightbox-image"><img src="${proj.imageUrl}" alt=""></a></figure>
                    </div>
                    <div class="content-box">
                        <h4 class="title"><a href="page-project-details.html">${proj.title}</a></h4>
                        <span class="category">${proj.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading projects:", error);
    }
}

async function renderDynamicJobs() {
    const container = document.getElementById('dynamic-jobs-container');
    if (!container) return;

    try {
        const jobs = await fetchFromConvex('jobs/listJobs');
        const activeJobs = jobs.filter(j => j.isActive);
        
        if (activeJobs.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white">No active openings at the moment.</div>';
            return;
        }

        container.innerHTML = activeJobs.map(job => `
            <div class="career-block col-lg-6 col-md-12">
                <div class="career-item p-4 mb-4" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;">
                    <div class="flex justify-between items-start mb-3">
                        <h4 class="text-white font-bold text-xl">${job.title}</h4>
                        <span class="badge bg-orange-500 text-white px-2 py-1 rounded text-xs">${job.type}</span>
                    </div>
                    <p class="text-gray-400 text-sm mb-4">${job.location} • ${job.department}</p>
                    <a href="mailto:careers@synergybrandarchitect.in?subject=Application for ${job.title}" class="theme-btn btn-style-one py-2 px-4" style="font-size: 14px;">
                        Apply Now
                    </a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

$(document).ready(function() {
    renderDynamicBlogs();
    renderDynamicProjects();
    renderDynamicJobs();
});
