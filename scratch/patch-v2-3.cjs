const fs = require('fs');

let content = fs.readFileSync('scratch/build-specialities-v2.cjs', 'utf8');

// The replacement for the speciality_edit right panel
const newRightPanelHtml = `
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
`;

// Currently build-specialities-v2.cjs has an "else {" block for both category and speciality edit.
// We need to split that into "else if (state.view === 'category_edit')" and "else if (state.view === 'speciality_edit')".

content = content.replace(/else \{[\s\S]*?\/\/ Edit views show the specific Category page/m, newRightPanelHtml.trim() + '\n            // Edit views show the specific Category page');

fs.writeFileSync('scratch/build-specialities-v2.cjs', content);
console.log('Replaced right panel speciality edit UI');
