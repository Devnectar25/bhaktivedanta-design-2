import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { loadAdminData, saveAdminData, initialDoctors } from '../../../data/adminState';
import { defaultServicesState, ensureStandardServiceTabs } from '../../../data/defaultServices';
import { getServicesState, saveServicesState, getServiceById } from '../../../utils/api';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';

// Available Department Tab Types
export const TAB_TYPES = [
  {
    type: 'rich_text',
    label: 'Rich Text Content',
    icon: 'article',
    color: 'blue',
    description: 'Formatted narrative with headings, lists, and bold text (TipTap JSON)'
  },
  {
    type: 'list',
    label: 'Bullet List / Key Points',
    icon: 'format_list_bulleted',
    color: 'indigo',
    description: 'Structured list of features, clinical points, or benefits'
  },
  {
    type: 'cards',
    label: 'Specialist Cards',
    icon: 'person_pin',
    color: 'emerald',
    description: 'Doctor / specialist cards with qualifications and photos'
  },
  {
    type: 'gallery',
    label: 'Photo Gallery',
    icon: 'photo_library',
    color: 'rose',
    description: 'Image gallery with captions, preview, and uploads'
  },
  {
    type: 'steps',
    label: 'Workflow Steps',
    icon: 'account_tree',
    color: 'amber',
    description: 'Sequential procedural steps and clinical pathway'
  },
  {
    type: 'testimonials',
    label: 'Patient Testimonials',
    icon: 'format_quote',
    color: 'purple',
    description: 'Patient reviews, 5-star ratings, and feedback quotes'
  }
];

// Helper to create initial default tab data
export const createDefaultTab = (type, customTitle = '') => {
  const id = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const base = {
    id,
    type,
    enabled: true,
    collapsed: false
  };

  switch (type) {
    case 'rich_text':
      return {
        ...base,
        title: customTitle || 'Overview',
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 2 },
              content: [{ type: 'text', text: 'Department Overview & Clinical Care' }]
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'We provide compassionate, evidence-based healthcare tailored to each patient’s physical and wellness needs.'
                }
              ]
            }
          ]
        }
      };

    case 'list':
      return {
        ...base,
        title: customTitle || 'Key Highlights',
        items: [
          { id: `li_${Date.now()}_1`, text: 'Comprehensive 24/7 emergency & outpatient consultation', icon: 'check_circle' },
          { id: `li_${Date.now()}_2`, text: 'Advanced diagnostic infrastructure with high-precision accuracy', icon: 'check_circle' },
          { id: `li_${Date.now()}_3`, text: 'Multidisciplinary team of experienced clinical specialists', icon: 'check_circle' }
        ]
      };

    case 'cards':
      return {
        ...base,
        title: customTitle || 'Our Specialists',
        cards: [
          {
            id: `card_${Date.now()}_1`,
            name: 'Dr. Vivek Sharma',
            designation: 'Senior Specialist Consultant',
            qualifications: 'MBBS, MD',
            image: ''
          }
        ]
      };

    case 'gallery':
      return {
        ...base,
        title: customTitle || 'Photo Gallery',
        galleryImages: [
          {
            id: `gimg_${Date.now()}_1`,
            url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1200&auto=format&fit=crop',
            caption: 'Main Department Suite'
          },
          {
            id: `gimg_${Date.now()}_2`,
            url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1200&auto=format&fit=crop',
            caption: 'Diagnostic Technology Unit'
          }
        ]
      };

    case 'steps':
      return {
        ...base,
        title: customTitle || 'How It Works',
        steps: [
          {
            id: `stp_${Date.now()}_1`,
            title: '1. Initial Assessment & Consultation',
            description: 'Comprehensive clinical evaluation and baseline investigations.',
            icon: 'clinical_notes'
          },
          {
            id: `stp_${Date.now()}_2`,
            title: '2. Personalized Treatment Plan',
            description: 'Customized therapeutic protocol crafted by our multidisciplinary panel.',
            icon: 'medication'
          },
          {
            id: `stp_${Date.now()}_3`,
            title: '3. Follow-up & Long-Term Wellness',
            description: 'Continuous monitoring, recovery tracking, and lifestyle guidance.',
            icon: 'health_and_safety'
          }
        ]
      };

    case 'testimonials':
      return {
        ...base,
        title: customTitle || 'Patient Testimonials',
        testimonials: [
          {
            id: `tst_${Date.now()}_1`,
            name: 'Rajesh Sharma',
            role: 'Mumbai, Patient',
            rating: 5,
            quote: 'The doctors and nursing staff were exceptionally caring and attentive throughout my recovery.'
          },
          {
            id: `tst_${Date.now()}_2`,
            name: 'Sunita Verma',
            role: 'Thane, Patient',
            rating: 5,
            quote: 'Holistic approach to health that addressed both physical and emotional well-being. Truly grateful.'
          }
        ]
      };

    default:
      return {
        ...base,
        title: customTitle || 'Tab Content',
        content: null
      };
  }
};

const AddService = ({ mode }) => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = paramId || searchParams.get('edit') || null;
  const isEditMode = Boolean(editId) || mode === 'edit';
  const navigate = useNavigate();

  // Loading state while fetching existing record on Edit
  const [loading, setLoading] = useState(Boolean(editId));

  // Basic Service Details State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('Active');
  const [icon, setIcon] = useState('medical_services');
  const [categoryId, setCategoryId] = useState('c1');
  const [bannerImage, setBannerImage] = useState('');
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Dynamic Department Tabs State
  const [tabsList, setTabsList] = useState([]);
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [tabToDelete, setTabToDelete] = useState(null);

  // Doctors list for quick picker
  const [doctorsList, setDoctorsList] = useState([]);

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    type: 'error'
  });

  const showAlert = ({ title, message, itemName = '', type = 'error' }) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      itemName,
      type
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  const [servicesList, setServicesList] = useState([]);
  const [unifiedServicesState, setUnifiedServicesState] = useState(defaultServicesState);

  // Drag and drop tracking
  const dragItemRef = useRef(null);
  const dragOverItemRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    // Load staff doctors for specialist picker
    initialDoctors().then(docs => {
      if (isMounted && docs) setDoctorsList(docs);
    });

    // Load full services state from API / cache
    getServicesState(defaultServicesState).then(res => {
      if (isMounted && res) {
        setUnifiedServicesState(res);
        if (res.services) {
          setServicesList(res.services);
        }
      }
    });

    if (editId) {
      setLoading(true);
      getServiceById(editId, defaultServicesState)
        .then((service) => {
          if (!isMounted) return;
          if (service) {
            setName(service.name || service.service_name || '');
            setDescription(service.shortDescription || service.short_description || service.description || '');
            setSlug(service.slug || '');
            setStatus(service.status === false || service.status === 'Draft' ? 'Draft' : 'Active');
            setIcon(service.icon || 'medical_services');
            setCategoryId(service.categoryId || service.category_id || 'c1');
            setBannerImage(service.bannerImage || service.banner_image || service.thumbnail_image || '');

            // Populate dynamic tabs from existing DB record
            const incomingTabs = service.tabs || service.tabs_data;
            if (Array.isArray(incomingTabs) && incomingTabs.length > 0) {
              const loadedTabs = incomingTabs.map((tab, idx) => {
                let tabType = tab.type || 'rich_text';
                // Map legacy types if any
                if (tabType === 'overview' || tabType === 'custom') tabType = 'rich_text';
                if (tabType === 'how_it_works') tabType = 'steps';
                if (tabType === 'our_experts') tabType = 'cards';
                if (tabType === 'photo_gallery') tabType = 'gallery';
                if (tabType === 'why_choose_us') tabType = 'list';

                return {
                  id: tab.id || `tab_${Date.now()}_${idx}`,
                  title: tab.title || `Tab ${idx + 1}`,
                  type: tabType,
                  enabled: tab.enabled !== false,
                  order: tab.order || idx + 1,
                  collapsed: false,
                  content: tab.content || null,
                  items: tab.items || tab.points || [],
                  cards: tab.cards || tab.experts || [],
                  galleryImages: tab.galleryImages || tab.images?.map((url, i) => ({ id: `img_${i}`, url, caption: '' })) || [],
                  steps: tab.steps || [],
                  testimonials: tab.testimonials || tab.items || []
                };
              });
              setTabsList(loadedTabs);
            } else {
              // Default initial tabs if service record has no tabs
              setTabsList([
                createDefaultTab('rich_text', 'Overview'),
                createDefaultTab('steps', 'How It Works'),
                createDefaultTab('list', 'Key Highlights'),
                createDefaultTab('cards', 'Specialists'),
                createDefaultTab('testimonials', 'Testimonials')
              ]);
            }
          }
        })
        .catch(err => {
          console.error('[AddService] Error fetching service details for edit:', err);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      // Default initial tabs for brand new service
      setTabsList([
        createDefaultTab('rich_text', 'Overview'),
        createDefaultTab('steps', 'How It Works'),
        createDefaultTab('list', 'Key Highlights'),
        createDefaultTab('cards', 'Specialists'),
        createDefaultTab('testimonials', 'Testimonials')
      ]);
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [editId]);

  // Handle Name Change and auto-slug
  const handleNameChange = (val) => {
    setName(val);
    if (!editId || !slug) {
      const generated = `/${val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
      setSlug(generated);
    }
  };

  // Image Upload processor
  const processImageUpload = (file, onSuccess, setUploadingState) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showAlert({
        title: 'File Size Exceeded',
        message: 'The selected image exceeds the 10MB limit. Please choose a smaller image file.',
        type: 'warning'
      });
      return;
    }

    if (setUploadingState) setUploadingState(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await fetch('http://localhost:5000/api/specialities/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            specialityName: name || 'service',
            fileName: file.name,
            base64Data
          })
        });

        const data = await res.json();
        if (data.success && data.url) {
          onSuccess(data.url);
        } else {
          onSuccess(base64Data);
        }
      } catch (err) {
        onSuccess(base64Data);
      } finally {
        if (setUploadingState) setUploadingState(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // DYNAMIC DEPARTMENT TAB ACTIONS
  // ----------------------------------------------------

  const handleAddTab = (type) => {
    const newTab = createDefaultTab(type);
    newTab.order = tabsList.length + 1;
    setTabsList(prev => [...prev, newTab]);
    setShowAddTabModal(false);
  };

  const handleUpdateTab = (index, updatedFields) => {
    setTabsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updatedFields };
      return copy;
    });
  };

  const handleToggleTabCollapse = (index) => {
    setTabsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], collapsed: !copy[index].collapsed };
      return copy;
    });
  };

  const handleToggleTabEnabled = (index) => {
    setTabsList(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], enabled: !copy[index].enabled };
      return copy;
    });
  };

  const handleDeleteTab = (index) => {
    const tab = tabsList[index];
    setTabToDelete({ index, title: tab.title || 'this tab' });
  };

  const confirmDeleteTab = () => {
    if (tabToDelete !== null) {
      setTabsList(prev =>
        prev
          .filter((_, idx) => idx !== tabToDelete.index)
          .map((t, idx) => ({ ...t, order: idx + 1 }))
      );
      setTabToDelete(null);
    }
  };

  const handleMoveTab = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= tabsList.length) return;

    setTabsList(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy.map((t, idx) => ({ ...t, order: idx + 1 }));
    });
  };

  // Drag & drop handlers
  const handleDragStart = (e, index) => {
    dragItemRef.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, index) => {
    dragOverItemRef.current = index;
  };

  const handleDragEnd = () => {
    const dragIdx = dragItemRef.current;
    const overIdx = dragOverItemRef.current;

    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      setTabsList(prev => {
        const copy = [...prev];
        const [moved] = copy.splice(dragIdx, 1);
        copy.splice(overIdx, 0, moved);
        return copy.map((t, idx) => ({ ...t, order: idx + 1 }));
      });
    }

    dragItemRef.current = null;
    dragOverItemRef.current = null;
  };

  // ----------------------------------------------------
  // REPEATABLE ITEM HANDLERS PER TAB TYPE
  // ----------------------------------------------------

  // 1. Bullet List Items
  const handleAddListItem = (tabIdx) => {
    const tab = tabsList[tabIdx];
    const items = tab.items || [];
    const newItem = {
      id: `li_${Date.now()}_${items.length + 1}`,
      text: 'New highlight or clinical feature point',
      icon: 'check_circle'
    };
    handleUpdateTab(tabIdx, { items: [...items, newItem] });
  };

  const handleUpdateListItem = (tabIdx, itemIdx, updatedFields) => {
    const tab = tabsList[tabIdx];
    const items = [...(tab.items || [])];
    items[itemIdx] = { ...items[itemIdx], ...updatedFields };
    handleUpdateTab(tabIdx, { items });
  };

  const handleDeleteListItem = (tabIdx, itemIdx) => {
    const tab = tabsList[tabIdx];
    const items = (tab.items || []).filter((_, idx) => idx !== itemIdx);
    handleUpdateTab(tabIdx, { items });
  };

  // 2. Specialist Cards
  const handleAddCard = (tabIdx) => {
    const tab = tabsList[tabIdx];
    const cards = tab.cards || [];
    const newCard = {
      id: `card_${Date.now()}_${cards.length + 1}`,
      name: 'Specialist Name',
      designation: 'Department Consultant',
      qualifications: 'MBBS, MD',
      image: ''
    };
    handleUpdateTab(tabIdx, { cards: [...cards, newCard] });
  };

  const handlePickDoctorForCard = (tabIdx, cardIdx, docId) => {
    if (!docId) return;
    const doc = doctorsList.find(d => d.id === docId);
    if (!doc) return;
    const tab = tabsList[tabIdx];
    const cards = [...(tab.cards || [])];
    cards[cardIdx] = {
      ...cards[cardIdx],
      name: doc.name || cards[cardIdx].name,
      designation: doc.speciality || doc.department || cards[cardIdx].designation,
      qualifications: doc.qualifications || cards[cardIdx].qualifications,
      image: doc.image || cards[cardIdx].image
    };
    handleUpdateTab(tabIdx, { cards });
  };

  const handleUpdateCard = (tabIdx, cardIdx, updatedFields) => {
    const tab = tabsList[tabIdx];
    const cards = [...(tab.cards || [])];
    cards[cardIdx] = { ...cards[cardIdx], ...updatedFields };
    handleUpdateTab(tabIdx, { cards });
  };

  const handleDeleteCard = (tabIdx, cardIdx) => {
    const tab = tabsList[tabIdx];
    const cards = (tab.cards || []).filter((_, idx) => idx !== cardIdx);
    handleUpdateTab(tabIdx, { cards });
  };

  // 3. Photo Gallery Images
  const handleAddGalleryImage = (tabIdx) => {
    const tab = tabsList[tabIdx];
    const galleryImages = tab.galleryImages || [];
    const newImg = {
      id: `gimg_${Date.now()}_${galleryImages.length + 1}`,
      url: '',
      caption: ''
    };
    handleUpdateTab(tabIdx, { galleryImages: [...galleryImages, newImg] });
  };

  const handleUpdateGalleryImage = (tabIdx, imgIdx, updatedFields) => {
    const tab = tabsList[tabIdx];
    const galleryImages = [...(tab.galleryImages || [])];
    galleryImages[imgIdx] = { ...galleryImages[imgIdx], ...updatedFields };
    handleUpdateTab(tabIdx, { galleryImages });
  };

  const handleDeleteGalleryImage = (tabIdx, imgIdx) => {
    const tab = tabsList[tabIdx];
    const galleryImages = (tab.galleryImages || []).filter((_, idx) => idx !== imgIdx);
    handleUpdateTab(tabIdx, { galleryImages });
  };

  // 4. Workflow Steps
  const handleAddStep = (tabIdx) => {
    const tab = tabsList[tabIdx];
    const steps = tab.steps || [];
    const newStep = {
      id: `stp_${Date.now()}_${steps.length + 1}`,
      title: `${steps.length + 1}. Step Title`,
      description: 'Step instructions and clinical description.',
      icon: 'arrow_forward'
    };
    handleUpdateTab(tabIdx, { steps: [...steps, newStep] });
  };

  const handleUpdateStep = (tabIdx, stepIdx, updatedFields) => {
    const tab = tabsList[tabIdx];
    const steps = [...(tab.steps || [])];
    steps[stepIdx] = { ...steps[stepIdx], ...updatedFields };
    handleUpdateTab(tabIdx, { steps });
  };

  const handleDeleteStep = (tabIdx, stepIdx) => {
    const tab = tabsList[tabIdx];
    const steps = (tab.steps || []).filter((_, idx) => idx !== stepIdx);
    handleUpdateTab(tabIdx, { steps });
  };

  // 5. Testimonials
  const handleAddTestimonial = (tabIdx) => {
    const tab = tabsList[tabIdx];
    const testimonials = tab.testimonials || [];
    const newTst = {
      id: `tst_${Date.now()}_${testimonials.length + 1}`,
      name: 'Patient Name',
      role: 'City / Department',
      rating: 5,
      quote: 'Patient feedback and healing experience...'
    };
    handleUpdateTab(tabIdx, { testimonials: [...testimonials, newTst] });
  };

  const handleUpdateTestimonial = (tabIdx, tstIdx, updatedFields) => {
    const tab = tabsList[tabIdx];
    const testimonials = [...(tab.testimonials || [])];
    testimonials[tstIdx] = { ...testimonials[tstIdx], ...updatedFields };
    handleUpdateTab(tabIdx, { testimonials });
  };

  const handleDeleteTestimonial = (tabIdx, tstIdx) => {
    const tab = tabsList[tabIdx];
    const testimonials = (tab.testimonials || []).filter((_, idx) => idx !== tstIdx);
    handleUpdateTab(tabIdx, { testimonials });
  };

  // ----------------------------------------------------
  // SUBMIT FORM
  // ----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showAlert({
        title: 'Service Name Required',
        message: 'Please provide a valid service name before saving.',
        type: 'error'
      });
      return;
    }

    const finalSlug = slug.trim() || `/${name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')}`;

    // Clean dynamic tabs with strict TipTap JSON format and structured arrays
    const formattedTabs = tabsList.map((tab, idx) => ({
      id: tab.id || `tab_${idx + 1}`,
      title: tab.title || `Tab ${idx + 1}`,
      type: tab.type || 'rich_text',
      order: idx + 1,
      enabled: tab.enabled !== false,
      content: tab.content || null,
      items: tab.items || [],
      cards: tab.cards || [],
      galleryImages: tab.galleryImages || [],
      steps: tab.steps || [],
      testimonials: tab.testimonials || []
    }));

    const serviceData = {
      name: name.trim(),
      description: description.trim(),
      slug: finalSlug,
      status: status === 'Active' || status === true,
      icon: icon.trim() || 'medical_services',
      categoryId: categoryId || 'c1',
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
      tabs: formattedTabs,
      lastUpdated: 'Just now',
      updatedAt: new Date().toISOString()
    };

    let updatedList;
    if (editId) {
      updatedList = servicesList.map(srv => {
        if (srv.id === editId) {
          return {
            ...srv,
            ...serviceData,
            id: editId
          };
        }
        return srv;
      });
    } else {
      const newSrv = {
        id: `SRV-${Date.now().toString().substring(8)}`,
        ...serviceData,
        createdAt: new Date().toISOString()
      };
      updatedList = [newSrv, ...servicesList];
    }

    // Save to admin state
    saveAdminData('bhaktivedanta_admin_services', updatedList);

    // Synchronize with unified backend & state
    if (unifiedServicesState && unifiedServicesState.services) {
      let updatedUnifiedServices;
      const targetId = editId || `SRV-${Date.now().toString().substring(8)}`;
      const existingIdx = unifiedServicesState.services.findIndex(s => s.id === editId || s.name.toLowerCase() === name.toLowerCase());

      if (existingIdx >= 0) {
        updatedUnifiedServices = unifiedServicesState.services.map((s, idx) => {
          if (idx === existingIdx) {
            const merged = { ...s, ...serviceData, id: s.id };
            ensureStandardServiceTabs(merged);
            return merged;
          }
          return s;
        });
      } else {
        const newUnified = {
          id: targetId,
          ...serviceData,
          shortDescription: description.trim()
        };
        ensureStandardServiceTabs(newUnified);
        updatedUnifiedServices = [...unifiedServicesState.services, newUnified];
      }

      const newUnifiedState = {
        ...unifiedServicesState,
        services: updatedUnifiedServices
      };
      saveServicesState(newUnifiedState).then(() => {
        window.dispatchEvent(new Event('admin_data_updated'));
        window.dispatchEvent(new Event('storage'));
        navigate('/admin/services');
      }).catch(err => {
        console.error('Error saving services state:', err);
        window.dispatchEvent(new Event('admin_data_updated'));
        window.dispatchEvent(new Event('storage'));
        navigate('/admin/services');
      });
    } else {
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
      navigate('/admin/services');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Services</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Service' : 'Add Service'}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">
            {editId ? 'Edit Service Details' : 'Add New Service'}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">
            Configure clinical offerings, dynamic department tabs with TipTap JSON rich text, and custom ordering.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddTabModal(true)}
          className="self-start sm:self-auto bg-[#1e3a8a] hover:bg-blue-900 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-base text-amber-400">add_circle</span>
          <span>+ Add Tab</span>
        </button>
      </div>

      {/* Main Form or Loading Indicator */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-16 text-center space-y-3 shadow-xs">
          <div className="w-10 h-10 border-3 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">Loading Service Configuration...</h4>
          <p className="text-xs text-slate-400">Fetching service details and department tabs from database</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">
          {/* SECTION 1: Main Service Details */}
          <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-[#1e3a8a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-blue-600">medical_services</span>
                <span>Main Service Details</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Basic Info & Identification</span>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 uppercase">Service Name *</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium text-slate-800"
                placeholder="e.g. Holistic Wellness"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Page Slug</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium text-slate-800"
                placeholder="e.g. /holistic-wellness"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase flex items-center justify-between">
                <span>Google Material Icon</span>
                {icon && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-semibold normal-case">
                    Preview: <span className="material-symbols-outlined text-sm">{icon}</span>
                  </span>
                )}
              </label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium text-slate-800"
                placeholder="e.g. self_improvement, medical_services"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Parent Category</label>
              <select
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer text-slate-800"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {(unifiedServicesState.categories && unifiedServicesState.categories.length > 0
                  ? unifiedServicesState.categories
                  : [
                      { id: 'c1', name: 'Healthcare Services' },
                      { id: 'c2', name: '24*7 Services' }
                    ]
                ).map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Status</label>
              <select
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer text-slate-800"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 uppercase">Short Summary / Teaser</label>
              <textarea
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium text-slate-800"
                placeholder="Brief summary for service cards, navigation previews, and search listings..."
                rows="2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Service / Department Banner Image */}
            <div className="sm:col-span-2 space-y-2 pt-3 border-t border-slate-100">
              <label className="font-bold text-slate-600 text-xs flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-blue-600">image</span>
                <span>Service / Department Banner Image (Optional)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-white h-24 flex items-center justify-center shadow-2xs">
                  {bannerImage ? (
                    <img
                      src={bannerImage}
                      alt="Service Banner"
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
                      uploadingBanner ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-2xs'
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {uploadingBanner ? 'sync' : 'cloud_upload'}
                      </span>
                      <span>{uploadingBanner ? 'Uploading...' : 'Upload Banner Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => processImageUpload(e.target.files?.[0], setBannerImage, setUploadingBanner)}
                        disabled={uploadingBanner}
                      />
                    </label>

                    {bannerImage && (
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="px-3 py-2 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold border border-rose-200"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg outline-none font-medium text-[11px] text-slate-600"
                    placeholder="Image URL (Auto-filled on upload or paste direct URL)..."
                    value={bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Configure Department Tabs */}
        <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#1e3a8a] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base text-orange-500">tab</span>
                <span>Configure Department Tabs</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Add, reorder via drag & drop, and configure tab content (stored as TipTap JSON for rich text).
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddTabModal(true)}
              className="px-3 py-1.5 bg-[#fea619] hover:bg-amber-500 text-slate-900 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">add_circle</span>
              <span>+ Add Tab</span>
            </button>
          </div>

          {/* Empty State */}
          {tabsList.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-xl space-y-3">
              <span className="material-symbols-outlined text-4xl text-slate-300">tab_unselected</span>
              <h4 className="font-bold text-sm text-slate-700">No Department Tabs Configured</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Add tabs such as Rich Text Overview, Specialist Cards, Photo Gallery, Workflow Steps, or Testimonials to build the service content.
              </p>
              <button
                type="button"
                onClick={() => setShowAddTabModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>Add First Tab</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {tabsList.map((tab, tabIdx) => {
                const typeDef = TAB_TYPES.find(t => t.type === tab.type) || {
                  type: 'rich_text',
                  label: 'Rich Text Content',
                  icon: 'article',
                  color: 'blue'
                };
                const isFirst = tabIdx === 0;
                const isLast = tabIdx === tabsList.length - 1;

                return (
                  <div
                    key={tab.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, tabIdx)}
                    onDragEnter={(e) => handleDragEnter(e, tabIdx)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    className={`rounded-xl border transition-all duration-200 ${
                      tab.enabled !== false
                        ? 'border-slate-200 bg-white shadow-xs hover:border-slate-300'
                        : 'border-slate-200/60 bg-slate-50/80 opacity-70'
                    }`}
                  >
                    {/* Tab Card Header */}
                    <div className="p-3.5 bg-slate-50/70 rounded-t-xl border-b border-slate-100 flex flex-wrap items-center justify-between gap-2.5 select-none">
                      {/* Left: Drag Handle, Tab Index, Title */}
                      <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                        <span
                          className="material-symbols-outlined text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing text-lg"
                          title="Drag to reorder tab"
                        >
                          drag_indicator
                        </span>

                        <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                          {tabIdx + 1}
                        </span>

                        <div className="flex items-center gap-1.5 flex-1">
                          <span className="material-symbols-outlined text-base text-blue-600">
                            {typeDef.icon}
                          </span>
                          <input
                            type="text"
                            value={tab.title || ''}
                            onChange={(e) => handleUpdateTab(tabIdx, { title: e.target.value })}
                            className="font-bold text-xs text-slate-800 bg-transparent hover:bg-white focus:bg-white px-2 py-1 rounded border border-transparent hover:border-slate-200 focus:border-blue-400 outline-none w-full max-w-[280px]"
                            placeholder="Tab Title..."
                          />
                          <span className="text-[10px] font-semibold text-slate-400 uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200/80">
                            {typeDef.label}
                          </span>
                        </div>
                      </div>

                      {/* Right: Tab Controls (Move Up/Down, Enable/Disable, Collapse, Delete) */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMoveTab(tabIdx, -1)}
                          disabled={isFirst}
                          className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Tab Up"
                        >
                          <span className="material-symbols-outlined text-base">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveTab(tabIdx, 1)}
                          disabled={isLast}
                          className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move Tab Down"
                        >
                          <span className="material-symbols-outlined text-base">arrow_downward</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleTabEnabled(tabIdx)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 border transition-all ${
                            tab.enabled !== false
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title={tab.enabled !== false ? 'Tab is enabled on public page' : 'Tab is disabled (hidden)'}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {tab.enabled !== false ? 'visibility' : 'visibility_off'}
                          </span>
                          <span>{tab.enabled !== false ? 'Active' : 'Disabled'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleTabCollapse(tabIdx)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                          title={tab.collapsed ? 'Expand tab' : 'Collapse tab'}
                        >
                          <span className="material-symbols-outlined text-base">
                            {tab.collapsed ? 'expand_more' : 'expand_less'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTab(tabIdx)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Delete Tab"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Tab Body (Conditional Form by Type) */}
                    {!tab.collapsed && (
                      <div className="p-4 space-y-4">
                        
                        {/* 1. TYPE: rich_text -> TipTap RichTextEditor */}
                        {tab.type === 'rich_text' && (
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-600 text-xs flex items-center justify-between">
                              <span>Formatted Content (TipTap Rich Text Editor)</span>
                              <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
                                Stored as TipTap JSON
                              </span>
                            </label>
                            <RichTextEditor
                              value={tab.content}
                              onChange={(jsonVal) => handleUpdateTab(tabIdx, { content: jsonVal })}
                              placeholder={`Enter formatted content for ${tab.title}...`}
                              minHeight="140px"
                            />
                          </div>
                        )}

                        {/* 2. TYPE: list -> Repeatable Bullet/Feature Points */}
                        {tab.type === 'list' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-indigo-600">format_list_bulleted</span>
                                <span>List Items ({tab.items?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddListItem(tabIdx)}
                                className="px-2.5 py-1 text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span>Add Item</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(tab.items || []).map((item, itemIdx) => (
                                <div key={item.id || itemIdx} className="flex items-center gap-2 p-2.5 bg-slate-50/80 border border-slate-200 rounded-lg">
                                  <input
                                    type="text"
                                    value={item.icon || 'check_circle'}
                                    onChange={(e) => handleUpdateListItem(tabIdx, itemIdx, { icon: e.target.value })}
                                    placeholder="Icon"
                                    className="text-xs bg-white border border-slate-200 px-2 py-1.5 rounded w-24 outline-none font-medium"
                                  />
                                  <input
                                    type="text"
                                    value={item.text || ''}
                                    onChange={(e) => handleUpdateListItem(tabIdx, itemIdx, { text: e.target.value })}
                                    placeholder="Enter item or feature point..."
                                    className="text-xs bg-white border border-slate-200 px-2.5 py-1.5 rounded flex-1 outline-none font-medium text-slate-800"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteListItem(tabIdx, itemIdx)}
                                    className="text-rose-500 hover:text-rose-700 p-1"
                                    title="Delete Item"
                                  >
                                    <span className="material-symbols-outlined text-base">close</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 3. TYPE: cards -> Repeatable Specialist Doctor Cards */}
                        {tab.type === 'cards' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-emerald-600">person_pin</span>
                                <span>Specialist Doctor Cards ({tab.cards?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddCard(tabIdx)}
                                className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span>Add Specialist</span>
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              {(tab.cards || []).map((card, cardIdx) => (
                                <div key={card.id || cardIdx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                                      {doctorsList.length > 0 && (
                                        <select
                                          onChange={(e) => handlePickDoctorForCard(tabIdx, cardIdx, e.target.value)}
                                          className="text-[11px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 px-2 py-1 rounded outline-none cursor-pointer"
                                          defaultValue=""
                                        >
                                          <option value="" disabled>Quick Pick Staff Doctor...</option>
                                          {doctorsList.map(d => (
                                            <option key={d.id} value={d.id}>{d.name} ({d.speciality || 'Specialist'})</option>
                                          ))}
                                        </select>
                                      )}

                                      <input
                                        type="text"
                                        value={card.name || ''}
                                        onChange={(e) => handleUpdateCard(tabIdx, cardIdx, { name: e.target.value })}
                                        placeholder="Doctor Name *"
                                        className="font-bold text-xs bg-white border border-slate-200 px-2.5 py-1 rounded flex-1 outline-none min-w-[140px]"
                                      />
                                      <input
                                        type="text"
                                        value={card.designation || ''}
                                        onChange={(e) => handleUpdateCard(tabIdx, cardIdx, { designation: e.target.value })}
                                        placeholder="Designation / Role"
                                        className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded flex-1 outline-none min-w-[140px]"
                                      />
                                      <input
                                        type="text"
                                        value={card.qualifications || ''}
                                        onChange={(e) => handleUpdateCard(tabIdx, cardIdx, { qualifications: e.target.value })}
                                        placeholder="Qualifications (e.g. MBBS, MD)"
                                        className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded w-36 outline-none"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteCard(tabIdx, cardIdx)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                      title="Remove Specialist"
                                    >
                                      <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                  </div>

                                  <div className="flex gap-2 items-center">
                                    <label className="flex items-center gap-1 border border-dashed rounded px-2.5 py-1 cursor-pointer font-bold text-[11px] bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-300">
                                      <span className="material-symbols-outlined text-xs">upload</span>
                                      <span>Photo</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => processImageUpload(e.target.files?.[0], (url) => handleUpdateCard(tabIdx, cardIdx, { image: url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      value={card.image || ''}
                                      onChange={(e) => handleUpdateCard(tabIdx, cardIdx, { image: e.target.value })}
                                      placeholder="Photo URL (Auto-filled on upload)..."
                                      className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded flex-1 outline-none"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 4. TYPE: gallery -> Repeatable Image + Caption List */}
                        {tab.type === 'gallery' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-rose-600">photo_library</span>
                                <span>Gallery Images ({tab.galleryImages?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddGalleryImage(tabIdx)}
                                className="px-2.5 py-1 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                                <span>Add Photo</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(tab.galleryImages || []).map((img, imgIdx) => (
                                <div key={img.id || imgIdx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-[11px] text-slate-600">Image #{imgIdx + 1}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteGalleryImage(tabIdx, imgIdx)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                      title="Remove Image"
                                    >
                                      <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                  </div>

                                  <div className="relative rounded overflow-hidden border border-slate-200 bg-white h-24 flex items-center justify-center">
                                    {img.url ? (
                                      <img
                                        src={img.url}
                                        alt={img.caption || `Gallery ${imgIdx + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="text-center p-2 text-slate-400">
                                        <span className="material-symbols-outlined text-2xl text-slate-300">image</span>
                                        <p className="text-[10px]">No Image</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2 items-center">
                                    <label className="flex-1 flex items-center justify-center gap-1 border border-dashed rounded px-2 py-1 cursor-pointer font-bold text-[11px] bg-white text-rose-700 hover:bg-rose-50 border-rose-300">
                                      <span className="material-symbols-outlined text-xs">upload</span>
                                      <span>Upload</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => processImageUpload(e.target.files?.[0], (url) => handleUpdateGalleryImage(tabIdx, imgIdx, { url }))}
                                      />
                                    </label>
                                    <input
                                      type="text"
                                      value={img.url || ''}
                                      onChange={(e) => handleUpdateGalleryImage(tabIdx, imgIdx, { url: e.target.value })}
                                      placeholder="Or paste URL..."
                                      className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded flex-1 outline-none"
                                    />
                                  </div>

                                  <input
                                    type="text"
                                    value={img.caption || ''}
                                    onChange={(e) => handleUpdateGalleryImage(tabIdx, imgIdx, { caption: e.target.value })}
                                    placeholder="Image Caption / Description..."
                                    className="w-full text-xs bg-white border border-slate-200 px-2 py-1 rounded outline-none font-medium"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. TYPE: steps -> Repeatable Workflow Steps */}
                        {tab.type === 'steps' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-amber-500">account_tree</span>
                                <span>Workflow Steps ({tab.steps?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddStep(tabIdx)}
                                className="px-2.5 py-1 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span>Add Step</span>
                              </button>
                            </div>

                            <div className="space-y-2">
                              {(tab.steps || []).map((step, stepIdx) => (
                                <div key={step.id || stepIdx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 flex-1">
                                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center justify-center">
                                        {stepIdx + 1}
                                      </span>
                                      <input
                                        type="text"
                                        value={step.title || ''}
                                        onChange={(e) => handleUpdateStep(tabIdx, stepIdx, { title: e.target.value })}
                                        placeholder={`Step ${stepIdx + 1} Title`}
                                        className="font-bold text-xs text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded flex-1 outline-none"
                                      />
                                      <input
                                        type="text"
                                        value={step.icon || ''}
                                        onChange={(e) => handleUpdateStep(tabIdx, stepIdx, { icon: e.target.value })}
                                        placeholder="Icon (e.g. check)"
                                        className="text-xs bg-white border border-slate-200 px-2 py-1 rounded w-32 outline-none"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteStep(tabIdx, stepIdx)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                      title="Remove Step"
                                    >
                                      <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                  </div>
                                  <textarea
                                    value={step.description || ''}
                                    onChange={(e) => handleUpdateStep(tabIdx, stepIdx, { description: e.target.value })}
                                    placeholder="Step procedure & clinical instructions..."
                                    rows="2"
                                    className="w-full text-xs bg-white border border-slate-200 px-2.5 py-1.5 rounded outline-none font-medium"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 6. TYPE: testimonials -> Repeatable Testimonials */}
                        {tab.type === 'testimonials' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-sm text-purple-600">format_quote</span>
                                <span>Patient Testimonials ({tab.testimonials?.length || 0})</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => handleAddTestimonial(tabIdx)}
                                className="px-2.5 py-1 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded flex items-center gap-1"
                              >
                                <span className="material-symbols-outlined text-sm">add</span>
                                <span>Add Testimonial</span>
                              </button>
                            </div>

                            <div className="space-y-2.5">
                              {(tab.testimonials || []).map((tst, tstIdx) => (
                                <div key={tst.id || tstIdx} className="p-3 bg-slate-50/80 border border-slate-200 rounded-lg space-y-2">
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                                      <input
                                        type="text"
                                        value={tst.name || ''}
                                        onChange={(e) => handleUpdateTestimonial(tabIdx, tstIdx, { name: e.target.value })}
                                        placeholder="Patient Name *"
                                        className="font-bold text-xs bg-white border border-slate-200 px-2.5 py-1 rounded outline-none"
                                      />
                                      <input
                                        type="text"
                                        value={tst.role || ''}
                                        onChange={(e) => handleUpdateTestimonial(tabIdx, tstIdx, { role: e.target.value })}
                                        placeholder="Location / Note"
                                        className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded outline-none"
                                      />
                                      <div className="flex items-center gap-1">
                                        <label className="text-[11px] font-bold text-slate-500">Rating:</label>
                                        <select
                                          value={tst.rating || 5}
                                          onChange={(e) => handleUpdateTestimonial(tabIdx, tstIdx, { rating: parseInt(e.target.value, 10) })}
                                          className="text-xs bg-white border border-slate-200 px-2 py-1 rounded font-bold text-amber-600 outline-none"
                                        >
                                          <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                          <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                          <option value="3">⭐⭐⭐ (3/5)</option>
                                        </select>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteTestimonial(tabIdx, tstIdx)}
                                      className="text-rose-500 hover:text-rose-700 p-1"
                                      title="Remove Testimonial"
                                    >
                                      <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                  </div>

                                  <textarea
                                    value={tst.quote || ''}
                                    onChange={(e) => handleUpdateTestimonial(tabIdx, tstIdx, { quote: e.target.value })}
                                    placeholder="Patient testimonial quote..."
                                    rows="2"
                                    className="w-full text-xs bg-white border border-slate-200 px-2.5 py-1.5 rounded outline-none"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* SECTION 3: Action Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => navigate('/admin/services')}
            className="px-5 py-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-all text-xs shadow-xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-7 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">
              {editId ? 'save' : 'publish'}
            </span>
            <span>{editId ? 'Save Service' : 'Publish Service'}</span>
          </button>
        </div>
      </form>
      )}

      {/* MODAL 1: Choose Department Tab Type Modal */}
      {showAddTabModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddTabModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 bg-gradient-to-r from-[#1e3a8a] to-blue-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-400">add_circle</span>
                  <span>Add Department Tab</span>
                </h3>
                <p className="text-xs text-blue-200 mt-0.5">
                  Select a tab type to configure rich content for this department
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTabModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[65vh] overflow-y-auto">
              {TAB_TYPES.map((tt) => (
                <button
                  key={tt.type}
                  type="button"
                  onClick={() => handleAddTab(tt.type)}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all group active:scale-98"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                    <span className="material-symbols-outlined text-xl">{tt.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 group-hover:text-blue-900 flex items-center gap-1">
                      <span>{tt.label}</span>
                      <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                        arrow_forward
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-sans">
                      {tt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddTabModal(false)}
                className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Delete Tab Confirmation */}
      {tabToDelete !== null && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setTabToDelete(null)}
        >
          <div
            className="bg-white rounded-xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">warning</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-800">Delete Tab?</h4>
                <p className="text-xs text-slate-500">Are you sure you want to remove "{tabToDelete.title}"?</p>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              This will remove this tab and its content from the department configuration.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTabToDelete(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteTab}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs"
              >
                Delete Tab
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert / Notification Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        itemName={alertModal.itemName}
        type={alertModal.type}
      />
    </div>
  );
};

export default AddService;
