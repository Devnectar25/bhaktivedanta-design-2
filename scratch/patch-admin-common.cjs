const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/Admin Panel html code/admin-common.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove Centres of Excellence and Emergency Services from navLinks
content = content.replace(
    /\{\s*name:\s*'Health Packages'[\s\S]*?\{\s*name:\s*'Emergency Services'[^}]*\},/g,
    "{ name: 'Health Packages', icon: 'health_and_safety', href: 'health-packages.html' },"
);

// 2. Rename Admin Users to Admin & Sub-Admin
content = content.replace(
    /\{\s*name:\s*'Admin Users',\s*icon:\s*'manage_accounts',\s*href:\s*'admin-users\.html'\s*\}/g,
    "{ name: 'Admin & Sub-Admin', icon: 'manage_accounts', href: 'admin-users.html' }"
);

// 3. Update initializeHeader to inject breadcrumbs into header instead of <h2>
const oldHeaderBlock = `
    header.innerHTML = \`
        <div class="flex items-center gap-4">
            <h2 class="text-lg font-bold text-slate-800 font-sans">\${currentTitle}</h2>
            <div class="relative w-80 group hidden md:block">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-slate-600 transition-colors">search</span>
                <input class="w-full bg-slate-100/80 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-full py-1.5 pl-10 pr-4 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-xs text-slate-700" placeholder="Type here to search list contents..." type="text"/>
            </div>
        </div>
        <div class="flex items-center gap-6">`;

const newHeaderBlock = `
    // Try to find breadcrumbs anywhere in the page
    let breadcrumbNav = originalNav || document.querySelector('main nav') || document.querySelector('section nav');
    let headerLeftContent = \`<h2 class="text-lg font-bold text-slate-800 font-sans">\${currentTitle}</h2>\`;
    
    if (breadcrumbNav && breadcrumbNav.textContent.includes('chevron_right') || breadcrumbNav && breadcrumbNav.textContent.toLowerCase().includes('dashboard')) {
        breadcrumbNav.className = "flex items-center gap-2 text-label-sm font-label-sm text-on-surface-variant";
        headerLeftContent = breadcrumbNav.outerHTML;
        breadcrumbNav.remove(); // Remove it from its original place in the content
    }

    header.innerHTML = \`
        <div class="flex items-center gap-4 w-1/2">
            \${headerLeftContent}
            <div class="relative w-full max-w-md hidden md:block ml-4">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] group-focus-within:text-slate-600 transition-colors">search</span>
                <input class="w-full bg-slate-100/80 border border-slate-200 focus:border-slate-300 focus:bg-white rounded-full py-1.5 pl-10 pr-4 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-xs text-slate-700" placeholder="Type here to search list contents..." type="text"/>
            </div>
        </div>
        <div class="flex items-center gap-6">`;

content = content.replace(oldHeaderBlock, newHeaderBlock);

// Remove the old breadcrumb repositioning block
const repositionBlock = `
    // Reposition the original breadcrumbs to the content area if captured
    if (originalNav) {
        const contentArea = header.nextElementSibling || document.querySelector('main > section') || document.querySelector('main');
        if (contentArea) {
            contentArea.insertBefore(originalNav, contentArea.firstChild);
            originalNav.className = "flex items-center gap-2 mb-6 text-on-surface-variant font-label-sm text-label-sm";
            if (contentArea.classList.contains('grid')) {
                originalNav.classList.add('col-span-12');
            }
        }
    }`;

content = content.replace(repositionBlock, "");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched admin-common.js');
