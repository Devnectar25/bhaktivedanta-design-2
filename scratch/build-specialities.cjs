const fs = require('fs');

const htmlContent = `<!DOCTYPE html>
<html class="light" lang="en" style="font-size: 75%;">
<head>
    <meta charset="utf-8"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <title>Specialities Management | Bhaktivedanta Hospital Admin</title>
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
    <style>
        body { font-family: 'Inter', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
    </style>
    <script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: { extend: { colors: { primary: "#1e3a8a", outline: "#757682", "outline-variant": "#c5c5d3", background: "#f8f9ff", "on-background": "#121c2a", error: "#ba1a1a" } } }
        }
    </script>
    <link rel="stylesheet" href="unified-admin.css">
    <script src="admin-common.js" defer></script>
</head>
<body class="bg-background text-on-background overflow-hidden">
<aside class="fixed left-0 top-0 h-full w-[280px] bg-primary shadow-xl z-50 flex flex-col py-lg overflow-y-auto custom-scrollbar" style="background-color: #1E3A8A;">
    <div class="px-md mb-lg border-b border-white/10 pb-sm">
        <a href="dashboard.html" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Bhaktivedanta Hospital" class="h-8 w-auto object-contain" style="filter: brightness(0) invert(1);">
        </a>
    </div>
    <nav class="flex-1 px-sm space-y-xs mb-2">
        <a class="flex items-center gap-sm px-md py-sm rounded-lg transition-colors text-white/80 hover:bg-white/10" href="dashboard.html"><span class="material-symbols-outlined text-white">dashboard</span><span class="font-label-lg text-label-lg">Dashboard</span></a>
        <a class="flex items-center gap-sm px-md py-sm rounded-lg transition-colors text-white/80 hover:bg-white/10" href="services.html"><span class="material-symbols-outlined text-white">medical_services</span><span class="font-label-lg text-label-lg">Services</span></a>
        <a class="flex items-center gap-sm px-md py-sm rounded-lg font-bold transition-colors text-white hover:bg-white/10" href="specialities.html" style="background-color: rgba(255, 255, 255, 0.12);"><span class="material-symbols-outlined text-white">star</span><span class="font-label-lg text-label-lg">Specialities</span></a>
    </nav>
</aside>

<main class="ml-[280px] h-screen flex flex-col overflow-hidden">
    <header class="sticky top-0 w-full z-40 bg-white shadow-sm h-16 flex items-center justify-between px-8">
        <div class="flex items-center gap-4">
            <h1 class="text-xl font-bold text-[#1e3a8a]">Specialities Management</h1>
        </div>
        <div class="flex items-center gap-6">
            <div class="flex items-center gap-3">
                <div class="text-right">
                    <p class="font-bold text-sm text-[#121c2a]">Admin User</p>
                    <p class="text-[10px] uppercase text-[#757682]">Super Administrator</p>
                </div>
            </div>
        </div>
    </header>

    <section class="flex-1 overflow-y-auto px-8 pb-8 pt-8 bg-[#F8F9FF] custom-scrollbar">


        <div class="flex flex-col lg:flex-row gap-6 items-start">
            <div id="builderMain" class="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6 md:p-8 flex flex-col min-h-[600px] transition-all duration-300">
                <!-- Left panel content dynamically injected here -->
            </div>

            <div id="previewSidebar" class="w-full lg:w-[40%] shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-[calc(100vh-180px)] sticky top-0 transition-all duration-300">
                <div class="bg-[#F8F9FA] px-4 py-3 flex items-center gap-4 border-b border-outline-variant/20">
                    <div class="flex items-center gap-1.5 shrink-0">
                        <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                        <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                    </div>
                    <div class="flex-1 bg-white border border-outline-variant/20 rounded-md py-1.5 px-3 text-[11px] text-center truncate text-[#757682] mx-4 shadow-sm" id="previewUrlBar">
                        bhaktivedantahospital.com<span class="text-primary font-medium">/specialities</span>
                    </div>
                    <div class="flex items-center gap-2 text-outline shrink-0">
                        <span class="material-symbols-outlined text-[16px]">desktop_mac</span>
                    </div>
                </div>
                
                <div id="previewScrollArea" class="flex-1 bg-white relative overflow-y-auto custom-scrollbar scroll-smooth">
                    <!-- Right preview content dynamically injected here -->
                </div>
            </div>
        </div>
    </section>
</main>
<script>
    let state = {
        view: 'listing', // 'listing', 'category_edit', 'speciality_edit'
        activeCategoryId: null,
        activeSpecialityId: null,
        categories: [
            { id: 'c1', name: 'General Specialities', description: 'Comprehensive general healthcare services for everyday medical needs.', status: true, order: 1 },
            { id: 'c2', name: 'Super Specialities', description: 'Advanced medical treatments and interventions by expert specialists.', status: true, order: 2 },
            { id: 'c3', name: 'Centres Of Excellence', description: 'World-class multidisciplinary care centres providing specialized treatments.', status: true, order: 3 },
            { id: 'c4', name: 'Alternative Medicine & Therapy', description: 'Holistic approaches to healing, integrating traditional and natural therapies.', status: true, order: 4 }
        ],
        specialities: [
            { id: 's1', categoryId: 'c1', name: 'Anesthesiology', icon: 'masks', shortDescription: 'Safe and effective anesthesia services for surgeries.', status: true },
            { id: 's2', categoryId: 'c1', name: 'Critical Care', icon: 'monitor_heart', shortDescription: '24/7 intensive care for life-threatening conditions.', status: true },
            { id: 's3', categoryId: 'c1', name: 'Dermatology & Venereology', icon: 'dermatology', shortDescription: 'Expert care for skin, hair, and nail disorders.', status: true },
            { id: 's4', categoryId: 'c1', name: 'Dentistry', icon: 'dentistry', shortDescription: 'Comprehensive dental care and oral surgery.', status: true },
            { id: 's5', categoryId: 'c1', name: 'E.N.T', icon: 'hearing', shortDescription: 'Advanced treatment for ear, nose, and throat issues.', status: true },
            { id: 's6', categoryId: 'c1', name: 'General Medicine', icon: 'stethoscope', shortDescription: 'Primary care and management of adult diseases.', status: true },
            
            { id: 's7', categoryId: 'c2', name: 'Pulmonology & Sleep Medicine', icon: 'pulmonology', shortDescription: 'Expert care for respiratory and sleep disorders.', status: true },
            { id: 's8', categoryId: 'c2', name: 'Clinical Genetics', icon: 'genetics', shortDescription: 'Diagnosis and counseling for genetic conditions.', status: true },
            { id: 's9', categoryId: 'c2', name: 'Diabetology', icon: 'blood_pressure', shortDescription: 'Comprehensive diabetes management and care.', status: true },
            { id: 's10', categoryId: 'c2', name: 'Integrated Medicine', icon: 'local_pharmacy', shortDescription: 'Combining modern and alternative therapies.', status: true },
            { id: 's11', categoryId: 'c2', name: 'Nephrology', icon: 'kidney', shortDescription: 'Advanced kidney care and dialysis services.', status: true },
            { id: 's12', categoryId: 'c2', name: 'Urology', icon: 'water_drop', shortDescription: 'Treatment of urinary tract and male reproductive system.', status: true },
    
            { id: 's13', categoryId: 'c3', name: 'Bone & Joint Centre', icon: 'orthopedics', shortDescription: 'Advanced orthopedic and joint replacement surgeries.', status: true },
            { id: 's14', categoryId: 'c3', name: 'Cancer Centre', icon: 'oncology', shortDescription: 'Comprehensive oncology and cancer care.', status: true },
            { id: 's15', categoryId: 'c3', name: 'Eye Care Centre', icon: 'visibility', shortDescription: 'State-of-the-art ophthalmology services.', status: true },
            { id: 's16', categoryId: 'c3', name: 'Heart Centre', icon: 'cardiology', shortDescription: 'Advanced cardiac care and surgeries.', status: true },
            { id: 's17', categoryId: 'c3', name: 'Neurosciences', icon: 'neurology', shortDescription: 'Expert care for brain and spine disorders.', status: true },
            
            { id: 's18', categoryId: 'c4', name: 'Ayurveda', icon: 'eco', shortDescription: 'Traditional Indian system of holistic healing.', status: true },
            { id: 's19', categoryId: 'c4', name: 'Yoga', icon: 'self_improvement', shortDescription: 'Therapeutic yoga for physical and mental wellness.', status: true },
            { id: 's20', categoryId: 'c4', name: 'Homeopathy', icon: 'medication', shortDescription: 'Natural remedies for safe and effective treatment.', status: true },
            { id: 's21', categoryId: 'c4', name: 'Acupuncture', icon: 'healing', shortDescription: 'Ancient therapy for pain relief and balance.', status: true }
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
            tail.classList.remove('hidden');
            tail.classList.add('flex');
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            current.textContent = spec ? spec.name : 'New Speciality';
        }
    }

    function renderLeftPanel() {
        const container = document.getElementById('builderMain');
        let html = '';

        if (state.view === 'listing') {
            html += \`
                <div class="flex justify-between items-end mb-8 fade-in">
                    <div>
                        <h2 class="text-[28px] font-bold text-[#121c2a] leading-tight mb-2">Speciality Categories</h2>
                        <p class="text-[15px] text-[#444651]">Manage top-level speciality categories and their underlying specialities.</p>
                    </div>
                    <button onclick="window.createCategory()" class="flex items-center gap-2 bg-[#1e3a8a] text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-[#1e3a8a]/90 transition-colors shadow-md shadow-[#1e3a8a]/20">
                        <span class="material-symbols-outlined text-[18px]">add</span> Add Category
                    </button>
                </div>
                
                <div class="bg-white rounded-xl border border-outline-variant/30 overflow-hidden fade-in shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-[#F8F9FA] text-[12px] uppercase tracking-wider font-bold text-outline border-b border-outline-variant/20">
                                <th class="py-4 px-6 font-semibold">Category Name</th>
                                <th class="py-4 px-6 font-semibold">Specialities</th>
                                <th class="py-4 px-6 font-semibold">Status</th>
                                <th class="py-4 px-6 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-outline-variant/20">
            \`;
            
            state.categories.sort((a,b) => a.order - b.order).forEach(cat => {
                const specCount = state.specialities.filter(s => s.categoryId === cat.id).length;
                html += \`
                            <tr class="hover:bg-[#F8F9FF] transition-colors group">
                                <td class="py-4 px-6">
                                    <div class="font-bold text-[#1e3a8a] text-[15px]">\${cat.name}</div>
                                </td>
                                <td class="py-4 px-6 text-[#444651] font-medium">\${specCount} items</td>
                                <td class="py-4 px-6">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-bold \${cat.status ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-outline-variant/20 text-outline'}">
                                        <span class="w-1.5 h-1.5 rounded-full \${cat.status ? 'bg-[#10B981]' : 'bg-outline'}"></span>
                                        \${cat.status ? 'Active' : 'Hidden'}
                                    </span>
                                </td>
                                <td class="py-4 px-6 text-right">
                                    <button onclick="window.editCategory('\${cat.id}')" class="text-[#1e3a8a] bg-[#1e3a8a]/5 hover:bg-[#1e3a8a]/10 px-3 py-1.5 rounded font-medium text-sm transition-colors">Manage</button>
                                </td>
                            </tr>
                \`;
            });

            html += \`
                        </tbody>
                    </table>
                </div>
            \`;
        } 
        else if (state.view === 'category_edit') {
            const cat = state.categories.find(c => c.id === state.activeCategoryId);
            const catSpecs = state.specialities.filter(s => s.categoryId === cat.id);
            
            html += \`
                <div class="flex justify-between items-center mb-8 fade-in pb-6 border-b border-outline-variant/20">
                    <div class="flex items-center gap-4">
                        <button onclick="window.navigate('listing')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-colors bg-[#F8F9FA]">
                            <span class="material-symbols-outlined">arrow_back</span>
                        </button>
                        <div>
                            <h2 class="text-[24px] font-bold text-[#121c2a] leading-tight mb-1">Edit Category</h2>
                            <p class="text-[13px] text-[#757682]">Modify category details and manage its specialities.</p>
                        </div>
                    </div>
                    <button onclick="window.deleteCategory('\${cat.id}')" class="text-error hover:bg-error/10 px-4 py-2 rounded-lg font-medium text-sm transition-colors border border-transparent hover:border-error/20 flex items-center gap-2">
                        <span class="material-symbols-outlined text-[18px]">delete</span> Delete Category
                    </button>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-10 fade-in">
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Category Name</label>
                        <input type="text" value="\${cat.name}" oninput="window.updateCategory('\${cat.id}', 'name', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Display Order</label>
                        <input type="number" value="\${cat.order}" oninput="window.updateCategory('\${cat.id}', 'order', parseInt(this.value))" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Description</label>
                        <textarea rows="2" oninput="window.updateCategory('\${cat.id}', 'description', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none">\${cat.description}</textarea>
                    </div>
                    <div class="space-y-2 col-span-2 flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-[#F8F9FA]">
                        <div>
                            <div class="font-bold text-[#121c2a] text-[15px]">Category Visibility</div>
                            <div class="text-[13px] text-[#757682]">Toggle whether this category appears on the website.</div>
                        </div>
                        <div class="relative inline-block w-[42px] h-[24px] transition duration-200 ease-in-out">
                            <input \${cat.status ? 'checked' : ''} onchange="window.updateCategory('\${cat.id}', 'status', this.checked)" class="opacity-0 w-0 h-0 peer" id="catStatusToggle" type="checkbox"/>
                            <label class="absolute top-0 left-0 right-0 bottom-0 bg-outline-variant/30 rounded-full cursor-pointer peer-checked:bg-[#10B981] transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[18px]" for="catStatusToggle"></label>
                        </div>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-6 pt-6 border-t border-outline-variant/20 fade-in">
                    <h3 class="text-[18px] font-bold text-[#121c2a]">Specialities in this Category</h3>
                    <button onclick="window.createSpeciality('\${cat.id}')" class="flex items-center gap-1.5 border border-[#1e3a8a]/20 bg-[#1e3a8a]/5 text-[#1e3a8a] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1e3a8a]/10 transition-colors">
                        <span class="material-symbols-outlined text-[18px]">add</span> Add Speciality
                    </button>
                </div>

                <div class="bg-white rounded-xl border border-outline-variant/30 overflow-hidden fade-in shadow-sm">
                    <table class="w-full text-left border-collapse">
                        <tbody class="divide-y divide-outline-variant/20">
            \`;

            if(catSpecs.length === 0) {
                html += \`<tr><td class="py-8 text-center text-outline text-sm italic">No specialities added yet.</td></tr>\`;
            } else {
                catSpecs.forEach(spec => {
                    html += \`
                        <tr class="hover:bg-[#F8F9FF] transition-colors">
                            <td class="py-3 px-4 w-12">
                                <div class="w-10 h-10 rounded-lg bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a]">
                                    <span class="material-symbols-outlined text-[20px]">\${spec.icon || 'medical_services'}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4">
                                <div class="font-bold text-[#121c2a] text-[15px]">\${spec.name}</div>
                                <div class="text-[12px] text-[#757682] truncate max-w-[200px]">\${spec.shortDescription}</div>
                            </td>
                            <td class="py-3 px-4 text-right">
                                <button onclick="window.editSpeciality('\${spec.id}')" class="text-primary hover:bg-primary/10 p-2 rounded transition-colors"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                                <button onclick="window.deleteSpeciality('\${spec.id}')" class="text-error hover:bg-error/10 p-2 rounded transition-colors ml-1"><span class="material-symbols-outlined text-[20px]">delete</span></button>
                            </td>
                        </tr>
                    \`;
                });
            }

            html += \`
                        </tbody>
                    </table>
                </div>
            \`;
        }
        else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            
            html += \`
                <div class="flex items-center gap-4 mb-8 fade-in pb-6 border-b border-outline-variant/20">
                    <button onclick="window.navigate('category_edit', '\${spec.categoryId}')" class="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center text-outline hover:text-primary hover:border-primary/50 transition-colors bg-[#F8F9FA]">
                        <span class="material-symbols-outlined">arrow_back</span>
                    </button>
                    <div>
                        <h2 class="text-[24px] font-bold text-[#121c2a] leading-tight mb-1">Edit Speciality</h2>
                        <p class="text-[13px] text-[#757682]">Modify the details of this specific medical service.</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-10 fade-in flex-1">
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Speciality Name</label>
                        <input type="text" value="\${spec.name}" oninput="window.updateSpeciality('\${spec.id}', 'name', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Parent Category</label>
                        <select onchange="window.updateSpeciality('\${spec.id}', 'categoryId', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none">
            \`;
            
            state.categories.forEach(c => {
                html += \`<option value="\${c.id}" \${c.id === spec.categoryId ? 'selected' : ''}>\${c.name}</option>\`;
            });

            html += \`
                        </select>
                    </div>
                    
                    <div class="space-y-2 col-span-2">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Short Description</label>
                        <textarea rows="3" oninput="window.updateSpeciality('\${spec.id}', 'shortDescription', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none">\${spec.shortDescription}</textarea>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Material Icon Name</label>
                        <div class="flex gap-2">
                            <div class="w-12 h-12 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant/30 text-primary">
                                <span class="material-symbols-outlined text-[24px]" id="iconPreview">\${spec.icon}</span>
                            </div>
                            <input type="text" value="\${spec.icon}" oninput="window.updateSpeciality('\${spec.id}', 'icon', this.value); document.getElementById('iconPreview').textContent = this.value;" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none font-mono text-sm" placeholder="e.g. cardiology">
                        </div>
                        <p class="text-[11px] text-outline mt-1">Google Material Symbols identifier.</p>
                    </div>

                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Thumbnail Image (Optional)</label>
                        <div class="border-2 border-dashed border-outline-variant/50 rounded-lg h-12 flex items-center justify-center text-outline hover:bg-[#F8F9FF] transition-colors cursor-pointer text-sm font-medium">
                            <span class="material-symbols-outlined text-[18px] mr-2">upload</span> Upload Image
                        </div>
                    </div>

                    <div class="space-y-2 col-span-2 flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 bg-[#F8F9FA] mt-4">
                        <div>
                            <div class="font-bold text-[#121c2a] text-[15px]">Speciality Visibility</div>
                            <div class="text-[13px] text-[#757682]">Toggle whether this appears under its category.</div>
                        </div>
                        <div class="relative inline-block w-[42px] h-[24px] transition duration-200 ease-in-out">
                            <input \${spec.status ? 'checked' : ''} onchange="window.updateSpeciality('\${spec.id}', 'status', this.checked)" class="opacity-0 w-0 h-0 peer" id="specStatusToggle" type="checkbox"/>
                            <label class="absolute top-0 left-0 right-0 bottom-0 bg-outline-variant/30 rounded-full cursor-pointer peer-checked:bg-[#10B981] transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[18px]" for="specStatusToggle"></label>
                        </div>
                    </div>
                </div>
            \`;
        }

        container.innerHTML = html;
    }

    function renderRightPanel() {
        const container = document.getElementById('previewScrollArea');
        let html = '';

        // If in listing view, show a generic "All Specialities" overview
        if (state.view === 'listing') {
            html += \`
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 text-center fade-in">
                    <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">BHAKTIVEDANTA HOSPITAL</p>
                    <h1 class="text-[32px] font-bold mb-4 leading-tight">Our Specialities</h1>
                    <p class="opacity-80 text-[15px] max-w-[400px] mx-auto">Comprehensive healthcare services delivered with compassion and excellence.</p>
                </div>
                <div class="p-8 fade-in">
                    <div class="space-y-12">
            \`;
            
            state.categories.filter(c => c.status).sort((a,b) => a.order - b.order).forEach(cat => {
                const specs = state.specialities.filter(s => s.categoryId === cat.id && s.status);
                html += \`
                    <div>
                        <h2 class="text-[20px] font-bold text-[#121c2a] mb-6 flex items-center gap-3">
                            <span class="w-1.5 h-6 bg-secondary rounded-full"></span> \${cat.name}
                        </h2>
                        <div class="grid grid-cols-2 gap-4">
                \`;
                specs.forEach(spec => {
                    html += \`
                            <div class="bg-white border border-outline-variant/20 p-4 rounded-xl shadow-sm flex items-start gap-3">
                                <div class="w-10 h-10 rounded-full bg-[#F8F9FF] text-primary flex items-center justify-center shrink-0">
                                    <span class="material-symbols-outlined text-[20px]">\${spec.icon || 'medical_services'}</span>
                                </div>
                                <div>
                                    <h3 class="font-bold text-[#121c2a] text-[14px] leading-tight mb-1">\${spec.name}</h3>
                                </div>
                            </div>
                    \`;
                });
                if(specs.length === 0) {
                    html += \`<div class="col-span-2 text-outline text-sm italic">Coming soon...</div>\`;
                }
                html += \`</div></div>\`;
            });

            html += \`</div></div>\`;
        } 
        else {
            // Edit views show the specific Category page
            let catId = state.view === 'category_edit' ? state.activeCategoryId : 
                        state.specialities.find(s => s.id === state.activeSpecialityId).categoryId;
            
            const cat = state.categories.find(c => c.id === catId);
            const specs = state.specialities.filter(s => s.categoryId === cat.id);
            
            html += \`
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden">
                    <div class="absolute inset-0 bg-[#0A235C]/50 z-10"></div>
                    <div class="relative z-20">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-3">DEPARTMENT</p>
                        <h1 class="text-[32px] font-bold mb-4 leading-tight drop-shadow-md">\${cat.name}</h1>
                        <p class="opacity-90 text-[15px] max-w-[400px] leading-relaxed">\${cat.description}</p>
                    </div>
                </div>
                <div class="p-8 fade-in bg-[#F8F9FA] min-h-[400px]">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            \`;

            specs.forEach(spec => {
                const isEditing = state.view === 'speciality_edit' && spec.id === state.activeSpecialityId;
                const highlightClass = isEditing ? 'ring-2 ring-secondary shadow-lg scale-[1.02] bg-white' : 'border-outline-variant/20 hover:shadow-md bg-white opacity-90';
                
                html += \`
                    <div class="border p-5 rounded-2xl transition-all duration-300 \${highlightClass} \${!spec.status ? 'opacity-40 grayscale' : ''}">
                        <div class="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                            <span class="material-symbols-outlined text-[24px]">\${spec.icon || 'medical_services'}</span>
                        </div>
                        <h3 class="font-bold text-[#121c2a] text-[16px] mb-2 leading-tight">\${spec.name}</h3>
                        <p class="text-[#757682] text-[13px] leading-relaxed">\${spec.shortDescription}</p>
                        \${!spec.status ? '<div class="mt-3 text-[10px] font-bold text-error uppercase">Hidden</div>' : ''}
                    </div>
                \`;
            });

            if(specs.length === 0) {
                html += \`<div class="col-span-2 text-center py-10 text-outline border-2 border-dashed border-outline-variant/30 rounded-2xl">No specialities populated.</div>\`;
            }

            html += \`</div></div>\`;
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
        state.specialities.push({ id, categoryId, name: 'New Speciality', icon: 'medical_services', shortDescription: '', status: true });
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

    // Initialize
    document.addEventListener('DOMContentLoaded', render);
</script>
</body>
</html>`;

fs.writeFileSync('src/Admin Panel html code/specialities.html', htmlContent);
console.log('Successfully wrote specialities.html');
