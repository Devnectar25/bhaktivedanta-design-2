const fs = require('fs');

let html = fs.readFileSync('src/Admin Panel html code/add-service.html', 'utf8');

// Update labels
html = html.replace('Service Icon Upload', 'Thumbnail Image');

// Insert dynamic sections before Descriptions
html = html.replace('<!-- Descriptions -->', `<!-- Dynamic Sections Builder Area -->
<div class="space-y-4 pt-4 border-t border-outline-variant/20" id="dynamicSectionsContainer">
<div class="flex items-center justify-between mb-4">
<h3 class="font-label-lg text-label-lg text-on-surface">Dynamic Content Sections</h3>
<button type="button" id="addSectionBtn" class="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-lg font-label-sm transition-colors">
<span class="material-symbols-outlined text-[18px]">add</span>
Add New Section
</button>
</div>
<div id="sectionsList" class="space-y-6">
<!-- Initial Section -->
<div class="section-card bg-surface p-4 rounded-lg border border-outline-variant/30 space-y-4">
    <div class="flex justify-between items-center">
        <input type="text" class="section-title-input w-2/3 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title (e.g. Key Procedures)" value="Key Procedures">
        <button type="button" class="text-error hover:bg-error/10 p-1 rounded transition-colors remove-section-btn"><span class="material-symbols-outlined text-[20px]">delete</span></button>
    </div>
    <textarea class="section-content-input w-full p-3 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm h-24" placeholder="Section content..."></textarea>
    <div class="flex items-center gap-4">
        <label class="text-label-sm text-on-surface-variant">Optional Image:</label>
        <input type="file" class="text-body-sm">
    </div>
</div>
</div>
</div>

<!-- Descriptions -->`);

// Add toggle preview button to the header
html = html.replace('<div class="flex items-center gap-6">', `<div class="flex items-center gap-6">
<button id="togglePreviewBtn" class="flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant text-on-surface px-4 py-2 rounded-full font-label-sm transition-colors shadow-sm border border-outline-variant/20">
<span class="material-symbols-outlined text-[18px]">visibility_off</span>
<span>Hide Preview</span>
</button>`);

// Add javascript for preview functionality
const jsLogic = `
        // Setup Dynamic Sections
        const addSectionBtn = document.getElementById('addSectionBtn');
        const sectionsList = document.getElementById('sectionsList');
        
        addSectionBtn.addEventListener('click', () => {
            const newSection = document.createElement('div');
            newSection.className = 'section-card bg-surface p-4 rounded-lg border border-outline-variant/30 space-y-4 fade-in';
            newSection.innerHTML = \`
                <div class="flex justify-between items-center">
                    <input type="text" class="section-title-input w-2/3 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title">
                    <button type="button" class="text-error hover:bg-error/10 p-1 rounded transition-colors remove-section-btn"><span class="material-symbols-outlined text-[20px]">delete</span></button>
                </div>
                <textarea class="section-content-input w-full p-3 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm h-24" placeholder="Section content..."></textarea>
                <div class="flex items-center gap-4">
                    <label class="text-label-sm text-on-surface-variant">Optional Image:</label>
                    <input type="file" class="text-body-sm">
                </div>
            \`;
            sectionsList.appendChild(newSection);
            attachRemoveEvents();
            updatePreviewSections();
        });

        function attachRemoveEvents() {
            document.querySelectorAll('.remove-section-btn').forEach(btn => {
                btn.onclick = (e) => {
                    e.currentTarget.closest('.section-card').remove();
                    updatePreviewSections();
                };
            });
        }
        attachRemoveEvents();

        // Setup Preview Toggle
        const togglePreviewBtn = document.getElementById('togglePreviewBtn');
        const previewSidebar = document.querySelector('.xl\\\\:w-\\\\[380px\\\\]');
        const mainFormWrapper = document.querySelector('.max-w-\\\\[900px\\\\]');
        let previewVisible = true;

        togglePreviewBtn.addEventListener('click', () => {
            previewVisible = !previewVisible;
            if (previewVisible) {
                previewSidebar.style.display = 'block';
                togglePreviewBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">visibility_off</span><span>Hide Preview</span>';
                mainFormWrapper.classList.remove('max-w-none');
                mainFormWrapper.classList.add('max-w-[900px]');
            } else {
                previewSidebar.style.display = 'none';
                togglePreviewBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">visibility</span><span>Show Preview</span>';
                mainFormWrapper.classList.remove('max-w-[900px]');
                mainFormWrapper.classList.add('max-w-none');
            }
        });

        // Live Preview Section updates
        function updatePreviewSections() {
            const previewContainer = document.getElementById('previewSectionsContainer');
            if(!previewContainer) return;
            
            let html = '';
            document.querySelectorAll('.section-card').forEach(card => {
                const title = card.querySelector('.section-title-input').value;
                const content = card.querySelector('.section-content-input').value;
                if(title || content) {
                    html += \`
                        <div class="mt-4 border-t border-outline-variant/10 pt-4">
                            <h5 class="font-label-lg text-primary mb-2">\${title}</h5>
                            <p class="text-[11px] text-on-surface-variant leading-relaxed">\${content}</p>
                        </div>
                    \`;
                }
            });
            previewContainer.innerHTML = html;
        }

        sectionsList.addEventListener('input', updatePreviewSections);
`;

// Insert the JS logic into the script block
html = html.replace('// Form submission feedback', jsLogic + '\n        // Form submission feedback');

// Inject the dynamic sections container into the preview mockup
html = html.replace('<div class="flex items-center justify-between pt-2">', `<div id="previewSectionsContainer"></div>\n<div class="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant/10">`);

fs.writeFileSync('src/Admin Panel html code/add-service.html', html);
console.log('add-service.html updated successfully.');
