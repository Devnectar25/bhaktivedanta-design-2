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
    { id: 'c1', name: 'General Specialities', description: 'Comprehensive general healthcare services for everyday medical needs.', status: true, order: 1, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c2', name: 'Super Specialities', description: 'Advanced medical treatments and interventions by expert specialists.', status: true, order: 2, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c3', name: 'Centres Of Excellence', description: 'World-class multidisciplinary care centres providing specialized treatments.', status: true, order: 3, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c4', name: 'Alternative Medicine & Therapy', description: 'Holistic approaches to healing, integrating traditional and natural therapies.', status: true, order: 4, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' }
  ],
  specialities: [
    // General Specialities (c1) - 14 items
    { id: 's1', categoryId: 'c1', name: 'Anesthesiology', icon: 'vaccines', shortDescription: 'Safe pain management and critical life support before, during, and after surgery.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's2', categoryId: 'c1', name: 'Critical Care', icon: 'monitor_heart', shortDescription: '24/7 intensive care monitoring for life-threatening clinical conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's3', categoryId: 'c1', name: 'Dermatology & Venerology', icon: 'dermatology', shortDescription: 'Comprehensive care for skin, hair, nail, and venereal disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's4', categoryId: 'c1', name: 'Dentistry', icon: 'dentistry', shortDescription: 'Advanced oral health, cosmetic dentistry, and maxillo-facial surgery.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's5', categoryId: 'c1', name: 'E.N.T', icon: 'hearing', shortDescription: 'Specialized treatment for ear, nose, throat, head, and neck conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's6', categoryId: 'c1', name: 'General Medicine', icon: 'stethoscope', shortDescription: 'Primary clinical care, chronic disease management, and adult medicine.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's7', categoryId: 'c1', name: 'General & Minimal Access Surgery', icon: 'medical_services', shortDescription: 'Comprehensive laparoscopic, endoscopic, and general surgical care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's8', categoryId: 'c1', name: 'Gynaecology & Obstetrics', icon: 'female', shortDescription: 'Comprehensive women’s health, high-risk maternity, and gynecological surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's9', categoryId: 'c1', name: 'Nutrition & Dietetics', icon: 'nutrition', shortDescription: 'Personalized clinical nutrition, therapeutic diet planning, and wellness.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's10', categoryId: 'c1', name: 'Pain Management', icon: 'healing', shortDescription: 'Multidisciplinary relief procedures for acute and chronic pain conditions.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's11', categoryId: 'c1', name: 'Palliative Care', icon: 'volunteer_activism', shortDescription: 'Compassionate symptom management and supportive care for chronic illness.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's12', categoryId: 'c1', name: 'Psychiatry & Clinical Psychology', icon: 'psychology', shortDescription: 'Comprehensive mental health counseling, therapy, and psychiatric care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's13', categoryId: 'c1', name: 'Rehabilitation', icon: 'accessibility_new', shortDescription: 'Physiotherapy, occupational recovery, and mobility restoration.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's14', categoryId: 'c1', name: 'Rheumatology', icon: 'personal_injury', shortDescription: 'Expert care for autoimmune diseases, arthritis, and joint inflammations.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Super Specialities (c2) - 12 items
    { id: 's15', categoryId: 'c2', name: 'Pulmonology & Sleep Medicine', icon: 'pulmonology', shortDescription: 'Advanced diagnosis and care for complex lung and sleep-disordered breathing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's16', categoryId: 'c2', name: 'Clinical Genetics', icon: 'genetics', shortDescription: 'Genetic counseling, hereditary disease screening, and diagnostic evaluation.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's17', categoryId: 'c2', name: 'Diabetology', icon: 'blood_pressure', shortDescription: 'Comprehensive management of Type 1, Type 2, and gestational diabetes.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's18', categoryId: 'c2', name: 'Integrated Medicine', icon: 'local_pharmacy', shortDescription: 'Combining modern evidence-based therapies with holistic natural healing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's19', categoryId: 'c2', name: 'Endocrinology & Endocrine Surgery', icon: 'health_metrics', shortDescription: 'Treatment for thyroid, hormonal, metabolic, and adrenal gland disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's20', categoryId: 'c2', name: 'Gastroenterology & Gastrosurgery', icon: 'digestive', shortDescription: 'Advanced digestive system treatment and GI endoscopic procedures.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's21', categoryId: 'c2', name: 'Hematology & Hemato-Oncology', icon: 'bloodtype', shortDescription: 'Specialized diagnosis and management of blood and bone marrow diseases.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's22', categoryId: 'c2', name: 'Infectious Disease', icon: 'coronavirus', shortDescription: 'Treatment for complex, tropical, resistant, and hospital-acquired infections.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's23', categoryId: 'c2', name: 'Nephrology', icon: 'kidney', shortDescription: 'Advanced kidney disease management, hemodialysis, and renal care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's24', categoryId: 'c2', name: 'Plastic & Reconstructive Surgery', icon: 'content_cut', shortDescription: 'Reconstructive procedures, burn care, and aesthetic surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's25', categoryId: 'c2', name: 'Vascular & Endovascular Surgery', icon: 'cardiology', shortDescription: 'Minimally invasive endovascular interventions and vascular surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's26', categoryId: 'c2', name: 'Urology', icon: 'water_drop', shortDescription: 'Comprehensive care for urinary tract, kidney stones, and male reproductive health.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Alternative Medicine & Therapy (c4) - 4 items
    { id: 's27', categoryId: 'c4', name: 'Acupuncture', icon: 'healing', shortDescription: 'Traditional precision needle therapy for pain relief and neurological balance.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's28', categoryId: 'c4', name: 'Ayurveda', icon: 'eco', shortDescription: 'Traditional Indian holistic healing, Panchakarma, and wellness therapies.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's29', categoryId: 'c4', name: 'Homeopathy', icon: 'medication', shortDescription: 'Natural remedies tailored for safe, gentle, and effective healing.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's30', categoryId: 'c4', name: 'Yoga', icon: 'self_improvement', shortDescription: 'Therapeutic yoga, pranayama, and meditation for physical and mental health.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // Centres Of Excellence (c3) - 7 items
    { id: 's31', categoryId: 'c3', name: 'Bone & Joint Centre', icon: 'orthopedics', shortDescription: 'World-class joint replacements, trauma care, and orthopedic surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's32', categoryId: 'c3', name: 'Cancer Centre', icon: 'oncology', shortDescription: 'Multidisciplinary medical, surgical, and radiation oncology services.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's33', categoryId: 'c3', name: 'Eye Care Centre', icon: 'visibility', shortDescription: 'State-of-the-art ophthalmology, cataract, retina, and laser vision care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's34', categoryId: 'c3', name: 'Heart Centre', icon: 'favorite', shortDescription: 'Advanced interventional cardiology, heart surgeries, and cardiac ICU.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's35', categoryId: 'c3', name: 'Vascular Interventional Radiology', icon: 'radiology', shortDescription: 'Pinhole image-guided interventions for vascular and tumor treatments.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's36', categoryId: 'c3', name: 'Neurosciences', icon: 'neurology', shortDescription: 'Expert care for brain, spine, stroke, and complex neurological disorders.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 's37', categoryId: 'c3', name: 'Pediatrics & Pediatrics Surgery', icon: 'child_care', shortDescription: 'Comprehensive pediatric care, NICU/PICU, and specialized child surgeries.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' }
  ]
};

// Ensure standard tabs for fallback data
defaultSpecialitiesState.specialities.forEach(ensureStandardTabs);
