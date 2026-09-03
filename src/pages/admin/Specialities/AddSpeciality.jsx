import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';
import { initialDoctors } from '../../../data/adminState';

// Utility helpers to convert between DB HTML structure and Admin-friendly raw plain text
function applyInlineFormatting(str) {
  if (!str) return '';
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
}

function htmlToText(html) {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  let result = [];
  
  for (let i = 0; i < temp.childNodes.length; i++) {
    const node = temp.childNodes[i];
    
    if (node.nodeType === 1) { // Node.ELEMENT_NODE
      const tagName = node.tagName.toLowerCase();
      
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4') {
        const text = node.textContent.trim();
        result.push(`### ${text}`);
      } else if (tagName === 'p') {
        let pContent = [];
        node.childNodes.forEach(child => {
          if (child.nodeType === 1 && (child.tagName.toLowerCase() === 'strong' || child.tagName.toLowerCase() === 'b')) {
            pContent.push(`**${child.textContent.trim()}**`);
          } else {
            pContent.push(child.textContent);
          }
        });
        result.push(pContent.join('').trim());
      } else if (tagName === 'ul') {
        const lis = node.getElementsByTagName('li');
        const listItems = [];
        for (let j = 0; j < lis.length; j++) {
          const li = lis[j];
          const strong = li.querySelector('strong, b');
          if (strong) {
            const label = strong.textContent.trim().replace(/:$/, '');
            const restOfText = li.textContent.replace(strong.textContent, '').trim();
            listItems.push(`* ${label}: ${restOfText}`);
          } else {
            listItems.push(`* ${li.textContent.trim()}`);
          }
        }
        result.push(listItems.join('\n'));
      } else if (tagName === 'div' && (node.className.includes('grid') || node.className.includes('gap-4'))) {
        const cards = node.querySelectorAll('.border, div');
        const experts = [];
        cards.forEach(card => {
          const h4 = card.querySelector('h4');
          const p = card.querySelector('p');
          if (h4 && p) {
            experts.push(`* Expert: ${h4.textContent.trim()} - ${p.textContent.trim()}`);
          }
        });
        if (experts.length > 0) {
          result.push(experts.join('\n'));
        } else {
          const txt = node.textContent.trim();
          if (txt) result.push(txt);
        }
      } else {
        const text = node.textContent.trim();
        if (text) result.push(text);
      }
    } else if (node.nodeType === 3) {
      const text = node.textContent.trim();
      if (text) result.push(text);
    }
  }
  
  return result.join('\n\n');
}

function textToHtml(text, tabTitle = '') {
  if (!text) return '';
  
  const isBulletOnlyTab = tabTitle && (
    tabTitle.toLowerCase().includes('why choose us') || 
    tabTitle.toLowerCase().includes('technology') || 
    tabTitle.toLowerCase().includes('infrastructure')
  );

  const blocks = text.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';
    
    // Title / Subheading check (e.g. ### Title, ## Title, # Title)
    if (!isBulletOnlyTab && lines.length === 1 && (/^#{1,3}\s+/.test(lines[0]) || /^title:\s*/i.test(lines[0]))) {
      const cleanTitle = lines[0].replace(/^#{1,3}\s+/, '').replace(/^title:\s*/i, '').trim();
      return `<h3 class="text-[#1e3a8a] text-lg font-bold mt-4 mb-2">${applyInlineFormatting(cleanTitle)}</h3>`;
    }

    const isList = isBulletOnlyTab || lines.every(line => line.startsWith('*') || line.startsWith('-'));
    
    if (isList) {
      const isExperts = lines.every(line => {
        const clean = line.replace(/^[\*\-\s]+/, '');
        return clean.toLowerCase().startsWith('expert:');
      });
      
      if (isExperts) {
        const cardsHtml = lines.map(line => {
          const clean = line.replace(/^[\*\-\s]+/, '').replace(/^expert:\s*/i, '');
          const parts = clean.split(/\s*-\s*/);
          const name = parts[0] || '';
          const title = parts[1] || '';
          return `<div class="border p-4 rounded-lg bg-slate-50"><h4 class="font-bold text-[#1e3a8a]">${applyInlineFormatting(name)}</h4><p class="text-sm text-[#757682]">${applyInlineFormatting(title)}</p></div>`;
        }).join('');
        return `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">${cardsHtml}</div>`;
      }
      
      const listItemsHtml = lines.map(line => {
        const clean = line.replace(/^[\*\-\s]+/, '');
        const colonIndex = clean.indexOf(':');
        if (colonIndex > 0 && colonIndex < 30) {
          const label = clean.substring(0, colonIndex).trim();
          const rest = clean.substring(colonIndex + 1).trim();
          return `<li><strong>${label}:</strong> ${applyInlineFormatting(rest)}</li>`;
        }
        return `<li>${applyInlineFormatting(clean)}</li>`;
      }).join('');
      
      return `<ul class="list-disc pl-5 space-y-2 mb-4 text-slate-700">${listItemsHtml}</ul>`;
    }
    
    const formattedParagraph = applyInlineFormatting(lines.join(' '));
    return `<p class="mb-4 text-slate-700 leading-relaxed">${formattedParagraph}</p>`;
  });
  
  return formattedBlocks.filter(Boolean).join('');
}

const getInitialCreateTabs = (specName) => [
  { id: 't1', title: 'Overview', content: `Welcome to the ${specName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.` },
  { id: 't2', title: 'Why Choose Us', content: `Our department stands out for its experienced professionals, modern equipment, and dedicated compassionate care.` },
  { id: 't3', title: 'Technology & Infrastructure', content: `We utilize advanced diagnostics and treatment facilities to deliver high-quality, precise clinical results.` },
  { id: 't4', title: 'Services', content: `We offer a wide range of inpatient and outpatient services to cater to diverse medical requirements.` },
  { id: 't5', title: 'Our Experts', content: `Meet our leading specialist physicians and support staff who work together to ensure your well-being.` }
];

const AddSpeciality = () => {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('c1');
  const [icon, setIcon] = useState('star');
  const [shortDescription, setShortDescription] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [status, setStatus] = useState(true);
  const [adminId, setAdminId] = useState('ADM-001');
  const [adminName, setAdminName] = useState('Super Administrator');

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
          setCategoryId(match.categoryId || 'c1');
          setIcon(match.icon || 'star');
          setShortDescription(match.shortDescription || '');
          setBannerImage(match.bannerImage || match.thumbnailImage || '');
          setStatus(match.status !== false);
          setAdminId(match.adminId || 'ADM-001');
          setAdminName(match.adminName || 'Super Administrator');
          const plainTabs = (match.tabs || []).map(t => ({
            ...t,
            content: htmlToText(t.content)
          }));
          setTabs(plainTabs);
        }
      } else {
        setTabs(getInitialCreateTabs(''));
      }
    });
  }, [editId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please choose a smaller image.');
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
          alert('Upload failed: ' + (data.error || 'Unknown error'));
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed. Please check backend connection.');
      setUploading(false);
    }
  };

  const handleAddDoctorToTab = (tabIdx) => {
    if (!selectedDocId) return;
    const doc = doctorsList.find(d => d.id === selectedDocId);
    if (!doc) return;
    
    const des = expertDesignation.trim() || doc.qualifications || 'Specialist';
    const currentContent = tabs[tabIdx].content || '';
    
    // Append new expert line
    const expertLine = `* Expert: ${doc.name} - ${des}`;
    const updatedContent = currentContent 
      ? `${currentContent.trim()}\n${expertLine}` 
      : expertLine;
      
    handleUpdateTabContent(tabIdx, updatedContent);
    
    setSelectedDocId('');
    setExpertDesignation('');
  };

  const handleInsertFormat = (tabIdx, formatType, customText = '') => {
    const current = tabs[tabIdx]?.content || '';
    let updated = '';
    
    if (formatType === 'title') {
      const titleText = customText || 'Department Overview';
      updated = current ? `${current.trim()}\n\n### ${titleText}\n` : `### ${titleText}\n`;
    } else if (formatType === 'bold') {
      updated = current ? `${current} **bold text**` : '**bold text**';
    } else if (formatType === 'paragraph') {
      updated = current ? `${current.trim()}\n\n` : '';
    }
    
    handleUpdateTabContent(tabIdx, updated);
  };

  const handleApplyFormattingToSelection = (targetElement, tabIdx, formatType, customText = '') => {
    if (!targetElement) {
      handleInsertFormat(tabIdx, formatType, customText);
      return;
    }

    const start = targetElement.selectionStart;
    const end = targetElement.selectionEnd;
    const val = targetElement.value || '';

    const isOverviewBody = targetElement.id === 'overview-body-textarea';
    const isOverview = tabs[tabIdx]?.id === 't1' || tabs[tabIdx]?.title === 'Overview';

    if (start !== undefined && end !== undefined && start !== end) {
      const selected = val.substring(start, end);
      let formatted = '';

      if (formatType === 'bold') {
        if (selected.startsWith('**') && selected.endsWith('**')) {
          formatted = selected.slice(2, -2);
        } else {
          formatted = `**${selected}**`;
        }
      } else if (formatType === 'title') {
        formatted = `### ${selected}\n`;
      } else if (formatType === 'paragraph') {
        formatted = `\n\n${selected}\n\n`;
      }

      const newVal = val.substring(0, start) + formatted + val.substring(end);

      if (isOverview && isOverviewBody) {
        const { title } = parseOverviewContent(tabs[tabIdx].content);
        handleUpdateTabContent(tabIdx, combineOverviewContent(title, newVal));
      } else {
        handleUpdateTabContent(tabIdx, newVal);
      }

      setTimeout(() => {
        targetElement.focus();
        targetElement.setSelectionRange(start, start + formatted.length);
      }, 0);
    } else {
      handleInsertFormat(tabIdx, formatType, customText);
    }
  };

  const parseOverviewContent = (content) => {
    if (!content) return { title: '', body: '' };
    const lines = content.split('\n');
    const firstLine = lines[0] ? lines[0].trim() : '';
    if (/^#{1,3}\s+/.test(firstLine) || /^title:\s*/i.test(firstLine)) {
      const title = firstLine.replace(/^#{1,3}\s+/, '').replace(/^title:\s*/i, '').trim();
      const body = lines.slice(1).join('\n').trim();
      return { title, body };
    }
    return { title: '', body: content };
  };

  const combineOverviewContent = (title, body) => {
    const cleanTitle = title ? title.trim() : '';
    const cleanBody = body ? body.trim() : '';
    if (cleanTitle) {
      return `### ${cleanTitle}\n\n${cleanBody}`;
    }
    return cleanBody;
  };

  const handleNameChange = (newName) => {
    setName(newName);
    if (!editId) {
      setTabs(prev => prev.map(t => {
        if (t.id === 't1' && (t.content.startsWith('Welcome to the') || t.content === '')) {
          return {
            ...t,
            content: `Welcome to the ${newName || 'new'} department. We provide comprehensive care and support tailored to each patient's needs.`
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

    if (!name) {
      alert("Speciality name is required.");
      return;
    }

    if (categoryId) {
      const existingCount = state.specialities.filter(s => s.categoryId === categoryId && s.id !== editId).length;
      if (existingCount >= 15) {
        const catObj = state.categories.find(c => c.id === categoryId);
        const catName = catObj ? catObj.name : 'Selected Category';
        alert(`The category "${catName}" has reached the maximum limit of 15 specialities. You cannot assign more specialities to this category.`);
        return;
      }
    }

    const now = new Date().toISOString();
    let updatedSpecs;
    if (editId) {
      const htmlTabs = tabs.map(t => ({
        ...t,
        content: textToHtml(t.content, t.title)
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
        content: textToHtml(t.content, t.title)
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
                <label className="font-bold text-slate-500 uppercase">Parent Category</label>
                <select 
                  className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {state.categories.map(c => {
                    const count = state.specialities.filter(s => s.categoryId === c.id && s.id !== editId).length;
                    const isFull = count >= 15;
                    return (
                      <option key={c.id} value={c.id} disabled={isFull}>
                        {c.name} ({count}/15 specialities){isFull ? ' - MAX 15 REACHED' : ''}
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
                      <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed rounded-lg px-4 py-2.5 cursor-pointer font-bold transition-all text-xs ${
                        uploading ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-50 shadow-xs'
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
                  const isOverview = tab.id === 't1' || tab.title === 'Overview';

                  if (isOverview) {
                    const parsed = parseOverviewContent(tab.content);
                    return (
                      <div key={tab.id} className="space-y-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-[#1e3a8a] uppercase flex items-center gap-1.5 text-xs">
                            <span>{tab.title}</span>
                            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200">
                              Overview Section
                            </span>
                          </label>
                        </div>

                        {/* Separated Overview Title & Body Box */}
                        <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                          {/* Separated Title Field */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-blue-600">title</span>
                                <span>Overview Title</span>
                              </label>

                              {/* Predefined Title Preset Selector */}
                              <select 
                                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-2 py-0.5 rounded text-[11px] outline-none font-semibold cursor-pointer shadow-2xs"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    const updated = combineOverviewContent(e.target.value, parsed.body);
                                    handleUpdateTabContent(idx, updated);
                                    e.target.value = '';
                                  }
                                }}
                              >
                                <option value="">+ Predefined Preset Title</option>
                                <option value="Department Overview">Department Overview</option>
                                <option value="Key Clinical Highlights">Key Clinical Highlights</option>
                                <option value="Specialized Treatments & Care">Specialized Treatments & Care</option>
                                <option value="Patient-Centric Care">Patient-Centric Care</option>
                              </select>
                            </div>

                            <input 
                              type="text"
                              className="w-full bg-white border border-slate-200 focus:border-blue-400 px-3 py-2 rounded-lg outline-none font-bold text-slate-800 text-xs shadow-2xs"
                              placeholder="e.g. Department Overview / Key Clinical Highlights"
                              value={parsed.title}
                              onChange={(e) => {
                                const updated = combineOverviewContent(e.target.value, parsed.body);
                                handleUpdateTabContent(idx, updated);
                              }}
                            />
                          </div>

                          {/* Separated Content / Description Field */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm text-blue-600">description</span>
                                <span>Overview Description &amp; Paragraphs</span>
                              </label>

                              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-lg text-xs">
                                <span className="font-bold text-slate-500 text-[10px] uppercase mr-0.5">Format:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const el = document.getElementById('overview-body-textarea');
                                    handleApplyFormattingToSelection(el, idx, 'bold');
                                  }}
                                  className="hover:bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold transition-all text-[11px] flex items-center gap-0.5"
                                  title="Bold Selected Text (Ctrl+B)"
                                >
                                  <span className="material-symbols-outlined text-[13px]">format_bold</span>
                                  <span>Bold Text</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const el = document.getElementById('overview-body-textarea');
                                    handleApplyFormattingToSelection(el, idx, 'paragraph');
                                  }}
                                  className="hover:bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold transition-all text-[11px] flex items-center gap-0.5"
                                  title="Insert Paragraph Break"
                                >
                                  <span className="material-symbols-outlined text-[13px]">segment</span>
                                  <span>New Paragraph</span>
                                </button>
                              </div>
                            </div>

                            <textarea 
                              id="overview-body-textarea"
                              className="w-full bg-white border border-slate-200 focus:border-blue-400 px-3 py-2 rounded-lg outline-none font-medium leading-relaxed font-sans text-xs shadow-2xs" 
                              rows="7"
                              placeholder="Write overview paragraphs here... Select text and press Ctrl+B to make bold."
                              value={parsed.body}
                              onKeyDown={(e) => {
                                if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
                                  e.preventDefault();
                                  handleApplyFormattingToSelection(e.target, idx, 'bold');
                                }
                              }}
                              onChange={(e) => {
                                const updated = combineOverviewContent(parsed.title, e.target.value);
                                handleUpdateTabContent(idx, updated);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={tab.id} className="space-y-1.5 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                      <label className="font-bold text-[#1e3a8a] uppercase block text-xs">{tab.title}</label>

                    <textarea 
                      id={`tab-textarea-${idx}`}
                      className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium leading-relaxed font-sans" 
                      rows="8"
                      value={tab.content}
                      onKeyDown={(e) => {
                        if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
                          e.preventDefault();
                          handleApplyFormattingToSelection(e.target, idx, 'bold');
                        }
                      }}
                      onChange={(e) => handleUpdateTabContent(idx, e.target.value)}
                    />
                    
                    {/* Doctor selection sub-form for Our Experts tab */}
                    {(tab.id === 't5' || tab.title === 'Our Experts') && (
                      <div className="mt-3 p-3 bg-slate-50 border border-slate-200/60 rounded-lg space-y-3 font-sans">
                        <p className="font-bold text-slate-600 flex items-center gap-1 text-[12px]">
                          <span className="material-symbols-outlined text-sm text-[#1e3a8a]">person_add</span>
                          <span>Insert Doctor from Directory</span>
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex-1">
                            <select 
                              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
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
                              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
                              placeholder="Designation/Qualifications (e.g. Senior Consultant)"
                              value={expertDesignation}
                              onChange={(e) => setExpertDesignation(e.target.value)}
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleAddDoctorToTab(idx)}
                            disabled={!selectedDocId}
                            className="bg-[#1e3a8a] text-white hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-sm">add</span>
                            <span>Add</span>
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
    </div>
  );
};

export default AddSpeciality;
