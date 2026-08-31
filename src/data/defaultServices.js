export function ensureStandardServiceTabs(srv) {
  const standardTabs = [
    { id: 't1', title: 'Overview', content: `<p>Welcome to our ${srv.name} services. We are dedicated to providing compassionate care and advanced treatments tailored to patient needs.</p>`, images: [] },
    { id: 't2', title: 'Services', content: `<p>We offer a comprehensive suite of clinical services and diagnostic evaluations under ${srv.name}.</p>`, images: [] },
    { id: 't3', title: 'Facilities', content: `<p>Our department is equipped with state-of-the-art medical technology and comfortable care rooms.</p>`, images: [] },
    { id: 't4', title: 'Patient Testimonials', content: `<p>Read inspiring stories and feedback from patients who recovered through our ${srv.name} services.</p>`, images: [] },
    { id: 't5', title: 'Photo Gallery', content: `<p>Take a virtual tour of our facilities, equipment, and medical care areas.</p>`, images: [] }
  ];

  if (!srv.tabs || srv.tabs.length === 0) {
    srv.tabs = standardTabs;
  }
}

export const defaultServicesState = {
  categories: [
    { id: 'c1', name: 'Healthcare Services', description: 'Specialized medical and clinical healthcare services.', status: true, order: 1, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' },
    { id: 'c2', name: '24*7', description: '24/7 round-the-clock emergency, diagnostic, and support services.', status: true, order: 2, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-10T10:00:00.000Z', updatedAt: '2025-01-10T10:00:00.000Z' }
  ],
  services: [
    // Healthcare Services (c1)
    { id: 'srv1', categoryId: 'c1', name: 'wHolistic Wellness', icon: 'self_improvement', shortDescription: 'Integrative therapies combining modern science with ancient wisdom.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv2', categoryId: 'c1', name: 'ISKCON Devotees Healthcare Services', icon: 'diversity_1', shortDescription: 'Customized healthcare packages and support desk for ISKCON devotees.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv3', categoryId: 'c1', name: 'Palliative Care', icon: 'volunteer_activism', shortDescription: 'Compassionate care for patients with life-limiting serious illnesses.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv4', categoryId: 'c1', name: 'Community Services', icon: 'groups', shortDescription: 'Free diagnostic camps, mobile clinics, and rural community clinics.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv5', categoryId: 'c1', name: 'Garbha Samskar', icon: 'pregnant_woman', shortDescription: 'Holistic prenatal therapy and education for healthy spiritual pregnancy.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv6', categoryId: 'c1', name: 'Swaasthya : The Organic Shop', icon: 'store', shortDescription: 'Pure organic foods, grains, natural remedies, and health products.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv7', categoryId: 'c1', name: 'Optical Shop', icon: 'visibility', shortDescription: 'High quality spectacles, contact lenses, and frame fitting facility.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv8', categoryId: 'c1', name: 'Speech & Audiology', icon: 'hearing', shortDescription: 'Specialized speech assessments, hearing aid fittings, and therapies.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv9', categoryId: 'c1', name: 'Dialysis Unit', icon: 'water_drop', shortDescription: 'Advanced hemodialysis, clean RO water systems, and 24/7 emergency support.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv10', categoryId: 'c1', name: 'Nursing Department', icon: 'medical_services', shortDescription: 'Compassionate, round-the-clock professional clinical nursing care.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },

    // 24*7 Services (c2)
    { id: 'srv11', categoryId: 'c2', name: 'Trauma & Emergency Centre', icon: 'siren', shortDescription: '24/7 emergency response, fully equipped crash carts, and trauma doctors.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv12', categoryId: 'c2', name: 'Ambulance', icon: 'airport_shuttle', shortDescription: '24/7 fully equipped advanced cardiac life support ambulance fleet.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv13', categoryId: 'c2', name: 'Pathology', icon: 'biotech', shortDescription: '24/7 highly precise diagnostic blood test and pathology lab.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv14', categoryId: 'c2', name: 'Radiology', icon: 'settings_overscan', shortDescription: '24/7 advanced CT scans, X-rays, MRI, and ultrasonography.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv15', categoryId: 'c2', name: 'Pharmacy', icon: 'local_pharmacy', shortDescription: '24/7 genuine prescription medicines, drugs, and healthcare products.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' },
    { id: 'srv16', categoryId: 'c2', name: 'Blood Storage Centre', icon: 'bloodtype', shortDescription: '24/7 authenticated blood storage, cross-matching, and typing facility.', status: true, adminId: 'ADM-001', adminName: 'Super Administrator', createdAt: '2025-01-15T09:30:00.000Z', updatedAt: '2025-01-15T09:30:00.000Z' }
  ]
};

defaultServicesState.services.forEach(ensureStandardServiceTabs);
