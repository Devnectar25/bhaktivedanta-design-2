const fs = require('fs');

const path = 'src/Admin Panel html code/admin-common.js';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove specialities routing so clicks don't redirect to broken pages
content = content.replace(/'add-speciality\.html': 'specialities\.html',?\n?\s*/g, '');
content = content.replace(/'specialities\.html': 'add-speciality\.html',?\n?\s*/g, '');

// 2. Fix the logo to be the image logo instead of the old text logo, and keep original colors
const oldLogoRegex = /<div class="px-6 mb-6">[\s\S]*?<\/div>/;
const newLogoHTML = `<div class="px-md mb-lg border-b border-white/10 pb-sm pt-2">
        <a href="dashboard.html" class="flex items-center justify-center hover:opacity-80 transition-opacity w-full">
            <img src="/logo.png" alt="Bhaktivedanta Hospital" class="h-[48px] w-auto object-contain">
        </a>
    </div>`;
content = content.replace(oldLogoRegex, newLogoHTML);

// 3. Remove the Emergency Alert Button
const emergencyBtnRegex = /<button id="emergency-alert-btn"[\s\S]*?<\/button>\s*<div class="mt-4 space-y-1">/;
content = content.replace(emergencyBtnRegex, '<div class="mt-4 space-y-1">');

fs.writeFileSync(path, content);
console.log('Successfully updated admin-common.js with the correct logo without the filter.');
