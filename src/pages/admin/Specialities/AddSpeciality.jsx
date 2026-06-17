import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';
import { initialDoctors } from '../../../data/adminState';

// Utility helpers to convert between DB HTML structure and Admin-friendly raw plain text
function htmlToText(html) {
  if (!html) return '';
  
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  let result = [];
  
  for (let i = 0; i < temp.childNodes.length; i++) {
    const node = temp.childNodes[i];
    
    if (node.nodeType === 1) { // Node.ELEMENT_NODE
      const tagName = node.tagName.toLowerCase();
      
      if (tagName === 'p') {
        result.push(node.textContent.trim());
      } else if (tagName === 'ul') {
        const lis = node.getElementsByTagName('li');
        const listItems = [];
        for (let j = 0; j < lis.length; j++) {
          const li = lis[j];
          const strong = li.querySelector('strong');
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
    } else if (node.nodeType === 3) { // Node.TEXT_NODE
      const text = node.textContent.trim();
      if (text) result.push(text);
    }
  }
  
  return result.join('\n\n');
}

function textToHtml(text) {
  if (!text) return '';
  
  const blocks = text.split(/\n\n+/);
  const formattedBlocks = blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return '';
    
    const isList = lines.every(line => line.startsWith('*') || line.startsWith('-'));
    
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
          return `<div class="border p-4 rounded-lg"><h4 class="font-bold text-[#1e3a8a]">${name}</h4><p class="text-sm text-[#757682]">${title}</p></div>`;
        }).join('');
        return `<div class="grid grid-cols-2 gap-4">${cardsHtml}</div>`;
      }
      
      const listItemsHtml = lines.map(line => {
        const clean = line.replace(/^[\*\-\s]+/, '');
        const colonIndex = clean.indexOf(':');
        if (colonIndex > 0 && colonIndex < 30) {
          const label = clean.substring(0, colonIndex).trim();
          const rest = clean.substring(colonIndex + 1).trim();
          return `<li><strong>${label}:</strong> ${rest}</li>`;
        }
        return `<li>${clean}</li>`;
      }).join('');
      
      return `<ul class="list-disc pl-5 space-y-2 mb-4">${listItemsHtml}</ul>`;
    }
    
    return `<p class="mb-4">${lines.join(' ')}</p>`;
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
  const [status, setStatus] = useState(true);

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
          setStatus(match.status !== false);
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

    let updatedSpecs;
    if (editId) {
      const htmlTabs = tabs.map(t => ({
        ...t,
        content: textToHtml(t.content)
      }));
      updatedSpecs = state.specialities.map(s => {
        if (s.id === editId) {
          const updated = {
            ...s,
            name,
            categoryId,
            icon,
            shortDescription,
            status,
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
        content: textToHtml(t.content)
      }));
      const newSpec = {
        id: `s${Date.now()}`,
        categoryId,
        name,
        icon,
        shortDescription,
        status,
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
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Specialities</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">{editId ? 'Edit Speciality' : 'Add Speciality'}</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{editId ? 'Edit Speciality details' : 'Add New Speciality'}</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Configure clinical speciality details, icons, and tab descriptions.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-700">
        
        {/* Left Columns (Details & Tabs) */}
        <div className="lg:col-span-2 space-y-6">
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
                  {state.categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
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
            </div>
          </section>

          {/* Specialities Tabbed Editor */}
          {tabs.length > 0 && (
            <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">tab</span>
                <span>Configure Department Tabs</span>
              </h3>

              <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 text-[11px] text-slate-500 font-sans space-y-1">
                <p className="font-bold text-slate-600 flex items-center gap-1 text-[12px]">
                  <span className="material-symbols-outlined text-sm text-amber-500">info</span>
                  <span>How to write formatted content (No HTML required!)</span>
                </p>
                <ul className="list-disc pl-4 space-y-0.5 leading-relaxed">
                  <li><strong>Paragraphs:</strong> Write text normally. Separate paragraphs with double Enter keys (a blank line).</li>
                  <li><strong>Lists:</strong> Start lines with an asterisk (<code>*</code>) or hyphen (<code>-</code>).</li>
                  <li><strong>Bold Labels inside lists:</strong> Use a colon: <code>* Expert Team: Certified specialists</code> will render "Expert Team" in bold.</li>
                  <li><strong>Expert Profile Cards:</strong> Write <code>* Expert: Dr. Name - Title</code> to render a professional team layout card.</li>
                </ul>
              </div>
              
              <div className="space-y-4 pt-2">
                {tabs.map((tab, idx) => (
                  <div key={tab.id} className="space-y-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <label className="font-bold text-[#1e3a8a] uppercase block">{tab.title}</label>
                    <textarea 
                      className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium leading-relaxed font-sans" 
                      rows="8"
                      value={tab.content}
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
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
            <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2">Visibility Settings</h3>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Status</label>
              <select 
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium cursor-pointer"
                value={status ? 'Live' : 'Hidden'}
                onChange={(e) => setStatus(e.target.value === 'Live')}
              >
                <option value="Live">Live (Show on Website)</option>
                <option value="Hidden">Hidden (Draft)</option>
              </select>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex gap-2">
            <button 
              type="button" 
              onClick={() => navigate('/admin/specialities')} 
              className="flex-1 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-lg font-bold hover:bg-slate-50 transition-all text-center"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-[#fea619] hover:bg-amber-500 text-slate-900 py-2.5 rounded-lg font-bold transition-all shadow-sm"
            >
              {editId ? 'Save Changes' : 'Create Speciality'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default AddSpeciality;
