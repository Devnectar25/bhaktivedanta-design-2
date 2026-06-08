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

            <div id="previewSidebar" class="w-full lg:w-[40%] shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col h-[calc(100vh-100px)] sticky top-0 transition-all duration-300">
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
        activeTabId: 't1',
        categories: [
            { id: 'c1', name: 'General Specialities', description: 'Comprehensive general healthcare services for everyday medical needs.', status: true, order: 1 },
            { id: 'c2', name: 'Super Specialities', description: 'Advanced medical treatments and interventions by expert specialists.', status: true, order: 2 },
            { id: 'c3', name: 'Centres Of Excellence', description: 'World-class multidisciplinary care centres providing specialized treatments.', status: true, order: 3 },
            { id: 'c4', name: 'Alternative Medicine & Therapy', description: 'Holistic approaches to healing, integrating traditional and natural therapies.', status: true, order: 4 }
        ],
        specialities: [
            { 
                id: 's1', 
                categoryId: 'c1', 
                name: 'Anesthesiology', 
                bannerImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
                thumbnailImage: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
                status: true, 
                tabs: [
                    {
                        id: 't1', 
                        title: 'Overview', 
                        content: '<p class="mb-4">Anesthesiology at Bhaktivedanta Hospital is dedicated to providing safe, effective, and compassionate care to patients undergoing surgical procedures. Our highly skilled team of anesthesiologists ensures optimal pain management and critical life support before, during, and after surgery.</p><p>We utilize state-of-the-art monitoring equipment and follow international safety protocols to minimize risks and ensure a smooth recovery for every patient.</p>',
                        images: []
                    },
                    {
                        id: 't2', 
                        title: 'Why Choose Us', 
                        content: '<ul class="list-disc pl-5 space-y-2 mb-4"><li><strong>Expert Team:</strong> Board-certified anesthesiologists with decades of combined experience.</li><li><strong>Advanced Technology:</strong> Equipped with modern anesthesia workstations and multiparameter monitors.</li><li><strong>Comprehensive Care:</strong> Pre-anesthetic check-ups (PAC) to assess patient fitness and tailor anesthesia plans.</li><li><strong>Pain Management:</strong> Specialized postoperative pain relief techniques, including epidural and nerve blocks.</li></ul>',
                        images: []
                    },
                    {
                        id: 't3', 
                        title: 'Technology & Infrastructure', 
                        content: '<p class="mb-4">Our operating theaters are equipped with the latest technology to ensure patient safety.</p><ul class="list-disc pl-5 space-y-1"><li>Advanced Anesthesia Workstations with integrated ventilators</li><li>Continuous invasive and non-invasive hemodynamic monitoring</li><li>Target Controlled Infusion (TCI) pumps for precise drug delivery</li><li>Point-of-care ultrasound (POCUS) for regional anesthesia</li></ul>',
                        images: ['https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=1000&auto=format&fit=crop']
                    },
                    {
                        id: 't4', 
                        title: 'Services', 
                        content: '<p>We provide a wide range of anesthesia services, including:</p><ul class="list-disc pl-5 space-y-1 mt-2"><li>General Anesthesia</li><li>Regional Anesthesia (Spinal, Epidural, Nerve Blocks)</li><li>Monitored Anesthesia Care (MAC)</li><li>Labor Analgesia (Painless Delivery)</li><li>Pediatric and Geriatric Anesthesia</li></ul>',
                        images: []
                    },
                    {
                        id: 't5', 
                        title: 'Our Experts', 
                        content: '<p class="mb-4">Meet our dedicated team of anesthesiology specialists who ensure your safety and comfort.</p><div class="grid grid-cols-2 gap-4"><div class="border p-4 rounded-lg"><h4 class="font-bold text-[#1e3a8a]">Dr. A. Sharma</h4><p class="text-sm text-[#757682]">Head of Anesthesiology</p></div><div class="border p-4 rounded-lg"><h4 class="font-bold text-[#1e3a8a]">Dr. R. Patel</h4><p class="text-sm text-[#757682]">Senior Consultant</p></div></div>',
                        images: []
                    }
                ] 
            },
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

    function updateBreadcrumbs() {
        const tail = document.getElementById('breadcrumb-tail');
        const current = document.getElementById('breadcrumb-current');
        if (!tail || !current) return;
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
                <div class="flex items-center justify-between mb-8 fade-in">
                    <h2 class="text-[32px] font-bold text-[#121c2a] tracking-tight">Manage Categories</h2>
                    <button onclick="window.createCategory()" class="bg-[#E67E22] hover:bg-[#D35400] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-md shadow-[#E67E22]/20 flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[18px]">add</span> Add Category
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 fade-in">
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-center">
                        <p class="text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Total Categories</p>
                        <h3 class="text-[36px] font-bold text-primary leading-none">\${state.categories.length}</h3>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-center">
                        <p class="text-[12px] font-bold text-outline uppercase tracking-wider mb-2">Total Specialities</p>
                        <h3 class="text-[36px] font-bold text-primary leading-none">\${state.specialities.length}</h3>
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
            \`;
            
            state.categories.sort((a,b) => a.order - b.order).forEach(cat => {
                const specCount = state.specialities.filter(s => s.categoryId === cat.id).length;
                html += \`
                            <tr class="hover:bg-[#F8F9FF] transition-colors group">
                                <td class="py-5 px-6">
                                    <div class="flex items-center gap-4">
                                        <div class="w-10 h-10 rounded-lg bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a] shrink-0 border border-[#1e3a8a]/10">
                                            <span class="material-symbols-outlined text-[20px]">folder</span>
                                        </div>
                                        <div>
                                            <div class="font-bold text-[#e67e22] text-[16px] cursor-pointer hover:underline mb-0.5" onclick="window.editCategory('\${cat.id}')">\${cat.name}</div>
                                            <div class="text-[13px] text-[#757682]">\${cat.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-5 px-6 text-center">
                                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1e3a8a]/5 text-[#1e3a8a] font-bold text-[13px]">\${specCount}</span>
                                </td>
                                <td class="py-5 px-6 text-center">
                                    <span class="px-3 py-1 rounded-full text-[11px] font-bold \${cat.status ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-outline-variant/20 text-outline'}">
                                        \${cat.status ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td class="py-5 px-6 text-[13px] text-[#757682] font-medium">12 Oct 2023</td>
                                <td class="py-5 px-6 text-right">
                                    <div class="flex justify-end gap-2">
                                        <button class="text-[#1e3a8a] hover:bg-[#1e3a8a]/10 p-1.5 rounded transition-colors" title="View"><span class="material-symbols-outlined text-[18px]">visibility</span></button>
                                        <button onclick="window.editCategory('\${cat.id}')" class="text-[#1e3a8a] hover:bg-[#1e3a8a]/10 p-1.5 rounded transition-colors" title="Edit"><span class="material-symbols-outlined text-[18px]">edit</span></button>
                                        <button class="text-error hover:bg-error/10 p-1.5 rounded transition-colors" title="Delete"><span class="material-symbols-outlined text-[18px]">delete</span></button>
                                    </div>
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
                        <tr class="hover:bg-[#F8F9FF] transition-colors cursor-pointer group" onclick="window.editSpeciality('\${spec.id}')">
                            <td class="py-3 px-4 w-12">
                                <div class="w-10 h-10 rounded-lg bg-[#1e3a8a]/5 flex items-center justify-center text-[#1e3a8a] group-hover:bg-[#1e3a8a]/10 transition-colors">
                                    <span class="material-symbols-outlined text-[20px]">\${spec.icon || 'medical_services'}</span>
                                </div>
                            </td>
                            <td class="py-3 px-4">
                                <div class="font-bold text-[#1e3a8a] text-[15px] group-hover:underline">\${spec.name}</div>
                                <div class="text-[12px] text-[#757682] truncate max-w-[200px]">\${spec.shortDescription}</div>
                            </td>
                            <td class="py-3 px-4 text-right">
                                <button onclick="event.stopPropagation(); window.deleteSpeciality('\${spec.id}')" class="text-error hover:bg-error/10 p-2 rounded transition-colors ml-1"><span class="material-symbols-outlined text-[20px]">delete</span></button>
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
                        <p class="text-[13px] text-[#757682]">Modify basic details and build the content page.</p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-6 mb-8 fade-in border border-outline-variant/30 p-6 rounded-2xl bg-[#F8F9FA]">
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Speciality Name</label>
                        <input type="text" value="\${spec.name}" oninput="window.updateSpeciality('\${spec.id}', 'name', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Category</label>
                        <select onchange="window.updateSpeciality('\${spec.id}', 'categoryId', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none">
            \`;
            
            state.categories.forEach(c => {
                html += \`<option value="\${c.id}" \${c.id === spec.categoryId ? 'selected' : ''}>\${c.name}</option>\`;
            });

            html += \`
                        </select>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Banner Image</label>
                        <div class="flex gap-2">
                            <input type="text" value="\${spec.bannerImage || ''}" oninput="window.updateSpeciality('\${spec.id}', 'bannerImage', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm" placeholder="URL or upload image...">
                            <button class="bg-surface-variant border border-outline-variant/30 rounded-lg px-4 hover:bg-surface-container transition-colors"><span class="material-symbols-outlined text-[20px] text-primary">upload</span></button>
                        </div>
                    </div>
                    
                    <div class="space-y-2 col-span-2 md:col-span-1">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Thumbnail Image</label>
                        <div class="flex gap-2">
                            <input type="text" value="\${spec.thumbnailImage || ''}" oninput="window.updateSpeciality('\${spec.id}', 'thumbnailImage', this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-[#444651] focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm" placeholder="URL or upload image...">
                            <button class="bg-surface-variant border border-outline-variant/30 rounded-lg px-4 hover:bg-surface-container transition-colors"><span class="material-symbols-outlined text-[20px] text-primary">upload</span></button>
                        </div>
                    </div>

                    <div class="space-y-2 col-span-2 flex items-center justify-between mt-2 pt-6 border-t border-outline-variant/20">
                        <div>
                            <div class="font-bold text-[#121c2a] text-[15px]">Status</div>
                            <div class="text-[13px] text-[#757682]">Toggle whether this speciality is active on the website.</div>
                        </div>
                        <div class="relative inline-block w-[42px] h-[24px] transition duration-200 ease-in-out">
                            <input \${spec.status ? 'checked' : ''} onchange="window.updateSpeciality('\${spec.id}', 'status', this.checked)" class="opacity-0 w-0 h-0 peer" id="specStatusToggle" type="checkbox"/>
                            <label class="absolute top-0 left-0 right-0 bottom-0 bg-outline-variant/30 rounded-full cursor-pointer peer-checked:bg-[#10B981] transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[18px]" for="specStatusToggle"></label>
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
            \`;
        }

        container.innerHTML = html;
        if(state.view === "speciality_edit") { setTimeout(window.renderTabsOnly, 0); setTimeout(window.renderEditorArea, 0); }
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

        else if (state.view === 'speciality_edit') {
            const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
            const cat = state.categories.find(c => c.id === spec.categoryId);
            
            const bannerStyle = spec.bannerImage ? \`style="background-image: url('\${spec.bannerImage}'); background-size: cover; background-position: center;"\` : '';
            
            html += \`
                <div class="bg-[#1e3a8a] text-white p-8 lg:p-12 fade-in relative overflow-hidden shrink-0 min-h-[250px] flex flex-col justify-end" \${bannerStyle}>
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0A235C] via-[#0A235C]/80 to-transparent z-10"></div>
                    <div class="relative z-20">
                        <div class="flex items-center gap-2 text-[11px] font-bold tracking-widest text-[#90a8ff] uppercase mb-4">
                            <span>Home</span>
                            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span>\${cat ? cat.name : 'Category'}</span>
                            <span class="material-symbols-outlined text-[14px]">chevron_right</span>
                            <span class="text-white">\${spec.name}</span>
                        </div>
                        <p class="text-[10px] font-bold tracking-[0.2em] text-white/70 uppercase mb-2">SPECIALITY</p>
                        <h1 class="text-[36px] font-bold mb-2 leading-tight drop-shadow-lg">\${spec.name}</h1>
                    </div>
                </div>
                
                <!-- Preview Tabs -->
                <div class="bg-white border-b border-outline-variant/20 px-8 pt-4 flex gap-6 overflow-x-auto custom-scrollbar sticky top-0 z-30 shadow-sm" id="previewTabs">
                    <!-- Dynamic Tabs -->
                </div>
                
                <div class="p-8 fade-in bg-white min-h-[400px] relative">
                    <div id="previewAllSectionsContainer" class="w-full max-w-[800px] mx-auto">
                        <!-- Dynamic Preview Content -->
                    </div>
                </div>
            \`;
        }
        else if (state.view === 'category_edit') {
            const cat = state.categories.find(c => c.id === state.activeCategoryId);
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
                const highlightClass = 'border-outline-variant/20 hover:shadow-md bg-white opacity-90';
                
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

        html += \`
            <div class="bg-[#121c2a] text-white p-6 mt-auto shrink-0 border-t border-outline-variant/20">
                <div class="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-[#90a8ff]">local_hospital</span>
                        <span class="font-bold text-[13px] tracking-wider">BHAKTIVEDANTA</span>
                    </div>
                    <div class="text-[#90a8ff] text-[11px] font-medium tracking-widest uppercase">
                        Care with Compassion
                    </div>
                </div>
                <div class="flex justify-between items-end">
                    <p class="text-[10px] text-white/50">&copy; 2024 Bhaktivedanta Hospital.<br>All rights reserved.</p>
                    <div class="flex gap-3">
                        <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors"><span class="material-symbols-outlined text-[12px]">call</span></div>
                        <div class="w-6 h-6 rounded bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors"><span class="material-symbols-outlined text-[12px]">mail</span></div>
                    </div>
                </div>
            </div>
        \`;

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
        spec.tabs.push({ id: newId, title: title, content: '', images: [] });
        state.activeTabId = newId;
        renderTabsOnly();
        renderPreviewSections();
        renderEditorArea();
        
        const builderTabs = document.getElementById('builderTabs');
        if (builderTabs) setTimeout(() => { builderTabs.scrollTo({ left: builderTabs.scrollWidth, behavior: 'smooth' }); }, 50);
    };

    window.updateTabContent = function(val) {
        const spec = state.specialities.find(s => s.id === state.activeSpecialityId);
        const activeTab = spec.tabs.find(t => t.id === state.activeTabId);
        if(activeTab) {
            activeTab.content = val;
            renderPreviewSections();
        }
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
        
        html += \`
            <div class="bg-white border border-outline-variant/30 rounded-2xl shadow-sm p-8 fade-in relative">
                <div class="absolute top-6 right-6">
                    <button onclick="window.deleteTab()" class="text-error hover:bg-error/10 px-3 py-1.5 rounded text-sm font-medium transition-colors border border-transparent hover:border-error/20 flex items-center gap-1.5"><span class="material-symbols-outlined text-[18px]">delete</span> Delete Tab</button>
                </div>
                
                <div class="space-y-6 max-w-3xl">
                    <div class="space-y-2">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Tab Name</label>
                        <input type="text" value="\${activeTab.title}" oninput="window.updateTabTitle(this.value)" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-bold focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Content</label>
                        <div class="border border-outline-variant/50 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <div class="bg-[#F8F9FA] px-3 py-2 border-b border-outline-variant/50 flex items-center gap-2">
                                <button class="p-1 hover:bg-outline-variant/30 rounded text-outline"><span class="material-symbols-outlined text-[18px]">format_bold</span></button>
                                <button class="p-1 hover:bg-outline-variant/30 rounded text-outline"><span class="material-symbols-outlined text-[18px]">format_italic</span></button>
                                <div class="w-px h-4 bg-outline-variant/50 mx-1"></div>
                                <button class="p-1 hover:bg-outline-variant/30 rounded text-outline"><span class="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                                <button class="p-1 hover:bg-outline-variant/30 rounded text-outline"><span class="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
                                <div class="w-px h-4 bg-outline-variant/50 mx-1"></div>
                                <button class="p-1 hover:bg-outline-variant/30 rounded text-outline"><span class="material-symbols-outlined text-[18px]">link</span></button>
                            </div>
                            <textarea rows="10" oninput="window.updateTabContent(this.value)" class="w-full p-4 border-none text-[#444651] outline-none custom-scrollbar resize-y text-sm leading-relaxed" placeholder="Enter HTML or rich text content here...">\${activeTab.content || ''}</textarea>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <label class="text-[13px] font-bold text-outline uppercase tracking-wider">Images (Optional)</label>
                        <div class="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center hover:bg-[#F8F9FF] transition-colors cursor-pointer flex flex-col items-center justify-center">
                            <span class="material-symbols-outlined text-[32px] text-[#A0ABCB] mb-2">add_photo_alternate</span>
                            <p class="text-sm font-medium text-primary">Upload Images</p>
                            <p class="text-xs text-outline mt-1">PNG, JPG up to 5MB</p>
                        </div>
                    </div>
                </div>
            </div>
        \`;

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
                builderHtml += \`<button onclick="window.setActiveTab('\${tab.id}')" class="\${activeClasses} whitespace-nowrap">\${tab.title}</button>\`;
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
                previewHtml += \`<span onclick="window.setActiveTab('\${tab.id}')" class="\${activeClasses} whitespace-nowrap">\${tab.title}</span>\`;
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
            let html = \`<div id="preview-\${activeTab.id}" class="fade-in">\`;
            
            // Render HTML content
            if (activeTab.content) {
                html += \`<div class="prose prose-sm max-w-none text-[#444651] leading-relaxed mb-8">\${activeTab.content}</div>\`;
            } else {
                html += \`<div class="text-outline italic text-sm mb-8">No content provided for this tab.</div>\`;
            }
            
            // Render images
            if (activeTab.images && activeTab.images.length > 0) {
                html += \`<div class="grid grid-cols-2 gap-4 mt-8">\`;
                activeTab.images.forEach(img => {
                    html += \`<img src="\${img}" class="w-full h-48 object-cover rounded-xl shadow-sm border border-outline-variant/20">\`;
                });
                html += \`</div>\`;
            }
            
            html += \`</div>\`;
            container.innerHTML = html;
        } else {
            container.innerHTML = \`<div class="text-center py-10 text-outline">No tabs available</div>\`;
        }
    };

    // Initialize
    document.addEventListener('DOMContentLoaded', render);
</script>
</body>
</html>`;

fs.writeFileSync('src/Admin Panel html code/specialities.html', htmlContent);
console.log('Successfully wrote specialities.html');
