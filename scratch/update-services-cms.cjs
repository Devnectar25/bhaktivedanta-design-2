const fs = require('fs');

const file = 'src/Admin Panel html code/services.html';
let html = fs.readFileSync(file, 'utf8');

// Update Table Headers
html = html.replace(/<thead class="bg-surface-container-low border-b border-outline-variant">[\s\S]*?<\/thead>/, `<thead class="bg-surface-container-low border-b border-outline-variant">
<tr>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant w-24">Thumbnail</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant">Service Name</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant">Slug</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant text-center">Total Sections</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant text-center">Status</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant">Last Updated</th>
<th class="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant text-right">Actions</th>
</tr>
</thead>`);

// Replace Table Body
const newBody = `<tbody class="divide-y divide-outline-variant">
<!-- Row 1: Holistic Wellness -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">self_improvement</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">Holistic Wellness</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Integrative healthcare combining modern medicine with traditional practices.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/holistic-wellness</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">5</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm font-label-sm">Active</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Today, 10:45 AM</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

<!-- Row 2: ISKCON Devotees Healthcare -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">diversity_1</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">ISKCON Devotees Healthcare Services</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Specialized healthcare services tailored for the ISKCON devotee community.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/iskcon-healthcare</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">3</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm font-label-sm">Active</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Yesterday, 02:30 PM</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

<!-- Row 3: Palliative Care -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">volunteer_activism</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">Palliative Care</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Compassionate end-of-life care and symptom management.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/palliative-care</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">4</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-label-sm font-label-sm">Draft</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Oct 28, 2023</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

<!-- Row 4: Community Services -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">groups</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">Community Services</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Outreach programs and medical camps for rural and underserved areas.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/community-services</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">6</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm font-label-sm">Active</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Oct 15, 2023</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

<!-- Row 5: Garbha Samskar -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">pregnant_woman</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">Garbha Samskar</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Ayurvedic prenatal education and holistic pregnancy care.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/garbha-samskar</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">2</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm font-label-sm">Active</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Oct 05, 2023</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

<!-- Row 6: Speech & Audiology -->
<tr class="hover:bg-surface-container-lowest transition-colors group">
<td class="px-6 py-4">
<div class="w-16 h-12 rounded bg-surface-container-high flex items-center justify-center text-primary/50">
<span class="material-symbols-outlined text-[24px]">hearing</span>
</div>
</td>
<td class="px-6 py-4">
<div class="flex flex-col">
<span class="font-label-lg text-label-lg text-on-surface">Speech & Audiology</span>
<span class="text-label-sm text-on-surface-variant line-clamp-1 max-w-[250px]">Comprehensive hearing assessments and speech therapy.</span>
</div>
</td>
<td class="px-6 py-4 font-body-sm text-on-surface-variant">/speech-audiology</td>
<td class="px-6 py-4 text-center font-label-lg text-primary">3</td>
<td class="px-6 py-4 text-center">
<span class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-label-sm font-label-sm">Active</span>
</td>
<td class="px-6 py-4 text-label-sm text-on-surface-variant">Sep 28, 2023</td>
<td class="px-6 py-4">
<div class="flex items-center justify-end gap-2">
<button class="p-2 text-on-surface-variant hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View"><span class="material-symbols-outlined text-[20px]">visibility</span></button>
<button class="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary/5 rounded-lg transition-all" title="Edit"><span class="material-symbols-outlined text-[20px]">edit</span></button>
<button class="p-2 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-lg transition-all" title="Delete"><span class="material-symbols-outlined text-[20px]">delete</span></button>
</div>
</td>
</tr>

</tbody>`;

html = html.replace(/<tbody class="divide-y divide-outline-variant">[\s\S]*?<\/tbody>/, newBody);

// Update Showing text
html = html.replace('Showing 1 to 5 of 42 services', 'Showing 1 to 6 of 6 services');

fs.writeFileSync(file, html);
console.log('services.html updated successfully.');
