const fs = require('fs');
let content = fs.readFileSync('scratch/build-specialities-v2.cjs', 'utf8');

// 1. Update the render() function to toggle the preview sidebar
const renderStart = content.indexOf("    function render() {");
const renderEndStr = "    function updateBreadcrumbs() {";
const renderEnd = content.indexOf(renderEndStr);

if (renderStart !== -1 && renderEnd !== -1) {
    const newRender = `    function render() {
        const previewSidebar = document.getElementById('previewSidebar');
        if (state.view === 'listing') {
            previewSidebar.classList.add('hidden');
            previewSidebar.classList.remove('flex', 'lg:flex');
        } else {
            previewSidebar.classList.remove('hidden');
            previewSidebar.classList.add('flex', 'flex-col');
        }

        renderLeftPanel();
        renderRightPanel();
        updateBreadcrumbs();
    }

`;
    content = content.substring(0, renderStart) + newRender + content.substring(renderEnd);
}

// 2. Update the left panel listing HTML
const listingStart = content.indexOf("        if (state.view === 'listing') {");
const listingEndStr = "        else if (state.view === 'category_edit') {";
const listingEnd = content.indexOf(listingEndStr);

if (listingStart !== -1 && listingEnd !== -1) {
    const newListing = `        if (state.view === 'listing') {
            html += \\\`
                <div class="flex items-center justify-between mb-8 fade-in">
                    <h2 class="text-[32px] font-bold text-[#121c2a] tracking-tight">Manage Categories</h2>
                    <button onclick="window.createCategory()" class="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-md shadow-[#E67E22]/20 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px]">add</span> Add Category
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-in">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-center">
                        <p class="text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Total Categories</p>
                        <h3 class="text-[36px] font-bold text-primary leading-none">\\\${state.categories.length}</h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-center">
                        <p class="text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Total Specialities</p>
                        <h3 class="text-[36px] font-bold text-primary leading-none">\\\${state.specialities.length}</h3>
                    </div>
                    <div class="bg-[#1e3a8a] p-6 rounded-2xl shadow-md flex flex-col justify-center relative overflow-hidden">
                        <div class="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
                            <span class="material-symbols-outlined text-[100px]">account_tree</span>
                        </div>
                        <h3 class="text-[20px] font-bold text-white mb-2 relative z-10">Structure Your Hospital</h3>
                        <p class="text-[13px] text-white/80 relative z-10">Categories define how specialities are grouped on the Bhaktivedanta website navigation menu.</p>
                    </div>
                </div>
                
                <div class="bg-white rounded-2xl border border-outline-variant/20 overflow-hidden fade-in shadow-sm">
                    <div class="px-6 py-5 border-b border-outline-variant/20 flex items-center justify-between">
                        <h3 class="text-[18px] font-bold text-[#121c2a]">All Categories</h3>
                        <div class="flex items-center gap-2 text-sm text-[#444651] border border-outline-variant/30 rounded-lg px-3 py-1.5">
                            Status: <span class="font-bold text-[#121c2a]">All</span> <span class="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                        </div>
                    </div>
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#F8F9FA] text-[11px] uppercase tracking-wider font-bold text-outline border-b border-outline-variant/20">
                                <th class="py-4 px-6">Category Name</th>
                                <th class="py-4 px-6 text-center">Specialities</th>
                                <th class="py-4 px-6 text-center">Status</th>
                                <th class="py-4 px-6">Created</th>
                                <th class="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/20">
            \\\`;
            
            state.categories.sort((a,b) => a.order - b.order).forEach(cat => {
                const specCount = state.specialities.filter(s => s.categoryId === cat.id).length;
                html += \\\`
                            <tr class="hover:bg-[#F8F9FF] transition-colors group">
                                <td class="py-5 px-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-lg bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a] shrink-0 border border-[#1e3a8a]/10">
                                            <span class="material-symbols-outlined text-[20px]">folder</span>
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#e67e22] text-[16px] cursor-pointer hover:underline mb-0.5" onclick="window.editCategory('\\\${cat.id}')">\\\${cat.name}</div>
                                            <div class="text-[13px] text-[#757682]">\\\${cat.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-5 px-6 text-center">
                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a8a]/5 text-[#1e3a8a] font-bold text-[13px]">\\\${specCount}</span>
                                </td>
                                <td class="py-5 px-6 text-center">
                                    <span class="px-3 py-1 rounded-full text-[11px] font-bold \\\${cat.status ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-outline-variant/20 text-outline'}">
                                        \\\${cat.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="py-5 px-6 text-[13px] text-[#757682] font-medium">12 Oct 2023</td>
                                <td class="py-5 px-6 text-right">
                                    <div class="flex justify-end gap-2">
                                        <button class="text-[#1e3a8a] hover:bg-[#1e3a8a]/10 p-1.5 rounded transition-colors" title="View"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
                                        <button onclick="window.editCategory('\\\${cat.id}')" class="text-[#1e3a8a] hover:bg-[#1e3a8a]/10 p-1.5 rounded transition-colors" title="Edit"><span class="material-symbols-outlined text-[18px]">edit</span></button>
                                        <button class="text-error hover:bg-error/10 p-1.5 rounded transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                                    </div>
                                </td>
                            </tr>
                \\\`;
            });

            html += \\\`
                        </tbody>
                    </table>
                </div>
            \\\`;
        } 
`;
    content = content.substring(0, listingStart) + newListing + content.substring(listingEnd);
}

fs.writeFileSync('scratch/patch-v2-6.cjs', content);
console.log('Successfully created patch script.');
