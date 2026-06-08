const fs = require('fs');

const file = 'src/Admin Panel html code/add-service.html';
let html = fs.readFileSync(file, 'utf8');

// 1. Basic Details: Add Slug next to Service Name
html = html.replace(
`<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="font-label-lg text-label-lg text-on-surface">Service Name</label>
<input class="w-full p-3 rounded-lg border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 transition-all" id="serviceName" placeholder="e.g. Cardiology &amp; Heart Surgery" required="" type="text"/>
</div>
<div class="space-y-2">
<label class="font-label-lg text-label-lg text-on-surface">Service Category</label>
<select class="w-full p-3 rounded-lg border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 transition-all" id="serviceCategory">
<option>Clinical</option>
<option>Emergency</option>
<option>Diagnostics</option>
<option>Surgical</option>
<option>Rehabilitation</option>
</select>
</div>
</div>`,
`<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="font-label-lg text-label-lg text-on-surface">Service Name</label>
<input class="w-full p-3 rounded-lg border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 transition-all" id="serviceName" placeholder="e.g. Holistic Wellness" required="" type="text"/>
</div>
<div class="space-y-2">
<label class="font-label-lg text-label-lg text-on-surface">Slug</label>
<input class="w-full p-3 rounded-lg border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 transition-all" id="serviceSlug" placeholder="e.g. holistic-wellness" type="text" readonly/>
<p class="text-[10px] text-outline-variant">Auto-generated from Service Name</p>
</div>
</div>`
);

// Add JS for Slug auto-generation
html = html.replace(`previewName.textContent = e.target.value || 'New Service';`,
`previewName.textContent = e.target.value || 'New Service';
            document.getElementById('serviceSlug').value = (e.target.value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');`);


// 2. Add Order Number to initial Section and JS
html = html.replace(
`<input type="text" class="section-title-input w-2/3 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title (e.g. Key Procedures)" value="Key Procedures">`,
`<input type="text" class="section-title-input w-1/2 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title (e.g. Overview)" value="Overview">
 <input type="number" class="section-order-input w-1/4 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Order (e.g. 1)" value="1">`
);

html = html.replace(
`<input type="text" class="section-title-input w-2/3 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title">`,
`<input type="text" class="section-title-input w-1/2 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Section Title">
 <input type="number" class="section-order-input w-1/4 p-2 rounded border-outline-variant bg-surface focus:ring-2 focus:ring-primary/20 text-body-sm" placeholder="Order">`
);

// 3. Redesign Live Preview Panel (Removing "Mockup Card" boundaries, making it look like a full page inside the sidebar)
html = html.replace(
`<!-- Mockup Card -->
<div class="bg-white rounded-2xl overflow-hidden shadow-xl shadow-primary-container/5 border border-outline-variant/10 group">
<div class="relative h-48 overflow-hidden">
<img alt="Service Preview" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" data-alt="A modern hospital cardiology department hallway with state-of-the-art medical monitors and soft blue ambient lighting. The atmosphere is pristine, calm, and high-tech, showcasing the latest in surgical equipment and patient care. The visual style is professional with a shallow depth of field, focusing on the sophisticated clinical environment and high-quality healthcare standards." id="previewBanner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLAoeSlQtKhMD9LXkIACIsndoruO7VMm6UI1GOVnJOtV2WBQMJcojL5EI_QSGSPz0xjP81PDnINd7BJ0fhD_M_Me5aRNOofMvWO6tMaNQkyW_6pzg7AblhLO6Tu-Le7SPFkPlfSlJkvyEGOYSj8MywpVn1zIacr3BuP7MMFmThhgTyNVpwibgJb_SuJssZ7dNwjowXRJ5hSsdJ4MhKJANgHgvYhncoMel8saLAGR20jk7k-i8obRR12RFQRITLo90hxilOIr6yBX8"/>
<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
<div class="absolute bottom-4 left-4 flex items-center gap-3">
<div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
<span class="material-symbols-outlined text-white text-[28px]" id="previewIcon">cardiology</span>
</div>
<div class="text-white">
<span class="text-[10px] uppercase font-bold tracking-widest opacity-80" id="previewCat">CLINICAL</span>
<h4 class="font-headline-md text-headline-md leading-tight" id="previewName">Heart Care</h4>
</div>
</div>
</div>
<div class="p-5 space-y-4">
<p class="text-body-sm text-on-surface-variant line-clamp-2" id="previewShortDesc">Comprehensive cardiac diagnostic and surgical solutions for all age groups provided by world-class specialists.</p>
<div id="previewSectionsContainer"></div>
<div class="flex items-center justify-between pt-4 mt-2 border-t border-outline-variant/10">
<div class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined text-[18px]">schedule</span>
<span class="font-label-sm text-label-sm">24x7 Available</span>
</div>
<button class="bg-primary text-on-primary text-[12px] px-4 py-2 rounded-full font-bold uppercase tracking-wider">Book Now</button>
</div>
</div>
</div>`,
`<!-- Full Page Style Mockup -->
<div class="bg-white rounded-lg overflow-hidden shadow-sm border border-outline-variant/20 flex flex-col h-[600px] custom-scrollbar overflow-y-auto">
<div class="relative h-32 shrink-0">
<img alt="Service Banner Preview" class="w-full h-full object-cover" id="previewBanner" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLAoeSlQtKhMD9LXkIACIsndoruO7VMm6UI1GOVnJOtV2WBQMJcojL5EI_QSGSPz0xjP81PDnINd7BJ0fhD_M_Me5aRNOofMvWO6tMaNQkyW_6pzg7AblhLO6Tu-Le7SPFkPlfSlJkvyEGOYSj8MywpVn1zIacr3BuP7MMFmThhgTyNVpwibgJb_SuJssZ7dNwjowXRJ5hSsdJ4MhKJANgHgvYhncoMel8saLAGR20jk7k-i8obRR12RFQRITLo90hxilOIr6yBX8"/>
<div class="absolute inset-0 bg-black/40"></div>
<div class="absolute inset-0 flex flex-col justify-center px-6">
<h4 class="font-headline-md text-[22px] text-white font-bold leading-tight drop-shadow-md" id="previewName">Holistic Wellness</h4>
</div>
</div>
<div class="p-6 flex-1 bg-surface-bright space-y-6">
<div>
<p class="text-body-md text-on-surface-variant leading-relaxed" id="previewShortDesc">Service summary description will appear here...</p>
</div>
<div id="previewSectionsContainer" class="space-y-6"></div>
</div>
</div>`
);

// Update Live Preview JS to render sections properly
html = html.replace(
`<div class="mt-4 border-t border-outline-variant/10 pt-4">
                            <h5 class="font-label-lg text-primary mb-2">\${title}</h5>
                            <p class="text-[11px] text-on-surface-variant leading-relaxed">\${content}</p>
                        </div>`,
`<div>
                            <h3 class="font-headline-md text-lg text-primary mb-3 font-semibold">\${title}</h3>
                            <p class="text-body-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">\${content}</p>
                        </div>`
);

// 4. Phase 5: Service Detail Architecture
// Injecting JSON data model mock
const jsonModel = `
    <!-- PHASE 5: Service Detail Architecture (Mock implementation for future backend integration) -->
    <script>
        const serviceDataModel = {
            serviceName: "",
            slug: "",
            status: "Active",
            thumbnail: "",
            banner: "",
            sections: [
                /* Example:
                {
                    title: "Overview",
                    content: "...",
                    image: "",
                    order: 1
                }
                */
            ]
        };

        // Example function to extract current form data to match the architecture
        function getServiceData() {
            const sections = [];
            document.querySelectorAll('.section-card').forEach(card => {
                sections.push({
                    title: card.querySelector('.section-title-input').value,
                    content: card.querySelector('.section-content-input').value,
                    order: parseInt(card.querySelector('.section-order-input').value) || 1,
                    image: "" // Handle image upload path later
                });
            });

            return {
                serviceName: document.getElementById('serviceName').value,
                slug: document.getElementById('serviceSlug').value,
                status: document.getElementById('statusToggle').checked ? 'Active' : 'Inactive',
                thumbnail: "", // Handle from dropzone
                banner: "", // Handle from dropzone
                sections: sections
            };
        }
    </script>
`;

html = html.replace('</body></html>', jsonModel + '\n</body></html>');

fs.writeFileSync(file, html);
console.log('add-service.html updated successfully.');
