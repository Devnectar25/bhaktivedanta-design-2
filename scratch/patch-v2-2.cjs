const fs = require('fs');

let content = fs.readFileSync('scratch/build-specialities-v2.cjs', 'utf8');

// The replacement for speciality_edit inside renderLeftPanel
const newSpecialityEditHtml = `
        else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            
            html += \\\`
                <div class="flex items-center gap-4 mb-8 fade-in pb-6 border-b border-outline-variant/20">
                    <button onclick="window.navigate('category_edit', '\\\${spec.categoryId}')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-colors bg-[#F8F9FA]">
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
                        <input type="text" value="\\\${spec.name}" oninput="window.updateSpeciality('\\\${spec.id}', 'name', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Parent Category</label>
                        <select onchange="window.updateSpeciality('\\\${spec.id}', 'categoryId', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none">
            \\\`;
            
            state.categories.forEach(c => {
                html += \\\`<option value="\\\${c.id}" \\\${c.id === spec.categoryId ? 'selected' : ''}>\\\${c.name}</option>\\\`;
            });

            html += \\\`
                        </select>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Short Description</label>
                        <textarea rows="2" oninput="window.updateSpeciality('\\\${spec.id}', 'shortDescription', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none">\\\${spec.shortDescription}</textarea>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Icon</label>
                        <div class="flex gap-2">
                            <div class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/30 text-primary">
                                <span class="material-symbols-outlined text-[24px]" id="iconPreview">\\\${spec.icon}</span>
                            </div>
                            <input type="text" value="\\\${spec.icon}" oninput="window.updateSpeciality('\\\${spec.id}', 'icon', this.value); document.getElementById('iconPreview').textContent = this.value;" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-sm" placeholder="e.g. cardiology">
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
            \\\`;
        }
`;

content = content.replace(/else if \(state\.view === 'speciality_edit'\) \{[\s\S]*?container\.innerHTML = html;/m, newSpecialityEditHtml.trim() + '\n\n        container.innerHTML = html;\n        if(state.view === "speciality_edit") { setTimeout(renderTabsOnly, 0); setTimeout(renderEditorArea, 0); }');

fs.writeFileSync('scratch/build-specialities-v2.cjs', content);
console.log('Replaced left panel speciality edit UI');
