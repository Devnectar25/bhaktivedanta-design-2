const fs = require('fs');
let content = fs.readFileSync('scratch/build-specialities-v2.cjs', 'utf8');

// --- 1. Fix renderLeftPanel speciality_edit ---
const leftPanelStart = content.indexOf("        else if (state.view === 'speciality_edit') {");
// The end is the container.innerHTML = html; line inside renderLeftPanel
const leftPanelEndStr = "        container.innerHTML = html;\n    }\n\n    function renderRightPanel() {";
const leftPanelEnd = content.indexOf(leftPanelEndStr);

if (leftPanelStart !== -1 && leftPanelEnd !== -1) {
    const newLeft = `
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

        container.innerHTML = html;
        if(state.view === "speciality_edit") { setTimeout(window.renderTabsOnly, 0); setTimeout(window.renderEditorArea, 0); }
    }

    function renderRightPanel() {`;
    
    content = content.substring(0, leftPanelStart) + newLeft + content.substring(leftPanelEnd + leftPanelEndStr.length);
} else {
    console.error("Left panel markers not found");
}

// --- 2. Fix renderRightPanel ---
const rightPanelStart = content.indexOf("        else {\n            // Edit views show the specific Category page");
const rightPanelEndStr = "        container.innerHTML = html;\n    }";
const rightPanelEnd = content.indexOf(rightPanelEndStr, rightPanelStart);

if (rightPanelStart !== -1 && rightPanelEnd !== -1) {
    const newRight = `
        else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            
            html += \\\`
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden shrink-0">
                    <div class="absolute inset-0 bg-[#0A235C]/50 z-10"></div>
                    <div class="relative z-20">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">SPECIALITY</p>
                        <h1 class="text-[32px] font-bold mb-4 leading-tight drop-shadow-md">\\\${spec.name}</h1>
                        <p class="opacity-90 text-[15px] max-w-[400px] leading-relaxed">\\\${spec.shortDescription}</p>
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
            \\\`;
        }
        else if (state.view === 'category_edit') {
            const cat = state.categories.find(c => c.id === state.activeCategoryId);
            const specs = state.specialities.filter(s => s.categoryId === cat.id);
            
            html += \\\`
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden">
                    <div class="absolute inset-0 bg-[#0A235C]/50 z-10"></div>
                    <div class="relative z-20">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">DEPARTMENT</p>
                        <h1 class="text-[32px] font-bold mb-4 leading-tight drop-shadow-md">\\\${cat.name}</h1>
                        <p class="opacity-90 text-[15px] max-w-[400px] leading-relaxed">\\\${cat.description}</p>
                    </div>
                </div>
                <div class="p-8 fade-in bg-[#F8F9FA] min-h-[400px]">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            \\\`;

            specs.forEach(spec => {
                const highlightClass = 'border-outline-variant/20 hover:shadow-md bg-white opacity-90';
                
                html += \\\`
                    <div class="border p-5 rounded-2xl transition-all duration-300 \\\${highlightClass} \\\${!spec.status ? 'opacity-40 grayscale' : ''}">
                        <div class="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-[24px]">\\\${spec.icon || 'medical_services'}</span>
                        </div>
                        <h3 class="font-bold text-[#121c2a] text-[16px] mb-2 leading-tight">\\\${spec.name}</h3>
                        <p class="text-[#757682] text-[13px] leading-relaxed">\\\${spec.shortDescription}</p>
                        \\\${!spec.status ? '<div class="mt-3 text-[10px] font-bold text-error uppercase">Hidden</div>' : ''}
                    </div>
                \\\`;
            });

            if(specs.length === 0) {
                html += \\\`<div class="col-span-2 text-center py-10 text-outline border-2 border-dashed border-outline-variant/30 rounded-2xl">No specialities populated.</div>\\\`;
            }

            html += \\\`</div></div>\\\`;
        }

        container.innerHTML = html;
    }`;

    content = content.substring(0, rightPanelStart) + newRight + content.substring(rightPanelEnd + rightPanelEndStr.length);
} else {
    console.error("Right panel markers not found");
}

fs.writeFileSync('scratch/build-specialities-v2.cjs', content);
console.log('Successfully patched left and right panels securely.');
