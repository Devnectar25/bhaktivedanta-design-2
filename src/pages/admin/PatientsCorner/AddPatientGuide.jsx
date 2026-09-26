import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  getPatientCornerState,
  getPatientCornerGuideById,
  createPatientCornerGuide,
  updatePatientCornerGuide
} from '../../../utils/api';
import { defaultPatientCornerState } from '../../../data/defaultPatientCorner';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';

export const SECTION_TYPES = [
  { type: 'rich_text', label: 'Rich Text / Article', icon: 'article', color: 'blue' },
  { type: 'feature_list', label: 'Feature List (Label: Value)', icon: 'fact_check', color: 'amber' },
  { type: 'accordion', label: 'Expandable Accordion', icon: 'view_agenda', color: 'indigo' },
  { type: 'logo_grid', label: 'Logo Grid / Partners', icon: 'grid_view', color: 'blue' },
  { type: 'steps', label: 'Workflow Steps', icon: 'account_tree', color: 'emerald' },
  { type: 'cards', label: 'Cards / Specialists', icon: 'view_module', color: 'purple' },
  { type: 'checklist', label: 'Checklist / Rules', icon: 'checklist', color: 'teal' },
  { type: 'gallery', label: 'Photo Gallery', icon: 'photo_library', color: 'rose' },
  { type: 'faq', label: 'Frequently Asked Questions (FAQ)', icon: 'help', color: 'cyan' },
  { type: 'table', label: 'Data Table', icon: 'table_chart', color: 'slate' }
];

export const createDefaultSection = (type = 'rich_text', customTitle = '') => {
  const id = `sec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const base = {
    id,
    title: customTitle || 'New Section',
    type,
    order: 1,
    enabled: true,
    collapsed: false,
    settings: {}
  };

  switch (type) {
    case 'rich_text':
      return {
        ...base,
        content: '<p>Enter section narrative and clinical instructions here.</p>',
        items: [],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    case 'feature_list':
      return {
        ...base,
        title: customTitle || 'Room Amenities & Features',
        content: '',
        items: [
          { label: 'Bed for Attendant', value: 'Available on request', enabled: true },
          { label: 'Number of Passes', value: '01 Pass', enabled: true },
          { label: 'Air-Conditioned', value: 'Yes', enabled: true },
          { label: 'Toilet', value: 'Attached Private Bathroom', enabled: true }
        ],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    case 'accordion':
      return {
        ...base,
        title: customTitle || 'Expandable Accordion',
        content: '',
        accordionItems: [
          {
            id: `acc_${Date.now()}_1`,
            title: 'Corporates',
            contentType: 'logo_grid',
            logos: [
              { id: `logo_${Date.now()}_1`, name: 'Corporate Partner 1', imageUrl: '', order: 1, enabled: true }
            ],
            content: '',
            enabled: true
          },
          {
            id: `acc_${Date.now()}_2`,
            title: 'Insurance Company',
            contentType: 'logo_grid',
            logos: [
              { id: `logo_${Date.now()}_2`, name: 'Insurance Provider 1', imageUrl: '', order: 1, enabled: true }
            ],
            content: '',
            enabled: true
          },
          {
            id: `acc_${Date.now()}_3`,
            title: "TPA's (Third Party Administrator)",
            contentType: 'logo_grid',
            logos: [
              { id: `logo_${Date.now()}_3`, name: 'TPA Partner 1', imageUrl: '', order: 1, enabled: true }
            ],
            content: '',
            enabled: true
          }
        ],
        items: [],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: [],
        logos: []
      };

    case 'logo_grid':
      return {
        ...base,
        title: customTitle || 'Company / Partner Logos',
        content: '',
        logos: [
          { id: `logo_${Date.now()}_1`, name: 'Partner Company 1', imageUrl: '', order: 1, enabled: true },
          { id: `logo_${Date.now()}_2`, name: 'Partner Company 2', imageUrl: '', order: 2, enabled: true }
        ],
        items: [],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    case 'steps':
      return {
        ...base,
        title: customTitle || 'Procedure Workflow',
        content: '',
        steps: [
          { step: 1, title: 'Doctor Recommendation', description: 'Obtain admission note from treating consultant.', enabled: true },
          { step: 2, title: 'Registration & Verification', description: 'Present identity and complete admission desk verification.', enabled: true }
        ],
        items: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    case 'cards':
      return {
        ...base,
        title: customTitle || 'Available Facilities & Services',
        content: '',
        cards: [
          { title: 'Inpatient Pharmacy', subtitle: '24/7 Service', description: 'Immediate medication dispatch for admitted patients.', icon: 'local_pharmacy', enabled: true }
        ],
        items: [],
        steps: [],
        galleryImages: [],
        faqs: []
      };

    case 'checklist':
      return {
        ...base,
        title: customTitle || 'Required Documents & Rules',
        content: '',
        items: [
          { text: 'Carry government photo identification proof', note: 'Mandatory', checked: true, enabled: true },
          { text: 'Submit previous medical history & prescription records', note: 'Essential', checked: true, enabled: true }
        ],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    case 'gallery':
      return {
        ...base,
        title: customTitle || 'Room & Ward Gallery',
        content: '',
        galleryImages: [
          { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop', caption: 'Inpatient Room Overview', enabled: true }
        ],
        items: [],
        steps: [],
        cards: [],
        faqs: []
      };

    case 'faq':
      return {
        ...base,
        title: customTitle || 'Common Questions',
        content: '',
        faqs: [
          { question: 'What are the visiting hours for general wards?', answer: 'Visiting hours are 4:00 PM to 7:00 PM daily.', enabled: true }
        ],
        items: [],
        steps: [],
        cards: [],
        galleryImages: []
      };

    case 'table':
      return {
        ...base,
        title: customTitle || 'Tariff Schedule',
        content: '',
        table: {
          headers: ['Room Category', 'Occupancy', 'Daily Tariff', 'Attendant Pass'],
          rows: [
            ['Economy Ward', 'Shared (4-6)', 'Standard Tariff', '1 Pass'],
            ['Twin Sharing', '2 Patients', 'Semi-Private Tariff', '1 Pass'],
            ['Single Deluxe', '1 Patient', 'Deluxe Tariff', '1 Pass + Couch']
          ]
        },
        items: [],
        steps: [],
        cards: [],
        galleryImages: [],
        faqs: []
      };

    default:
      return base;
  }
};

export const createDefaultTab = (customTitle = 'New Tab') => {
  const id = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  return {
    id,
    title: customTitle,
    type: 'rich_text',
    order: 1,
    enabled: true,
    collapsed: false,
    content: '',
    sections: [
      createDefaultSection('rich_text', `${customTitle} Overview`)
    ],
    items: [],
    steps: [],
    cards: [],
    galleryImages: [],
    faqs: []
  };
};

const AddPatientGuide = ({ mode = 'add' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = mode === 'edit' || Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [categories, setCategories] = useState([]);
  const [allGuides, setAllGuides] = useState([]);

  // Form State
  const [guideData, setGuideData] = useState({
    id: '',
    title: '',
    categoryId: 'pc-cat-guide',
    category: 'Patient Guide',
    slug: '',
    shortDescription: '',
    bannerImage: '',
    status: 'Published',
    displayOrder: 1,
    tabs: []
  });

  // Active Tab Index in Builder
  const [activeTabIdx, setActiveTabIdx] = useState(0);

  // Inline Tab Creation State
  const [isAddingTab, setIsAddingTab] = useState(false);
  const [newTabTitle, setNewTabTitle] = useState('');

  // Modal Dialogs State
  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '', type: 'info' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, itemName: '' });

  // Load Data
  const loadFormData = () => {
    getPatientCornerState(defaultPatientCornerState).then((state) => {
      const cats = state?.categories || defaultPatientCornerState.categories || [];
      const gList = state?.guides || defaultPatientCornerState.guides || [];
      setCategories(cats);
      setAllGuides(gList);

      if (isEdit && id) {
        const found = gList.find(g => g.id === id || g.slug === id);
        if (found) {
          setGuideData(prev => ({
            ...prev,
            id: found.id,
            title: found.title || '',
            categoryId: found.categoryId || (cats[0]?.id || 'pc-cat-guide'),
            category: found.category || (cats[0]?.name || 'Patient Guide'),
            slug: found.slug || '',
            shortDescription: found.shortDescription || '',
            bannerImage: found.bannerImage || '',
            status: found.status || 'Published',
            displayOrder: found.displayOrder || 1,
            tabs: Array.isArray(found.tabs) && found.tabs.length > 0
              ? found.tabs.map((t, tIdx) => ({
                ...t,
                order: t.order || (tIdx + 1),
                enabled: t.enabled !== false,
                sections: Array.isArray(t.sections) && t.sections.length > 0
                  ? t.sections.map((s, sIdx) => ({
                    ...s,
                    order: s.order || (sIdx + 1),
                    enabled: s.enabled !== false
                  }))
                  : [createDefaultSection('rich_text', `${t.title || 'Tab'} Content`)]
              }))
              : [createDefaultTab('Overview')]
          }));
        } else {
          setAlertState({
            isOpen: true,
            title: 'Guide Not Found',
            message: `Could not find patient guide with ID: "${id}".`,
            type: 'error'
          });
        }
        setLoading(false);
      } else {
        // Find first category with available slot
        const availableCat = cats.find(c => {
          const count = gList.filter(g => g.categoryId === c.id || g.category_id === c.id).length;
          const maxLimit = c.max_items !== undefined ? c.max_items : (c.maxItems !== undefined ? c.maxItems : 6);
          return count < maxLimit;
        }) || cats[0];

        // Initialize Add Form if title is empty
        setGuideData(prev => {
          if (prev.title) {
            return { ...prev, categoryId: prev.categoryId || availableCat?.id || 'pc-cat-guide' };
          }
          return {
            id: `pc-${Date.now()}`,
            title: '',
            categoryId: availableCat?.id || 'pc-cat-guide',
            category: availableCat?.name || 'Patient Guide',
            slug: '',
            shortDescription: '',
            bannerImage: '',
            status: 'Published',
            displayOrder: (gList.length || 0) + 1,
            tabs: [
              createDefaultTab('Overview'),
              createDefaultTab('Guidelines')
            ]
          };
        });
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadFormData();

    const handleSync = () => {
      loadFormData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [id, isEdit]);

  // Handle Basic Field Updates
  const handleFieldChange = (field, value) => {
    setGuideData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title' && !isEdit && !prev.slug) {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (field === 'categoryId') {
        const matchingCat = categories.find(c => c.id === value);
        if (matchingCat) {
          updated.category = matchingCat.name;
        }
      }
      return updated;
    });
  };

  // Image Upload processor for Guide Banner
  const processImageUpload = (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setAlertState({
        isOpen: true,
        title: 'File Size Exceeded',
        message: 'The selected image exceeds the 10MB limit. Please choose a smaller image file.',
        type: 'warning'
      });
      return;
    }

    setUploadingBanner(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        let res = await fetch('http://localhost:5000/api/patient-corner/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guideTitle: guideData.title || 'patient-guide',
            fileName: file.name,
            base64Data
          })
        });

        if (!res.ok) {
          res = await fetch('http://localhost:5000/api/services/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceName: guideData.title || 'patient-guide',
              fileName: file.name,
              base64Data
            })
          });
        }

        const data = await res.json();
        if (data && data.url) {
          handleFieldChange('bannerImage', data.url);
        } else {
          handleFieldChange('bannerImage', base64Data);
        }
      } catch (err) {
        console.warn('Upload fallback to local base64:', err);
        handleFieldChange('bannerImage', base64Data);
      } finally {
        setUploadingBanner(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // Tab Operations
  // ----------------------------------------------------
  const handleConfirmAddTab = () => {
    if (!newTabTitle || !newTabTitle.trim()) return;

    const newTab = createDefaultTab(newTabTitle.trim());
    newTab.order = guideData.tabs.length + 1;

    setGuideData(prev => ({
      ...prev,
      tabs: [...prev.tabs, newTab]
    }));
    setActiveTabIdx(guideData.tabs.length);
    setNewTabTitle('');
    setIsAddingTab(false);
  };

  const handleUpdateTab = (tabIdx, updates) => {
    setGuideData(prev => {
      const updatedTabs = [...prev.tabs];
      updatedTabs[tabIdx] = { ...updatedTabs[tabIdx], ...updates };
      return { ...prev, tabs: updatedTabs };
    });
  };

  const handleDeleteTab = (tabIdx) => {
    const tabToDelete = guideData.tabs[tabIdx];
    setConfirmModal({
      isOpen: true,
      title: 'Delete Tab?',
      itemName: tabToDelete?.title || `Tab ${tabIdx + 1}`,
      message: 'Are you sure you want to delete this tab and all its nested sections? This cannot be undone.',
      onConfirm: () => {
        setGuideData(prev => {
          const filtered = prev.tabs.filter((_, idx) => idx !== tabIdx).map((t, idx) => ({ ...t, order: idx + 1 }));
          return { ...prev, tabs: filtered };
        });
        setActiveTabIdx(Math.max(0, tabIdx - 1));
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, itemName: '' });
      }
    });
  };

  const handleMoveTab = (tabIdx, direction) => {
    const targetIdx = tabIdx + direction;
    if (targetIdx < 0 || targetIdx >= guideData.tabs.length) return;

    setGuideData(prev => {
      const tabsCopy = [...prev.tabs];
      const temp = tabsCopy[tabIdx];
      tabsCopy[tabIdx] = tabsCopy[targetIdx];
      tabsCopy[targetIdx] = temp;
      const reordered = tabsCopy.map((t, idx) => ({ ...t, order: idx + 1 }));
      return { ...prev, tabs: reordered };
    });
    setActiveTabIdx(targetIdx);
  };

  // ----------------------------------------------------
  // Section Operations
  // ----------------------------------------------------
  const handleAddSection = (tabIdx, type = 'rich_text') => {
    const currentTab = guideData.tabs[tabIdx];
    if (!currentTab) return;

    const typeConfig = SECTION_TYPES.find(st => st.type === type);
    const defaultName = typeConfig ? `${typeConfig.label}` : 'New Section';

    const newSection = createDefaultSection(type, defaultName);
    const existingSections = Array.isArray(currentTab.sections) ? currentTab.sections : [];
    newSection.order = existingSections.length + 1;

    handleUpdateTab(tabIdx, {
      sections: [...existingSections, newSection]
    });
  };

  const handleUpdateSection = (tabIdx, sectionIdx, updates) => {
    const currentTab = guideData.tabs[tabIdx];
    if (!currentTab || !Array.isArray(currentTab.sections)) return;

    const updatedSections = [...currentTab.sections];
    updatedSections[sectionIdx] = { ...updatedSections[sectionIdx], ...updates };
    handleUpdateTab(tabIdx, { sections: updatedSections });
  };

  const handleDeleteSection = (tabIdx, sectionIdx) => {
    const currentTab = guideData.tabs[tabIdx];
    const section = currentTab?.sections?.[sectionIdx];

    setConfirmModal({
      isOpen: true,
      title: 'Delete Section?',
      itemName: section?.title || `Section ${sectionIdx + 1}`,
      message: 'Are you sure you want to remove this section from the tab?',
      onConfirm: () => {
        const filtered = currentTab.sections
          .filter((_, idx) => idx !== sectionIdx)
          .map((s, idx) => ({ ...s, order: idx + 1 }));
        handleUpdateTab(tabIdx, { sections: filtered });
        setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, itemName: '' });
      }
    });
  };

  const handleMoveSection = (tabIdx, sectionIdx, direction) => {
    const currentTab = guideData.tabs[tabIdx];
    if (!currentTab || !Array.isArray(currentTab.sections)) return;

    const targetIdx = sectionIdx + direction;
    if (targetIdx < 0 || targetIdx >= currentTab.sections.length) return;

    const sectionsCopy = [...currentTab.sections];
    const temp = sectionsCopy[sectionIdx];
    sectionsCopy[sectionIdx] = sectionsCopy[targetIdx];
    sectionsCopy[targetIdx] = temp;

    const reordered = sectionsCopy.map((s, idx) => ({ ...s, order: idx + 1 }));
    handleUpdateTab(tabIdx, { sections: reordered });
  };

  // ----------------------------------------------------
  // Save Handler
  // ----------------------------------------------------
  const handleSave = async (e) => {
    if (e) e.preventDefault();

    // Validations
    if (!guideData.title || !guideData.title.trim()) {
      setAlertState({ isOpen: true, title: 'Validation Error', message: 'Guide Title is required.', type: 'error' });
      return;
    }

    if (!guideData.tabs || guideData.tabs.length === 0) {
      setAlertState({ isOpen: true, title: 'Validation Error', message: 'At least one tab is required in the guide.', type: 'error' });
      return;
    }

    for (let tIdx = 0; tIdx < guideData.tabs.length; tIdx++) {
      const tab = guideData.tabs[tIdx];
      if (!tab.title || !tab.title.trim()) {
        setAlertState({ isOpen: true, title: 'Validation Error', message: `Tab #${tIdx + 1} has an empty title.`, type: 'error' });
        return;
      }

      if (!tab.sections || tab.sections.length === 0) {
        setAlertState({ isOpen: true, title: 'Validation Error', message: `Tab "${tab.title}" must contain at least one section.`, type: 'error' });
        return;
      }

      for (let sIdx = 0; sIdx < tab.sections.length; sIdx++) {
        const sec = tab.sections[sIdx];
        if (!sec.title || !sec.title.trim()) {
          setAlertState({ isOpen: true, title: 'Validation Error', message: `Section #${sIdx + 1} in tab "${tab.title}" has an empty title.`, type: 'error' });
          return;
        }
      }
    }

    // Capacity validation
    const targetCat = categories.find(c => c.id === guideData.categoryId);
    const maxLimit = targetCat?.max_items !== undefined ? targetCat.max_items : (targetCat?.maxItems !== undefined ? targetCat.maxItems : 6);
    const existingCount = allGuides.filter(g => (g.categoryId === guideData.categoryId || g.category_id === guideData.categoryId) && g.id !== guideData.id).length;

    if (existingCount >= maxLimit) {
      setAlertState({
        isOpen: true,
        title: 'Category Limit Reached',
        message: `Is category me already ${maxLimit} guides hain (maximum limit). Pehle koi guide hatao ya dusri category chuno.`,
        type: 'error'
      });
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await updatePatientCornerGuide(guideData.id, guideData);
      } else {
        await createPatientCornerGuide(guideData);
      }

      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));

      setAlertState({
        isOpen: true,
        title: 'Saved Successfully',
        message: `Patient guide "${guideData.title}" has been saved with all tabs and nested sections.`,
        type: 'success'
      });

      setTimeout(() => {
        navigate('/admin/patients-corner');
      }, 800);
    } catch (err) {
      console.error('Error saving guide:', err);
      setAlertState({
        isOpen: true,
        title: 'Save Error',
        message: err.message || 'Failed to save patient guide.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-500 text-sm">
        <span className="material-symbols-outlined animate-spin text-3xl text-amber-500 mr-3">progress_activity</span>
        <span>Loading Patient Guide Builder...</span>
      </div>
    );
  }

  const currentTab = guideData.tabs[activeTabIdx] || guideData.tabs[0];

  return (
    <div className="space-y-6 pb-20 font-sans max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/patients-corner"
            className="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
            title="Back to Guides List"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </Link>
          <div>
            <nav className="flex items-center gap-2 text-slate-400 text-xs font-medium">
              <span>Dashboard</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span>Patients Corner</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-slate-700 font-bold">{isEdit ? 'Edit Guide' : 'New Guide'}</span>
            </nav>
            <h2 className="text-xl font-bold text-slate-800">
              {guideData.title ? guideData.title : (isEdit ? 'Edit Patient Guide' : 'Create Patient Guide')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/patients-corner"
            className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{saving ? 'Saving...' : 'Save Patient Guide'}</span>
          </button>
        </div>
      </div>

      {/* Guide Basic Metadata */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <span className="material-symbols-outlined text-amber-500">menu_book</span>
            <span>Guide Information</span>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
              <span>Status:</span>
              <select
                value={guideData.status}
                onChange={(e) => handleFieldChange('status', e.target.value)}
                className="border border-slate-200 rounded-md px-2 py-1 text-xs font-bold outline-none bg-slate-50 cursor-pointer"
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Guide Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g. Admission, Visitor Rules"
              value={guideData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Category <span className="text-red-500">*</span></label>
            <select
              value={guideData.categoryId}
              onChange={(e) => {
                const selectedCat = categories.find(c => c.id === e.target.value);
                handleFieldChange('categoryId', e.target.value);
                if (selectedCat) {
                  handleFieldChange('category', selectedCat.name);
                }
              }}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-amber-500 font-medium bg-white cursor-pointer"
            >
              {categories.map((c) => {
                const count = allGuides.filter(g => (g.categoryId === c.id || g.category_id === c.id) && g.id !== guideData.id).length;
                const maxLimit = c.max_items !== undefined ? c.max_items : (c.maxItems !== undefined ? c.maxItems : 6);
                const isFull = isEdit ? (count >= maxLimit && c.id !== guideData.categoryId) : (count >= maxLimit);
                return (
                  <option key={c.id} value={c.id} disabled={isFull} className={isFull ? 'text-slate-400 bg-slate-100' : ''}>
                    {c.name} ({count}/{maxLimit} guides{isFull ? ' - Full' : ''})
                  </option>
                );
              })}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Display Order</label>
            <input
              type="number"
              min="1"
              value={guideData.displayOrder}
              onChange={(e) => handleFieldChange('displayOrder', parseInt(e.target.value, 10) || 1)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-amber-500 font-medium"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="font-bold text-slate-700">Short Summary / Description</label>
            <textarea
              rows="2"
              placeholder="Summary shown on listing cards and guide banner..."
              value={guideData.shortDescription}
              onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 outline-none focus:border-amber-500 font-medium resize-none"
            />
          </div>

          {/* Guide Banner Image Upload & Preview */}
          <div className="md:col-span-3 space-y-2 pt-3 border-t border-slate-100">
            <label className="font-bold text-slate-600 text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-amber-600">image</span>
              <span>Guide Banner / Header Image (Optional)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
              <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white h-24 flex items-center justify-center shadow-2xs">
                {guideData.bannerImage ? (
                  <img
                    src={guideData.bannerImage}
                    alt="Guide Banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2 text-slate-400">
                    <span className="material-symbols-outlined text-2xl text-slate-300">wallpaper</span>
                    <p className="text-[10px] font-medium">No Banner Image</p>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2">
                <div className="flex gap-2 items-center">
                  <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed rounded-lg px-3 py-2 cursor-pointer font-bold text-xs transition-all ${
                    uploadingBanner ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-amber-300 text-amber-800 hover:bg-amber-50 shadow-2xs'
                  }`}>
                    <span className="material-symbols-outlined text-sm">
                      {uploadingBanner ? 'sync' : 'cloud_upload'}
                    </span>
                    <span>{uploadingBanner ? 'Uploading...' : 'Upload Banner Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => processImageUpload(e.target.files?.[0])}
                      disabled={uploadingBanner}
                    />
                  </label>

                  {guideData.bannerImage && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('bannerImage', '')}
                      className="px-3 py-2 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold border border-rose-200 cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg outline-none font-medium text-[11px] text-slate-600 focus:border-amber-500"
                  placeholder="Image URL (Auto-filled on upload or paste direct URL)..."
                  value={guideData.bannerImage}
                  onChange={(e) => handleFieldChange('bannerImage', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Tab Builder */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <span className="material-symbols-outlined text-amber-500">tab</span>
              <span>Dynamic Tab Builder ({guideData.tabs.length} Tabs)</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Manage tabs and nested sections inside this guide.</p>
          </div>
          {!isAddingTab && (
            <button
              type="button"
              onClick={() => { setIsAddingTab(true); setNewTabTitle(''); }}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors w-fit"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add New Tab</span>
            </button>
          )}
        </div>

        {/* Inline Add Tab UI */}
        {isAddingTab && (
          <div className="flex flex-wrap items-center gap-2 bg-blue-50/70 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
              <span className="material-symbols-outlined text-sm text-blue-600">add_circle</span>
              <span>New Tab:</span>
            </div>
            <input
              type="text"
              autoFocus
              value={newTabTitle}
              onChange={(e) => setNewTabTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleConfirmAddTab();
                } else if (e.key === 'Escape') {
                  setIsAddingTab(false);
                  setNewTabTitle('');
                }
              }}
              placeholder="Enter tab title (e.g. Admission Guidelines, Amenities)..."
              className="px-3 py-1.5 rounded-lg border border-blue-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[260px] flex-1"
            />
            <button
              type="button"
              onClick={handleConfirmAddTab}
              disabled={!newTabTitle.trim()}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">check</span>
              <span>Add Tab</span>
            </button>
            <button
              type="button"
              onClick={() => { setIsAddingTab(false); setNewTabTitle(''); }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              <span>Cancel</span>
            </button>
          </div>
        )}

        {/* Horizontal Tab Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {guideData.tabs.map((tab, tIdx) => {
            const isActive = tIdx === activeTabIdx;
            return (
              <div
                key={tab.id || tIdx}
                onClick={() => setActiveTabIdx(tIdx)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all border whitespace-nowrap ${isActive
                    ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
              >
                <span>{tab.title || `Tab ${tIdx + 1}`}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {tab.sections?.length || 0}
                </span>
              </div>
            );
          })}
        </div>

        {/* Active Tab Management Panel */}
        {currentTab && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <div className="flex-1 flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Tab {activeTabIdx + 1}:</span>
                <input
                  type="text"
                  value={currentTab.title}
                  onChange={(e) => handleUpdateTab(activeTabIdx, { title: e.target.value })}
                  placeholder="Tab Title..."
                  className="font-bold text-slate-800 text-sm border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1 py-0.5 w-64 bg-transparent"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveTab(activeTabIdx, -1)}
                  disabled={activeTabIdx === 0}
                  className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                  title="Move Tab Left"
                >
                  <span className="material-symbols-outlined text-sm">arrow_left</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveTab(activeTabIdx, 1)}
                  disabled={activeTabIdx === guideData.tabs.length - 1}
                  className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                  title="Move Tab Right"
                >
                  <span className="material-symbols-outlined text-sm">arrow_right</span>
                </button>
                <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 px-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentTab.enabled !== false}
                    onChange={(e) => handleUpdateTab(activeTabIdx, { enabled: e.target.checked })}
                    className="accent-amber-500"
                  />
                  <span>Enabled</span>
                </label>
                <button
                  type="button"
                  onClick={() => handleDeleteTab(activeTabIdx)}
                  disabled={guideData.tabs.length <= 1}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors disabled:opacity-30 text-xs font-bold flex items-center gap-1"
                  title="Delete Tab"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete Tab</span>
                </button>
              </div>
            </div>

            {/* Nested Section Builder inside Current Tab */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-indigo-600">layers</span>
                  <span>Sections inside "{currentTab.title}" ({currentTab.sections?.length || 0})</span>
                </h4>

                {/* Add Section Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Add Section:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddSection(activeTabIdx, e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-xs font-bold bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg outline-none cursor-pointer hover:bg-blue-900"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Choose Section Type</option>
                    {SECTION_TYPES.map((st) => (
                      <option key={st.type} value={st.type}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sections List */}
              {(!currentTab.sections || currentTab.sections.length === 0) ? (
                <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400">
                  No sections in this tab yet. Click "+ Choose Section Type" above to add your first section.
                </div>
              ) : (
                <div className="space-y-4">
                  {currentTab.sections.map((section, sIdx) => {
                    const typeConfig = SECTION_TYPES.find(st => st.type === section.type) || SECTION_TYPES[0];

                    return (
                      <div
                        key={section.id || sIdx}
                        className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden"
                      >
                        {/* Section Header Accordion */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2.5 flex-1">
                            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <input
                              type="text"
                              value={section.title || ''}
                              onChange={(e) => handleUpdateSection(activeTabIdx, sIdx, { title: e.target.value })}
                              placeholder="Section Title..."
                              className="font-bold text-slate-800 text-sm border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1 py-0.5 w-full sm:w-64 bg-transparent"
                            />
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">{typeConfig.icon}</span>
                              <span>{typeConfig.label}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleMoveSection(activeTabIdx, sIdx, -1)}
                              disabled={sIdx === 0}
                              className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                              title="Move Section Up"
                            >
                              <span className="material-symbols-outlined text-sm">arrow_upward</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveSection(activeTabIdx, sIdx, 1)}
                              disabled={sIdx === currentTab.sections.length - 1}
                              className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                              title="Move Section Down"
                            >
                              <span className="material-symbols-outlined text-sm">arrow_downward</span>
                            </button>
                            <label className="flex items-center gap-1 text-xs font-semibold text-slate-600 px-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={section.enabled !== false}
                                onChange={(e) => handleUpdateSection(activeTabIdx, sIdx, { enabled: e.target.checked })}
                                className="accent-amber-500"
                              />
                              <span>Enabled</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => handleDeleteSection(activeTabIdx, sIdx)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors text-xs font-bold"
                              title="Delete Section"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Section Content Editor */}
                        <div className="p-4 space-y-4">
                          <SectionTypeEditor
                            section={section}
                            onUpdate={(updates) => handleUpdateSection(activeTabIdx, sIdx, updates)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Alert Modals */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        itemName={confirmModal.itemName}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null, itemName: '' })}
      />

      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onClose={() => setAlertState({ isOpen: false, title: '', message: '', type: 'info' })}
      />
    </div>
  );
};

// ------------------------------------------------------------------
// Section Type Specific Editors
// ------------------------------------------------------------------
function SectionTypeEditor({ section, onUpdate }) {
  const type = section.type || 'rich_text';

  // 1. Rich Text Section Editor
  if (type === 'rich_text') {
    return (
      <div className="space-y-2">
        <label className="font-bold text-slate-700 text-xs">Rich Text Content / HTML</label>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <RichTextEditor
            content={section.content || ''}
            onChange={(val) => onUpdate({ content: val })}
          />
        </div>
      </div>
    );
  }

  // 2. Feature List Section Editor (Label: Value pairs)
  if (type === 'feature_list') {
    const items = Array.isArray(section.items) ? section.items : [];

    const handleAddItem = () => {
      const newItem = { label: 'New Feature', value: 'Details here', enabled: true };
      onUpdate({ items: [...items, newItem] });
    };

    const handleUpdateItem = (idx, updates) => {
      const updated = [...items];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ items: updated });
    };

    const handleDeleteItem = (idx) => {
      onUpdate({ items: items.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">Feature Items (Label: Value pairs)</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Feature</span>
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
              <span className="material-symbols-outlined text-amber-500 text-base">check_circle</span>
              <input
                type="text"
                placeholder="Label (e.g. Bed for Attendant)"
                value={item.label || item.title || ''}
                onChange={(e) => handleUpdateItem(idx, { label: e.target.value })}
                className="w-1/3 border border-slate-300 rounded px-2 py-1 outline-none font-bold bg-white"
              />
              <span className="font-bold text-slate-400">:</span>
              <input
                type="text"
                placeholder="Value (e.g. 01 / Available / Common)"
                value={item.value || item.description || ''}
                onChange={(e) => handleUpdateItem(idx, { value: e.target.value })}
                className="flex-1 border border-slate-300 rounded px-2 py-1 outline-none bg-white"
              />
              <button
                type="button"
                onClick={() => handleDeleteItem(idx)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Remove Item"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Accordion Section Editor (Supports Nested Accordion Items & Logo Grids)
  if (type === 'accordion') {
    const accordionItems = Array.isArray(section.accordionItems)
      ? section.accordionItems
      : [];

    const handleAddAccordionItem = () => {
      const newItem = {
        id: `acc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        title: `Accordion Item ${accordionItems.length + 1}`,
        contentType: 'logo_grid',
        logos: [],
        content: '',
        enabled: true
      };
      onUpdate({ accordionItems: [...accordionItems, newItem] });
    };

    const handleUpdateItem = (idx, updates) => {
      const updated = [...accordionItems];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ accordionItems: updated });
    };

    const handleDeleteItem = (idx) => {
      onUpdate({ accordionItems: accordionItems.filter((_, i) => i !== idx) });
    };

    const handleMoveItem = (idx, dir) => {
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= accordionItems.length) return;
      const updated = [...accordionItems];
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      onUpdate({ accordionItems: updated });
    };

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
          <div>
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-indigo-600">view_agenda</span>
              <span>Accordion Items ({accordionItems.length})</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Each item expands to display its content or nested Logo Grid when clicked on the public site.
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddAccordionItem}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors w-fit"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Accordion Item</span>
          </button>
        </div>

        {accordionItems.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-5 text-center space-y-3">
            <p className="text-xs text-slate-500">
              No accordion items defined. Add items like "Corporates", "Insurance Company", or "TPA's".
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onUpdate({
                    accordionItems: [
                      { id: `acc_${Date.now()}_1`, title: 'Corporates', contentType: 'logo_grid', logos: [], enabled: true },
                      { id: `acc_${Date.now()}_2`, title: 'Insurance Company', contentType: 'logo_grid', logos: [], enabled: true },
                      { id: `acc_${Date.now()}_3`, title: "TPA's (Third Party Administrator)", contentType: 'logo_grid', logos: [], enabled: true }
                    ]
                  });
                }}
                className="text-xs font-bold bg-[#1e3a8a] text-white px-3 py-1.5 rounded-lg hover:bg-blue-900"
              >
                + Initialize Corporate / Insurance / TPA Items
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {accordionItems.map((item, idx) => {
              const contentType = item.contentType || (item.logos?.length > 0 ? 'logo_grid' : 'rich_text');

              return (
                <div
                  key={item.id || idx}
                  className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden text-xs"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-100 border-b border-slate-200">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => handleUpdateItem(idx, { title: e.target.value })}
                        placeholder="Accordion Item Title (e.g. Corporates, Insurance Company)..."
                        className="font-bold text-slate-800 text-xs border border-slate-300 rounded px-2 py-1 flex-1 bg-white outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={contentType}
                        onChange={(e) => handleUpdateItem(idx, { contentType: e.target.value })}
                        className="text-[11px] font-bold bg-white border border-slate-300 text-slate-700 rounded px-2 py-1 outline-none"
                      >
                        <option value="logo_grid">Logo Grid</option>
                        <option value="rich_text">Rich Text</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, -1)}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                        title="Move Up"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveItem(idx, 1)}
                        disabled={idx === accordionItems.length - 1}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                        title="Move Down"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      </button>

                      <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 px-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.enabled !== false}
                          onChange={(e) => handleUpdateItem(idx, { enabled: e.target.checked })}
                          className="accent-amber-500"
                        />
                        <span>Active</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete Accordion Item"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Item Body Editor */}
                  <div className="p-3 bg-white space-y-3">
                    {contentType === 'logo_grid' ? (
                      <LogoGridEditor
                        logos={item.logos || []}
                        onChange={(updatedLogos) => handleUpdateItem(idx, { logos: updatedLogos })}
                        label={`Logos inside "${item.title || `Item ${idx + 1}`}"`}
                      />
                    ) : (
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 text-xs">Body Content / Description</label>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                          <RichTextEditor
                            content={item.content || ''}
                            onChange={(val) => handleUpdateItem(idx, { content: val })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 3b. Logo Grid Section Editor (Standalone Section)
  if (type === 'logo_grid') {
    return (
      <div className="space-y-3">
        <LogoGridEditor
          logos={section.logos || []}
          onChange={(updatedLogos) => onUpdate({ logos: updatedLogos })}
          label={section.title || 'Partner Logos'}
        />
      </div>
    );
  }

  // 4. Steps Section Editor
  if (type === 'steps') {
    const steps = Array.isArray(section.steps) ? section.steps : (Array.isArray(section.items) ? section.items : []);

    const handleAddStep = () => {
      const nextNum = steps.length + 1;
      const newStep = { step: nextNum, title: `Step ${nextNum}`, description: 'Step instructions', enabled: true };
      onUpdate({ steps: [...steps, newStep] });
    };

    const handleUpdateStep = (idx, updates) => {
      const updated = [...steps];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ steps: updated });
    };

    const handleDeleteStep = (idx) => {
      const filtered = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 }));
      onUpdate({ steps: filtered });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">Sequential Steps ({steps.length})</label>
          <button
            type="button"
            onClick={handleAddStep}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((s, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                  STEP {s.step || idx + 1}
                </span>
                <input
                  type="text"
                  placeholder="Step Title (e.g. Doctor Recommendation)"
                  value={s.title || ''}
                  onChange={(e) => handleUpdateStep(idx, { title: e.target.value })}
                  className="flex-1 border border-slate-300 rounded px-2.5 py-1 font-bold bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteStep(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove Step"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <textarea
                rows="2"
                placeholder="Step description or clinical guidance..."
                value={s.description || ''}
                onChange={(e) => handleUpdateStep(idx, { description: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white outline-none resize-none text-slate-700"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Cards Section Editor
  if (type === 'cards') {
    const cards = Array.isArray(section.cards) ? section.cards : [];

    const handleAddCard = () => {
      const newCard = { title: 'New Facility / Amenity', subtitle: 'Category', description: 'Description', icon: 'local_hospital', enabled: true };
      onUpdate({ cards: [...cards, newCard] });
    };

    const handleUpdateCard = (idx, updates) => {
      const updated = [...cards];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ cards: updated });
    };

    const handleDeleteCard = (idx) => {
      onUpdate({ cards: cards.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">Information Cards ({cards.length})</label>
          <button
            type="button"
            onClick={handleAddCard}
            className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Card</span>
          </button>
        </div>

        <div className="space-y-3">
          {cards.map((c, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <input
                type="text"
                placeholder="Card Title"
                value={c.title || c.name || ''}
                onChange={(e) => handleUpdateCard(idx, { title: e.target.value })}
                className="border border-slate-300 rounded px-2 py-1 font-bold bg-white"
              />
              <input
                type="text"
                placeholder="Subtitle / Tag"
                value={c.subtitle || c.role || ''}
                onChange={(e) => handleUpdateCard(idx, { subtitle: e.target.value })}
                className="border border-slate-300 rounded px-2 py-1 bg-white"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Icon (e.g. restaurant, pharmacy)"
                  value={c.icon || ''}
                  onChange={(e) => handleUpdateCard(idx, { icon: e.target.value })}
                  className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCard(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <div className="md:col-span-3">
                <textarea
                  rows="2"
                  placeholder="Card description..."
                  value={c.description || ''}
                  onChange={(e) => handleUpdateCard(idx, { description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2 py-1 bg-white resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Checklist Section Editor
  if (type === 'checklist') {
    const items = Array.isArray(section.items) ? section.items : [];

    const handleAddItem = () => {
      const newItem = { text: 'New policy or checklist item', note: 'Important', checked: true, enabled: true };
      onUpdate({ items: [...items, newItem] });
    };

    const handleUpdateItem = (idx, updates) => {
      const updated = [...items];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ items: updated });
    };

    const handleDeleteItem = (idx) => {
      onUpdate({ items: items.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">Checklist Items ({items.length})</label>
          <button
            type="button"
            onClick={handleAddItem}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add Checklist Item</span>
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs">
              <span className="material-symbols-outlined text-teal-600 text-base">check_box</span>
              <input
                type="text"
                placeholder="Checklist instruction / requirement..."
                value={item.text || item.title || ''}
                onChange={(e) => handleUpdateItem(idx, { text: e.target.value })}
                className="flex-1 border border-slate-300 rounded px-2 py-1 bg-white outline-none font-medium"
              />
              <input
                type="text"
                placeholder="Tag (e.g. Mandatory, Note)"
                value={item.note || ''}
                onChange={(e) => handleUpdateItem(idx, { note: e.target.value })}
                className="w-32 border border-slate-300 rounded px-2 py-1 bg-white outline-none text-slate-600"
              />
              <button
                type="button"
                onClick={() => handleDeleteItem(idx)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. Gallery Section Editor
  if (type === 'gallery') {
    const images = Array.isArray(section.galleryImages) ? section.galleryImages : [];

    const handleAddImage = () => {
      const newImg = { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop', caption: 'Room photo', enabled: true };
      onUpdate({ galleryImages: [...images, newImg] });
    };

    const handleUpdateImage = (idx, updates) => {
      const updated = [...images];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ galleryImages: updated });
    };

    const handleDeleteImage = (idx) => {
      onUpdate({ galleryImages: images.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">Gallery Images ({images.length})</label>
          <button
            type="button"
            onClick={handleAddImage}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
            <span>Add Image</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {images.map((img, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div className="h-28 bg-slate-200 rounded overflow-hidden relative">
                <img src={img.url} alt={img.caption || 'Preview'} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(idx)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded p-1 hover:bg-red-700"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                </button>
              </div>
              <input
                type="text"
                placeholder="Image URL..."
                value={img.url || ''}
                onChange={(e) => handleUpdateImage(idx, { url: e.target.value })}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white"
              />
              <input
                type="text"
                placeholder="Caption..."
                value={img.caption || ''}
                onChange={(e) => handleUpdateImage(idx, { caption: e.target.value })}
                className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-medium"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. FAQ Section Editor
  if (type === 'faq') {
    const faqs = Array.isArray(section.faqs) ? section.faqs : [];

    const handleAddFaq = () => {
      const newFaq = { question: 'New Question?', answer: 'Detailed answer response here.', enabled: true };
      onUpdate({ faqs: [...faqs, newFaq] });
    };

    const handleUpdateFaq = (idx, updates) => {
      const updated = [...faqs];
      updated[idx] = { ...updated[idx], ...updates };
      onUpdate({ faqs: updated });
    };

    const handleDeleteFaq = (idx) => {
      onUpdate({ faqs: faqs.filter((_, i) => i !== idx) });
    };

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700 text-xs">FAQ Items ({faqs.length})</label>
          <button
            type="button"
            onClick={handleAddFaq}
            className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Add FAQ</span>
          </button>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-cyan-700">Q{idx + 1}:</span>
                <input
                  type="text"
                  placeholder="Question..."
                  value={faq.question || faq.title || ''}
                  onChange={(e) => handleUpdateFaq(idx, { question: e.target.value })}
                  className="flex-1 border border-slate-300 rounded px-2.5 py-1 font-bold bg-white"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteFaq(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
              <textarea
                rows="2"
                placeholder="Answer response..."
                value={faq.answer || faq.description || ''}
                onChange={(e) => handleUpdateFaq(idx, { answer: e.target.value })}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white resize-none text-slate-700"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Table Section Editor
  if (type === 'table') {
    const tableData = section.table || { headers: ['Column 1', 'Column 2'], rows: [['Value 1', 'Value 2']] };
    const headers = tableData.headers || ['Column 1', 'Column 2'];
    const rows = tableData.rows || [['Value 1', 'Value 2']];

    const handleAddColumn = () => {
      const colName = prompt('Enter Column Header Name:');
      if (!colName) return;
      const nextHeaders = [...headers, colName];
      const nextRows = rows.map(r => [...r, '-']);
      onUpdate({ table: { headers: nextHeaders, rows: nextRows } });
    };

    const handleRemoveColumn = (colIdx) => {
      if (headers.length <= 1) return;
      const nextHeaders = headers.filter((_, i) => i !== colIdx);
      const nextRows = rows.map(r => r.filter((_, i) => i !== colIdx));
      onUpdate({ table: { headers: nextHeaders, rows: nextRows } });
    };

    const handleAddRow = () => {
      const newRow = headers.map(() => 'Value');
      onUpdate({ table: { headers, rows: [...rows, newRow] } });
    };

    const handleRemoveRow = (rowIdx) => {
      if (rows.length <= 1) return;
      onUpdate({ table: { headers, rows: rows.filter((_, i) => i !== rowIdx) } });
    };

    const handleCellChange = (rowIdx, colIdx, val) => {
      const nextRows = rows.map((r, rI) => {
        if (rI !== rowIdx) return r;
        const nextR = [...r];
        nextR[colIdx] = val;
        return nextR;
      });
      onUpdate({ table: { headers, rows: nextRows } });
    };

    const handleHeaderChange = (colIdx, val) => {
      const nextHeaders = [...headers];
      nextHeaders[colIdx] = val;
      onUpdate({ table: { headers: nextHeaders, rows } });
    };

    return (
      <div className="space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-700">Data Table ({headers.length} Cols, {rows.length} Rows)</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddColumn}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
            >
              + Add Column
            </button>
            <button
              type="button"
              onClick={handleAddRow}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded"
            >
              + Add Row
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                {headers.map((h, colIdx) => (
                  <th key={colIdx} className="p-2 border-r border-slate-200">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                        className="font-bold bg-transparent outline-none w-full text-slate-800"
                      />
                      {headers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(colIdx)}
                          className="text-red-400 hover:text-red-600 text-xs"
                          title="Delete Column"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </th>
                ))}
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-slate-100">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-2 border-r border-slate-100">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                        className="w-full bg-transparent outline-none text-slate-700"
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(rowIdx)}
                        className="text-red-400 hover:text-red-600"
                        title="Delete Row"
                      >
                        ×
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return null;
}

// ------------------------------------------------------------------
// Reusable Logo Grid Editor (Admin Component)
// ------------------------------------------------------------------
export function LogoGridEditor({ logos = [], onChange, label = 'Partner / Company Logos' }) {
  const handleAddLogo = () => {
    const nextOrder = logos.length + 1;
    const newLogo = {
      id: `logo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `Company ${nextOrder}`,
      imageUrl: '',
      order: nextOrder,
      enabled: true
    };
    onChange([...logos, newLogo]);
  };

  const handleUpdateLogo = (idx, updates) => {
    const updated = [...logos];
    updated[idx] = { ...updated[idx], ...updates };
    onChange(updated);
  };

  const handleDeleteLogo = (idx) => {
    onChange(logos.filter((_, i) => i !== idx));
  };

  const handleMoveLogo = (idx, dir) => {
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= logos.length) return;
    const updated = [...logos];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    const reordered = updated.map((l, i) => ({ ...l, order: i + 1 }));
    onChange(reordered);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-700 text-xs">{label} ({logos.length})</label>
        </div>
        <button
          type="button"
          onClick={handleAddLogo}
          className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Add Logo</span>
        </button>
      </div>

      {logos.length === 0 ? (
        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-4 text-center text-xs text-slate-500">
          No logos added yet. Click "+ Add Logo" to add company or partner logos.
        </div>
      ) : (
        <div className="space-y-2.5">
          {logos.map((logo, idx) => (
            <div
              key={logo.id || idx}
              className={`p-3 rounded-lg border text-xs transition-all ${logo.enabled !== false
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
                {/* Logo Image Preview / Fallback */}
                <div className="md:col-span-2 flex items-center gap-2">
                  <div className="w-12 h-10 rounded border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logo.imageUrl ? (
                      <img
                        src={logo.imageUrl}
                        alt={logo.name || 'Preview'}
                        className="max-w-full max-h-full object-contain p-0.5"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-slate-400 text-base">
                        business
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">#{logo.order || idx + 1}</span>
                </div>

                {/* Company Name */}
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Company / Partner Name *"
                    value={logo.name || ''}
                    onChange={(e) => handleUpdateLogo(idx, { name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-800 outline-none focus:border-amber-500 bg-white"
                  />
                </div>

                {/* Logo Image URL */}
                <div className="md:col-span-4">
                  <input
                    type="text"
                    placeholder="Logo Image URL (https://... or /path.png)"
                    value={logo.imageUrl || ''}
                    onChange={(e) => handleUpdateLogo(idx, { imageUrl: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 outline-none focus:border-amber-500 bg-white font-mono text-[11px]"
                  />
                </div>

                {/* Actions: Reorder, Enabled, Delete */}
                <div className="md:col-span-2 flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveLogo(idx, -1)}
                    disabled={idx === 0}
                    className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                    title="Move Up"
                  >
                    <span className="material-symbols-outlined text-xs">arrow_upward</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveLogo(idx, 1)}
                    disabled={idx === logos.length - 1}
                    className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30"
                    title="Move Down"
                  >
                    <span className="material-symbols-outlined text-xs">arrow_downward</span>
                  </button>
                  <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 px-1 cursor-pointer" title="Enable/Disable Logo">
                    <input
                      type="checkbox"
                      checked={logo.enabled !== false}
                      onChange={(e) => handleUpdateLogo(idx, { enabled: e.target.checked })}
                      className="accent-amber-500"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteLogo(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Delete Logo"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddPatientGuide;
