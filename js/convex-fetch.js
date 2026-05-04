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
            body: JSON.stringify(args)
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
            body: JSON.stringify(args)
        });
        const result = await response.json();
        return result.value;
    } catch (error) {
        console.error(`Error sending mutation to Convex (${funcName}):`, error);
        return null;
    }
}

// 1. Render Dynamic Blogs
async function renderDynamicBlogs() {
    const container = document.getElementById('dynamic-blogs-container');
    if (!container) return;

    try {
        const blogs = await fetchFromConvex('content/listAll');
        const publishedBlogs = blogs.filter(b => b.isPublished && b.type === 'blog');
        
        if (publishedBlogs.length === 0) return;

        container.innerHTML = publishedBlogs.slice(0, 3).map(blog => `
            <div class="news-block col-lg-4 col-md-6 wow fadeInUp">
                <div class="blog-single-box style_two">
                    <div class="image-box">
                        <figure class="image">
                            <a href="blog-details.html?slug=${blog.slug}"><img src="${blog.imageUrl || 'images/home-2/blog1.jpg'}" alt="${blog.imageAltText || blog.title}"></a>
                        </figure>
                    </div>
                    <div class="content-box">
                        <span class="date">${new Date(blog.publishedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <h4 class="title">
                            <a href="blog-details.html?slug=${blog.slug}">${blog.title}</a>
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
        if (projects.length === 0) return;

        container.innerHTML = projects.map(proj => `
            <div class="col-lg-4 col-md-6 wow fadeInUp">
                <div class="project-block">
                    <div class="inner-box">
                        <div class="image-box">
                            <figure class="image">
                                <a href="page-project-details.html?id=${proj._id}"><img src="${proj.imageUrl}" alt="${proj.title}"></a>
                            </figure>
                        </div>
                        <div class="content-box">
                            <div class="text">${proj.category}</div>
                            <h4 class="title"><a href="page-project-details.html?id=${proj._id}">${proj.title}</a></h4>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering projects:", error);
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

        container.innerHTML = activeJobs.map(job => `
            <div class="col-lg-4 col-md-6 wow fadeInUp">
                <div class="job-card p-4 p-md-5" style="background: #1a1a1a; border-radius: 32px; border: 1px solid #333; transition: 0.3s; height: 100%; display: flex; flex-direction: column;">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div class="badge px-3 py-2" style="background: rgba(255, 94, 20, 0.1); color: #ff5e14; border-radius: 10px; font-weight: 600; font-size: 13px;">${job.department}</div>
                        <div class="text-white-50 small"><i class="fa-solid fa-location-dot me-1"></i> ${job.location}</div>
                    </div>
                    <h4 class="text-white mb-3" style="font-weight: 800; font-size: 24px; line-height: 1.2;">${job.title}</h4>
                    <p class="text-white-50 mb-5" style="font-size: 15px; line-height: 1.6; flex-grow: 1;">${job.description.substring(0, 120)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <div class="text-white fw-bold">${job.type}</div>
                        <button onclick="openApplyModal('${job._id}')" class="btn p-0" style="color: #ff5e14; font-weight: 800; text-transform: uppercase; font-size: 14px; letter-spacing: 1px;">Apply Now <i class="fa-solid fa-arrow-right ms-2"></i></button>
                    </div>
                </div>
            </div>
        `).join('');
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
            submitBtn.innerText = 'Submitting...';
            submitBtn.disabled = true;

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
                portfolioUrl: document.getElementById('app-portfolio').value,
                message: document.getElementById('app-message').value,
                answers: customAnswers
            };

            try {
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
        if (caseStudies.length === 0) {
            container.innerHTML = '<div class="col-12 text-center text-white-50 p-5">Coming soon! We are documenting our latest success stories.</div>';
            return;
        }

        container.innerHTML = caseStudies.map(cs => `
            <div class="col-lg-4 col-md-6 wow fadeInUp">
                <div class="case-study-card p-4 h-100" style="background: #1a1a1a; border-radius: 24px; border: 1px solid #333;">
                    <img src="${cs.imageUrl}" alt="${cs.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 16px; margin-bottom: 20px;">
                    <div class="badge mb-2" style="background: rgba(255, 94, 20, 0.1); color: #ff5e14;">${cs.category}</div>
                    <h4 class="text-white mb-3" style="font-weight: 700;">${cs.title}</h4>
                    <p class="text-white-50 small mb-0">${cs.description}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error rendering case studies:", error);
    }
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    renderDynamicBlogs();
    renderDynamicProjects();
    renderDynamicJobs();
    renderDynamicCaseStudies();
});
