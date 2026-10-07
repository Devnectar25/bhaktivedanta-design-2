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
    id: 'pc-cat-guide',
    name: 'Patient Guide',
    slug: 'patient-guide',
    description: 'Patient guidelines, admission rules, and hospitalization assistance.',
    order: 1,
    status: true,
    max_items: 6,
    maxItems: 6
  },
  {
    id: 'pc-cat-consult',
    name: 'Consultations',
    slug: 'consultations',
    description: 'Doctor consultations, OPD schedules, and patient appointments.',
    order: 2,
    status: true,
    max_items: 6,
    maxItems: 6
  },
  {
    id: 'pc-cat-links',
    name: 'Quick Links',
    slug: 'quick-links',
    description: 'Quick access services, patient reports, feedback, and announcements.',
    order: 3,
    status: true,
    max_items: 6,
    maxItems: 6
  }
];

export const defaultPatientCornerGuides = [];

export function ensureStandardPatientCornerTabs(guide) {
  if (!guide) return;
  const standardTabs = [
    {
      id: 'tab-overview',
      title: 'Overview',
      type: 'rich_text',
      order: 1,
      enabled: true,
      content: '',
      sections: []
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
