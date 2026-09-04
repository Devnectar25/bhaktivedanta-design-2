import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';
import { initialDoctors } from '../../../data/adminState';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';

const getInitialCreateTabs = (specName) => [
  { id: 't1', title: 'Overview', content: `<p>Welcome to the ${specName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.</p>` },
  { id: 't2', title: 'Why Choose Us', content: `<p>Our ${specName || 'new'} department stands out for its experienced professionals, modern equipment, and dedicated compassionate care.</p>` },
  { id: 't3', title: 'Technology & Infrastructure', content: `<p>We utilize advanced diagnostics and treatment facilities to deliver high-quality, precise clinical results in ${specName || 'this speciality'}.</p>` },
  { id: 't4', title: 'Services', content: `<p>We offer a wide range of inpatient and outpatient services to cater to diverse medical requirements.</p>` },
  { id: 't5', title: 'Our Experts', content: `<p>Meet our leading specialist physicians and support staff who work together to ensure your well-being.</p>` }
];

const AddSpeciality = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
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

  // Doctors selection states
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [expertDesignation, setExpertDesignation] = useState('');

  const [state, setState] = useState(defaultSpecialitiesState);

  useEffect(() => {
    initialDoctors().then(docs => {
      setDoctorsList(docs || []);
    });

    getSpecialitiesState(defaultSpecialitiesState).then(res => {
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
          const plainTabs = (match.tabs || []).map(t => ({
            ...t,
            content: t.content || ''
          }));
          setTabs(plainTabs);
        }
      } else {
        setTabs(getInitialCreateTabs(''));
      }
    });
  }, [editId]);

  const handleCategoryChange = (val) => {
    if (!val) {
      setCategoryId('');
      return;
    }
    const count = state.specialities.filter(s => s.categoryId === val && s.id !== editId).length;
    if (count >= 15) {
      const catObj = state.categories.find(c => c.id === val);
      const catName = catObj ? catObj.name : 'Selected Category';
      showAlert({
        title: 'Category Limit Reached',
        itemName: `${catName} (${count}/15 specialities)`,
        message: 'This category has reached the maximum limit of 15 specialities.',
        type: 'warning'
      });
      return;
    }
    setCategoryId(val);
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
          console.log('Image uploaded successfully to Supabase:', data.url);
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

  const handleAddDoctorToTab = (tabIdx) => {
    if (!selectedDocId) return;
    const doc = doctorsList.find(d => d.id === selectedDocId);
    if (!doc) return;

    const des = expertDesignation.trim() || doc.qualifications || 'Specialist';
    const currentContent = tabs[tabIdx].content || '';

    // Append clean HTML for expert
    const expertHtml = `<p><strong>${doc.name}</strong> - ${des}</p>`;
    const updatedContent = currentContent
      ? `${currentContent}${expertHtml}`
      : expertHtml;

    handleUpdateTabContent(tabIdx, updatedContent);

    setSelectedDocId('');
    setExpertDesignation('');
  };

  const handleNameChange = (newName) => {
    setName(newName);
    if (!editId) {
      setTabs(prev => prev.map(t => {
        if (t.id === 't1' && (t.content.startsWith('<p>Welcome to the') || t.content.startsWith('Welcome to the') || t.content === '')) {
          return {
            ...t,
            content: `<p>Welcome to the ${newName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.</p>`
          };
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

    const existingCount = state.specialities.filter(s => s.categoryId === categoryId && s.id !== editId).length;
    if (existingCount >= 15) {
      const catObj = state.categories.find(c => c.id === categoryId);
      const catName = catObj ? catObj.name : 'Selected Category';
      showAlert({
        title: 'Category Limit Reached',
        itemName: `${catName} (${existingCount}/15 specialities)`,
        message: 'This category has reached the maximum limit of 15 specialities.',
        type: 'error'
      });
      return;
    }

    const now = new Date().toISOString();
    let updatedSpecs;
    if (editId) {
      const htmlTabs = tabs.map(t => ({
        ...t,
        content: t.content || ''
      }));
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
            tabs: htmlTabs.length > 0 ? htmlTabs : s.tabs
          };
          ensureStandardTabs(updated);
          return updated;
        }
        return s;
      });
    } else {
      const htmlTabs = tabs.map(t => ({
        ...t,
        content: t.content || ''
      }));
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
        tabs: htmlTabs
      };
      ensureStandardTabs(newSpec);
      updatedSpecs = [...state.specialities, newSpec];
    }

    const newState = { ...state, specialities: updatedSpecs };
    saveSpecialitiesState(newState).then(() => {
      navigate('/admin/specialities');
    });
  };

  // Sort categories: active with available slots first, inactive or full (15/15) at bottom
  const sortedCategories = [...(state.categories || [])].sort((a, b) => {
    const countA = state.specialities.filter(s => s.categoryId === a.id && s.id !== editId).length;
    const isFullA = countA >= 15;
    const isInactiveA = a.status === false || isFullA;

    const countB = state.specialities.filter(s => s.categoryId === b.id && s.id !== editId).length;
    const isFullB = countB >= 15;
    const isInactiveB = b.status === false || isFullB;

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
                  const count = state.specialities.filter(s => s.categoryId === c.id && s.id !== editId).length;
                  const isFull = count >= 15;
                  const isInactive = c.status === false;
                  const isDisabled = isFull || isInactive;
                  let statusBadge = '';
                  if (isFull) {
                    statusBadge = ' - Limit Reached (15/15)';
                  } else if (isInactive) {
                    statusBadge = ' - Inactive';
                  }
                  return (
                    <option key={c.id} value={c.id} disabled={isDisabled}>
                      {c.name} ({count}/15 specialities){statusBadge}
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

            {/* Speciality Image Upload (Stored in Supabase Bucket under Speciality Name) */}
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
            <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lg">tab</span>
              <span>Configure Department Tabs</span>
            </h3>

            <div className="space-y-4 pt-2">
              {tabs.map((tab, idx) => {
                const getTabIcon = () => {
                  if (tab.id === 't1' || tab.title === 'Overview') return 'article';
                  if (tab.id === 't2' || tab.title.toLowerCase().includes('why choose')) return 'verified';
                  if (tab.id === 't3' || tab.title.toLowerCase().includes('technology') || tab.title.toLowerCase().includes('infrastructure')) return 'biotech';
                  if (tab.id === 't4' || tab.title.toLowerCase().includes('services')) return 'medical_services';
                  return 'groups';
                };

                return (
                  <div key={tab.id} className="space-y-3 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-[#1e3a8a] uppercase flex items-center gap-1.5 text-xs">
                        <span className="material-symbols-outlined text-sm text-blue-600">{getTabIcon()}</span>
                        <span>{tab.title} Description &amp; Details</span>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                          Live Rich-Text Editor
                        </span>
                      </label>
                    </div>

                    <RichTextEditor
                      value={tab.content}
                      onChange={(newHtml) => handleUpdateTabContent(idx, newHtml)}
                      placeholder={`Write ${tab.title.toLowerCase()} content here... Use Bold (Ctrl+B) and New Paragraph buttons to format text live.`}
                      minHeight={tab.id === 't1' ? '220px' : '180px'}
                    />

                    {/* Doctor selection sub-form for Our Experts tab */}
                    {(tab.id === 't5' || tab.title === 'Our Experts') && (
                      <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3 font-sans">
                        <p className="font-bold text-slate-700 flex items-center gap-1.5 text-xs">
                          <span className="material-symbols-outlined text-base text-[#1e3a8a]">person_add</span>
                          <span>Insert Doctor from Directory into Experts Content</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <select
                              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer text-xs"
                              value={selectedDocId}
                              onChange={(e) => setSelectedDocId(e.target.value)}
                            >
                              <option value="">-- Select Doctor --</option>
                              {doctorsList.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
                              ))}
                            </select>
                          </div>

                          <div className="flex-1">
                            <input
                              type="text"
                              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium text-xs"
                              placeholder="Designation/Qualifications (e.g. Senior Consultant)"
                              value={expertDesignation}
                              onChange={(e) => setExpertDesignation(e.target.value)}
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAddDoctorToTab(idx)}
                            disabled={!selectedDocId}
                            className="bg-[#1e3a8a] text-white hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 text-xs shadow-xs"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add to Content</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
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
              className="w-full sm:w-auto px-8 py-2.5 bg-[#fea619] hover:bg-amber-500 text-slate-900 rounded-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              <span>{editId ? 'Save Changes' : 'Create Speciality'}</span>
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
