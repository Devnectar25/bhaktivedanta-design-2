import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';
import { initialDoctors } from '../../../data/adminState';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';
import { showSuccessAlert } from '../../../utils/swal';

const getInitialCreateTabs = (specName) => [
  { id: 't1', title: 'Overview', type: 'rich_text', content: `<p>Welcome to the ${specName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.</p>` },
  { id: 't2', title: 'Why Choose Us', type: 'rich_text', content: `<p>Our ${specName || 'new'} department stands out for its experienced professionals, modern equipment, and dedicated compassionate care.</p>` },
  { id: 't3', title: 'Technology & Infrastructure', type: 'rich_text', content: `<p>We utilize advanced diagnostics and treatment facilities to deliver high-quality, precise clinical results in ${specName || 'this speciality'}.</p>` },
  { id: 't4', title: 'Services', type: 'rich_text', content: `<p>We offer a wide range of inpatient and outpatient services to cater to diverse medical requirements.</p>` },
  { id: 't5', title: 'Our Experts', type: 'specialists', content: `<p>Meet our leading specialist physicians and support staff who work together to ensure your well-being.</p>`, cards: [], items: [] }
];

const AddSpeciality = () => {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const editId = paramId || searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [icon, setIcon] = useState('star');
  const [shortDescription, setShortDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [status, setStatus] = useState(true);
  const [adminId, setAdminId] = useState('ADM-001');
  const [adminName, setAdminName] = useState('Super Administrator');
  const [saving, setSaving] = useState(false);

  // Custom Alert / Error Dialog State
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

  // Tabs structure state
  const [tabs, setTabs] = useState([]);

  // Doctors directory state
  const [doctorsList, setDoctorsList] = useState([]);

  const [state, setState] = useState(defaultSpecialitiesState);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      initialDoctors(),
      getSpecialitiesState(defaultSpecialitiesState)
    ]).then(([docs, res]) => {
      if (!isMounted) return;
      const loadedDocs = docs || [];
      setDoctorsList(loadedDocs);

      if (res && res.specialities) {
        res.specialities.forEach(ensureStandardTabs);
      }
      setState(res);

      if (editId && res && res.specialities) {
        const match = res.specialities.find(s => s.id === editId);
        if (match) {
          setName(match.name || '');
          setCategoryId(match.categoryId || '');
          setIcon(match.icon || 'star');
          setShortDescription(match.shortDescription || '');
          setBannerImage(match.bannerImage || match.thumbnailImage || '');
          setStatus(match.status !== false);
          setAdminId(match.adminId || 'ADM-001');
          setAdminName(match.adminName || 'Super Administrator');

          const plainTabs = (match.tabs || []).map((t, idx) => {
            const isExpertTab =
              t.id === 't5' ||
              (t.title || '').toLowerCase().includes('expert') ||
              (t.title || '').toLowerCase().includes('specialist') ||
              (t.title || '').toLowerCase().includes('doctor') ||
              t.type === 'specialists' ||
              t.type === 'cards';

            const rawCards = t.cards || t.items || t.specialists || t.experts || [];
            let cards = [];
            const seenIds = new Set();

            if (Array.isArray(rawCards) && rawCards.length > 0) {
              rawCards.forEach((c, cIdx) => {
                if (!c) return;
                const docId = c.doctorId || c.id;
                const dedupKey = docId || (c.name ? c.name.toLowerCase().trim() : `card_${cIdx}`);
                if (seenIds.has(dedupKey)) return;
                seenIds.add(dedupKey);

                const matchedDoc = loadedDocs.find(
                  d => String(d.id) === String(docId) ||
                    (d.name && c.name && d.name.toLowerCase().trim() === c.name.toLowerCase().trim())
                );

                cards.push({
                  id: c.id || docId || `card_${Date.now()}_${cIdx}`,
                  doctorId: docId || matchedDoc?.id || '',
                  name: c.name || c.doctorName || c.title || matchedDoc?.name || '',
                  designation: c.designation || c.role || c.subSpeciality || matchedDoc?.subSpeciality || matchedDoc?.speciality || matchedDoc?.department || '',
                  qualifications: c.qualifications || c.qualification || matchedDoc?.qualifications || '',
                  qualification: c.qualifications || c.qualification || matchedDoc?.qualifications || '',
                  experience: c.experience || matchedDoc?.experience || '',
                  image: c.image || c.photo || c.imageUrl || matchedDoc?.image || matchedDoc?.photo || '',
                  photo: c.photo || c.image || c.imageUrl || matchedDoc?.image || matchedDoc?.photo || '',
                  department: c.department || matchedDoc?.department || ''
                });
              });
            } else if (isExpertTab && typeof t.content === 'string' && t.content.trim()) {
              // Extract legacy HTML/text doctors if rawCards was empty
              if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
                try {
                  const parser = new DOMParser();
                  const docHtml = parser.parseFromString(t.content, 'text/html');
                  const pElements = Array.from(docHtml.querySelectorAll('p, li'));
                  pElements.forEach((p, pIdx) => {
                    const text = p.textContent?.trim() || '';
                    if (!text || text.startsWith('Meet our leading') || text.startsWith('Welcome to')) return;

                    const strong = p.querySelector('strong, b');
                    let docName = '';
                    let docDes = '';
                    if (strong && strong.textContent) {
                      docName = strong.textContent.trim();
                      docDes = text.replace(docName, '').replace(/^[\s\-–—:]+/, '').trim();
                    } else if (text.includes(' - ') || text.includes(' – ')) {
                      const parts = text.split(/[\-–—]/);
                      docName = (parts[0] || '').trim();
                      docDes = (parts.slice(1).join(' - ') || '').trim();
                    } else if (text.toLowerCase().startsWith('dr.') || text.toLowerCase().startsWith('dr ')) {
                      docName = text;
                    }

                    if (docName && (docName.toLowerCase().startsWith('dr') || loadedDocs.some(d => d.name && d.name.toLowerCase() === docName.toLowerCase()))) {
                      const matchedDoc = loadedDocs.find(
                        d => d.name && (d.name.toLowerCase().trim() === docName.toLowerCase().trim() || docName.toLowerCase().includes(d.name.toLowerCase().trim()))
                      );
                      const dedupKey = matchedDoc?.id || docName.toLowerCase().trim();
                      if (!seenIds.has(dedupKey)) {
                        seenIds.add(dedupKey);
                        cards.push({
                          id: matchedDoc?.id || `card_legacy_${Date.now()}_${pIdx}`,
                          doctorId: matchedDoc?.id || '',
                          name: matchedDoc?.name || docName,
                          designation: docDes || matchedDoc?.subSpeciality || matchedDoc?.speciality || matchedDoc?.department || '',
                          qualifications: matchedDoc?.qualifications || docDes || '',
                          qualification: matchedDoc?.qualifications || docDes || '',
                          image: matchedDoc?.image || matchedDoc?.photo || '',
                          photo: matchedDoc?.photo || matchedDoc?.image || '',
                          experience: matchedDoc?.experience || '',
                          department: matchedDoc?.department || ''
                        });
                      }
                    }
                  });
                } catch (e) {
                  console.warn('Error parsing legacy doctor content in AddSpeciality:', e);
                }
              }
            }

            return {
              ...t,
              id: t.id || `t${idx + 1}`,
              title: t.title || `Tab ${idx + 1}`,
              type: isExpertTab ? 'specialists' : (t.type || 'rich_text'),
              content: t.content || '',
              cards: cards,
              items: cards
            };
          });
          setTabs(plainTabs);
        }
      } else {
        setTabs(getInitialCreateTabs(''));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [editId]);

  const handleCategoryChange = (val) => {
    setCategoryId(val || '');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showAlert({
        title: 'File Size Exceeded',
        message: 'File size exceeds 10MB limit. Please choose a smaller image.',
        type: 'warning'
      });
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        const res = await fetch('http://localhost:5000/api/specialities/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            specialityName: name || 'speciality',
            fileName: file.name,
            base64Data
          })
        });

        const data = await res.json();
        if (data.success && data.url) {
          setBannerImage(data.url);
          setUploadSuccess(true);
        } else {
          showAlert({
            title: 'Upload Failed',
            message: data.error || 'Unknown error occurred while uploading image.',
            type: 'error'
          });
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
      showAlert({
        title: 'Upload Error',
        message: 'Image upload failed. Please check backend connection.',
        type: 'error'
      });
      setUploading(false);
    }
  };

  // Image Upload processor for Doctor Cards (reusing services upload pattern)
  const processImageUpload = (file, onSuccess) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showAlert({
        title: 'File Size Exceeded',
        message: 'The selected image exceeds the 10MB limit. Please choose a smaller image file.',
        type: 'warning'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      try {
        const res = await fetch('http://localhost:5000/api/specialities/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            specialityName: name || 'speciality',
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
      }
    };
    reader.readAsDataURL(file);
  };

  // ----------------------------------------------------
  // STRUCTURED SPECIALIST DOCTOR CARD HANDLERS
  // ----------------------------------------------------

  const handleAddCard = (tabIdx) => {
    const tab = tabs[tabIdx];
    const cards = tab.cards || tab.items || [];
    const newCard = {
      id: `card_${Date.now()}_${cards.length + 1}`,
      doctorId: '',
      name: '',
      designation: '',
      qualifications: '',
      qualification: '',
      image: '',
      photo: ''
    };
    const updatedCards = [...cards, newCard];
    const updatedTabs = [...tabs];
    updatedTabs[tabIdx] = {
      ...updatedTabs[tabIdx],
      cards: updatedCards,
      items: updatedCards
    };
    setTabs(updatedTabs);
  };

  const handlePickDoctorForCard = (tabIdx, cardIdx, docId) => {
    if (!docId) return;
    const doc = doctorsList.find(d => String(d.id) === String(docId));
    if (!doc) return;
    const tab = tabs[tabIdx];
    const cards = [...(tab.cards || tab.items || [])];
    const currentCard = cards[cardIdx] || {};
    cards[cardIdx] = {
      ...currentCard,
      id: currentCard.id || doc.id || `card_${Date.now()}_${cardIdx + 1}`,
      doctorId: doc.id,
      name: doc.name || currentCard.name || '',
      designation: doc.speciality || doc.department || doc.subSpeciality || doc.designation || doc.role || currentCard.designation || 'Specialist',
      qualifications: doc.qualifications || doc.qualification || currentCard.qualifications || '',
      qualification: doc.qualifications || doc.qualification || currentCard.qualification || '',
      image: doc.image || doc.photo || doc.imageUrl || currentCard.image || '',
      photo: doc.image || doc.photo || doc.imageUrl || currentCard.photo || '',
      department: doc.department || currentCard.department || '',
      experience: doc.experience || currentCard.experience || ''
    };
    const updatedTabs = [...tabs];
    updatedTabs[tabIdx] = {
      ...updatedTabs[tabIdx],
      cards,
      items: cards
    };
    setTabs(updatedTabs);
  };

  const handleUpdateCard = (tabIdx, cardIdx, updatedFields) => {
    const tab = tabs[tabIdx];
    const cards = [...(tab.cards || tab.items || [])];
    cards[cardIdx] = {
      ...cards[cardIdx],
      ...updatedFields,
      ...(updatedFields.image !== undefined && { photo: updatedFields.image }),
      ...(updatedFields.photo !== undefined && { image: updatedFields.photo }),
      ...(updatedFields.qualifications !== undefined && { qualification: updatedFields.qualifications }),
      ...(updatedFields.qualification !== undefined && { qualifications: updatedFields.qualification })
    };
    const updatedTabs = [...tabs];
    updatedTabs[tabIdx] = {
      ...updatedTabs[tabIdx],
      cards,
      items: cards
    };
    setTabs(updatedTabs);
  };

  const handleDeleteCard = (tabIdx, cardIdx) => {
    const tab = tabs[tabIdx];
    const cards = (tab.cards || tab.items || []).filter((_, idx) => idx !== cardIdx);
    const updatedTabs = [...tabs];
    updatedTabs[tabIdx] = {
      ...updatedTabs[tabIdx],
      cards,
      items: cards
    };
    setTabs(updatedTabs);
  };

  const handleNameChange = (newName) => {
    setName(newName);
    if (!editId) {
      setTabs(prev => (prev || []).map(t => {
        if (t.id === 't1') {
          const content = t.content;
          const isStr = typeof content === 'string';
          const isDefaultText = !content || (isStr && (
            content.startsWith('<p>Welcome to the') ||
            content.startsWith('Welcome to the') ||
            content === ''
          ));

          if (isDefaultText) {
            return {
              ...t,
              content: `<p>Welcome to the ${newName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.</p>`
            };
          }
        }
        return t;
      }));
    }
  };

  const handleUpdateTabContent = (idx, newContent) => {
    const updatedTabs = [...tabs];
    updatedTabs[idx] = { ...updatedTabs[idx], content: newContent };
    setTabs(updatedTabs);
  };

  const handleUpdateTabTitle = (idx, newTitle) => {
    const updatedTabs = [...tabs];
    updatedTabs[idx] = { ...updatedTabs[idx], title: newTitle };
    setTabs(updatedTabs);
  };

  const handleAddCustomTab = () => {
    const customCount = (tabs || []).filter(t => t.isCustom || !['t1', 't2', 't3', 't4', 't5'].includes(t.id)).length;
    const newTab = {
      id: `custom-${Date.now()}`,
      title: `Custom Section ${customCount + 1}`,
      type: 'rich_text',
      content: '<p></p>',
      isCustom: true
    };
    setTabs(prev => [...(prev || []), newTab]);
  };

  const handleDeleteCustomTab = (idx) => {
    setTabs(prev => (prev || []).filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showAlert({
        title: 'Speciality Name Required',
        message: 'Please enter a name for the speciality before submitting.',
        type: 'error'
      });
      return;
    }

    if (!categoryId) {
      showAlert({
        title: 'Parent Category Required',
        message: 'Please select a parent category before submitting.',
        type: 'warning'
      });
      return;
    }

    const now = new Date().toISOString();

    const preparedTabs = tabs.map((t, idx) => {
      const isExpertTab =
        t.id === 't5' ||
        (t.title || '').toLowerCase().includes('expert') ||
        (t.title || '').toLowerCase().includes('specialist') ||
        (t.title || '').toLowerCase().includes('doctor') ||
        t.type === 'specialists' ||
        t.type === 'cards';

      if (isExpertTab) {
        const rawCards = t.cards || t.items || [];
        const structuredCards = rawCards.map((c, cIdx) => ({
          id: c.id || c.doctorId || `doc_${Date.now()}_${cIdx}`,
          doctorId: c.doctorId || c.id || '',
          name: c.name || '',
          designation: c.designation || c.role || '',
          qualifications: c.qualifications || c.qualification || '',
          qualification: c.qualifications || c.qualification || '',
          role: c.designation || c.role || '',
          experience: c.experience || '',
          image: c.image || c.photo || '',
          photo: c.photo || c.image || '',
          department: c.department || ''
        }));

        return {
          ...t,
          type: 'specialists',
          content: t.content || '',
          cards: structuredCards,
          items: structuredCards
        };
      }

      return {
        ...t,
        type: t.type || 'rich_text',
        content: t.content || ''
      };
    });

    let updatedSpecs;
    if (editId) {
      updatedSpecs = state.specialities.map(s => {
        if (s.id === editId) {
          const updated = {
            ...s,
            name,
            categoryId,
            icon,
            shortDescription,
            bannerImage: bannerImage || s.bannerImage || '',
            thumbnailImage: bannerImage || s.thumbnailImage || '',
            status,
            adminId: adminId.trim() || 'ADM-001',
            adminName: adminName.trim() || 'Super Administrator',
            updatedAt: now,
            tabs: preparedTabs.length > 0 ? preparedTabs : s.tabs
          };
          ensureStandardTabs(updated);
          return updated;
        }
        return s;
      });
    } else {
      const newSpec = {
        id: `s${Date.now()}`,
        categoryId,
        name,
        icon,
        shortDescription,
        bannerImage: bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
        thumbnailImage: bannerImage || 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop',
        status,
        adminId: adminId.trim() || 'ADM-001',
        adminName: adminName.trim() || 'Super Administrator',
        createdAt: now,
        updatedAt: now,
        tabs: preparedTabs
      };
      ensureStandardTabs(newSpec);
      updatedSpecs = [...(state?.specialities || []), newSpec];
    }

    setSaving(true);
    const newState = { ...(state || defaultSpecialitiesState), specialities: updatedSpecs };
    saveSpecialitiesState(newState)
      .then(async () => {
        window.dispatchEvent(new Event('admin_data_updated'));
        window.dispatchEvent(new Event('storage'));
        setSaving(false);
        await showSuccessAlert(
          editId ? 'Speciality Updated!' : 'Speciality Created!',
          `Speciality "${name}" has been saved successfully.`
        );
        navigate('/admin/specialities');
      })
      .catch((err) => {
        console.error('Error saving speciality:', err);
        setSaving(false);
        showAlert({
          title: 'Save Error',
          message: err.message || 'Failed to save speciality.',
          type: 'error'
        });
      });
  };

  // Sort categories: active categories first, then by order
  const sortedCategories = [...(state?.categories || [])].sort((a, b) => {
    const isInactiveA = a.status === false;
    const isInactiveB = b.status === false;

    if (isInactiveA !== isInactiveB) {
      return isInactiveA ? 1 : -1;
    }

    return (a.order || 0) - (b.order || 0);
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 leading-tight">{editId ? 'Edit Speciality details' : 'Add New Speciality'}</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5 font-sans">Configure clinical speciality details, icons, and tab descriptions.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs text-slate-700">

        {/* Main Details Section */}
        <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
          <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2">Main Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 uppercase">Speciality Name *</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
                placeholder="e.g. Cardiology"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Parent Category *</label>
              <select
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
              >
                <option value="" disabled>Select Parent Category</option>
                {sortedCategories.map(c => {
                  const count = (state?.specialities || []).filter(s => s.categoryId === c.id && s.id !== editId).length;
                  const isInactive = c.status === false;
                  let statusBadge = isInactive ? ' - Inactive' : '';
                  return (
                    <option key={c.id} value={c.id}>
                      {c.name} ({count} {count === 1 ? 'speciality' : 'specialities'}){statusBadge}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Material Icon Identifier</label>
              <input
                type="text"
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
                placeholder="e.g. star"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-500 uppercase">Brief Intro Description</label>
              <textarea
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
                placeholder="Enter short description for summaries..."
                rows="2"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>

            {/* Speciality Image Upload */}
            <div className="sm:col-span-2 space-y-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-600 uppercase text-xs flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-blue-600">cloud_upload</span>
                  <span>Speciality Image (Stored in Supabase Bucket: specialities-images)</span>
                </label>
                {uploadSuccess && (
                  <span className="text-emerald-600 text-xs font-semibold flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Uploaded to Supabase</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-slate-50/60 p-3.5 rounded-xl border border-slate-200/80">
                {/* Image Preview Box */}
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 bg-white h-28 flex items-center justify-center shadow-xs">
                  {bannerImage ? (
                    <img
                      src={bannerImage}
                      alt={name || 'Speciality'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop';
                      }}
                    />
                  ) : (
                    <div className="text-center p-3 text-slate-400">
                      <span className="material-symbols-outlined text-3xl text-slate-300">image</span>
                      <p className="text-[11px] font-medium mt-0.5">No Image Uploaded</p>
                    </div>
                  )}
                </div>

                {/* Upload Controls & URL Input */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex gap-2 items-center">
                    <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed rounded-lg px-4 py-2.5 cursor-pointer font-bold transition-all text-xs ${uploading ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-xs'
                      }`}>
                      <span className="material-symbols-outlined text-base">
                        {uploading ? 'sync' : 'cloud_upload'}
                      </span>
                      <span>{uploading ? 'Uploading to Supabase...' : 'Upload Speciality Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>

                    {bannerImage && (
                      <button
                        type="button"
                        onClick={() => { setBannerImage(''); setUploadSuccess(false); }}
                        className="px-3.5 py-2.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-all border border-rose-200"
                        title="Remove Image"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 rounded-lg outline-none font-medium text-[11px] text-slate-600"
                      placeholder="Image URL (Auto-filled on upload or paste custom URL)"
                      value={bannerImage}
                      onChange={(e) => setBannerImage(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialities Tabbed Editor */}
        {tabs.length > 0 && (
          <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-[#1e3a8a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-lg">tab</span>
                  <span>Configure Department Tabs &amp; Sections</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Manage standard department sections or add dynamic custom sections.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddCustomTab}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>+ Add Custom Section</span>
              </button>
            </div>

            <div className="space-y-6 pt-1">
              {tabs.map((tab, idx) => {
                const isCustom = tab.isCustom || !['t1', 't2', 't3', 't4', 't5'].includes(tab.id);
                const tabTitle = tab.title || 'Tab';
                const lowerTitle = tabTitle.toLowerCase();
                const isExpertTab =
                  tab.id === 't5' ||
                  lowerTitle.includes('expert') ||
                  lowerTitle.includes('specialist') ||
                  lowerTitle.includes('doctor') ||
                  tab.type === 'specialists' ||
                  tab.type === 'cards';

                const getTabIcon = () => {
                  if (tab.id === 't1' || lowerTitle === 'overview') return 'article';
                  if (tab.id === 't2' || lowerTitle.includes('why choose')) return 'verified';
                  if (tab.id === 't3' || lowerTitle.includes('technology') || lowerTitle.includes('infrastructure')) return 'biotech';
                  if (tab.id === 't4' || lowerTitle.includes('services')) return 'medical_services';
                  if (isExpertTab) return 'person_pin';
                  return 'extension';
                };

                return (
                  <div key={tab.id || idx} className="space-y-3 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                    {/* Header / Title line */}
                    {isCustom ? (
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-amber-600">extension</span>
                            <div className="flex-1 space-y-1">
                              <label className="block text-[10px] font-bold uppercase text-amber-900 tracking-wider">
                                Custom Section Title *
                              </label>
                              <input
                                type="text"
                                className="w-full bg-white border border-amber-300 focus:border-amber-500 px-3 py-1.5 rounded-lg outline-none font-bold text-xs text-slate-800 shadow-xs"
                                placeholder="e.g. Research & Publications, Patient Stories..."
                                value={tab.title || ''}
                                onChange={(e) => handleUpdateTabTitle(idx, e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <span className="bg-amber-100/80 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                              Custom Section
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomTab(idx)}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-all border border-rose-200 shadow-xs"
                              title="Delete this custom section"
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-[#1e3a8a] uppercase flex items-center gap-1.5 text-xs">
                          <span className="material-symbols-outlined text-sm text-blue-600">{getTabIcon()}</span>
                          <span>{tabTitle} {isExpertTab ? 'Management' : 'Description & Details'}</span>
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                            Standard Section
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Standard Rich Text Editor for non-expert tabs */}
                    {!isExpertTab ? (
                      <RichTextEditor
                        value={tab.content}
                        onChange={(newHtml) => handleUpdateTabContent(idx, newHtml)}
                        placeholder={`Write ${lowerTitle} content here... Use Bold (Ctrl+B) and New Paragraph buttons to format text live.`}
                        minHeight={tab.id === 't1' ? '220px' : '180px'}
                      />
                    ) : (
                      /* Structured Repeatable Specialist Doctor Cards matching Services implementation */
                      <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/80 font-sans">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm text-emerald-600">person_pin</span>
                            <span>Specialist Doctor Cards ({tab.cards?.length || tab.items?.length || 0})</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => handleAddCard(idx)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded flex items-center gap-1 transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add Specialist</span>
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {(tab.cards || tab.items || []).map((card, cardIdx) => (
                            <div key={card.id || cardIdx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1 flex-wrap">
                                  {doctorsList.length > 0 && (
                                    <select
                                      onChange={(e) => handlePickDoctorForCard(idx, cardIdx, e.target.value)}
                                      className="text-[11px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 px-2 py-1 rounded outline-none cursor-pointer"
                                      value={card.doctorId || ""}
                                    >
                                      <option value="" disabled>Quick Pick Staff Doctor...</option>
                                      {doctorsList.map(d => (
                                        <option key={d.id} value={d.id}>{d.name} ({d.speciality || d.department || 'Specialist'})</option>
                                      ))}
                                    </select>
                                  )}

                                  <input
                                    type="text"
                                    value={card.name || ''}
                                    onChange={(e) => handleUpdateCard(idx, cardIdx, { name: e.target.value })}
                                    placeholder="Doctor Name *"
                                    className="font-bold text-xs bg-white border border-slate-200 px-2.5 py-1 rounded flex-1 outline-none min-w-[140px]"
                                  />
                                  <input
                                    type="text"
                                    value={card.designation || card.role || ''}
                                    onChange={(e) => handleUpdateCard(idx, cardIdx, { designation: e.target.value, role: e.target.value })}
                                    placeholder="Designation / Role"
                                    className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded flex-1 outline-none min-w-[140px]"
                                  />
                                  <input
                                    type="text"
                                    value={card.qualifications || card.qualification || ''}
                                    onChange={(e) => handleUpdateCard(idx, cardIdx, { qualifications: e.target.value, qualification: e.target.value })}
                                    placeholder="Qualifications (e.g. MBBS, MD)"
                                    className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded w-36 outline-none"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCard(idx, cardIdx)}
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
                                    onChange={(e) => processImageUpload(e.target.files?.[0], (url) => handleUpdateCard(idx, cardIdx, { image: url, photo: url }))}
                                  />
                                </label>
                                <input
                                  type="text"
                                  value={card.image || card.photo || ''}
                                  onChange={(e) => handleUpdateCard(idx, cardIdx, { image: e.target.value, photo: e.target.value })}
                                  placeholder="Photo URL (Auto-filled on upload)..."
                                  className="text-[11px] bg-white border border-slate-200 px-2 py-1 rounded flex-1 outline-none text-slate-600"
                                />
                              </div>
                            </div>
                          ))}

                          {(tab.cards || tab.items || []).length === 0 && (
                            <div className="text-center py-5 bg-white border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                              No specialists added yet. Click "+ Add Specialist" to add doctor cards.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCustomTab}
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>+ Add Custom Section</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* End of Page - Combined Visibility Settings & Actions in One Line */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          {/* Status Dropdown on Left */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="material-symbols-outlined text-base text-blue-600">visibility</span>
            <label className="font-bold text-slate-500 uppercase text-xs whitespace-nowrap">Status:</label>
            <select
              className="bg-white border border-slate-200 focus:border-slate-300 px-3.5 py-2 rounded-lg outline-none font-medium cursor-pointer text-xs min-w-[200px]"
              value={status ? 'Live' : 'Hidden'}
              onChange={(e) => setStatus(e.target.value === 'Live')}
            >
              <option value="Live">Live (Show on Website)</option>
              <option value="Hidden">Hidden (Draft)</option>
            </select>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/specialities')}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition-all text-center text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-2.5 bg-[#fea619] hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-slate-900 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">{saving ? 'hourglass_top' : 'check_circle'}</span>
              <span>{saving ? 'Saving...' : (editId ? 'Save Changes' : 'Create Speciality')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Styled Error / Warning Alert Modal */}
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

export default AddSpeciality;
