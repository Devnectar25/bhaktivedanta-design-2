/**
 * Default Patient Corner State Data
 * Structured hierarchical data layer for Patients Corner:
 * Patient Corner → Guide → Tab → Sections → Content
 */

export const TAB_TYPES = {
  RICH_TEXT: 'rich_text',
  STEPS: 'steps',
  CHECKLIST: 'checklist',
  LIST: 'list',
  CARDS: 'cards',
  GALLERY: 'gallery',
  FAQ: 'faq',
  TESTIMONIALS: 'testimonials',
  LOGO_GRID: 'logo_grid'
};

export const SECTION_TYPES = {
  RICH_TEXT: 'rich_text',
  FEATURE_LIST: 'feature_list',
  ACCORDION: 'accordion',
  STEPS: 'steps',
  CARDS: 'cards',
  CHECKLIST: 'checklist',
  GALLERY: 'gallery',
  FAQ: 'faq',
  TABLE: 'table',
  LOGO_GRID: 'logo_grid'
};

export const defaultPatientCornerCategories = [
  {
    id: 'cat-inpatient',
    name: 'Inpatient Guide',
    slug: 'inpatient-guide',
    description: 'Guidelines and instructions for admitted patients and their families.',
    order: 1,
    status: true,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'cat-visitor',
    name: 'Visitor Rules',
    slug: 'visitor-rules',
    description: 'Visiting hours, ICU guidelines, and hospital visitor policies.',
    order: 2,
    status: true,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z'
  },
  {
    id: 'cat-billing',
    name: 'Billing Help',
    slug: 'billing-help',
    description: 'Insurance, cashless claims, and billing department procedures.',
    order: 3,
    status: true,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'cat-discharge',
    name: 'Discharge Process',
    slug: 'discharge-process',
    description: 'Step-by-step discharge protocol, summary handover, and post-discharge care.',
    order: 4,
    status: true,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z'
  }
];

export const defaultPatientCornerGuides = [
  {
    id: 'pc-1',
    categoryId: 'cat-inpatient',
    category: 'Inpatient Guide',
    title: 'Admission',
    slug: 'admission',
    shortDescription: 'Comprehensive guide covering inpatient admission protocols, room accommodation, billing formalities, and discharge.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 1,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-pc1-1',
        title: 'Admission Process',
        type: 'steps',
        order: 1,
        enabled: true,
        content: '<p>Welcome to Bhaktivedanta Hospital & Research Institute. Our admission desk assists patients and families with seamless inpatient admission.</p>',
        steps: [
          { step: 1, title: 'Doctor Recommendation', description: 'Obtain an admission note or prescription from the treating consultant doctor.' },
          { step: 2, title: 'Registration & Verification', description: 'Present identity proof, insurance documents, and complete the admission form at the admission desk.' },
          { step: 3, title: 'Room Selection & Deposit', description: 'Choose available room category and complete initial admission formalities.' },
          { step: 4, title: 'Ward Transfer', description: 'Nursing staff escorts the patient to the designated room or ward.' }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-adm-1',
            title: 'Admission Workflow',
            type: 'steps',
            order: 1,
            enabled: true,
            content: '<p>Welcome to Bhaktivedanta Hospital & Research Institute. Our admission desk assists patients and families with seamless inpatient admission.</p>',
            steps: [
              { step: 1, title: 'Doctor Recommendation', description: 'Obtain an admission note or prescription from the treating consultant doctor.' },
              { step: 2, title: 'Registration & Verification', description: 'Present identity proof, insurance documents, and complete the admission form at the admission desk.' },
              { step: 3, title: 'Room Selection & Deposit', description: 'Choose available room category and complete initial admission formalities.' },
              { step: 4, title: 'Ward Transfer', description: 'Nursing staff escorts the patient to the designated room or ward.' }
            ],
            items: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc1-2',
        title: 'Accommodation',
        type: 'checklist',
        order: 2,
        enabled: true,
        content: '<p>Our inpatient accommodations are designed to provide a quiet, clean, and spiritually uplifting environment for speedy recovery.</p>',
        steps: [],
        items: [
          { text: 'General Ward, Twin Sharing Semi-Private, and Single Private Deluxe room options', checked: true, note: 'Room categories' },
          { text: 'One designated attendant pass provided per admitted patient', checked: true, note: 'Attendant policy' },
          { text: '24/7 central nurse call station and dedicated resident doctor coverage', checked: true, note: 'Clinical support' },
          { text: 'Nutritious pure vegetarian meals planned by certified clinical dietitians', checked: true, note: 'Dietary service' },
          { text: 'Daily housekeeping and rigorous hospital infection control protocols', checked: true, note: 'Hygiene standard' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-acc-1',
            title: 'Economy & Day Care',
            type: 'rich_text',
            order: 1,
            enabled: true,
            content: '<p>Economical inpatient beds and dedicated day care units for short-stay procedures, dialysis, and chemotherapy treatments under continuous clinical supervision.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-2',
            title: 'Deluxe Room',
            type: 'rich_text',
            order: 2,
            enabled: true,
            content: '<p>Spacious single-occupancy air-conditioned private room with attached bathroom, patient entertainment TV, attendant couch, and personalized dietary service.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-3',
            title: 'AC Triple Sharing',
            type: 'rich_text',
            order: 3,
            enabled: true,
            content: '<p>Air-conditioned room shared by three patients with individual privacy curtains, central nurse call system, and dedicated bedside locker facilities.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-4',
            title: 'AC Twin Sharing',
            type: 'rich_text',
            order: 4,
            enabled: true,
            content: '<p>Semi-private air-conditioned room shared between two patients with privacy partitions, attendant seating, and television.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-5',
            title: 'AC Multiple Sharing',
            type: 'rich_text',
            order: 5,
            enabled: true,
            content: '<p>Comfortable, sanitized general ward setting with air conditioning, centralized oxygen/suction ports, and 24/7 nursing station monitoring.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-6',
            title: 'AC First Class',
            type: 'rich_text',
            order: 6,
            enabled: true,
            content: '<p>Individual private room with air conditioning, attached washroom, sofa for attendant, and priority doctor rounds.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-7',
            title: 'Suite',
            type: 'rich_text',
            order: 7,
            enabled: true,
            content: '<p>Premium healthcare suite comprising a patient recovery room, separate attendant living lounge, dining area, refrigerator, and dedicated nurse attention.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-acc-8',
            title: 'Premium',
            type: 'rich_text',
            order: 8,
            enabled: true,
            content: '<p>Top-tier inpatient accommodations with upgraded amenities, peaceful ambiance, and personalized care coordination.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc1-3',
        title: 'Billing',
        type: 'steps',
        order: 3,
        enabled: true,
        content: '<p>The TPA and Insurance Helpdesk facilitates pre-authorization and cashless claim processing for empanelled insurance providers.</p>',
        steps: [
          { step: 1, title: 'Pre-Authorization Request', description: 'Submit TPA / Health Insurance card and pre-authorization request form 48 hours prior for planned admission, or within 24 hours of emergency admission.' },
          { step: 2, title: 'Insurer Approval', description: 'TPA/Insurance provider verifies coverage and sends initial approval amount.' },
          { step: 3, title: 'Final Bill Settlement', description: 'Upon discharge, final bill and medical records are sent to TPA for final authorization.' }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-bill-1',
            title: 'Charges for Indoor Patients',
            type: 'rich_text',
            order: 1,
            enabled: true,
            content: '<p>Inpatient room tariffs, consultant visit fees, investigation charges, and nursing care are billed as per standardized hospital tariff schedules based on the chosen room category.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-bill-2',
            title: 'Mode of Payment',
            type: 'rich_text',
            order: 2,
            enabled: true,
            content: '<p>Payments can be made via UPI, Debit/Credit Cards, Net Banking, Demand Drafts, Cash (as per statutory limits), or cashless authorization through empanelled TPAs and insurance partners.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-bill-3',
            title: 'Transfer of Patient',
            type: 'rich_text',
            order: 3,
            enabled: true,
            content: '<p>When a patient transfers from one room category to another (e.g. Ward to ICU or Single Room to Deluxe), applicable billing tariffs transition from the effective time of transfer as per hospital policy.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          },
          {
            id: 'sec-bill-4',
            title: 'Refund',
            type: 'rich_text',
            order: 4,
            enabled: true,
            content: '<p>Any excess advance deposit remaining after final bill settlement is processed for refund to the original payment mode or bank account within statutory banking timelines.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc1-4',
        title: 'Discharge',
        type: 'steps',
        order: 4,
        enabled: true,
        content: '<p>Our streamlined discharge workflow ensures all summaries, reports, and medication instructions are handed over smoothly.</p>',
        steps: [
          { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
          { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
          { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
          { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-disch-1',
            title: 'Discharge Workflow',
            type: 'steps',
            order: 1,
            enabled: true,
            content: '<p>Our streamlined discharge workflow ensures all summaries, reports, and medication instructions are handed over smoothly.</p>',
            steps: [
              { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
              { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
              { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
              { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
            ],
            items: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      }
    ]
  },
  {
    id: 'pc-rights',
    categoryId: 'cat-inpatient',
    category: 'Inpatient Guide',
    title: 'Patients Rights & Responsibilities',
    slug: 'patients-rights-responsibilities',
    shortDescription: 'Core values of ethical care, patient privacy, informed consent, and responsibilities.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 2,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-pcr-1',
        title: 'Patient Rights',
        type: 'checklist',
        order: 1,
        enabled: true,
        content: '',
        steps: [],
        items: [
          { text: 'Right to considerate, respectful, and non-discriminatory medical care', checked: true, note: 'Fundamental right' },
          { text: 'Right to receive complete, clear information regarding diagnosis, plan of care, and prognosis', checked: true, note: 'Transparency' },
          { text: 'Right to informed consent prior to any non-emergency procedure or surgery', checked: true, note: 'Autonomy' },
          { text: 'Right to complete confidentiality and privacy of medical records and physical examination', checked: true, note: 'Privacy' },
          { text: 'Right to seek a second opinion and receive itemized billing explanations', checked: true, note: 'Clarity' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-pcr-rights',
            title: 'Charter of Patient Rights',
            type: 'checklist',
            order: 1,
            enabled: true,
            content: '',
            items: [
              { text: 'Right to considerate, respectful, and non-discriminatory medical care', checked: true, note: 'Fundamental right' },
              { text: 'Right to receive complete, clear information regarding diagnosis, plan of care, and prognosis', checked: true, note: 'Transparency' },
              { text: 'Right to informed consent prior to any non-emergency procedure or surgery', checked: true, note: 'Autonomy' },
              { text: 'Right to complete confidentiality and privacy of medical records and physical examination', checked: true, note: 'Privacy' },
              { text: 'Right to seek a second opinion and receive itemized billing explanations', checked: true, note: 'Clarity' }
            ],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pcr-2',
        title: 'Patient Responsibilities',
        type: 'checklist',
        order: 2,
        enabled: true,
        content: '',
        steps: [],
        items: [
          { text: 'Provide accurate, complete medical history and current medication details', checked: true, note: 'Disclosure' },
          { text: 'Follow agreed treatment plan, medical prescriptions, and clinical instructions', checked: true, note: 'Compliance' },
          { text: 'Respect hospital quiet hours, infection control guidelines, and no-smoking policy', checked: true, note: 'Hospital rules' },
          { text: 'Meet financial commitments and complete insurance documentation in a timely manner', checked: true, note: 'Administrative' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-pcr-resp',
            title: 'Patient & Family Responsibilities',
            type: 'checklist',
            order: 1,
            enabled: true,
            content: '',
            items: [
              { text: 'Provide accurate, complete medical history and current medication details', checked: true, note: 'Disclosure' },
              { text: 'Follow agreed treatment plan, medical prescriptions, and clinical instructions', checked: true, note: 'Compliance' },
              { text: 'Respect hospital quiet hours, infection control guidelines, and no-smoking policy', checked: true, note: 'Hospital rules' },
              { text: 'Meet financial commitments and complete insurance documentation in a timely manner', checked: true, note: 'Administrative' }
            ],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pcr-3',
        title: 'FAQs',
        type: 'faq',
        order: 3,
        enabled: true,
        content: '',
        steps: [],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [
          { question: 'Who can I contact if I have questions about my clinical care or rights?', answer: 'You can contact the Patient Relations Officer (PRO) or Nursing Supervisor on duty on your floor.' },
          { question: 'How can I obtain a copy of my medical records after discharge?', answer: 'Submit a formal request along with valid photo ID at the Medical Records Department (MRD) during OPD hours.' }
        ],
        sections: [
          {
            id: 'sec-pcr-faq',
            title: 'Rights & Feedback Questions',
            type: 'faq',
            order: 1,
            enabled: true,
            content: '',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [
              { question: 'Who can I contact if I have questions about my clinical care or rights?', answer: 'You can contact the Patient Relations Officer (PRO) or Nursing Supervisor on duty on your floor.' },
              { question: 'How can I obtain a copy of my medical records after discharge?', answer: 'Submit a formal request along with valid photo ID at the Medical Records Department (MRD) during OPD hours.' }
            ],
            settings: {}
          }
        ]
      }
    ]
  },
  {
    id: 'pc-intl',
    categoryId: 'cat-inpatient',
    category: 'Inpatient Guide',
    title: 'International Patient',
    slug: 'international-patient',
    shortDescription: 'Dedicated assistance for international patients including visa, airport transfer, and language interpretation.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 3,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-intl-1',
        title: 'Overview',
        type: 'rich_text',
        order: 1,
        enabled: true,
        content: '<p>Bhaktivedanta Hospital & Research Institute welcomes patients from across the world. Our International Patient Services desk ensures compassionate, end-to-end support from pre-arrival medical consultation to post-treatment recovery.</p>',
        steps: [],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-intl-overview',
            title: 'Global Patient Care Overview',
            type: 'rich_text',
            order: 1,
            enabled: true,
            content: '<p>Bhaktivedanta Hospital & Research Institute welcomes patients from across the world. Our International Patient Services desk ensures compassionate, end-to-end support from pre-arrival medical consultation to post-treatment recovery.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-intl-2',
        title: 'Services Offered',
        type: 'checklist',
        order: 2,
        enabled: true,
        content: '',
        steps: [],
        items: [
          { text: 'Medical Visa invitation letter and documentation support', checked: true, note: 'Visa Assistance' },
          { text: 'Complimentary airport pickup and drop assistance', checked: true, note: 'Logistics' },
          { text: 'Dedicated relationship manager and language assistance', checked: true, note: 'Personalized care' },
          { text: 'Assistance with nearby hotel/guest house accommodation for attendants', checked: true, note: 'Stay support' },
          { text: 'Tele-consultation follow-up with treating specialists upon return home', checked: true, note: 'Continuous care' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-intl-services',
            title: 'International Patient Care Desk',
            type: 'checklist',
            order: 1,
            enabled: true,
            content: '',
            items: [
              { text: 'Medical Visa invitation letter and documentation support', checked: true, note: 'Visa Assistance' },
              { text: 'Complimentary airport pickup and drop assistance', checked: true, note: 'Logistics' },
              { text: 'Dedicated relationship manager and language assistance', checked: true, note: 'Personalized care' },
              { text: 'Assistance with nearby hotel/guest house accommodation for attendants', checked: true, note: 'Stay support' },
              { text: 'Tele-consultation follow-up with treating specialists upon return home', checked: true, note: 'Continuous care' }
            ],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      }
    ]
  },
  {
    id: 'pc-2',
    categoryId: 'cat-visitor',
    category: 'Visitor Rules',
    title: 'Visiting Hours & ICU Guidelines',
    slug: 'visiting-hours-icu-guidelines',
    shortDescription: 'Guidelines for visitors, permitted visiting timings, ICU protocol, and safety precautions.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 2,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-pc2-1',
        title: 'Visiting Hours',
        type: 'rich_text',
        order: 1,
        enabled: true,
        content: '<p>To ensure a quiet, healing environment for our patients, visitors are requested to follow designated visiting hours.</p>',
        steps: [],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-vis-hours',
            title: 'General Visiting Timings',
            type: 'rich_text',
            order: 1,
            enabled: true,
            content: '<p>To ensure a quiet, healing environment for our patients, visitors are requested to follow designated visiting hours.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc2-2',
        title: 'ICU Guidelines',
        type: 'checklist',
        order: 2,
        enabled: true,
        content: '',
        steps: [],
        items: [
          { text: 'Only 1 visitor permitted at a time in the ICU area', checked: true, note: 'Mandatory' },
          { text: 'Sanitize hands and wear shoe covers/masks before entering ICU', checked: true, note: 'Infection control' },
          { text: 'Mobile phones must be kept on silent mode', checked: true, note: 'Strict silence' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-vis-icu',
            title: 'Intensive Care Unit Entry Protocol',
            type: 'checklist',
            order: 1,
            enabled: true,
            content: '',
            items: [
              { text: 'Only 1 visitor permitted at a time in the ICU area', checked: true, note: 'Mandatory' },
              { text: 'Sanitize hands and wear shoe covers/masks before entering ICU', checked: true, note: 'Infection control' },
              { text: 'Mobile phones must be kept on silent mode', checked: true, note: 'Strict silence' }
            ],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc2-3',
        title: 'Visitor Amenities',
        type: 'cards',
        order: 3,
        enabled: true,
        content: '',
        steps: [],
        items: [],
        cards: [
          { title: 'Cafeteria & Organic Shop', description: 'Fresh, healthy pure vegetarian meals and organic goods on premises.', icon: 'restaurant' },
          { title: 'Spiritual Care Desk', description: 'Counseling and spiritual wellness support for attendants and families.', icon: 'self_improvement' }
        ],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-vis-amenities',
            title: 'Campus Amenities',
            type: 'cards',
            order: 1,
            enabled: true,
            content: '',
            items: [],
            steps: [],
            cards: [
              { title: 'Cafeteria & Organic Shop', description: 'Fresh, healthy pure vegetarian meals and organic goods on premises.', icon: 'restaurant' },
              { title: 'Spiritual Care Desk', description: 'Counseling and spiritual wellness support for attendants and families.', icon: 'self_improvement' }
            ],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      }
    ]
  },
  {
    id: 'pc-3',
    categoryId: 'cat-billing',
    category: 'Billing Help',
    title: 'Empanelled Corporate / TPA / Insurances',
    slug: 'empanelled-corporate-tpa-insurances',
    shortDescription: 'Comprehensive directory of empanelled corporate organizations, health insurance providers, and Third Party Administrators (TPAs) offering cashless hospitalization services.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 3,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-09-15T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-pc3-1',
        title: "List of Corporates / TPA's / Insurance Companies",
        type: 'accordion',
        order: 1,
        enabled: true,
        content: '<p>Bhaktivedanta Hospital & Research Institute is empanelled with leading corporate entities, national and private health insurance companies, and Third Party Administrators (TPAs) to facilitate hassle-free cashless hospitalization and credit services for patients and their beneficiaries.</p>',
        steps: [],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        logos: [],
        sections: [
          {
            id: 'sec-empanelled-accordion',
            title: 'Empanelled Corporate / TPA / Insurance Companies',
            type: 'accordion',
            order: 1,
            enabled: true,
            content: '',
            accordionItems: [
              {
                id: 'acc-item-corp',
                title: 'Corporates',
                contentType: 'logo_grid',
                enabled: true,
                logos: [
                  { id: 'logo-c1', name: 'Tata Consultancy Services (TCS)', imageUrl: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80', order: 1, enabled: true },
                  { id: 'logo-c2', name: 'Larsen & Toubro (L&T)', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80', order: 2, enabled: true },
                  { id: 'logo-c3', name: 'Reliance Industries Limited', imageUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=300&auto=format&fit=crop&q=80', order: 3, enabled: true },
                  { id: 'logo-c4', name: 'Mahindra & Mahindra', imageUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&auto=format&fit=crop&q=80', order: 4, enabled: true },
                  { id: 'logo-c5', name: 'Godrej Group', imageUrl: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&auto=format&fit=crop&q=80', order: 5, enabled: true },
                  { id: 'logo-c6', name: 'Infosys Limited', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80', order: 6, enabled: true }
                ]
              },
              {
                id: 'acc-item-ins',
                title: 'Insurance Company',
                contentType: 'logo_grid',
                enabled: true,
                logos: [
                  { id: 'logo-i1', name: 'Star Health and Allied Insurance', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80', order: 1, enabled: true },
                  { id: 'logo-i2', name: 'HDFC ERGO General Insurance', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80', order: 2, enabled: true },
                  { id: 'logo-i3', name: 'ICICI Lombard General Insurance', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80', order: 3, enabled: true },
                  { id: 'logo-i4', name: 'Bajaj Allianz General Insurance', imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=300&auto=format&fit=crop&q=80', order: 4, enabled: true },
                  { id: 'logo-i5', name: 'Niva Bupa Health Insurance', imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&auto=format&fit=crop&q=80', order: 5, enabled: true },
                  { id: 'logo-i6', name: 'National Insurance Company', imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&auto=format&fit=crop&q=80', order: 6, enabled: true },
                  { id: 'logo-i7', name: 'The New India Assurance Co. Ltd.', imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&auto=format&fit=crop&q=80', order: 7, enabled: true },
                  { id: 'logo-i8', name: 'Oriental Insurance Company', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&auto=format&fit=crop&q=80', order: 8, enabled: true },
                  { id: 'logo-i9', name: 'United India Insurance Co.', imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&auto=format&fit=crop&q=80', order: 9, enabled: true }
                ]
              },
              {
                id: 'acc-item-tpa',
                title: "TPA's (Third Party Administrator)",
                contentType: 'logo_grid',
                enabled: true,
                logos: [
                  { id: 'logo-t1', name: 'Medi Assist Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=300&auto=format&fit=crop&q=80', order: 1, enabled: true },
                  { id: 'logo-t2', name: 'Paramount Health Services & Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&auto=format&fit=crop&q=80', order: 2, enabled: true },
                  { id: 'logo-t3', name: 'MDIndia Health Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=300&auto=format&fit=crop&q=80', order: 3, enabled: true },
                  { id: 'logo-t4', name: 'Vidal Health Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=300&auto=format&fit=crop&q=80', order: 4, enabled: true },
                  { id: 'logo-t5', name: 'Heritage Health Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&auto=format&fit=crop&q=80', order: 5, enabled: true },
                  { id: 'logo-t6', name: 'Raksha Health Insurance TPA', imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&auto=format&fit=crop&q=80', order: 6, enabled: true }
                ]
              }
            ],
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc3-2',
        title: 'Cashless Claim Process',
        type: 'steps',
        order: 2,
        enabled: true,
        content: '',
        steps: [
          { step: 1, title: 'Pre-Authorization Request', description: 'Submit TPA / Health Insurance card and pre-authorization request form 48 hours prior for planned admission, or within 24 hours of emergency admission.' },
          { step: 2, title: 'Insurer Approval', description: 'TPA/Insurance provider verifies coverage and sends initial approval amount.' },
          { step: 3, title: 'Final Bill Settlement', description: 'Upon discharge, final bill and medical records are sent to TPA for final authorization.' }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-cashless-steps',
            title: 'Cashless Claim Workflow',
            type: 'steps',
            order: 1,
            enabled: true,
            content: '',
            items: [],
            steps: [
              { step: 1, title: 'Pre-Authorization Request', description: 'Submit TPA / Health Insurance card and pre-authorization request form 48 hours prior for planned admission, or within 24 hours of emergency admission.' },
              { step: 2, title: 'Insurer Approval', description: 'TPA/Insurance provider verifies coverage and sends initial approval amount.' },
              { step: 3, title: 'Final Bill Settlement', description: 'Upon discharge, final bill and medical records are sent to TPA for final authorization.' }
            ],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc3-3',
        title: 'TPA & Helpdesk Assistance',
        type: 'rich_text',
        order: 3,
        enabled: true,
        content: '<p>The dedicated TPA and Cashless Insurance Helpdesk at Bhaktivedanta Hospital is operational 24/7 on Ground Floor. Our team assists patients with query resolution, pre-authorization, query documentation, and final settlement with insurance providers.</p>',
        steps: [],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-cashless-overview',
            title: 'TPA Desk Assistance',
            type: 'rich_text',
            order: 1,
            enabled: true,
            content: '<p>The dedicated TPA and Cashless Insurance Helpdesk at Bhaktivedanta Hospital is operational 24/7 on Ground Floor. Our team assists patients with query resolution, pre-authorization, query documentation, and final settlement with insurance providers.</p>',
            items: [],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      }
    ]
  },
  {
    id: 'pc-4',
    categoryId: 'cat-discharge',
    category: 'Discharge Process',
    title: 'Discharge Procedure & Post-Care Guidelines',
    slug: 'discharge-procedure-post-care',
    shortDescription: 'Step-by-step discharge workflow, summary handover, take-home medication instructions, and follow-up consultation planning.',
    bannerImage: '',
    status: 'Published',
    displayOrder: 4,
    adminId: 'ADM-001',
    adminName: 'Super Administrator',
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    tabs: [
      {
        id: 'tab-pc4-1',
        title: 'Discharge Workflow',
        type: 'steps',
        order: 1,
        enabled: true,
        content: '',
        steps: [
          { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
          { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
          { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
          { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-disch-steps',
            title: 'Step-by-Step Discharge',
            type: 'steps',
            order: 1,
            enabled: true,
            content: '',
            items: [],
            steps: [
              { step: 1, title: 'Doctor Clearance', description: 'Treating consultant certifies patient readiness for discharge and prepares discharge summary.' },
              { step: 2, title: 'Billing Clearance', description: 'Pharmacy and ward supplies clearance sent to billing desk for final invoice generation.' },
              { step: 3, title: 'Medication Counseling', description: 'Pharmacist and nurse explain discharge medications, dosage schedules, and dietary restrictions.' },
              { step: 4, title: 'Discharge Summary Handover', description: 'Handover of discharge summary, investigation reports, and follow-up appointment date.' }
            ],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      },
      {
        id: 'tab-pc4-2',
        title: 'Post-Discharge Checklist',
        type: 'checklist',
        order: 2,
        enabled: true,
        content: '',
        steps: [],
        items: [
          { text: 'Receive original discharge summary signed by the treating doctor', checked: true, note: 'Essential' },
          { text: 'Collect all diagnostic reports, X-rays, and MRI films', checked: true, note: 'Original records' },
          { text: 'Collect prescribed discharge medications from hospital pharmacy', checked: true, note: 'Medications' },
          { text: 'Note follow-up OPD appointment schedule and emergency contact number', checked: true, note: 'Continuity of care' }
        ],
        cards: [],
        galleryImages: [],
        faqs: [],
        sections: [
          {
            id: 'sec-disch-checklist',
            title: 'Departure Verification',
            type: 'checklist',
            order: 1,
            enabled: true,
            content: '',
            items: [
              { text: 'Receive original discharge summary signed by the treating doctor', checked: true, note: 'Essential' },
              { text: 'Collect all diagnostic reports, X-rays, and MRI films', checked: true, note: 'Original records' },
              { text: 'Collect prescribed discharge medications from hospital pharmacy', checked: true, note: 'Medications' },
              { text: 'Note follow-up OPD appointment schedule and emergency contact number', checked: true, note: 'Continuity of care' }
            ],
            steps: [],
            cards: [],
            galleryImages: [],
            faqs: [],
            settings: {}
          }
        ]
      }
    ]
  }
];

export function ensureStandardPatientCornerTabs(guide) {
  const standardTabs = [
    {
      id: 't1',
      title: 'Overview',
      type: 'rich_text',
      order: 1,
      enabled: true,
      content: `<p>Welcome to ${guide.title || 'Patient Guide'}. Please refer to the guidelines below.</p>`,
      steps: [],
      items: [],
      cards: [],
      galleryImages: [],
      faqs: [],
      sections: [
        {
          id: 'sec-std-overview',
          title: 'Overview',
          type: 'rich_text',
          order: 1,
          enabled: true,
          content: `<p>Welcome to ${guide.title || 'Patient Guide'}. Please refer to the guidelines below.</p>`,
          items: [],
          steps: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          settings: {}
        }
      ]
    },
    {
      id: 't2',
      title: 'Important Guidelines',
      type: 'checklist',
      order: 2,
      enabled: true,
      content: '',
      steps: [],
      items: [
        { text: 'Please carry valid government photo identification and relevant medical records.', checked: true, note: 'Important' }
      ],
      cards: [],
      galleryImages: [],
      faqs: [],
      sections: [
        {
          id: 'sec-std-guidelines',
          title: 'Essential Guidelines',
          type: 'checklist',
          order: 1,
          enabled: true,
          content: '',
          items: [
            { text: 'Please carry valid government photo identification and relevant medical records.', checked: true, note: 'Important' }
          ],
          steps: [],
          cards: [],
          galleryImages: [],
          faqs: [],
          settings: {}
        }
      ]
    }
  ];

  if (!guide.tabs || guide.tabs.length === 0) {
    guide.tabs = standardTabs;
  }

  guide.tabs.forEach(tab => {
    if (!Array.isArray(tab.sections)) {
      tab.sections = [];
    }
  });
}

export const defaultPatientCornerState = {
  categories: defaultPatientCornerCategories,
  guides: defaultPatientCornerGuides
};

defaultPatientCornerState.guides.forEach(ensureStandardPatientCornerTabs);

export default defaultPatientCornerState;
