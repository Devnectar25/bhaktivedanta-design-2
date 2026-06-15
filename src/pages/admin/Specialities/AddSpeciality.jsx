import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';

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

  const [state, setState] = useState(defaultSpecialitiesState);

  useEffect(() => {
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
          setTabs(match.tabs || []);
        }
      }
    });
  }, [editId]);

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
      updatedSpecs = state.specialities.map(s => {
        if (s.id === editId) {
          const updated = {
            ...s,
            name,
            categoryId,
            icon,
            shortDescription,
            status,
            tabs: tabs.length > 0 ? tabs : s.tabs
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
        status,
        tabs: []
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
                  onChange={(e) => setName(e.target.value)}
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
          {editId && tabs.length > 0 && (
            <section className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4">
              <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-lg">tab</span>
                <span>Configure Department Tabs</span>
              </h3>
              
              <div className="space-y-4">
                {tabs.map((tab, idx) => (
                  <div key={tab.id} className="space-y-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <label className="font-bold text-[#1e3a8a] uppercase block">{tab.title}</label>
                    <textarea 
                      className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium" 
                      rows="4"
                      value={tab.content}
                      onChange={(e) => handleUpdateTabContent(idx, e.target.value)}
                    />
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
