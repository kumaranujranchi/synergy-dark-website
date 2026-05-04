/**
 * Synergy Brand Architect - Dynamic Content Fetching
 * Fetches Blogs, Projects, and Jobs from Convex
 */

async function fetchFromConvex(funcName, args = {}) {
    const queryParams = new URLSearchParams(args).toString();
    const url = `${CONVEX_URL}/api/query/${funcName}${queryParams ? '?' + queryParams : ''}`;
    const response = await fetch(url);
    const result = await response.json();
    return result.value || [];
}

async function mutationToConvex(funcName, args = {}) {
    const url = `${CONVEX_URL}/api/mutation/${funcName}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: args }),
    });
    const result = await response.json();
    return result;
}

// Global variable to store active jobs for modal lookup
let activeJobsList = [];

async function renderDynamicBlogs() {
    const container = document.getElementById('dynamic-blog-container');
    if (!container) return;

    try {
        const blogs = await fetchFromConvex('content:listAll');
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
        const projects = await fetchFromConvex('projects:listProjects');
        if (projects.length === 0) return;

        container.innerHTML = projects.map(proj => `
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 wow fadeInUp">
                <div class="project-box-style-4">
                    <div class="images-box">
                        <a href="page-project-details.html"><img src="${proj.imageUrl}" alt="${proj.title}"></a>
                        <div class="icon"><a href="page-project-details.html" style="color:#fff;"><i class="fa fa-arrow-right"></i></a></div>
                    </div>
                    <div class="content">
                        <h4 class="title"><a href="page-project-details.html">${proj.title}</a></h4>
                        <a href="page-project-details.html" class="post-box">${proj.category.toUpperCase()}</a>
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
        const jobs = await fetchFromConvex('jobs:listJobs');
        const activeJobs = jobs.filter(j => j.isActive);
        activeJobsList = activeJobs;
        
        if (activeJobs.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white p-5">No active openings at the moment. Stay tuned!</div>';
            return;
        }

        container.innerHTML = activeJobs.map(job => `
            <div class="col-xl-4 col-md-6 wow fadeInUp" data-wow-delay=".1s">
                <div class="job-card p-5" style="background: #1a1a1a; border-radius: 32px; border: 1px solid #333; transition: 0.4s; height: 100%; display: flex; flex-direction: column;">
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <span style="background: rgba(255,94,20,0.1); color: #ff5e14; padding: 6px 16px; border-radius: 50px; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">${job.type}</span>
                        <div style="color: #555; font-size: 18px;"><i class="fa-solid fa-briefcase"></i></div>
                    </div>
                    <h3 style="font-weight: 800; color: #fff; margin-bottom: 12px; font-size: 24px;">${job.title}</h3>
                    <div class="d-flex gap-3 text-white-50 small mb-4">
                        <span><i class="fa-solid fa-location-dot me-2 text-warning"></i> ${job.location}</span>
                        <span><i class="fa-solid fa-folder me-2 text-warning"></i> ${job.department}</span>
                    </div>
                    <p class="text-white-50 mb-5" style="font-size: 15px; line-height: 1.6; flex-grow: 1;">${job.description.substring(0, 120)}...</p>
                    <button 
                        class="btn-apply w-100 py-3" 
                        data-bs-toggle="modal" 
                        data-bs-target="#applyModal"
                        data-job-id="${job._id}"
                        data-job-title="${job.title}"
                        style="background: transparent; border: 1px solid #ff5e14; color: #ff5e14; font-weight: 800; border-radius: 12px; transition: 0.3s;"
                        onmouseover="this.style.background='#ff5e14'; this.style.color='#fff'"
                        onmouseout="this.style.background='transparent'; this.style.color='#ff5e14'"
                    >
                        Apply Now
                    </button>
                </div>
            </div>
        `).join('');

        // Setup modal listeners
        document.querySelectorAll('.btn-apply').forEach(btn => {
            btn.addEventListener('click', function() {
                const jobId = this.getAttribute('data-job-id');
                const jobTitle = this.getAttribute('data-job-title');
                const job = activeJobsList.find(j => j._id === jobId);
                
                document.getElementById('modal-job-title').innerText = jobTitle;
                document.getElementById('job-id-input').value = jobId;
                
                // Render custom questions
                const questionsContainer = document.getElementById('custom-questions-container');
                if (questionsContainer && job.customQuestions) {
                    questionsContainer.innerHTML = job.customQuestions.map((q, i) => `
                        <div class="col-12 mt-3">
                            <label class="form-label small text-white-50">${q.question}${q.required ? '*' : ''}</label>
                            <input 
                                type="text" 
                                class="form-control custom-answer-input" 
                                data-question="${q.question}" 
                                ${q.required ? 'required' : ''} 
                                style="background: #0f0f0f; border: 1px solid #333; color: #fff; border-radius: 12px;"
                            >
                        </div>
                    `).join('');
                } else if (questionsContainer) {
                    questionsContainer.innerHTML = '';
                }
                
                // Reset form
                document.getElementById('application-form').classList.remove('d-none');
                document.getElementById('app-success').classList.add('d-none');
                document.getElementById('application-form').reset();
            });
        });

    } catch (error) {
        console.error("Error loading jobs:", error);
    }
}

// Handle application submission
async function setupApplicationForm() {
    const form = document.getElementById('application-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-app-btn');
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        // Collect custom answers
        const customAnswers = [];
        document.querySelectorAll('.custom-answer-input').forEach(input => {
            customAnswers.push({
                question: input.getAttribute('data-question'),
                answer: input.value
            });
        });

        const applicationData = {
            jobId: document.getElementById('job-id-input').value,
            name: document.getElementById('app-name').value,
            email: document.getElementById('app-email').value,
            phone: document.getElementById('app-phone').value,
            portfolioUrl: document.getElementById('app-portfolio').value,
            message: document.getElementById('app-message').value,
            answers: customAnswers.length > 0 ? customAnswers : undefined
        };

        try {
            const result = await mutationToConvex('jobs:submitApplication', applicationData);
            if (result) {
                form.classList.add('d-none');
                document.getElementById('app-success').classList.remove('d-none');
            }
        } catch (error) {
            console.error("Application error:", error);
            alert("Something went wrong. Please try again.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit Application";
        }
    });
}

async function renderDynamicCaseStudies() {
    const container = document.getElementById('dynamic-case-studies-container');
    if (!container) return;

    try {
        const caseStudies = await fetchFromConvex('caseStudies:listCaseStudies');
        if (caseStudies.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">Coming soon! We are documenting our latest success stories.</div>';
            return;
        }

        container.innerHTML = caseStudies.map(cs => `
            <div class="col-xl-4 col-lg-4 col-md-6 col-sm-12 wow fadeInUp">
                <div class="project-box-style-4">
                    <div class="images-box">
                        <img src="${cs.imageUrl}" alt="${cs.title}">
                        <div class="icon"><a href="#" style="color:#fff;"><i class="fa fa-arrow-right"></i></a></div>
                    </div>
                    <div class="content">
                        <span class="post-box" style="color: #ff5e14; font-weight: 700; font-size: 12px; letter-spacing: 1px; text-decoration: none;">${cs.client.toUpperCase()} • ${cs.category.toUpperCase()}</span>
                        <h4 class="title mt-2" style="font-weight: 800; color: #fff;">${cs.title}</h4>
                        <p class="text-white-50 mt-2" style="font-size: 14px; line-height: 1.6;">${cs.description}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error loading case studies:", error);
    }
}

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', () => {
    renderDynamicBlogs();
    renderDynamicProjects();
    renderDynamicJobs();
    renderDynamicCaseStudies();
});

$(document).ready(function() {
    renderDynamicBlogs();
    renderDynamicProjects();
    renderDynamicJobs();
    setupApplicationForm();
});
