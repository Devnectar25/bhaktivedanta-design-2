const fs = require('fs');
let content = fs.readFileSync('scratch/build-specialities-v3.cjs', 'utf8');

// 1. Update mock data array
const specStart = content.indexOf('specialities: [');
const specEnd = content.indexOf(']', specStart) + 1;

const newSpecialities = `specialities: [
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
                        content: '<p class="mb-4">Our operating theaters are equipped with the latest technology to ensure patient safety.</p><ul><li>Advanced Anesthesia Workstations with integrated ventilators</li><li>Continuous invasive and non-invasive hemodynamic monitoring</li><li>Target Controlled Infusion (TCI) pumps for precise drug delivery</li><li>Point-of-care ultrasound (POCUS) for regional anesthesia</li></ul>',
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
            { id: 's2', categoryId: 'c1', name: 'Critical Care', bannerImage: '', thumbnailImage: '', status: true, tabs: [{id: 't1', title: 'Overview', content: '24/7 intensive care for life-threatening conditions.', images: []}] },
            { id: 's3', categoryId: 'c1', name: 'Dermatology & Venereology', bannerImage: '', thumbnailImage: '', status: true, tabs: [{id: 't1', title: 'Overview', content: 'Expert care for skin, hair, and nail disorders.', images: []}] },
            { id: 's4', categoryId: 'c1', name: 'Dentistry', bannerImage: '', thumbnailImage: '', status: true, tabs: [{id: 't1', title: 'Overview', content: 'Comprehensive dental care and oral surgery.', images: []}] },
            { id: 's5', categoryId: 'c1', name: 'E.N.T', bannerImage: '', thumbnailImage: '', status: true, tabs: [{id: 't1', title: 'Overview', content: 'Advanced treatment for ear, nose, and throat issues.', images: []}] },
            { id: 's6', categoryId: 'c1', name: 'General Medicine', bannerImage: '', thumbnailImage: '', status: true, tabs: [{id: 't1', title: 'Overview', content: 'Primary care and management of adult diseases.', images: []}] }
        ]`;
content = content.substring(0, specStart) + newSpecialities + content.substring(specEnd);


fs.writeFileSync('scratch/build-specialities-v3.cjs', content);
console.log("Mock data patched!");
