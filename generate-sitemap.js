const fs = require('fs');
const path = require('path');
const https = require('https');

const DOMAIN = 'https://synergybrandarchitect.in';

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

function getHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            const basename = path.basename(filePath);
            const excludeDirs = ['node_modules', 'admin', 'dist', 'css', 'js', 'fonts', 'images', 'assets', 'vendor'];
            if (!excludeDirs.includes(basename) && !basename.startsWith('.')) {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            const relativePath = path.relative('.', filePath);
            if (file !== 'blog-details.html' && file !== 'news-details.html' && file !== 'dashboard.html') {
                fileList.push(relativePath);
            }
        }
    }
    return fileList;
}

async function main() {
    console.log('🤖 Starting Dynamic Sitemap Generator...');
    
    const urls = [];
    
    // 1. Collect static HTML files
    try {
        const htmlFiles = getHtmlFiles('.');
        console.log(`📂 Found ${htmlFiles.length} static HTML files.`);
        
        for (const file of htmlFiles) {
            let cleanUrl = file.replace(/\\/g, '/'); // Normalize windows paths
            
            if (cleanUrl === 'index.html') {
                urls.push({ loc: `${DOMAIN}/`, changefreq: 'daily', priority: '1.0' });
            } else {
                // Remove .html extension
                cleanUrl = cleanUrl.replace(/\.html$/, '');
                // Avoid duplicating about, services, etc. with leading slashes
                urls.push({ loc: `${DOMAIN}/${cleanUrl}`, changefreq: 'weekly', priority: '0.8' });
            }
        }
    } catch (err) {
        console.error('❌ Error reading static HTML files:', err);
    }
    
    // 2. Fetch dynamic blogs and news from Convex
    try {
        console.log('☁️ Fetching dynamic content from Convex...');
        const blogs = await fetchFromConvex('content/listPublished', { type: 'blog' });
        console.log(`📝 Retrieved ${blogs.length} published blogs.`);
        for (const blog of blogs) {
            urls.push({
                loc: `${DOMAIN}/blog/${blog.slug}`,
                changefreq: 'weekly',
                priority: '0.7',
                lastmod: new Date(blog.publishedAt).toISOString().split('T')[0]
            });
        }
        
        const news = await fetchFromConvex('content/listPublished', { type: 'news' });
        console.log(`📰 Retrieved ${news.length} published news items.`);
        for (const item of news) {
            urls.push({
                loc: `${DOMAIN}/news/${item.slug}`,
                changefreq: 'weekly',
                priority: '0.7',
                lastmod: new Date(item.publishedAt).toISOString().split('T')[0]
            });
        }
    } catch (err) {
        console.warn('⚠️ Could not fetch dynamic content from Convex (using static pages only):', err.message);
    }
    
    // 3. Build XML Sitemap
    console.log(`✍️ Generating XML structure for ${urls.length} URLs...`);
    const xmlEntries = urls.map(url => {
        let entry = '  <url>\n';
        entry += `    <loc>${url.loc}</loc>\n`;
        if (url.lastmod) {
            entry += `    <lastmod>${url.lastmod}</lastmod>\n`;
        }
        entry += `    <changefreq>${url.changefreq}</changefreq>\n`;
        entry += `    <priority>${url.priority}</priority>\n`;
        entry += '  </url>';
        return entry;
    }).join('\n');
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;

    // Ensure build output directory exists (dist)
    if (!fs.existsSync('dist')) {
        fs.mkdirSync('dist');
    }
    
    // Write sitemap.xml to dist directory
    fs.writeFileSync('dist/sitemap.xml', sitemapXml);
    // Also write to workspace root for local persistence/verification
    fs.writeFileSync('sitemap.xml', sitemapXml);
    
    console.log('✅ sitemap.xml successfully generated at /dist/sitemap.xml and /sitemap.xml!');
}

main();
