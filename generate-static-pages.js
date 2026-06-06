const fs = require('fs');
const path = require('path');
const https = require('https');

const DOMAIN = 'https://synergybrandarchitect.in';

function truncateTitle(title) {
    if (!title || title.length <= 60) return title;
    let truncated = title.substring(0, 57);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 40) {
        truncated = truncated.substring(0, lastSpace);
    }
    return truncated + '...';
}

function fetchFromConvex(funcName, args = {}) {
    return new Promise((resolve, reject) => {
        const formattedName = funcName.replace(':', '/');
        const convexUrl = process.env.CONVEX_URL || 'https://qualified-duck-586.convex.cloud';
        const url = `${convexUrl}/api/run/${formattedName}`;
        
        const payload = JSON.stringify({ args, format: "json" });
        
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed.value || []);
                } catch (err) {
                    reject(err);
                }
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        req.write(payload);
        req.end();
    });
}

function ensureDirectoryExistence(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}

async function preRenderPage(post, type) {
    const templatePath = type === 'blog' ? 'blog-details.html' : 'news-details.html';
    
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template not found: ${templatePath}`);
        return;
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    let metaTitle = post.metaTitle || post.title;
    metaTitle = truncateTitle(metaTitle);
    const metaDesc = post.metaDescription || post.title;
    const imageUrl = post.imageUrl || 'https://synergybrandarchitect.in/images/common/logos/SBA-logo.webp';
    const pageUrl = `${DOMAIN}/${type}/${post.slug}/`;

    // 1. Update Title tag
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${metaTitle}</title>`);

    // 2. Update meta description tag
    html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"/i, `<meta name="description" content="${metaDesc}">`);
    html = html.replace(/<meta\s+content="[\s\S]*?"\s+name="description"/i, `<meta name="description" content="${metaDesc}">`);

    // 3. Update Open Graph Meta tags
    html = html.replace(/<meta\s+property="og:url"\s+content="[\s\S]*?"/i, `<meta property="og:url" content="${pageUrl}">`);
    html = html.replace(/<meta\s+property="og:title"\s+content="[\s\S]*?"/i, `<meta property="og:title" content="${post.title}">`);
    html = html.replace(/<meta\s+property="og:description"\s+content="[\s\S]*?"/i, `<meta property="og:description" content="${metaDesc}">`);
    html = html.replace(/<meta\s+property="og:image"\s+content="[\s\S]*?"/i, `<meta property="og:image" content="${imageUrl}">`);

    // 4. Update Twitter Meta tags
    html = html.replace(/<meta\s+property="twitter:url"\s+content="[\s\S]*?"/i, `<meta property="twitter:url" content="${pageUrl}">`);
    html = html.replace(/<meta\s+property="twitter:title"\s+content="[\s\S]*?"/i, `<meta property="twitter:title" content="${post.title}">`);
    html = html.replace(/<meta\s+property="twitter:description"\s+content="[\s\S]*?"/i, `<meta property="twitter:description" content="${metaDesc}">`);
    html = html.replace(/<meta\s+property="twitter:image"\s+content="[\s\S]*?"/i, `<meta property="twitter:image" content="${imageUrl}">`);
    html = html.replace(/<meta\s+name="twitter:image"\s+content="[\s\S]*?"/i, `<meta name="twitter:image" content="${imageUrl}">`);

    // 4.5. Update or Inject Canonical Tag
    const canonicalLink = `<link rel="canonical" href="${pageUrl}">`;
    if (html.includes('rel="canonical"')) {
        html = html.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, canonicalLink);
        html = html.replace(/<link\s+href="[^"]*"\s+rel="canonical"\s*\/?>/i, canonicalLink);
    } else {
        html = html.replace('</head>', `    ${canonicalLink}\n</head>`);
    }

    // 5. Pre-render body elements for ultra-fast loading & SEO parsing
    // Breadcrumb Title
    html = html.replace(/<h1 class="title" id="breadcrumb-title">[\s\S]*?<\/h1>/i, `<h1 class="title" id="breadcrumb-title">${post.title}</h1>`);
    // Breadcrumb Type
    html = html.replace(/<li id="breadcrumb-type">[\s\S]*?<\/li>/i, `<li id="breadcrumb-type">${type === 'blog' ? 'Blog' : 'News'}</li>`);
    // Details Title
    html = html.replace(/<h3 class="blog-details__title" id="details-title">[\s\S]*?<\/h3>/i, `<h3 class="blog-details__title" id="details-title">${post.title}</h3>`);
    // Details Author
    html = html.replace(/<li id="details-author">[\s\S]*?<\/li>/i, `<li id="details-author"><a href="/${type}/${post.slug}/"><i class="fas fa-user-circle"></i> ${post.author || 'Admin'}</a></li>`);
    
    // Details Date
    const date = new Date(post.publishedAt || Date.now());
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    html = html.replace(/<div class="blog-details__date" id="details-date">[\s\S]*?<\/div>/i, `<div class="blog-details__date" id="details-date"><span class="day">${day}</span><span class="month">${month}</span></div>`);

    // Details Image
    html = html.replace(/<img[^>]*?id="details-image"[^>]*?>/i, `<img loading="lazy" decoding="async" src="${imageUrl}" alt="${post.imageAltText || post.title}" id="details-image">`);

    // Details Body
    html = html.replace(/<div id="details-body">[\s\S]*?<\/div>/i, `<div id="details-body">${post.body}</div>`);

    // Define output path (dist/blog/slug/index.html or dist/news/slug/index.html)
    const outDir = path.join('dist', type, post.slug);
    const outFile = path.join(outDir, 'index.html');
    
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outFile, html, 'utf8');
    console.log(`  ✓ Pre-rendered static page: ${outFile}`);
}

async function main() {
    console.log('🤖 Starting Static Page Generator (SSG)...');
    
    // Fetch dynamic content from Convex
    try {
        console.log('☁️  Fetching blog posts from Convex...');
        const blogs = await fetchFromConvex('content/listPublished', { type: 'blog' });
        console.log(`📝 Found ${blogs.length} published blogs to pre-render.`);
        for (const blog of blogs) {
            await preRenderPage(blog, 'blog');
        }
        
        console.log('☁️  Fetching news items from Convex...');
        const news = await fetchFromConvex('content/listPublished', { type: 'news' });
        console.log(`📰 Found ${news.length} published news items to pre-render.`);
        for (const item of news) {
            await preRenderPage(item, 'news');
        }
        
        console.log('🎉 Static site generation (SSG) complete!');
    } catch (err) {
        console.error('❌ Error during static page generation:', err);
        process.exit(1);
    }
}

main();
