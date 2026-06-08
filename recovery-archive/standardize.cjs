const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const dir = 'c:/Workplace/bhaktivedanta-design-2/src/Admin Panel html code';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const GOLDEN = {
    pageTitle: 'text-2xl font-bold text-on-surface mb-1',
    sectionTitle: 'text-2xl font-bold text-on-surface mb-1',
    cardTitle: 'font-bold text-base text-on-surface',
    primaryButton: 'flex items-center gap-2 bg-secondary-container hover:shadow-lg active:scale-95 transition-all shadow-md px-5 py-2.5 rounded-lg font-label-lg text-label-lg',
    secondaryButton: 'px-6 py-2.5 rounded-lg border border-outline text-outline hover:bg-surface-variant transition-colors font-label-lg text-label-lg',
    filterButton: 'flex items-center gap-2 hover:bg-primary/5 transition-colors px-4 py-1.5 rounded-lg font-label-lg',
    tableHeader: 'px-4 py-3 font-label-lg text-label-lg text-on-surface-variant',
    tableCell: 'px-4 py-3',
    inputField: 'w-full p-3 border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 transition-all px-4 py-1.5 text-body-sm rounded-lg',
    formLabel: 'text-label-sm font-label-sm text-on-surface-variant px-1',
    badge: 'px-3 py-1 rounded-full text-label-sm font-label-sm inline-flex items-center gap-1',
    actionIconBtn: 'w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant relative',
    card: 'bg-white rounded-xl shadow-md border border-outline-variant overflow-hidden',
    tableContainer: 'bg-white rounded-xl shadow-md border border-outline-variant overflow-hidden'
};

files.forEach(file => {
    // Skip services.html as it is the golden reference, and the login page
    if (file === 'services.html' || file === 'index.html' || file === 'login.html') return;
    
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    const $ = cheerio.load(content, { decodeEntities: false });
    let modified = false;

    // 1. Page Titles: Find the first h2 inside main or div that holds the main content
    const h2s = $('main h2, .flex-1 h2');
    if (h2s.length > 0) {
        h2s.first().attr('class', GOLDEN.pageTitle);
        modified = true;
    }

    // Section Titles
    $('h3').each((i, el) => {
        let cls = $(el).attr('class') || '';
        if (cls.includes('font-bold') && !cls.includes('text-base')) {
            $(el).attr('class', GOLDEN.sectionTitle);
            modified = true;
        }
    });

    // 2. Buttons
    $('button, a').each((i, el) => {
        let cls = $(el).attr('class') || '';
        let text = $(el).text().toLowerCase();
        
        if ($(el).is('button') && !cls.includes('absolute')) {
            if (cls.includes('bg-primary') || cls.includes('bg-secondary-container') || text.includes('add ') || text.includes('save') || text.includes('update ') || text.includes('publish')) {
                $(el).attr('class', GOLDEN.primaryButton + (cls.includes('w-full') ? ' w-full' : ''));
                modified = true;
            } else if (text.includes('cancel') || text.includes('reset') || text.includes('back')) {
                if (text.includes('reset filters') || $(el).parents('.bg-white').length > 0 && text.includes('reset')) {
                    $(el).attr('class', GOLDEN.filterButton);
                } else {
                    $(el).attr('class', GOLDEN.secondaryButton + (cls.includes('w-full') ? ' w-full' : ''));
                }
                modified = true;
            }
        }
    });

    // 3. Inputs, Selects, Textareas
    $('input[type="text"], input[type="email"], input[type="number"], input[type="tel"], input[type="date"], select, textarea').each((i, el) => {
        let cls = $(el).attr('class') || '';
        if (!cls.includes('absolute') && !cls.includes('sr-only')) { 
            $(el).attr('class', GOLDEN.inputField);
            modified = true;
        }
    });

    // 4. Form Labels
    $('label').each((i, el) => {
        let cls = $(el).attr('class') || '';
        if (!cls.includes('absolute') && !cls.includes('peer-checked')) {
            $(el).attr('class', GOLDEN.formLabel);
            modified = true;
        }
    });

    // 5. Tables
    $('table').each((i, el) => {
        $(el).attr('class', 'w-full text-left border-collapse');
        $(el).parent().attr('class', GOLDEN.tableContainer);
        modified = true;
    });
    $('thead').each((i, el) => {
        $(el).attr('class', 'bg-surface-container-low border-b border-outline-variant');
        modified = true;
    });
    $('th').each((i, el) => {
        $(el).attr('class', GOLDEN.tableHeader);
        modified = true;
    });
    $('td').each((i, el) => {
        let cls = $(el).attr('class') || '';
        let newCls = GOLDEN.tableCell;
        if (cls.includes('text-center')) newCls += ' text-center';
        if (cls.includes('text-right')) newCls += ' text-right';
        $(el).attr('class', newCls);
        modified = true;
    });
    $('tbody').each((i, el) => {
        $(el).attr('class', 'divide-y divide-outline-variant');
        modified = true;
    });
    $('tbody tr').each((i, el) => {
        $(el).attr('class', 'transition-colors group hover:bg-surface-container-lowest');
        modified = true;
    });

    // 6. Badges
    $('.rounded-full, .rounded-xl').each((i, el) => {
        let cls = $(el).attr('class') || '';
        let text = $(el).text().toLowerCase().trim();
        if ((cls.includes('px-') || cls.includes('p-1')) && cls.includes('text-') && !$(el).is('button') && !$(el).is('img') && text.length > 0 && text.length < 15) {
            let bgMatch = cls.match(/bg-[a-z]+(-[0-9]+|\/[0-9]+)?/);
            let textMatch = cls.match(/text-[a-z]+(-[0-9]+)?/);
            let bgCls = bgMatch ? bgMatch[0] : 'bg-surface-container';
            let txtCls = textMatch && !textMatch[0].includes('text-sm') && !textMatch[0].includes('text-xs') ? textMatch[0] : 'text-on-surface-variant';
            
            $(el).attr('class', bgCls + ' ' + txtCls + ' ' + GOLDEN.badge);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(path.join(dir, file), $.html());
        console.log('Standardized', file);
    }
});
