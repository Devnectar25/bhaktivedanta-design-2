const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const directory = path.join(__dirname, '../src/Admin Panel html code');
const files = fs.readdirSync(directory).filter(f => f.endsWith('.html'));

let updatedCount = 0;

files.forEach(file => {
    // Skip the ones that might not need this standard admin layout
    if (file === 'login.html') return;

    const filePath = path.join(directory, file);
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Parse using JSDOM
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const main = document.querySelector('main');
    if (!main) return;

    // Find the header. It could be outside main or inside main.
    let header = document.querySelector('header');
    
    if (header) {
        // Standardize Header classes
        // Target: flex-none w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-8 py-4 z-40
        // We preserve inner HTML.
        header.className = 'flex-none w-full bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-8 py-4 z-40';
        
        // Remove 'fixed' styles if any inline
        header.removeAttribute('style');
        
        // Ensure header is inside main, at the very top.
        if (header.parentElement !== main) {
            header.remove();
            main.insertBefore(header, main.firstChild);
        } else if (main.firstChild !== header) {
            // It's inside main, but maybe not the first child.
            header.remove();
            main.insertBefore(header, main.firstChild);
        }
    }

    // Standardize Main classes
    // Target: ml-[280px] h-screen flex flex-col overflow-hidden bg-background text-on-surface
    main.className = 'ml-[280px] h-screen flex flex-col overflow-hidden bg-background text-on-surface';

    // Everything inside main that is NOT the header should be wrapped in the flex-1 scroller.
    // Let's check if there's already a flex-1 scroller.
    let scroller = null;
    let mainChildren = Array.from(main.children);
    
    // Check if there's an existing section or div with flex-1 overflow-y-auto
    const existingScroller = mainChildren.find(el => el !== header && (el.classList.contains('overflow-y-auto') || el.classList.contains('flex-1')));
    
    if (existingScroller) {
        // Just standardize it
        existingScroller.className = 'flex-1 overflow-y-auto custom-scrollbar p-8';
        // Clean up inner wrappers if they have weird margins/padding
        scroller = existingScroller;
    } else {
        // Create new scroller
        scroller = document.createElement('div');
        scroller.className = 'flex-1 overflow-y-auto custom-scrollbar p-8';
        
        // Move all children except header into scroller
        mainChildren.forEach(child => {
            if (child !== header && child.tagName !== 'SCRIPT') {
                scroller.appendChild(child);
            }
        });
        
        main.appendChild(scroller);
    }

    // Strip padding/margin from immediate children of scroller if they were compensating for fixed header
    Array.from(scroller.children).forEach(child => {
        if (child.classList) {
            child.classList.remove('pt-16', 'pt-24', 'pt-[88px]', 'mt-16', 'mt-24', 'pb-xl', 'pb-6', 'px-6', 'p-md', 'p-xl', 'min-h-screen', 'min-h-[calc(100vh-64px)]', 'h-screen');
            // Ensure max-w-[1440px] and mx-auto if it's the main wrapper
            if (child.tagName === 'DIV' || child.tagName === 'SECTION') {
                if (!child.classList.contains('max-w-[1440px]')) {
                   // child.classList.add('max-w-[1440px]', 'mx-auto');
                }
            }
        }
    });

    // Write back
    const newHtml = dom.serialize();
    if (newHtml !== html) {
        fs.writeFileSync(filePath, newHtml, 'utf8');
        updatedCount++;
    }
});

console.log(`Successfully standardized layout for ${updatedCount} files.`);
