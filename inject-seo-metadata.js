const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://synergybrandarchitect.in';
const LOGO_URL = 'https://synergybrandarchitect.in/images/common/logos/logo-header.webp';

function getHtmlFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            const basename = path.basename(filePath);
            const excludeDirs = ['node_modules', 'admin', 'dist', '.git', '.github'];
            if (!excludeDirs.includes(basename) && !basename.startsWith('.')) {
                getHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

async function main() {
    const files = getHtmlFiles('.');
    console.log(`🤖 Scanning ${files.length} HTML files...`);

    let injectedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Find title
        const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : 'Synergy Brand Architect';
        
        // Find description
        const descMatch = content.match(/<meta\s+name="description"\s+content="([\s\S]*?)"/i) || 
                           content.match(/<meta\s+content="([\s\S]*?)"\s+name="description"/i);
        const desc = descMatch ? descMatch[1].trim() : 'Synergy Brand Architect is the leading digital marketing agency in Patna, Bihar.';
        
        // Determine page URL path relative to domain
        let relPath = path.relative('.', file).replace(/\\/g, '/');
        let pageUrl = DOMAIN + '/' + relPath;
        if (relPath === 'index.html') {
            pageUrl = DOMAIN + '/';
        } else {
            // Remove .html extension for cleaner URLs
            pageUrl = pageUrl.replace(/\.html$/, '');
        }
        
        // Check if Open Graph tags or Twitter tags already exist
        const hasOG = content.includes('property="og:image"') || 
                      content.includes("property='og:image'") || 
                      content.includes('name="twitter:image"') ||
                      content.includes('property="twitter:image"');
        
        if (hasOG) {
            console.log(`ℹ️ Skipping ${file} - already has OG/Twitter image tags`);
            skippedCount++;
            continue;
        }
        
        // Prepare social sharing tags block
        const ogTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${desc}">
    <meta property="og:image" content="${LOGO_URL}">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${pageUrl}">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:description" content="${desc}">
    <meta property="twitter:image" content="${LOGO_URL}">
`;

        // Inject tags inside the <head> before closing </head>
        if (content.includes('</head>')) {
            content = content.replace('</head>', `${ogTags}</head>`);
            fs.writeFileSync(file, content, 'utf8');
            console.log(`✓ Injected social sharing meta tags into ${file}`);
            injectedCount++;
        } else {
            console.warn(`✗ Could not find </head> tag in ${file}`);
        }
    }

    console.log(`\n🎉 Scan finished!`);
    console.log(`   - Total Files Checked: ${files.length}`);
    console.log(`   - Successfully Injected: ${injectedCount}`);
    console.log(`   - Already Had Tags (Skipped): ${skippedCount}`);
}

main();
