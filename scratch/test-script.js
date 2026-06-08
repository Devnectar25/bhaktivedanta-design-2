
    let state = {
        view: 'listing', // 'listing', 'category_edit', 'speciality_edit'
        activeCategoryId: null,
        activeSpecialityId: null,
        activeTabId: 't1',
        categories: [
            { id: 'c1', name: 'General Specialities', description: 'Comprehensive general healthcare services for everyday medical needs.', status: true, order: 1 },
            { id: 'c2', name: 'Super Specialities', description: 'Advanced medical treatments and interventions by expert specialists.', status: true, order: 2 },
            { id: 'c3', name: 'Centres Of Excellence', description: 'World-class multidisciplinary care centres providing specialized treatments.', status: true, order: 3 },
            { id: 'c4', name: 'Alternative Medicine & Therapy', description: 'Holistic approaches to healing, integrating traditional and natural therapies.', status: true, order: 4 }
        ],
        specialities: [
            { id: 's1', categoryId: 'c1', name: 'Anesthesiology', icon: 'masks', shortDescription: 'Safe and effective anesthesia services for surgeries.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Safe and effective anesthesia services for surgeries.'}]}] },
            { id: 's2', categoryId: 'c1', name: 'Critical Care', icon: 'monitor_heart', shortDescription: '24/7 intensive care for life-threatening conditions.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: '24/7 intensive care for life-threatening conditions.'}]}] },
            { id: 's3', categoryId: 'c1', name: 'Dermatology & Venereology', icon: 'dermatology', shortDescription: 'Expert care for skin, hair, and nail disorders.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Expert care for skin, hair, and nail disorders.'}]}] },
            { id: 's4', categoryId: 'c1', name: 'Dentistry', icon: 'dentistry', shortDescription: 'Comprehensive dental care and oral surgery.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Comprehensive dental care and oral surgery.'}]}] },
            { id: 's5', categoryId: 'c1', name: 'E.N.T', icon: 'hearing', shortDescription: 'Advanced treatment for ear, nose, and throat issues.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Advanced treatment for ear, nose, and throat issues.'}]}] },
            { id: 's6', categoryId: 'c1', name: 'General Medicine', icon: 'stethoscope', shortDescription: 'Primary care and management of adult diseases.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Primary care and management of adult diseases.'}]}] },
            
            { id: 's7', categoryId: 'c2', name: 'Pulmonology & Sleep Medicine', icon: 'pulmonology', shortDescription: 'Expert care for respiratory and sleep disorders.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Expert care for respiratory and sleep disorders.'}]}] },
            { id: 's8', categoryId: 'c2', name: 'Clinical Genetics', icon: 'genetics', shortDescription: 'Diagnosis and counseling for genetic conditions.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Diagnosis and counseling for genetic conditions.'}]}] },
            { id: 's9', categoryId: 'c2', name: 'Diabetology', icon: 'blood_pressure', shortDescription: 'Comprehensive diabetes management and care.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Comprehensive diabetes management and care.'}]}] },
            { id: 's10', categoryId: 'c2', name: 'Integrated Medicine', icon: 'local_pharmacy', shortDescription: 'Combining modern and alternative therapies.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Combining modern and alternative therapies.'}]}] },
            { id: 's11', categoryId: 'c2', name: 'Nephrology', icon: 'kidney', shortDescription: 'Advanced kidney care and dialysis services.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Advanced kidney care and dialysis services.'}]}] },
            { id: 's12', categoryId: 'c2', name: 'Urology', icon: 'water_drop', shortDescription: 'Treatment of urinary tract and male reproductive system.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Treatment of urinary tract and male reproductive system.'}]}] },
    
            { id: 's13', categoryId: 'c3', name: 'Bone & Joint Centre', icon: 'orthopedics', shortDescription: 'Advanced orthopedic and joint replacement surgeries.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Advanced orthopedic and joint replacement surgeries.'}]}] },
            { id: 's14', categoryId: 'c3', name: 'Cancer Centre', icon: 'oncology', shortDescription: 'Comprehensive oncology and cancer care.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Comprehensive oncology and cancer care.'}]}] },
            { id: 's15', categoryId: 'c3', name: 'Eye Care Centre', icon: 'visibility', shortDescription: 'State-of-the-art ophthalmology services.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'State-of-the-art ophthalmology services.'}]}] },
            { id: 's16', categoryId: 'c3', name: 'Heart Centre', icon: 'cardiology', shortDescription: 'Advanced cardiac care and surgeries.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Advanced cardiac care and surgeries.'}]}] },
            { id: 's17', categoryId: 'c3', name: 'Neurosciences', icon: 'neurology', shortDescription: 'Expert care for brain and spine disorders.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Expert care for brain and spine disorders.'}]}] },
            
            { id: 's18', categoryId: 'c4', name: 'Ayurveda', icon: 'eco', shortDescription: 'Traditional Indian system of holistic healing.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Traditional Indian system of holistic healing.'}]}] },
            { id: 's19', categoryId: 'c4', name: 'Yoga', icon: 'self_improvement', shortDescription: 'Therapeutic yoga for physical and mental wellness.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Therapeutic yoga for physical and mental wellness.'}]}] },
            { id: 's20', categoryId: 'c4', name: 'Homeopathy', icon: 'medication', shortDescription: 'Natural remedies for safe and effective treatment.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Natural remedies for safe and effective treatment.'}]}] },
            { id: 's21', categoryId: 'c4', name: 'Acupuncture', icon: 'healing', shortDescription: 'Ancient therapy for pain relief and balance.', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: 'Ancient therapy for pain relief and balance.'}]}] }
        ]
    };

    function render() {
        renderLeftPanel();
        renderRightPanel();
        updateBreadcrumbs();
    }

    function updateBreadcrumbs() {
        const tail = document.getElementById('breadcrumb-tail');
        const current = document.getElementById('breadcrumb-current');
        if (state.view === 'listing') {
            tail.classList.add('hidden');
            tail.classList.remove('flex');
        } else if (state.view === 'category_edit') {
            tail.classList.remove('hidden');
            tail.classList.add('flex');
            const cat = state.categories.find(c => c.id === state.activeCategoryId);
            current.textContent = cat ? cat.name : 'New Category';
        } else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            
            html += `
                <div class="flex items-center gap-4 mb-8 fade-in pb-6 border-b border-outline-variant/20">
                    <button onclick="window.navigate('category_edit', '${spec.categoryId}')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-colors bg-[#F8F9FA]">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 class="text-[24px] font-bold text-[#121c2a] leading-tight mb-1">Edit Speciality</h2>
                        <p class="text-[13px] text-[#757682]">Modify basic details and build the content page.</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-8 fade-in border border-outline-variant/30 p-6 rounded-2xl bg-[#F8F9FA]">
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Speciality Name</label>
                        <input type="text" value="${spec.name}" oninput="window.updateSpeciality('${spec.id}', 'name', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Parent Category</label>
                        <select onchange="window.updateSpeciality('${spec.id}', 'categoryId', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none">
            `;
            
            state.categories.forEach(c => {
                html += `<option value="${c.id}" ${c.id === spec.categoryId ? 'selected' : ''}>${c.name}</option>`;
            });

            html += `
                        </select>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Short Description</label>
                        <textarea rows="2" oninput="window.updateSpeciality('${spec.id}', 'shortDescription', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none">${spec.shortDescription}</textarea>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Icon</label>
                        <div class="flex gap-2">
                            <div class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/30 text-primary">
                                <span class="material-symbols-outlined text-[24px]" id="iconPreview">${spec.icon}</span>
                            </div>
                            <input type="text" value="${spec.icon}" oninput="window.updateSpeciality('${spec.id}', 'icon', this.value); document.getElementById('iconPreview').textContent = this.value;" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-sm" placeholder="e.g. cardiology">
                        </div>
                    </div>
                </div>

                <div class="mt-8 pt-8 border-t border-outline-variant/20 fade-in">
                    <div class="flex justify-between items-end mb-6">
                        <div>
                            <h3 class="text-[20px] font-bold text-[#121c2a] mb-1">Content Builder</h3>
                            <p class="text-[13px] text-[#757682]">Design the individual landing page for this speciality.</p>
                        </div>
                        <button onclick="window.addTab()" id="addSectionBtn" class="flex items-center gap-1.5 border border-[#1e3a8a]/20 bg-[#1e3a8a]/5 text-[#1e3a8a] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1e3a8a]/10 transition-colors">
                            <span class="material-symbols-outlined text-[18px]">add</span> Add Tab
                        </button>
                    </div>

                    <!-- Builder Tabs List -->
                    <div class="flex gap-6 overflow-x-auto custom-scrollbar border-b border-outline-variant/20 mb-6" id="builderTabs">
                        <!-- Dynamic Tabs -->
                    </div>

                    <div id="editorArea" class="min-h-[400px]">
                        <!-- Dynamic Editor -->
                    </div>
                </div>
            `;
        }

        container.innerHTML = html;
        if(state.view === "speciality_edit") { setTimeout(renderTabsOnly, 0); setTimeout(renderEditorArea, 0); }
    }

    function renderRightPanel() {
        const container = document.getElementById('previewScrollArea');
        let html = '';

        // If in listing view, show a generic "All Specialities" overview
        if (state.view === 'listing') {
            html += `
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 text-center fade-in">
                    <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">BHAKTIVEDANTA HOSPITAL</p>
                    <h1 class="text-[32px] font-bold mb-4 leading-tight">Our Specialities</h1>
                    <p class="opacity-80 text-[15px] max-w-[400px] mx-auto">Comprehensive healthcare services delivered with compassion and excellence.</p>
                </div>
                <div class="p-8 fade-in">
                    <div class="space-y-12">
            `;
            
            state.categories.filter(c => c.status).sort((a,b) => a.order - b.order).forEach(cat => {
                const specs = state.specialities.filter(s => s.categoryId === cat.id && s.status);
                html += `
                    <div>
                        <h2 class="text-[20px] font-bold text-[#121c2a] mb-6 flex items-center gap-3">
                            <span class="w-1.5 h-6 bg-secondary rounded-full"></span> ${cat.name}
                        </h2>
                        <div class="grid grid-cols-2 gap-4">
                `;
                specs.forEach(spec => {
                    html += `
                            <div class="bg-white border border-outline-variant/20 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                <div class="w-10 h-10 rounded-full bg-[#F8F9FF] text-primary flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[20px]">${spec.icon || 'medical_services'}</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-[#121c2a] text-[14px] leading-tight mb-1">${spec.name}</h3>
                                </div>
                            </div>
                    `;
                });
                if(specs.length === 0) {
                    html += `<div class="col-span-2 text-outline text-sm italic">Coming soon...</div>`;
                }
                html += `</div></div>`;
            });

            html += `</div></div>`;
        } 
        else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            
            html += `
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden shrink-0">
                    <div class="absolute inset-0 bg-[#0A235C]/50 z-10"></div>
                    <div class="relative z-20">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">SPECIALITY</p>
                        <h1 class="text-[32px] font-bold mb-4 leading-tight drop-shadow-md">${spec.name}</h1>
                        <p class="opacity-90 text-[15px] max-w-[400px] leading-relaxed">${spec.shortDescription}</p>
                    </div>
                </div>
                
                <!-- Preview Tabs -->
                <div class="bg-white border-b border-outline-variant/20 px-8 pt-4 flex gap-6 overflow-x-auto custom-scrollbar sticky top-0 z-30 shadow-sm" id="previewTabs">
                    <!-- Dynamic Tabs -->
                </div>
                
                <div class="p-8 fade-in bg-[#F8F9FA] min-h-[400px] relative">
                    <div id="previewAllSectionsContainer" class="w-full max-w-[800px] mx-auto">
                        <!-- Dynamic Preview Blocks -->
                    </div>
                </div>
            `;
        }
        else if (state.view === 'category_edit') {
            // Edit views show the specific Category page
            let catId = state.view === 'category_edit' ? state.activeCategoryId : 
                        state.specialities.find(s => s.id === state.activeSpecialityId).categoryId;
            
            const cat = state.categories.find(c => c.id === catId);
            const specs = state.specialities.filter(s => s.categoryId === cat.id);
            
            html += `
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden">
                    <div class="absolute inset-0 bg-[#0A235C]/50 z-10"></div>
                    <div class="relative z-20">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">DEPARTMENT</p>
                        <h1 class="text-[32px] font-bold mb-4 leading-tight drop-shadow-md">${cat.name}</h1>
                        <p class="opacity-90 text-[15px] max-w-[400px] leading-relaxed">${cat.description}</p>
                    </div>
                </div>
                <div class="p-8 fade-in bg-[#F8F9FA] min-h-[400px]">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            `;

            specs.forEach(spec => {
                const isEditing = state.view === 'speciality_edit' && spec.id === state.activeSpecialityId;
                const highlightClass = isEditing ? 'ring-2 ring-secondary shadow-lg scale-[1.02] bg-white' : 'border-outline-variant/20 hover:shadow-md bg-white opacity-90';
                
                html += `
                    <div class="border p-5 rounded-2xl transition-all duration-300 ${highlightClass} ${!spec.status ? 'opacity-40 grayscale' : ''}">
                        <div class="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-[24px]">${spec.icon || 'medical_services'}</span>
                        </div>
                        <h3 class="font-bold text-[#121c2a] text-[16px] mb-2 leading-tight">${spec.name}</h3>
                        <p class="text-[#757682] text-[13px] leading-relaxed">${spec.shortDescription}</p>
                        ${!spec.status ? '<div class="mt-3 text-[10px] font-bold text-error uppercase">Hidden</div>' : ''}
                    </div>
                `;
            });

            if(specs.length === 0) {
                html += `<div class="col-span-2 text-center py-10 text-outline border-2 border-dashed border-outline-variant/30 rounded-2xl">No specialities populated.</div>`;
            }

            html += `</div></div>`;
        }

        container.innerHTML = html;
    }

    // Handlers
    window.navigate = function(view, id = null) {
        state.view = view;
        if(view === 'category_edit') state.activeCategoryId = id;
        render();
    };

    window.createCategory = function() {
        const id = 'c' + Date.now();
        state.categories.push({ id, name: 'New Category', description: '', status: true, order: 99 });
        state.view = 'category_edit';
        state.activeCategoryId = id;
        render();
    };

    window.editCategory = function(id) {
        state.view = 'category_edit';
        state.activeCategoryId = id;
        render();
    };

    window.updateCategory = function(id, field, value) {
        const cat = state.categories.find(c => c.id === id);
        if(cat) {
            cat[field] = value;
            renderRightPanel();
            updateBreadcrumbs();
        }
    };

    window.deleteCategory = function(id) {
        if(!confirm("Are you sure? This will delete the category and ALL its specialities!")) return;
        state.categories = state.categories.filter(c => c.id !== id);
        state.specialities = state.specialities.filter(s => s.categoryId !== id);
        window.navigate('listing');
    };

    window.createSpeciality = function(categoryId) {
        const id = 's' + Date.now();
        state.specialities.push({ id, categoryId, name: 'New Speciality', icon: 'medical_services', shortDescription: '', status: true, tabs: [{id: 't1', title: 'Overview', blocks: [{id: 'b1', type: 'rich-text', content: ''}]}] });
        state.view = 'speciality_edit';
        state.activeSpecialityId = id;
        render();
    };

    window.editSpeciality = function(id) {
        state.view = 'speciality_edit';
        state.activeSpecialityId = id;
        render();
    };

    window.updateSpeciality = function(id, field, value) {
        const spec = state.specialities.find(s => s.id === id);
        if(spec) {
            spec[field] = value;
            renderRightPanel();
            updateBreadcrumbs();
        }
    };

    window.deleteSpeciality = function(id) {
        if(!confirm("Delete this speciality?")) return;
        const spec = state.specialities.find(s => s.id === id);
        state.specialities = state.specialities.filter(s => s.id !== id);
        window.navigate('category_edit', spec.categoryId);
    };

    
    // Content Builder Logic
    window.setActiveTab = function(id) {
        state.activeTabId = id;
        renderTabsOnly();
        renderPreviewSections();
        renderEditorArea();
    };

    window.addTab = function() {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        if(!spec) return;
        const title = prompt("Enter Tab Name:");
        if (!title) return;
        const newId = 'tab-' + Date.now();
        spec.tabs.push({ id: newId, title: title, blocks: [] });
        state.activeTabId = newId;
        renderTabsOnly();
        renderPreviewSections();
        renderEditorArea();
        
        const builderTabs = document.getElementById('builderTabs');
        if (builderTabs) setTimeout(() => { builderTabs.scrollTo({ left: builderTabs.scrollWidth, behavior: 'smooth' }); }, 50);
    };

    window.addBlock = function(type) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
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
        renderEditorArea();
        renderPreviewSections();
    };

    window.moveBlock = function(blockId, dir) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        const idx = activeTab.blocks.findIndex(b => b.id === blockId);
        if (idx < 0) return;
        const newIdx = idx + dir;
        if (newIdx >= 0 && newIdx < activeTab.blocks.length) {
            const temp = activeTab.blocks[idx];
            activeTab.blocks[idx] = activeTab.blocks[newIdx];
            activeTab.blocks[newIdx] = temp;
            renderEditorArea();
            renderPreviewSections();
        }
    };

    window.deleteBlock = function(blockId) {
        if (!confirm("Delete this content block?")) return;
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        activeTab.blocks = activeTab.blocks.filter(b => b.id !== blockId);
        renderEditorArea();
        renderPreviewSections();
    };

    window.updateBlockText = function(blockId, field, val) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block[field] = val; renderPreviewSections(); }
    };
    
    window.addFeatureItem = function(blockId) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items.push(''); renderEditorArea(); renderPreviewSections(); }
    };

    window.updateFeatureItem = function(blockId, idx, val) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items[idx] = val; renderPreviewSections(); }
    };

    window.deleteFeatureItem = function(blockId, idx) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        const block = activeTab.blocks.find(b => b.id === blockId);
        if(block) { block.items.splice(idx, 1); renderEditorArea(); renderPreviewSections(); }
    };

    window.updateTabTitle = function(val) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        if(activeTab) {
            activeTab.title = val;
            renderTabsOnly();
            renderPreviewSections();
        }
    };

    window.deleteTab = function() {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        if(spec.tabs.length <= 1) { alert("Cannot delete the last tab."); return; }
        if(!confirm("Are you sure you want to delete this tab and all its content?")) return;
        const idx = spec.tabs.findIndex(t => t.id === state.activeTabId);
        spec.tabs.splice(idx, 1);
        state.activeTabId = spec.tabs[0].id;
        renderTabsOnly();
        renderEditorArea();
        renderPreviewSections();
    };

    window.renderEditorArea = function() {
        if(state.view !== 'speciality_edit') return;
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId) || spec.tabs[0];
        if(!activeTab) return;
        
        const editorArea = document.getElementById('editorArea');
        if (!editorArea) return;
        
        let html = '';
        
        // Tab settings
        html += `
            <div class="mb-8 pb-6 border-b border-outline-variant/20 flex items-center justify-between">
                <div class="space-y-1">
                    <label class="text-[12px] uppercase tracking-wider font-bold text-outline">Tab Settings</label>
                    <input type="text" value="${activeTab.title}" onchange="window.updateTabTitle(this.value)" class="bg-transparent border-none p-0 text-[20px] font-bold text-primary focus:ring-0 w-64 outline-none" placeholder="Tab Title">
                </div>
                <button onclick="window.deleteTab()" class="text-error hover:bg-error/10 px-3 py-1.5 rounded text-sm font-medium transition-colors">Delete Tab</button>
            </div>
        `;

        // Blocks loop
        if(activeTab.blocks.length === 0) {
            html += `<div class="text-center py-12 border-2 border-dashed border-outline-variant/50 rounded-xl bg-surface/50 text-outline"><p class="mb-2 text-[15px]">No content blocks in this tab.</p><p class="text-[13px]">Add a block below to start building.</p></div>`;
        } else {
            html += `<div class="space-y-6">`;
            activeTab.blocks.forEach((b, idx) => {
                html += `
                    <div class="border border-outline-variant/40 rounded-xl bg-white shadow-sm overflow-hidden transition-all hover:border-primary/30 group fade-in">
                        <div class="bg-[#F8F9FA] px-4 py-2 border-b border-outline-variant/20 flex justify-between items-center">
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-[16px] text-outline cursor-move">drag_indicator</span>
                                <span class="text-[11px] uppercase tracking-wider font-bold text-outline">${b.type.replace('-', ' ')} BLOCK</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button onclick="window.moveBlock('${b.id}', -1)" class="p-1 text-outline hover:text-primary rounded"><span class="material-symbols-outlined text-[16px]">keyboard_arrow_up</span></button>
                                <button onclick="window.moveBlock('${b.id}', 1)" class="p-1 text-outline hover:text-primary rounded"><span class="material-symbols-outlined text-[16px]">keyboard_arrow_down</span></button>
                                <button onclick="window.deleteBlock('${b.id}')" class="p-1 text-error hover:bg-error/10 rounded ml-2"><span class="material-symbols-outlined text-[16px]">delete</span></button>
                            </div>
                        </div>
                        <div class="p-5">
                `;
                
                if (b.type === 'rich-text') {
                    html += `<textarea rows="4" placeholder="Enter rich text content here..." oninput="window.updateBlockText('${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none custom-scrollbar">${b.content || ''}</textarea>`;
                } else if (b.type === 'quote') {
                    html += `
                        <div class="space-y-3">
                            <textarea rows="2" placeholder="Quote text" oninput="window.updateBlockText('${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none font-serif italic">${b.content || ''}</textarea>
                            <input type="text" placeholder="Author / Attribution" value="${b.author || ''}" oninput="window.updateBlockText('${b.id}', 'author', this.value)" class="w-full p-2 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">
                        </div>
                    `;
                } else if (b.type === 'feature-list') {
                    html += `<div class="space-y-2">`;
                    b.items.forEach((item, i) => {
                        html += `
                            <div class="flex items-center gap-2">
                                <span class="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                                <input type="text" value="${item}" oninput="window.updateFeatureItem('${b.id}', ${i}, this.value)" class="flex-1 p-2 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none">
                                <button onclick="window.deleteFeatureItem('${b.id}', ${i})" class="text-outline hover:text-error"><span class="material-symbols-outlined text-[16px]">close</span></button>
                            </div>
                        `;
                    });
                    html += `<button onclick="window.addFeatureItem('${b.id}')" class="text-sm text-primary font-medium mt-2 flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">add</span> Add Item</button></div>`;
                } else if (b.type === 'image' || b.type === 'gallery') {
                    html += `
                        <div class="border-2 border-dashed border-outline-variant/50 rounded-lg p-6 text-center hover:bg-[#F8F9FF] cursor-pointer">
                            <span class="material-symbols-outlined text-[24px] text-outline mb-1">add_photo_alternate</span>
                            <p class="text-xs text-outline">Click to upload or drag images here</p>
                        </div>
                    `;
                } else if (b.type === 'image-text') {
                    html += `
                        <div class="grid grid-cols-2 gap-4">
                            <div class="border-2 border-dashed border-outline-variant/50 rounded-lg p-6 text-center flex flex-col justify-center items-center cursor-pointer hover:bg-[#F8F9FF]">
                                <span class="material-symbols-outlined text-[24px] text-outline mb-1">add_photo_alternate</span>
                                <p class="text-[10px] text-outline">Select Image</p>
                            </div>
                            <textarea rows="4" placeholder="Accompanying text..." oninput="window.updateBlockText('${b.id}', 'content', this.value)" class="w-full p-3 rounded border border-outline-variant/30 text-sm focus:ring-1 focus:ring-primary outline-none custom-scrollbar">${b.content || ''}</textarea>
                        </div>
                    `;
                } else if (b.type === 'stats') {
                    html += `<p class="text-sm text-outline italic">Stats block configuration...</p>`;
                }

                html += `</div></div>`;
            });
            html += `</div>`;
        }

        // Add Block toolbar
        html += `
            <div class="mt-8 pt-6 border-t border-outline-variant/20">
                <label class="text-[12px] uppercase tracking-wider font-bold text-outline mb-3 block">Add Content Block</label>
                <div class="flex flex-wrap gap-2">
                    <button onclick="window.addBlock('rich-text')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">notes</span> Rich Text</button>
                    <button onclick="window.addBlock('image')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">image</span> Image</button>
                    <button onclick="window.addBlock('image-text')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">view_carousel</span> Image + Text</button>
                    <button onclick="window.addBlock('quote')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">format_quote</span> Quote</button>
                    <button onclick="window.addBlock('feature-list')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">checklist</span> List</button>
                    <button onclick="window.addBlock('gallery')" class="flex items-center gap-1.5 px-3 py-1.5 rounded border border-outline-variant/50 bg-white hover:bg-primary/5 hover:border-primary/30 text-sm font-medium transition-colors"><span class="material-symbols-outlined text-[16px]">photo_library</span> Gallery</button>
                </div>
            </div>
        `;

        editorArea.innerHTML = html;
    };

    window.renderTabsOnly = function() {
        if(state.view !== 'speciality_edit') return;
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        if(!spec) return;
        
        const builderTabs = document.getElementById('builderTabs');
        const previewTabs = document.getElementById('previewTabs');
        
        if (builderTabs) {
            let builderHtml = '';
            spec.tabs.forEach(tab => {
                const isActive = tab.id === state.activeTabId;
                const activeClasses = isActive 
                    ? 'text-[#1e3a8a] font-semibold pb-3 border-b-2 border-[#1e3a8a] relative top-[1px]' 
                    : 'text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-[#1e3a8a] transition-colors';
                builderHtml += `<button onclick="window.setActiveTab('${tab.id}')" class="${activeClasses} whitespace-nowrap">${tab.title}</button>`;
            });
            builderTabs.innerHTML = builderHtml;
        }

        if (previewTabs) {
            let previewHtml = '';
            spec.tabs.forEach(tab => {
                const isActive = tab.id === state.activeTabId;
                const activeClasses = isActive
                    ? 'text-[13px] font-bold text-[#1e3a8a] pb-3 border-b-2 border-[#1e3a8a] relative top-[1px]'
                    : 'text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent cursor-pointer hover:text-[#1e3a8a] transition-colors';
                previewHtml += `<span onclick="window.setActiveTab('${tab.id}')" class="${activeClasses} whitespace-nowrap">${tab.title}</span>`;
            });
            previewTabs.innerHTML = previewHtml;
        }
    };

    window.renderPreviewSections = function() {
        if(state.view !== 'speciality_edit') return;
        const container = document.getElementById('previewAllSectionsContainer');
        if (!container) return;
        
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        if(!spec) return;
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId) || spec.tabs[0];
        
        if (activeTab) {
            let html = `<div id="preview-${activeTab.id}" class="space-y-8 fade-in">`;
            
            // Render blocks for preview
            activeTab.blocks.forEach(b => {
                if (b.type === 'rich-text') {
                    html += `<div class="prose prose-sm max-w-none text-[#444651] leading-relaxed whitespace-pre-wrap">${b.content || '<em class="text-outline">Empty text block</em>'}</div>`;
                } else if (b.type === 'quote') {
                    html += `
                        <blockquote class="border-l-4 border-primary pl-4 py-1 italic text-[#1e3a8a] bg-primary/5 rounded-r-lg">
                            <p class="text-[16px] font-serif mb-2">"${b.content || '...'}"</p>
                            <footer class="text-[12px] font-bold uppercase tracking-wider">— ${b.author || 'Anonymous'}</footer>
                        </blockquote>
                    `;
                } else if (b.type === 'feature-list') {
                    html += `<ul class="space-y-3">`;
                    b.items.forEach(item => {
                        if(item.trim()) {
                            html += `<li class="flex items-start gap-3"><span class="material-symbols-outlined text-[#10B981] text-[20px] shrink-0">check_circle</span><span class="text-[#444651] text-[15px]">${item}</span></li>`;
                        }
                    });
                    html += `</ul>`;
                } else if (b.type === 'image') {
                    html += `<div class="rounded-xl overflow-hidden shadow-sm border border-outline-variant/20"><div class="aspect-video bg-surface-variant flex items-center justify-center text-outline"><span class="material-symbols-outlined text-[32px]">image</span></div></div>`;
                } else if (b.type === 'image-text') {
                    html += `
                        <div class="flex flex-col gap-4">
                            <img src="${b.image || ''}" class="w-full h-48 object-cover rounded-xl shadow-sm" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%\' height=\'100%\'><rect width=\'100%\' height=\'100%\' fill=\'#d9e3f6\'/></svg>'">
                            <p class="text-[14px] text-[#444651] leading-relaxed">${b.content || ''}</p>
                        </div>
                    `;
                } else if (b.type === 'gallery') {
                    html += `<div class="grid grid-cols-2 gap-2">`;
                    if(b.images && b.images.length) {
                        b.images.forEach(img => { html += `<img src="${img}" class="w-full h-24 object-cover rounded shadow-sm">`; });
                    } else {
                        html += `<div class="aspect-square bg-surface-variant rounded"></div><div class="aspect-square bg-surface-variant rounded"></div>`;
                    }
                    html += `</div>`;
                } else if (b.type === 'stats') {
                    html += `<div class="grid grid-cols-2 gap-4">`;
                    if(b.stats) b.stats.forEach(st => {
                        html += `<div class="bg-surface p-4 rounded-xl text-center border border-primary/10 shadow-sm"><div class="text-[24px] font-black text-primary mb-1">${st.value || '0'}</div><div class="text-[11px] font-bold text-outline uppercase tracking-wider">${st.label || 'Label'}</div></div>`;
                    });
                    html += `</div>`;
                }
            });

            if (activeTab.blocks.length === 0) {
                html += `<div class="text-center py-12 opacity-50"><span class="material-symbols-outlined text-[32px] text-outline mb-2">web</span><p class="text-sm text-outline">No content blocks added yet.</p></div>`;
            }
            
            html += `</div>`;
            container.innerHTML = html;
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', render);
