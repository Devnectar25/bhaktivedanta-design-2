const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// Replace everything inside the <script> block and some specific HTML tags to support the dropdown
const scriptRegex = /<script>[\s\S]*?<\/script>\s*<\/body>/;

// We need to inject the dropdown into the HTML header
const builderMainRegex = /<div class="mb-8 flex justify-between items-start">([\s\S]*?)<\/div>/;
const newHeader = `
<div class="mb-8 flex justify-between items-start">
    <div>
        <div class="flex items-center gap-4 mb-2">
            <h2 class="text-[28px] font-bold text-[#121c2a] leading-tight">Service Content Builder</h2>
            <select id="mockDataSelector" class="bg-surface-container-high border-none text-primary font-medium text-sm rounded-lg focus:ring-0 cursor-pointer px-3 py-1.5 ml-4">
                <option value="holistic-wellness">Mock: Holistic Wellness</option>
                <option value="idhs">Mock: IDHS</option>
                <option value="empty">Mock: Empty New Service</option>
            </select>
        </div>
        <p class="text-[15px] text-[#444651]">Design the service landing page structure and content sections.</p>
    </div>
    <button id="togglePreviewBtn" class="flex items-center gap-2 bg-[#1e3a8a]/10 text-[#1e3a8a] px-4 py-2 rounded-lg font-medium text-sm hover:bg-[#1e3a8a]/20 transition-colors">
        <span class="material-symbols-outlined text-[18px]">visibility_off</span> <span id="togglePreviewText">Hide Preview</span>
    </button>
</div>
`;

html = html.replace(builderMainRegex, newHeader.trim());

// New Script block
const newScript = `<script>
    const mockDatabase = {
        'holistic-wellness': {
            title: 'Holistic Wellness',
            slug: '/services/holistic-wellness',
            banner: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
            tabs: [
                {
                    id: 'hw-tab-1',
                    title: 'Overview',
                    blocks: [
                        { id: 'b1', type: 'rich-text', content: 'Experience a comprehensive approach to health that integrates physical, mental, and spiritual well-being. Our specialized team creates personalized care plans tailored to your unique needs.' },
                        { id: 'b2', type: 'quote', content: 'Healing is a matter of time, but it is sometimes also a matter of opportunity.', author: 'Hippocrates' }
                    ]
                },
                {
                    id: 'hw-tab-2',
                    title: 'How It Works',
                    blocks: [
                        { id: 'b3', type: 'feature-list', items: ['Initial Consultation & Assessment', 'Personalized Therapy Plan', 'Integrated Treatment Sessions', 'Ongoing Progress Monitoring'] }
                    ]
                },
                {
                    id: 'hw-tab-3',
                    title: 'Why Choose Holistic Wellness',
                    blocks: [
                        { id: 'b4', type: 'image-text', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000', content: 'Our approach goes beyond treating symptoms. We focus on uncovering the root causes of imbalance.' }
                    ]
                },
                {
                    id: 'hw-tab-4',
                    title: 'Explore Life Transforming Programs',
                    blocks: [
                        { id: 'b5', type: 'rich-text', content: 'Explore our specialized healing programs tailored for every aspect of your life.' },
                        { id: 'b6', type: 'gallery', images: ['https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400', 'https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=400'] }
                    ]
                }
            ]
        },
        'idhs': {
            title: 'ISKCON Devotees Healthcare Services',
            slug: '/services/idhs',
            banner: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000',
            tabs: [
                {
                    id: 'idhs-tab-1',
                    title: 'Overview',
                    blocks: [
                        { id: 'b7', type: 'rich-text', content: 'Dedicated healthcare services tailored to the specific spiritual and physical needs of the ISKCON devotee community globally.' }
                    ]
                },
                {
                    id: 'idhs-tab-2',
                    title: 'Our Offerings',
                    blocks: [
                        { id: 'b8', type: 'feature-list', items: ['Priority Outpatient Services', 'Subsidized Inpatient Care', 'Spiritual Counseling during treatment', 'Prasadam arrangements'] }
                    ]
                },
                {
                    id: 'idhs-tab-3',
                    title: 'Hospital Services',
                    blocks: [
                        { id: 'b9', type: 'stats', stats: [{label: 'Devotees Served', value: '15,000+'}, {label: 'Specialties', value: '25+'}] }
                    ]
                },
                {
                    id: 'idhs-tab-4',
                    title: 'Gallery',
                    blocks: [
                        { id: 'b10', type: 'gallery', images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=400'] }
                    ]
                },
                {
                    id: 'idhs-tab-5',
                    title: 'Health Talks & Testimonials',
                    blocks: [
                        { id: 'b11', type: 'quote', content: 'The care I received was not just medical, but deeply spiritual and uplifting.', author: 'A Grateful Patient' }
                    ]
                }
            ]
        },
        'empty': {
            title: '',
            slug: '',
            banner: '',
            tabs: [
                { id: 't-new', title: 'Overview', blocks: [] }
            ]
        }
    };

    let serviceData = JSON.parse(JSON.stringify(mockDatabase['holistic-wellness']));
    let activeTabId = serviceData.tabs[0].id;
    let previewVisible = true;

    document.addEventListener('DOMContentLoaded', () => {
        // Dropdown Event
        const selector = document.getElementById('mockDataSelector');
        if (selector) {
            selector.addEventListener('change', (e) => {
                serviceData = JSON.parse(JSON.stringify(mockDatabase[e.target.value]));
                activeTabId = serviceData.tabs[0].id;
                document.getElementById('serviceName').value = serviceData.title;
                document.getElementById('serviceSlug').value = serviceData.slug;
                const heroTitle = document.getElementById('previewHeroTitle');
                if (heroTitle) heroTitle.textContent = serviceData.title || 'Service Title';
                render();
            });
        }

        // Toggle Event
        const toggleBtn = document.getElementById('togglePreviewBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const sidebar = document.getElementById('previewSidebar');
                const textSpan = document.getElementById('togglePreviewText');
                const iconSpan = toggleBtn.querySelector('.material-symbols-outlined');
                previewVisible = !previewVisible;
                if (previewVisible) {
                    sidebar.style.display = 'flex';
                    setTimeout(() => { sidebar.style.opacity = '1'; sidebar.style.width = ''; }, 10);
                    textSpan.textContent = 'Hide Preview';
                    iconSpan.textContent = 'visibility_off';
                } else {
                    sidebar.style.display = 'none';
                    textSpan.textContent = 'Show Preview';
                    iconSpan.textContent = 'visibility';
                }
            });
        }
        
        // Title Input Event
        const serviceName = document.getElementById('serviceName');
        if (serviceName) {
            serviceName.addEventListener('input', (e) => {
                serviceData.title = e.target.value;
                const heroTitle = document.getElementById('previewHeroTitle');
                if (heroTitle) heroTitle.textContent = serviceData.title || 'Service Title';
                const slug = (e.target.value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                serviceData.slug = '/services/' + slug;
                document.getElementById('serviceSlug').value = serviceData.slug;
                const pUrl = document.getElementById('previewUrl');
                if(pUrl) pUrl.textContent = serviceData.slug;
            });
        }

        // Add Tab Event
        const addSectionBtn = document.getElementById('addSectionBtn');
        if (addSectionBtn) {
            addSectionBtn.addEventListener('click', () => {
                const title = prompt("Enter Tab Name:");
                if (!title) return;
                const newId = 'tab-' + Date.now();
                serviceData.tabs.push({ id: newId, title: title, blocks: [] });
                activeTabId = newId;
                render();
                
                const builderTabs = document.getElementById('builderTabs');
                if (builderTabs) setTimeout(() => { builderTabs.scrollTo({ left: builderTabs.scrollWidth, behavior: 'smooth' }); }, 50);
            });
        }

        render();
    });

    window.setActiveTab = function(id) {
        activeTabId = id;
        render();
    };

    window.addBlock = function(type) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        if (!activeTab) return;
        
        let block = { id: 'b-' + Date.now(), type: type };
        switch(type) {
            case 'rich-text': block.content = ''; break;
            case 'image': block.image = ''; break;
            case 'image-text': block.image = ''; block.content = ''; break;
            case 'quote': block.content = ''; block.author = ''; break;
            case 'feature-list': block.items = ['']; break;
            case 'stats': block.stats = [{label: '', value: ''}]; break;
            case 'gallery': block.images = []; break;
        }
        activeTab.blocks.push(block);
        render();
    };

    window.moveBlock = function(blockId, dir) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const idx = activeTab.blocks.findIndex(b => b.id === blockId);
        if (idx < 0) return;
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < activeTab.blocks.length) {
            const temp = activeTab.blocks[idx];
            activeTab.blocks[idx] = activeTab.blocks[newIdx];
            activeTab.blocks[newIdx] = temp;
            render();
        }
    };

    window.deleteBlock = function(blockId) {
        if (!confirm("Delete this content block?")) return;
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        activeTab.blocks = activeTab.blocks.filter(b => b.id !== blockId);
        render();
    };

    window.updateBlockText = function(blockId, field, val) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block[field] = val; renderPreviewSections(); }
    };
    
    window.addFeatureItem = function(blockId) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items.push(''); render(); }
    };

    window.updateFeatureItem = function(blockId, idx, val) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items[idx] = val; renderPreviewSections(); }
    };

    window.deleteFeatureItem = function(blockId, idx) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items.splice(idx, 1); render(); }
    };

    function render() {
        renderTabsOnly();
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        const editorArea = document.getElementById('editorArea');
        
        if (activeTab && editorArea) {
            let html = '';
            
            // Tab settings
            html += \`
                <div class="mb-8 pb-6 border-b border-outline-variant/20 flex items-center justify-between">
                    <div class="space-y-1">
                        <label class="text-[12px] uppercase tracking-wider font-bold text-outline">Tab Settings</label>
                        <input type="text" value="\\\${activeTab.title}" onchange="window.updateTabTitle(this.value)" class="bg-transparent border-none p-0 text-[20px] font-bold text-primary focus:ring-0 w-64" placeholder="Tab Title">
                    </div>
                    <button onclick="window.deleteTab()" class="text-error hover:bg-error/10 px-3 py-1.5 rounded text-sm font-medium transition-colors">Delete Tab</button>
                </div>
            \`;

            // Blocks loop
            if(activeTab.blocks.length === 0) {
                html += \`<div class="text-center py-12 border-2 border-dashed border-outline-variant/50 rounded-xl bg-surface/50 text-outline"><p class="mb-2 text-[15px]">No content blocks in this tab.</p><p class="text-[13px]">Add a block below to start building.</p></div>\`;
            } else {
                html += \`<div class="space-y-6">\`;
                activeTab.blocks.forEach((b, idx) => {
                    html += \`
                        <div class="border border-outline-variant/40 rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:border-primary/30 group">
                            <div class="bg-[#F8F9FA] px-4 py-2 border-b border-outline-variant/20 flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[16px] text-outline cursor-move">drag_indicator</span>
                                    <span class="text-[11px] uppercase tracking-wider font-bold text-outline">\\\${b.type.replace('-', ' ')} BLOCK</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button onclick="window.moveBlock('\\\${b.id}', -1)" class="p-1 text-outline hover:text-primary rounded"><span class="material-symbols-outlined text-[16px]">keyboard_arrow_up</span></button>
                                    <button onclick="window.moveBlock('\\\${b.id}', 1)" class="p-1 text-outline hover:text-primary rounded"><span class="material-symbols-outlined text-[16px]">keyboard_arrow_down</span></button>
                                    <button onclick="window.deleteBlock('\\\${b.id}')" class="p-1 text-error hover:bg-error/10 rounded ml-2"><span class="material-symbols-outlined text-[16px]">delete</span></button>
                                </div>
                            </div>
                            <div class="p-5">
                    \`;
                    
                    // Render specific block controls
                    if (b.type === 'rich-text') {
                        html += \`<textarea rows="4" placeholder="Enter rich text content here..." oninput="window.updateBlockText('\\\${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">\\\${b.content || ''}</textarea>\`;
                    } else if (b.type === 'quote') {
                        html += \`
                            <div class="space-y-3">
                                <textarea rows="2" placeholder="Quote text" oninput="window.updateBlockText('\\\${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none font-serif italic">\\\${b.content || ''}</textarea>
                                <input type="text" placeholder="Author / Attribution" value="\\\${b.author || ''}" oninput="window.updateBlockText('\\\${b.id}', 'author', this.value)" class="w-full p-2 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">
                            </div>
                        \`;
                    } else if (b.type === 'feature-list') {
                        html += \`<div class="space-y-2">\`;
                        b.items.forEach((item, i) => {
                            html += \`
                                <div class="flex items-center gap-2">
                                    <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                    <input type="text" value="\\\${item}" oninput="window.updateFeatureItem('\\\${b.id}', \\\${i}, this.value)" class="flex-1 p-2 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">
                                    <button onclick="window.deleteFeatureItem('\\\${b.id}', \\\${i})" class="text-outline hover:text-error"><span class="material-symbols-outlined text-[16px]">close</span></button>
                                </div>
                            \`;
                        });
                        html += \`<button onclick="window.addFeatureItem('\\\${b.id}')" class="text-sm text-primary font-medium mt-2 flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">add</span> Add Item</button></div>\`;
                    } else if (b.type === 'image' || b.type === 'gallery') {
                        html += \`
                            <div class="border-2 border-dashed border-outline-variant/50 rounded-lg p-6 text-center hover:bg-[#F8F9FF] cursor-pointer">
                                <span class="material-symbols-outlined text-[24px] text-outline mb-1">add_photo_alternate</span>
                                <p class="text-xs text-outline">Click to upload or drag images here</p>
                            </div>
                        \`;
                    } else if (b.type === 'image-text') {
                        html += \`
                            <div class="grid grid-cols-2 gap-4">
                                <div class="border-2 border-dashed border-outline-variant/50 rounded-lg p-6 text-center flex flex-col justify-center items-center cursor-pointer hover:bg-[#F8F9FF]">
                                    <span class="material-symbols-outlined text-[24px] text-outline mb-1">add_photo_alternate</span>
                                    <p class="text-[10px] text-outline">Select Image</p>
                                </div>
                                <textarea rows="4" placeholder="Accompanying text..." oninput="window.updateBlockText('\\\${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">\\\${b.content || ''}</textarea>
                            </div>
                        \`;
                    } else if (b.type === 'stats') {
                        html += \`<p class="text-sm text-outline italic">Stats block configuration...</p>\`; // Placeholder
                    }

                    html += \`</div></div>\`;
                });
                html += \`</div>\`;
            }

            // Add Block toolbar
            html += \`
                <div class="mt-8 pt-6 border-t border-outline-variant/20">
                    <label class="text-[12px] uppercase tracking-wider font-bold text-outline mb-3 block">Add Content Block</label>
                    <div class="flex flex-wrap gap-2">
                        <button onclick="window.addBlock('rich-text')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">notes</span> Rich Text</button>
                        <button onclick="window.addBlock('image')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">image</span> Image</button>
                        <button onclick="window.addBlock('image-text')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">view_carousel</span> Image + Text</button>
                        <button onclick="window.addBlock('quote')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">format_quote</span> Quote</button>
                        <button onclick="window.addBlock('feature-list')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">checklist</span> List</button>
                        <button onclick="window.addBlock('stats')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">query_stats</span> Stats</button>
                        <button onclick="window.addBlock('gallery')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">photo_library</span> Gallery</button>
                    </div>
                </div>
            \`;

            editorArea.innerHTML = html;
        }
        
        renderPreviewSections();
    }

    window.updateTabTitle = function(val) {
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        if(activeTab) {
            activeTab.title = val;
            renderTabsOnly();
            renderPreviewSections();
        }
    };

    window.deleteTab = function() {
        if(serviceData.tabs.length <= 1) { alert("Cannot delete the last tab."); return; }
        if(!confirm("Are you sure you want to delete this tab and all its content?")) return;
        const idx = serviceData.tabs.findIndex(t => t.id === activeTabId);
        serviceData.tabs.splice(idx, 1);
        activeTabId = serviceData.tabs[0].id;
        render();
    };

    function renderPreviewSections() {
        const container = document.getElementById('previewAllSectionsContainer');
        if (!container) return;
        
        const activeTab = serviceData.tabs.find(t => t.id === activeTabId);
        if (activeTab) {
            let html = \`<div id="preview-\\\${activeTab.id}" class="space-y-8 fade-in">\`;
            
            // Render blocks for preview
            activeTab.blocks.forEach(b => {
                if (b.type === 'rich-text') {
                    html += \`<div class="prose prose-sm max-w-none text-[#444651] leading-relaxed whitespace-pre-wrap">\\\${b.content || '<em class="text-outline">Empty text block</em>'}</div>\`;
                } else if (b.type === 'quote') {
                    html += \`
                        <blockquote class="border-l-4 border-primary pl-4 py-1 italic text-[#1e3a8a] bg-primary/5 rounded-r-lg">
                            <p class="text-[16px] font-serif mb-2">"\\\${b.content || '...'}"</p>
                            <footer class="text-[12px] font-bold uppercase tracking-wider">— \\\${b.author || 'Anonymous'}</footer>
                        </blockquote>
                    \`;
                } else if (b.type === 'feature-list') {
                    html += \`<ul class="space-y-3">\`;
                    b.items.forEach(item => {
                        if(item.trim()) {
                            html += \`<li class="flex items-start gap-3"><span class="material-symbols-outlined text-[#10B981] text-[20px] shrink-0">check_circle</span><span class="text-[#444651] text-[15px]">\\\${item}</span></li>\`;
                        }
                    });
                    html += \`</ul>\`;
                } else if (b.type === 'image') {
                    html += \`<div class="rounded-xl overflow-hidden shadow-sm border border-outline-variant/20"><div class="aspect-video bg-surface-variant flex items-center justify-center text-outline"><span class="material-symbols-outlined text-[32px]">image</span></div></div>\`;
                } else if (b.type === 'image-text') {
                    html += \`
                        <div class="flex flex-col gap-4">
                            <img src="\\\${b.image || ''}" class="w-full h-48 object-cover rounded-xl shadow-sm" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\\'http://www.w3.org/2000/svg\\\' width=\\\'100%\\\' height=\\\'100%\\\'><rect width=\\\'100%\\\' height=\\\'100%\\\' fill=\\\'#d9e3f6\\\'/></svg>'">
                            <p class="text-[14px] text-[#444651] leading-relaxed">\\\${b.content || ''}</p>
                        </div>
                    \`;
                } else if (b.type === 'gallery') {
                    html += \`<div class="grid grid-cols-2 gap-2">\`;
                    if(b.images && b.images.length) {
                        b.images.forEach(img => { html += \`<img src="\\\${img}" class="w-full h-24 object-cover rounded shadow-sm">\`; });
                    } else {
                        html += \`<div class="aspect-square bg-surface-variant rounded"></div><div class="aspect-square bg-surface-variant rounded"></div>\`;
                    }
                    html += \`</div>\`;
                } else if (b.type === 'stats') {
                    html += \`<div class="grid grid-cols-2 gap-4">\`;
                    if(b.stats) b.stats.forEach(st => {
                        html += \`<div class="bg-surface p-4 rounded-xl text-center border border-primary/10 shadow-sm"><div class="text-[24px] font-black text-primary mb-1">\\\${st.value || '0'}</div><div class="text-[11px] font-bold text-outline uppercase tracking-wider">\\\${st.label || 'Label'}</div></div>\`;
                    });
                    html += \`</div>\`;
                }
            });

            if (activeTab.blocks.length === 0) {
                html += \`<div class="text-center py-12 opacity-50"><span class="material-symbols-outlined text-[32px] text-outline mb-2">web</span><p class="text-sm text-outline">No content blocks added yet.</p></div>\`;
            }
            
            html += \`</div>\`;
            container.innerHTML = html;
        }
    }

    function renderTabsOnly() {
        const builderTabs = document.getElementById('builderTabs');
        const previewTabs = document.getElementById('previewTabs');
        
        if (builderTabs) {
            let builderHtml = '';
            serviceData.tabs.forEach(tab => {
                const isActive = tab.id === activeTabId;
                const activeClasses = isActive 
                    ? 'text-[#1e3a8a] font-semibold pb-3 border-b-2 border-[#1e3a8a] relative top-[1px]' 
                    : 'text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-[#1e3a8a] transition-colors';
                builderHtml += \`<button onclick="window.setActiveTab('\\\${tab.id}')" class="\\\${activeClasses}">\\\${tab.title}</button>\`;
            });
            builderTabs.innerHTML = builderHtml;
        }

        if (previewTabs) {
            let previewHtml = '';
            serviceData.tabs.forEach(tab => {
                const isActive = tab.id === activeTabId;
                const activeClasses = isActive
                    ? 'text-[13px] font-bold text-[#1e3a8a] pb-3 border-b-2 border-[#1e3a8a] relative top-[1px]'
                    : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-[#1e3a8a] transition-colors';
                previewHtml += \`<span onclick="window.setActiveTab('\\\${tab.id}')" class="\\\${activeClasses}">\\\${tab.title}</span>\`;
            });
            previewTabs.innerHTML = previewHtml;
        }
    }
</script>
</body>`;

html = html.replace(scriptRegex, newScript);
fs.writeFileSync(file, html);
console.log('Successfully rebuilt CMS with Dynamic Architecture.');
