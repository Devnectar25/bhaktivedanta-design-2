const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// Add IDs to key elements
html = html.replace('<div class="flex items-center gap-8 min-w-max">', '<div class="flex items-center gap-8 min-w-max" id="builderTabs">');
html = html.replace('<button class="flex items-center gap-1 border border-primary/20', '<button id="addSectionBtn" class="flex items-center gap-1 border border-primary/20');
html = html.replace('<!-- Tab Content (Hero Banner Upload) -->', '<!-- Dynamic Editor Area -->\n<div id="editorArea" class="space-y-6 mb-12 flex-1"></div>\n<!-- Tab Content (Hero Banner Upload) -->');

// Add IDs to preview
html = html.replace('<h1 class="text-[32px] md:text-[40px] font-bold text-white mb-6 leading-tight drop-shadow-md">Holistic Wellness</h1>', '<h1 id="previewHeroTitle" class="text-[32px] md:text-[40px] font-bold text-white mb-6 leading-tight drop-shadow-md">Holistic Wellness</h1>');
html = html.replace('<div class="flex items-center gap-6 border-b border-outline-variant/20 mb-8">', '<div id="previewTabs" class="flex items-center gap-6 border-b border-outline-variant/20 mb-8 overflow-x-auto custom-scrollbar">');
html = html.replace('<h3 class="text-[22px] font-bold text-[#1E3A8A]">Overview</h3>', '<h3 id="previewSectionTitle" class="text-[22px] font-bold text-[#1E3A8A]">Overview</h3>');
html = html.replace('<p class="text-[15px] text-[#444651] leading-relaxed">Experience a comprehensive approach', '<p id="previewSectionContent" class="text-[15px] text-[#444651] leading-relaxed">Experience a comprehensive approach');

// URL Slug fix
html = html.replace('bhaktivedantahospital.com<span class="text-primary font-medium">/services/holistic-wel...</span>', 'bhaktivedantahospital.com<span id="previewUrl" class="text-primary font-medium">/services/holistic-wellness</span>');


const jsLogic = `
<script>
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
    const previewSectionTitle = document.getElementById('previewSectionTitle');
    const previewSectionContent = document.getElementById('previewSectionContent');
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

        // Render Preview Tabs
        let previewHtml = '';
        sections.forEach(sec => {
            const isActive = sec.id === activeSectionId;
            const activeClasses = isActive
                ? 'text-[13px] font-bold text-primary pb-3 border-b-2 border-primary relative top-[1px]'
                : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-primary transition-colors';
            previewHtml += \`<span onclick="setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</span>\`;
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
                if (previewSectionTitle) previewSectionTitle.textContent = activeSec.title || 'Section Title';
            });

            document.getElementById('editSecContent').addEventListener('input', (e) => {
                activeSec.content = e.target.value;
                if (previewSectionContent) previewSectionContent.textContent = activeSec.content || 'Content goes here...';
            });

            // Update Preview immediately
            if (previewSectionTitle) previewSectionTitle.textContent = activeSec.title || 'Section Title';
            if (previewSectionContent) previewSectionContent.textContent = activeSec.content || 'Content goes here...';
        }
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
            previewHtml += \`<span onclick="setActive('\${sec.id}')" class="\${activeClasses}">\${sec.title}</span>\`;
        });
        previewTabs.innerHTML = previewHtml;
    }

    // Global method to switch tabs
    window.setActive = function(id) {
        activeSectionId = id;
        render();
    };

    // Add Section logic
    if (addSectionBtn) {
        addSectionBtn.addEventListener('click', () => {
            const newId = 'sec-' + Date.now();
            sections.push({ id: newId, title: 'New Section', content: '' });
            activeSectionId = newId;
            render();
        });
    }

    // Initial render
    render();
</script>
`;

// Remove existing scripts if any so we don't duplicate
html = html.replace(/<script>[\s\S]*?<\/script>\s*<\/body>/, jsLogic + '\n</body>');

if (!html.includes('id="builderTabs"')) { // Fallback if replace failed
    html = html.replace('</body></html>', jsLogic + '\n</body></html>');
}

fs.writeFileSync(file, html);
console.log('Interactive logic added.');
