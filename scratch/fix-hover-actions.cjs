const fs = require('fs');
const path = require('path');

const dirsToSearch = [
    'src/Admin Panel html code',
    'scratch'
];

const filesToProcess = [];

dirsToSearch.forEach(dir => {
    if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        files.forEach(f => {
            if (f.endsWith('.html') || f.endsWith('.js') || f.endsWith('.cjs')) {
                filesToProcess.push(path.join(dir, f));
            }
        });
    }
});

let modifiedFiles = 0;

filesToProcess.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;

    // Pattern 1: <div class="flex justify-end gap-[something]">
    newContent = newContent.replace(/class="([^"]*)opacity-0 group-hover:opacity-100 transition-opacity([^"]*)"/g, (match, before, after) => {
        if (before.includes('absolute') || after.includes('absolute')) {
            // Keep absolute positioned ones (like tooltips or image overlays) except if it's gallery action buttons
            if (!match.includes('from-black/60') && !match.includes('bg-primary/40')) {
                 return match;
            }
        }
        
        const newClass = (before + after).trim().replace(/\s+/g, ' ');
        return `class="${newClass}"`;
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent);
        console.log('Updated', file);
        modifiedFiles++;
    }
});

console.log(`Updated ${modifiedFiles} files.`);
