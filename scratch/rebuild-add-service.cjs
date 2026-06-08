const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// Replace everything inside the <section> block
const newSectionContent = `<section class="flex-1 overflow-y-auto px-8 pb-8 pt-[88px] bg-[#F8F9FF] custom-scrollbar">
    <!-- Breadcrumbs -->
    <nav class="flex items-center gap-2 mb-6 text-on-surface-variant font-label-sm text-sm">
        <a class="hover:text-primary" href="dashboard.html">Dashboard</a>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <a class="hover:text-primary" href="services.html">Services</a>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-primary font-semibold">Content Builder</span>
    </nav>

    <div class="flex flex-col lg:flex-row gap-6 items-start">
        <!-- Left Column: Service Content Builder -->
        <div class="flex-1 bg-white rounded-2xl shadow-sm border border-outline-variant/10 p-6 md:p-8 flex flex-col min-h-[600px]">
            <!-- Header -->
            <div class="mb-8">
                <h2 class="text-[28px] font-bold text-[#121c2a] mb-2 leading-tight">Service Content Builder</h2>
                <p class="text-[15px] text-[#444651]">Design the service landing page structure and content sections.</p>
            </div>

            <!-- Basic Info -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="space-y-2">
                    <label class="text-[14px] font-medium text-[#444651]">Service Title</label>
                    <input type="text" id="serviceName" value="Holistic Wellness" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-white text-primary font-medium focus:ring-2 focus:ring-primary/20 transition-all outline-none">
                </div>
                <div class="space-y-2">
                    <label class="text-[14px] font-medium text-[#444651]">URL Slug</label>
                    <input type="text" id="serviceSlug" value="/services/holistic-wellness" class="w-full p-3 rounded-lg border border-outline-variant/50 bg-[#F4F6F8] text-[#757682] focus:ring-0 transition-all outline-none" readonly>
                </div>
            </div>

            <!-- Tabbed Navigation -->
            <div class="flex items-center justify-between border-b border-outline-variant/20 mb-8 overflow-x-auto custom-scrollbar pb-1">
                <div class="flex items-center gap-8 min-w-max">
                    <button class="text-primary font-semibold pb-3 border-b-2 border-primary relative top-[1px]">Overview</button>
                    <button class="text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors">How It Works</button>
                    <button class="text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors">Why Choose Us</button>
                    <button class="text-[#757682] font-medium pb-3 border-b-2 border-transparent hover:text-primary transition-colors">Programs</button>
                </div>
                <button class="flex items-center gap-1 border border-primary/20 bg-primary/5 text-primary px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/10 transition-colors whitespace-nowrap ml-4">
                    <span class="material-symbols-outlined text-[18px]">add</span> Add Section
                </button>
            </div>

            <!-- Tab Content (Hero Banner Upload) -->
            <div class="space-y-4 mb-12 flex-1">
                <label class="text-[15px] font-medium text-[#121c2a]">Hero Banner Image</label>
                <div class="border-2 border-dashed border-outline-variant/50 rounded-xl p-10 text-center hover:bg-[#F8F9FF] transition-colors cursor-pointer flex flex-col items-center justify-center">
                    <span class="material-symbols-outlined text-[40px] text-[#A0ABCB] mb-2">add_photo_alternate</span>
                </div>
            </div>

            <!-- Action Bar -->
            <div class="flex items-center justify-between pt-6 border-t border-outline-variant/20 mt-auto">
                <div class="flex items-center gap-3">
                    <div class="relative inline-block w-[42px] h-[24px] transition duration-200 ease-in-out">
                        <input checked class="opacity-0 w-0 h-0 peer" id="statusToggle" type="checkbox"/>
                        <label class="absolute top-0 left-0 right-0 bottom-0 bg-outline-variant/30 rounded-full cursor-pointer peer-checked:bg-[#10B981] transition-all duration-300 before:content-[''] before:absolute before:h-[18px] before:w-[18px] before:left-[3px] before:bottom-[3px] before:bg-white before:rounded-full before:transition-all peer-checked:before:translate-x-[18px]" for="statusToggle"></label>
                    </div>
                    <span class="text-[14px] font-medium text-[#121c2a]">Published</span>
                </div>
                <div class="flex items-center gap-3">
                    <button class="px-5 py-2.5 rounded-lg border border-outline-variant text-[#444651] font-medium text-sm hover:bg-surface-variant transition-colors">Save Draft</button>
                    <button class="px-5 py-2.5 rounded-lg bg-[#F59E0B] text-white font-medium text-sm hover:bg-[#D97706] transition-colors flex items-center gap-2 shadow-md shadow-[#F59E0B]/20">
                        <span class="material-symbols-outlined text-[18px]">cloud_upload</span> Update Content
                    </button>
                </div>
            </div>
        </div>

        <!-- Right Column: Browser Mockup -->
        <div class="w-full lg:w-[480px] xl:w-[600px] shrink-0 bg-white rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 overflow-hidden flex flex-col">
            <!-- Browser Chrome -->
            <div class="bg-[#F8F9FA] px-4 py-3 flex items-center gap-4 border-b border-outline-variant/20">
                <div class="flex items-center gap-1.5 shrink-0">
                    <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div class="flex-1 bg-white border border-outline-variant/20 rounded-md py-1.5 px-3 text-[11px] text-center truncate text-[#757682] mx-4 shadow-sm">
                    bhaktivedantahospital.com<span class="text-primary font-medium">/services/holistic-wel...</span>
                </div>
                <div class="flex items-center gap-2 text-outline shrink-0">
                    <span class="material-symbols-outlined text-[16px]">desktop_mac</span>
                    <span class="material-symbols-outlined text-[16px] opacity-50">smartphone</span>
                </div>
            </div>
            
            <!-- Mockup Content -->
            <div class="flex-1 bg-white relative">
                <!-- Hero Image -->
                <div class="relative h-[280px] w-full bg-[#1e3a8a] overflow-hidden">
                    <!-- Overlay to make it dark blue like screenshot -->
                    <div class="absolute inset-0 bg-[#0A235C]/80 mix-blend-multiply z-10"></div>
                    <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop" class="w-full h-full object-cover absolute inset-0 opacity-40 mix-blend-luminosity" alt="Hospital Hallway">
                    
                    <div class="relative z-20 h-full flex flex-col justify-center px-8 lg:px-12">
                        <p class="text-[10px] font-bold tracking-[0.2em] text-[#90a8ff] uppercase mb-2">SPECIALIZED SERVICE</p>
                        <div class="w-12 h-0.5 bg-[#90a8ff] mb-4"></div>
                        <h1 class="text-[32px] md:text-[40px] font-bold text-white mb-6 leading-tight drop-shadow-md">Holistic Wellness</h1>
                        <button class="bg-[#F59E0B] text-white font-semibold text-sm px-6 py-2.5 rounded-full w-max hover:bg-[#D97706] transition-colors shadow-lg shadow-[#F59E0B]/20">Book Consultation</button>
                    </div>
                </div>

                <!-- Page Content Mockup -->
                <div class="px-8 lg:px-12 pt-6 pb-12">
                    <!-- Mock Nav -->
                    <div class="flex items-center gap-6 border-b border-outline-variant/20 mb-8">
                        <span class="text-[13px] font-bold text-primary pb-3 border-b-2 border-primary relative top-[1px]">Overview</span>
                        <span class="text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent">Process</span>
                        <span class="text-[13px] font-medium text-[#757682] pb-3 border-b-2 border-transparent">Programs</span>
                    </div>

                    <!-- Mock Section Content -->
                    <div class="space-y-4">
                        <div class="flex items-center gap-3 mb-2">
                            <div class="w-8 h-[3px] bg-[#F59E0B] rounded-full"></div>
                            <h3 class="text-[22px] font-bold text-[#1E3A8A]">Overview</h3>
                        </div>
                        <p class="text-[15px] text-[#444651] leading-relaxed">Experience a comprehensive approach to health that integrates physical, mental, and spiritual well-being. Our specialized team creates personalized care plans tailored to your unique needs.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>`;

const sectionRegex = /<section class="flex-1 overflow-y-auto[\s\S]*?<\/section>/;
html = html.replace(sectionRegex, newSectionContent);

// Remove the old script tag at the bottom that had the live preview logic since we've completely rebuilt it
const scriptRegex = /<script>\s*\/\/ Micro-interactions for live preview[\s\S]*?<\/script>/;
html = html.replace(scriptRegex, '');

fs.writeFileSync(file, html);
console.log('add-service.html updated to match the new UI mockup successfully.');
