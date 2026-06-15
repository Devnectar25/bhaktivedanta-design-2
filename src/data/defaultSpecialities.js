export function ensureStandardTabs(spec) {
  const standardTabs = [
    { id: 't1', title: 'Overview', content: `<p>Welcome to the ${spec.name} department. We provide comprehensive care and support tailored to each patient's needs.</p>`, images: [] },
    { id: 't2', title: 'Why Choose Us', content: `<p>Our ${spec.name} department stands out for its experienced professionals, modern equipment, and dedicated compassionate care.</p>`, images: [] },
    { id: 't3', title: 'Technology & Infrastructure', content: `<p>We utilize advanced diagnostics and treatment facilities to deliver high-quality, precise clinical results in ${spec.name}.</p>`, images: [] },
    { id: 't4', title: 'Services', content: `<p>We offer a wide range of inpatient and outpatient services under ${spec.name} to cater to diverse medical requirements.</p>`, images: [] },
    { id: 't5', title: 'Our Experts', content: `<p>Meet our leading specialist physicians and support staff who work together to ensure your well-being.</p>`, images: [] }
  ];

  if (!spec.tabs || spec.tabs.length === 0) {
    spec.tabs = standardTabs;
  } else {
    const currentOverview = spec.tabs.find(t => t.title === 'Overview' || t.id === 't1');
    let overviewContent = `<p>Welcome to the ${spec.name} department. We provide comprehensive care and support tailored to each patient's needs.</p>`;
    
    if (currentOverview) {
      if (currentOverview.content) {
        overviewContent = currentOverview.content;
      } else if (currentOverview.blocks && currentOverview.blocks[0]) {
        overviewContent = `<p>${currentOverview.blocks[0].content}</p>`;
      } else if (spec.shortDescription) {
        overviewContent = `<p>${spec.shortDescription}</p>`;
      }
    }

    spec.tabs = [
      { id: 't1', title: 'Overview', content: overviewContent, images: currentOverview?.images || [] },
      { id: 't2', title: 'Why Choose Us', content: (spec.tabs.find(t => t.title === 'Why Choose Us' || t.id === 't2')?.content) || standardTabs[1].content, images: (spec.tabs.find(t => t.title === 'Why Choose Us' || t.id === 't2')?.images) || [] },
      { id: 't3', title: 'Technology & Infrastructure', content: (spec.tabs.find(t => t.title === 'Technology & Infrastructure' || t.id === 't3')?.content) || standardTabs[2].content, images: (spec.tabs.find(t => t.title === 'Technology & Infrastructure' || t.id === 't3')?.images) || [] },
      { id: 't4', title: 'Services', content: (spec.tabs.find(t => t.title === 'Services' || t.id === 't4')?.content) || standardTabs[3].content, images: (spec.tabs.find(t => t.title === 'Services' || t.id === 't4')?.images) || [] },
      { id: 't5', title: 'Our Experts', content: (spec.tabs.find(t => t.title === 'Our Experts' || t.id === 't5')?.content) || standardTabs[4].content, images: (spec.tabs.find(t => t.title === 'Our Experts' || t.id === 't5')?.images) || [] }
    ];
  }
}

export const defaultSpecialitiesState = {
  view: 'listing',
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

// Ensure standard tabs for fallback data
defaultSpecialitiesState.specialities.forEach(ensureStandardTabs);
