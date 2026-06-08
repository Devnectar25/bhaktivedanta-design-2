const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Inject the Toggle Button into the Header
const oldHeader = `<div class="mb-8">
                <h2 class="text-[28px] font-bold text-[#121c2a] mb-2 leading-tight">Service Content Builder</h2>
                <p class="text-[15px] text-[#444651]">Design the service landing page structure and content sections.</p>
            </div>`;
const newHeader = `<div class="mb-8 flex justify-between items-start">
                <div>
                    <h2 class="text-[28px] font-bold text-[#121c2a] mb-2 leading-tight">Service Content Builder</h2>
                    <p class="text-[15px] text-[#444651]">Design the service landing page structure and content sections.</p>
                </div>
                <button id="togglePreviewBtn" class="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-[18px]">visibility_off</span> <span id="togglePreviewText">Hide Preview</span>
                </button>
            </div>`;
html = html.replace(oldHeader, newHeader);

// 2. Add IDs and transition classes to columns
// Left Column
html = html.replace(
    '<div class="flex-1 bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6 md:p-8 flex flex-col min-h-[600px]">',
    '<div id="builderMain" class="flex-1 bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6 md:p-8 flex flex-col min-h-[600px] transition-all duration-300">'
);
// Right Column
html = html.replace(
    '<div class="w-full lg:w-[480px] xl:w-[600px] shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-[calc(100vh-180px)] sticky top-0">',
    '<div id="previewSidebar" class="w-full lg:w-[480px] xl:w-[600px] shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-[calc(100vh-180px)] sticky top-0 transition-all duration-300">'
);


// 3. Replace the entire Script Block with new logic
const scriptRegex = /<script>[\s\S]*?<\/script>\s*<\/body>/;
const newScript = `<script>
    // State
    let sections = [
        { id: 'sec-1', title: 'Overview', content: 'Experience a comprehensive approach to health that integrates physical, mental, and spiritual well-being. Our specialized team creates personalized care plans tailored to your unique needs.' },
        { id: 'sec-2', title: 'How It Works', content: 'Learn about our integrative healing processes and consultations.' },
        { id: 'sec-3', title: 'Why Choose Us', content: 'State-of-the-art facilities combined with spiritual care and ancient wisdom.' },
        { id: 'sec-4', title: 'Programs', content: 'Explore our various therapeutic programs and workshops.' }
    ];
    let activeSectionId = 'sec-1';

    // DOM Elements
    const builderTabs = document.getElementById('builderTabs');
    const previewTabs = document.getElementById('previewTabs');
    const editorArea = document.getElementById('editorArea');
    const previewAllSectionsContainer = document.getElementById('previewAllSectionsContainer');
    const previewScrollArea = document.getElementById('previewScrollArea');
    const serviceName = document.getElementById('serviceName');
    const serviceSlug = document.getElementById('serviceSlug');
    const previewHeroTitle = document.getElementById('previewHeroTitle');
    const previewUrl = document.getElementById('previewUrl');
    const addSectionBtn = document.getElementById('addSectionBtn');
    const togglePreviewBtn = document.getElementById('togglePreviewBtn');
    const previewSidebar = document.getElementById('previewSidebar');

    // Toggle Preview Logic
    let previewVisible = true;
    if (togglePreviewBtn) {
        togglePreviewBtn.addEventListener('click', () => {
            previewVisible = !previewVisible;
            const textSpan = document.getElementById('togglePreviewText');
            const iconSpan = togglePreviewBtn.querySelector('.material-symbols-outlined');
            
            if (previewVisible) {
                previewSidebar.style.display = 'flex';
                // Slight delay to allow display block to apply before animating opacity/width if needed
                setTimeout(() => {
                    previewSidebar.style.opacity = '1';
                    previewSidebar.style.width = '';
                }, 10);
                textSpan.textContent = 'Hide Preview';
                iconSpan.textContent = 'visibility_off';
            } else {
                previewSidebar.style.display = 'none';
                textSpan.textContent = 'Show Preview';
                iconSpan.textContent = 'visibility';
            }
        });
    }

    // Basic Info Sync
    if (serviceName) {
        serviceName.addEventListener('input', (e) => {
            const val = e.target.value || 'New Service';
            if (previewHeroTitle) previewHeroTitle.textContent = val;
            
            const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            if (serviceSlug) serviceSlug.value = '/services/' + slug;
            if (previewUrl) previewUrl.textContent = '/services/' + slug;
        });
    }

    // Render logic
    function render() {
        if (!builderTabs || !previewTabs || !editorArea) return;

        // Render Builder Tabs
        let builderHtml = '';
        sections.forEach(sec => {
            const isActive = sec.id === activeSectionId;
            const activeClasses = isActive 
                ? 'text-primary font-semibold pb-3 border-b-2 border-primary relative top-[1px]' 
                : 'text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors';
            builderHtml += \`<button onclick="setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</button>\`;
        });
        builderTabs.innerHTML = builderHtml;

        // Render Preview Tabs (Mock Nav)
        let previewHtml = '';
        sections.forEach(sec => {
            const isActive = sec.id === activeSectionId;
            const activeClasses = isActive
                ? 'text-[13px] font-bold text-primary pb-3 border-b-2 border-primary relative top-[1px]'
                : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-primary transition-colors';
            previewHtml += \`<span onclick="scrollToPreview('\${sec.id}')" class="\${activeClasses}">\${sec.title}</span>\`;
        });
        previewTabs.innerHTML = previewHtml;

        // Render Editor Area
        const activeSec = sections.find(s => s.id === activeSectionId);
        const secIndex = sections.findIndex(s => s.id === activeSectionId);
        
        if (activeSec) {
            editorArea.innerHTML = \`
                <div class="space-y-4">
                    <label class="text-[14px] font-medium text-[#444651]">Section Title</label>
                    <input type="text" id="editSecTitle" value="\${activeSec.title}" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#121c2a] focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                </div>
                <div class="space-y-4">
                    <label class="text-[14px] font-medium text-[#444651]">Section Content</label>
                    <textarea id="editSecContent" rows="5" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none leading-relaxed">\${activeSec.content}</textarea>
                </div>
                <div class="space-y-4">
                    <label class="text-[14px] font-medium text-[#444651]">Optional Image</label>
                    <div class="border-2 border-dashed border-outline-variant/50 rounded-xl p-6 text-center hover:bg-[#F8F9FF] transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <span class="material-symbols-outlined text-[24px] text-[#A0ABCB] mb-2">add_photo_alternate</span>
                        <p class="text-xs text-[#757682]">Drag & drop or Browse</p>
                    </div>
                </div>
                <div class="flex items-center gap-2 pt-4 mt-4 border-t border-outline-variant/20">
                    <button onclick="moveSection(-1)" class="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-variant transition-colors text-[#444651] text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${secIndex === 0 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">arrow_upward</span> Move Up</button>
                    <button onclick="moveSection(1)" class="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-variant transition-colors text-[#444651] text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${secIndex === sections.length - 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">arrow_downward</span> Move Down</button>
                    <div class="flex-1"></div>
                    <button onclick="deleteSection()" class="flex items-center gap-1 px-3 py-1.5 rounded bg-error/10 text-error hover:bg-error/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${sections.length <= 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">delete</span> Delete Section</button>
                </div>
            \`;

            // Bind editor events
            document.getElementById('editSecTitle').addEventListener('input', (e) => {
                activeSec.title = e.target.value;
                renderTabsOnly();
                renderPreviewSections();
            });

            document.getElementById('editSecContent').addEventListener('input', (e) => {
                activeSec.content = e.target.value;
                renderPreviewSections();
            });
        }

        renderPreviewSections();
    }

    function renderPreviewSections() {
        if (!previewAllSectionsContainer) return;
        let html = '';
        sections.forEach(sec => {
            const isHighlight = sec.id === activeSectionId;
            html += \`
                <div id="preview-\${sec.id}" class="space-y-4 transition-all duration-300 \${isHighlight ? '' : 'opacity-70'}">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-8 h-[3px] bg-[#F59E0B] rounded-full"></div>
                        <h3 class="text-[22px] font-bold text-[#1E3A8A]">\${sec.title || 'Untitled Section'}</h3>
                    </div>
                    <p class="text-[15px] text-[#444651] leading-relaxed whitespace-pre-wrap">\${sec.content || 'Content goes here...'}</p>
                </div>
            \`;
        });
        previewAllSectionsContainer.innerHTML = html;
    }

    function renderTabsOnly() {
        if (!builderTabs || !previewTabs) return;
        let builderHtml = '';
        sections.forEach(sec => {
            const isActive = sec.id === activeSectionId;
            const activeClasses = isActive 
                ? 'text-primary font-semibold pb-3 border-b-2 border-primary relative top-[1px]' 
                : 'text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors';
            builderHtml += \`<button onclick="setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</button>\`;
        });
        builderTabs.innerHTML = builderHtml;

        let previewHtml = '';
        sections.forEach(sec => {
            const isActive = sec.id === activeSectionId;
            const activeClasses = isActive
                ? 'text-[13px] font-bold text-primary pb-3 border-b-2 border-primary relative top-[1px]'
                : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-primary transition-colors';
            previewHtml += \`<span onclick="scrollToPreview('\${sec.id}')" class="\${activeClasses}">\${sec.title}</span>\`;
        });
        previewTabs.innerHTML = previewHtml;
    }

    // Window methods for section management
    window.setActive = function(id) {
        activeSectionId = id;
        render();
        scrollToPreview(id);
    };

    window.scrollToPreview = function(id) {
        if (!previewVisible) return; // Don't scroll if preview is hidden
        activeSectionId = id;
        renderTabsOnly();
        renderPreviewSections();
        const el = document.getElementById('preview-' + id);
        if (el && previewScrollArea) {
            previewScrollArea.scrollTo({
                top: el.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }

    window.moveSection = function(direction) {
        const index = sections.findIndex(s => s.id === activeSectionId);
        if (index < 0) return;
        const newIndex = index + direction;
        
        if (newIndex >= 0 && newIndex < sections.length) {
            // Swap
            const temp = sections[index];
            sections[index] = sections[newIndex];
            sections[newIndex] = temp;
            render();
            scrollToPreview(activeSectionId);
        }
    };

    window.deleteSection = function() {
        if (sections.length <= 1) return; // Must have at least 1 section
        const index = sections.findIndex(s => s.id === activeSectionId);
        sections.splice(index, 1);
        
        // Select adjacent section
        if (index < sections.length) {
            activeSectionId = sections[index].id;
        } else {
            activeSectionId = sections[index - 1].id;
        }
        render();
    };

    // Add Section logic
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            const newId = 'sec-' + Date.now();
            sections.push({ id: newId, title: 'New Section', content: '' });
            activeSectionId = newId;
            render();
            setTimeout(() => scrollToPreview(newId), 100);
            
            // Scroll builder tabs to end so new tab is visible
            if (builderTabs) {
                builderTabs.scrollTo({
                    left: builderTabs.scrollWidth,
                    behavior: 'smooth'
                });
            }
        });
    }

    // Initial render
    render();
</script>
</body>`;

html = html.replace(scriptRegex, newScript);

fs.writeFileSync(file, html);
console.log('UX Refinements updated successfully.');
