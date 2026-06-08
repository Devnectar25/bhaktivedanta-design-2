const fs = require('fs');

const path = 'src/Admin Panel html code/admin-common.js';
let content = fs.readFileSync(path, 'utf8');

// The regex matches the current logo div we inserted last time
const oldLogoRegex = /<div class="px-md mb-lg border-b border-white\/10 pb-sm pt-2">[\s\S]*?<\/div>/;
const newLogoHTML = `<div class="px-md mb-lg border-b border-white/10 pb-sm pt-2">
        <a href="dashboard.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/icon.png" alt="Icon" class="h-[54px] w-auto object-contain">
            <img src="/logo.png" alt="Bhaktivedanta Hospital" class="h-[44px] w-auto object-contain" style="filter: brightness(0) invert(1);">
        </a>
    </div>`;

content = content.replace(oldLogoRegex, newLogoHTML);
fs.writeFileSync(path, content);
console.log('Successfully updated admin-common.js with both icon and logo.');
