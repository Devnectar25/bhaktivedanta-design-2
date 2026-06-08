const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// Replace the entire JS block to ensure perfect execution
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

    // Toggle logic setup (outside render to prevent rebinding)
    let previewVisible = true;
    
    document.addEventListener('DOMContentLoaded', () => {
        const toggleBtn = document.getElementById('togglePreviewBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const sidebar = document.getElementById('previewSidebar');
                const textSpan = document.getElementById('togglePreviewText');
                const iconSpan = toggleBtn.querySelector('.material-symbols-outlined');
                
                previewVisible = !previewVisible;
                
                if (previewVisible) {
                    sidebar.style.display = 'flex';
                    setTimeout(() => {
                        sidebar.style.opacity = '1';
                        sidebar.style.width = '';
                    }, 10);
                    textSpan.textContent = 'Hide Preview';
                    iconSpan.textContent = 'visibility_off';
                } else {
                    sidebar.style.display = 'none';
                    textSpan.textContent = 'Show Preview';
                    iconSpan.textContent = 'visibility';
                }
            });
        }
        
        const serviceName = document.getElementById('serviceName');
        if (serviceName) {
            serviceName.addEventListener('input', (e) => {
                const val = e.target.value || 'New Service';
                const previewHeroTitle = document.getElementById('previewHeroTitle');
                if (previewHeroTitle) previewHeroTitle.textContent = val;
                
                const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                const serviceSlug = document.getElementById('serviceSlug');
                const previewUrl = document.getElementById('previewUrl');
                if (serviceSlug) serviceSlug.value = '/services/' + slug;
                if (previewUrl) previewUrl.textContent = '/services/' + slug;
            });
        }

        const addSectionBtn = document.getElementById('addSectionBtn');
        if (addSectionBtn) {
            addSectionBtn.addEventListener('click', () => {
                const newId = 'sec-' + Date.now();
                sections.push({ id: newId, title: 'New Section', content: '' });
                window.setActive(newId);
                
                const builderTabs = document.getElementById('builderTabs');
                if (builderTabs) {
                    setTimeout(() => {
                        builderTabs.scrollTo({ left: builderTabs.scrollWidth, behavior: 'smooth' });
                    }, 50);
                }
            });
        }

        render();
    });

    function render() {
        renderTabsOnly();
        
        const activeSec = sections.find(s => s.id === activeSectionId);
        const secIndex = sections.findIndex(s => s.id === activeSectionId);
        const editorArea = document.getElementById('editorArea');
        
        if (activeSec && editorArea) {
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
                    <button onclick="window.moveSection(-1)" class="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-variant transition-colors text-[#444651] text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${secIndex === 0 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">arrow_upward</span> Move Up</button>
                    <button onclick="window.moveSection(1)" class="flex items-center gap-1 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-variant transition-colors text-[#444651] text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${secIndex === sections.length - 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">arrow_downward</span> Move Down</button>
                    <div class="flex-1"></div>
                    <button onclick="window.deleteSection()" class="flex items-center gap-1 px-3 py-1.5 rounded bg-error/10 text-error hover:bg-error/20 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed" \${sections.length <= 1 ? 'disabled' : ''}><span class="material-symbols-outlined text-[16px]">delete</span> Delete Section</button>
                </div>
            \`;

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

    // Explicitly ONLY render the active section in the preview
    // Based on user feedback: "i click on How It Works but its showing overview only"
    // They expect the preview content to swap like tabs, not stack.
    function renderPreviewSections() {
        const container = document.getElementById('previewAllSectionsContainer');
        if (!container) return;
        
        const activeSec = sections.find(s => s.id === activeSectionId);
        if (activeSec) {
            container.innerHTML = \`
                <div id="preview-\${activeSec.id}" class="space-y-4 fade-in">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="w-8 h-[3px] bg-[#F59E0B] rounded-full"></div>
                        <h3 class="text-[22px] font-bold text-[#1E3A8A]">\${activeSec.title || 'Untitled Section'}</h3>
                    </div>
                    <p class="text-[15px] text-[#444651] leading-relaxed whitespace-pre-wrap">\${activeSec.content || 'Content goes here...'}</p>
                </div>
            \`;
        }
    }

    function renderTabsOnly() {
        const builderTabs = document.getElementById('builderTabs');
        const previewTabs = document.getElementById('previewTabs');
        
        if (builderTabs) {
            let builderHtml = '';
            sections.forEach(sec => {
                const isActive = sec.id === activeSectionId;
                const activeClasses = isActive 
                    ? 'text-primary font-semibold pb-3 border-b-2 border-primary relative top-[1px]' 
                    : 'text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors';
                builderHtml += \`<button onclick="window.setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</button>\`;
            });
            builderTabs.innerHTML = builderHtml;
        }

        if (previewTabs) {
            let previewHtml = '';
            sections.forEach(sec => {
                const isActive = sec.id === activeSectionId;
                const activeClasses = isActive
                    ? 'text-[13px] font-bold text-primary pb-3 border-b-2 border-primary relative top-[1px]'
                    : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-primary transition-colors';
                previewHtml += \`<span onclick="window.setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</span>\`;
            });
            previewTabs.innerHTML = previewHtml;
        }
    }

    window.setActive = function(id) {
        activeSectionId = id;
        render();
    };

    window.moveSection = function(direction) {
        const index = sections.findIndex(s => s.id === activeSectionId);
        if (index < 0) return;
        const newIndex = index + direction;
        
        if (newIndex >= 0 && newIndex < sections.length) {
            const temp = sections[index];
            sections[index] = sections[newIndex];
            sections[newIndex] = temp;
            render();
        }
    };

    window.deleteSection = function() {
        if (sections.length <= 1) return; 
        const index = sections.findIndex(s => s.id === activeSectionId);
        sections.splice(index, 1);
        
        if (index < sections.length) {
            activeSectionId = sections[index].id;
        } else {
            activeSectionId = sections[index - 1].id;
        }
        render();
    };
</script>
</body>`;

html = html.replace(scriptRegex, newScript);

fs.writeFileSync(file, html);
console.log('Fixed toggle button and preview behavior.');
