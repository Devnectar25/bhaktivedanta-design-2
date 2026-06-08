const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Update Right Column height and overflow
// Find the right column wrapper and ensure it has a good height.
html = html.replace('shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col', 'shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-[calc(100vh-180px)] sticky top-0');

// Make the mockup content scrollable
html = html.replace('<div class="flex-1 bg-white relative">', '<div id="previewScrollArea" class="flex-1 bg-white relative overflow-y-auto custom-scrollbar scroll-smooth">');

// 2. Change how preview sections are rendered in HTML
// Remove the hardcoded Overview section from HTML, replace with a container
const oldMockContent = `<div class="space-y-4">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-8 h-[3px] bg-[#F59E0B] rounded-full"></div>
                            <h3 class="text-[22px] font-bold text-[#1E3A8A]">Overview</h3>
                        </div>
                        <p class="text-[15px] text-[#444651] leading-relaxed">Experience a comprehensive approach to health that integrates physical, mental, and spiritual well-being. Our specialized team creates personalized care plans tailored to your unique needs.</p>
                    </div>`;

// Alternatively, just replace the inner content of the padding div
html = html.replace(/<div class="space-y-4">\s*<div class="flex items-center gap-3 mb-2">\s*<div class="w-8 h-\[3px\] bg-\[#F59E0B\] rounded-full"><\/div>\s*<h3 class="text-\[22px\] font-bold text-\[#1E3A8A\]">Overview<\/h3>\s*<\/div>\s*<p class="text-\[15px\] text-\[#444651\] leading-relaxed">Experience a comprehensive approach to health that integrates physical, mental, and spiritual well-being\. Our specialized team creates personalized care plans tailored to your unique needs\.<\/p>\s*<\/div>/, '<div id="previewAllSectionsContainer" class="space-y-12"></div>');

// Add a mock footer
const mockFooter = `
                <!-- Mock Footer -->
                <div class="bg-[#0A235C] text-white px-8 py-10 mt-12">
                    <div class="grid grid-cols-2 gap-8 mb-8 opacity-80">
                        <div>
                            <h5 class="font-bold mb-4">Quick Links</h5>
                            <div class="space-y-2 text-[12px]"><p>About Us</p><p>Doctors</p><p>Contact</p></div>
                        </div>
                        <div>
                            <h5 class="font-bold mb-4">Contact</h5>
                            <div class="space-y-2 text-[12px]"><p>Emergency: 1066</p><p>info@bhaktivedanta.com</p></div>
                        </div>
                    </div>
                    <div class="border-t border-white/20 pt-6 text-[10px] text-center opacity-60">
                        &copy; 2026 Bhaktivedanta Hospital. All rights reserved.
                    </div>
                </div>
`;
// Inject mock footer right before closing div of previewScrollArea
html = html.replace('</div>\n        </div>\n    </div>\n</section>', mockFooter + '\n            </div>\n        </div>\n    </div>\n</section>');


// 3. Update JS Logic to render ALL sections in preview
const oldJsRegex = /<script>\s*\/\/ State[\s\S]*?<\/script>/;
const newJs = `<script>
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
    const previewAllSectionsContainer = document.getElementById('previewAllSectionsContainer') || (() => { 
        // Fallback injection if regex missed
        const target = document.querySelector('.px-8.lg\\:px-12.pt-6.pb-12');
        if (target) {
            const div = document.createElement('div');
            div.id = 'previewAllSectionsContainer';
            div.className = 'space-y-12';
            target.appendChild(div);
            return div;
        }
        return null;
    })();
    const previewScrollArea = document.getElementById('previewScrollArea');
    const serviceName = document.getElementById('serviceName');
    const serviceSlug = document.getElementById('serviceSlug');
    const previewHeroTitle = document.getElementById('previewHeroTitle');
    const previewUrl = document.getElementById('previewUrl');
    const addSectionBtn = document.getElementById('addSectionBtn');

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

    // Global method to switch tabs
    window.setActive = function(id) {
        activeSectionId = id;
        render();
        scrollToPreview(id);
    };

    window.scrollToPreview = function(id) {
        activeSectionId = id;
        renderTabsOnly(); // Highlight tab in preview nav
        renderPreviewSections(); // Highlight section in preview body
        const el = document.getElementById('preview-' + id);
        if (el && previewScrollArea) {
            // Scroll to element with some offset
            previewScrollArea.scrollTo({
                top: el.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    }

    // Add Section logic
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            const newId = 'sec-' + Date.now();
            sections.push({ id: newId, title: 'New Section', content: '' });
            activeSectionId = newId;
            render();
            setTimeout(() => scrollToPreview(newId), 100);
        });
    }

    // Initial render
    render();
</script>`;

html = html.replace(oldJsRegex, newJs);

fs.writeFileSync('src/Admin Panel html code/add-service.html', html);
console.log('Preview updated successfully');
