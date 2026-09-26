import React, { useState, useEffect } from 'react';
import { getSpiritualCareState, saveSpiritualCareState } from '../../../utils/api';
import { defaultSpiritualCareState } from '../../../data/defaultSpiritualCare';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

export default function SpiritualServicesManager() {
  const [data, setData] = useState(defaultSpiritualCareState.services);
  const [activeSubTab, setActiveSubTab] = useState('overview'); // 'overview' | 'services_offered' | 'contact'
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New bullet item temporary states
  const [newSupportItem, setNewSupportItem] = useState({ text: '', note: '' });
  const [newCounselItem, setNewCounselItem] = useState({ text: '', note: '' });
  const [newAcronymItem, setNewAcronymItem] = useState({ letter: '', word: '', description: '' });

  // Inline edit states for individual items
  const [editingSupportId, setEditingSupportId] = useState(null);
  const [editingSupportForm, setEditingSupportForm] = useState({ text: '', note: '' });
  const [editingCounselId, setEditingCounselId] = useState(null);
  const [editingCounselForm, setEditingCounselForm] = useState({ text: '', note: '' });

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.services) {
        setData(res.services);
      }
    });
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const fullState = await getSpiritualCareState(defaultSpiritualCareState);
      const updatedFullState = {
        ...fullState,
        services: data
      };
      await saveSpiritualCareState(updatedFullState);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setAlertModal({
        isOpen: true,
        title: 'Changes Saved',
        message: 'Spiritual Care Services and values have been updated successfully.',
        type: 'success'
      });
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaving(false);
      setAlertModal({
        isOpen: true,
        title: 'Save Failed',
        message: err.message || 'Unable to save changes. Please try again.',
        type: 'error'
      });
    }
  };

  // Acronym helper functions
  const handleAcronymChange = (index, field, val) => {
    const updated = [...(data.overview?.acronymItems || [])];
    updated[index] = { ...updated[index], [field]: val };
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        acronymItems: updated
      }
    }));
  };

  const handleAddAcronymItem = () => {
    if (!newAcronymItem.word.trim()) return;
    const letter = newAcronymItem.letter.trim() || newAcronymItem.word.trim().charAt(0).toUpperCase();
    const newItem = {
      letter,
      word: newAcronymItem.word.trim(),
      description: newAcronymItem.description.trim()
    };
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        acronymItems: [...(prev.overview?.acronymItems || []), newItem]
      }
    }));
    setNewAcronymItem({ letter: '', word: '', description: '' });
  };

  const handleDeleteAcronymItem = (index) => {
    const updated = (data.overview?.acronymItems || []).filter((_, idx) => idx !== index);
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        acronymItems: updated
      }
    }));
  };

  const handleMoveAcronymItem = (index, direction) => {
    const items = [...(data.overview?.acronymItems || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;
    setData(prev => ({
      ...prev,
      overview: {
        ...prev.overview,
        acronymItems: items
      }
    }));
  };

  // Patient Support helpers
  const handleAddSupportItem = () => {
    if (!newSupportItem.text.trim()) return;
    const newItem = {
      id: `ps-${Date.now()}`,
      text: newSupportItem.text.trim(),
      note: newSupportItem.note.trim(),
      enabled: true
    };
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        patientSupport: [...(prev.servicesOffered?.patientSupport || []), newItem]
      }
    }));
    setNewSupportItem({ text: '', note: '' });
  };

  const handleStartEditSupport = (item) => {
    setEditingSupportId(item.id);
    setEditingSupportForm({ text: item.text || '', note: item.note || '' });
  };

  const handleSaveEditSupport = (id) => {
    if (!editingSupportForm.text.trim()) return;
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        patientSupport: (prev.servicesOffered?.patientSupport || []).map(item =>
          item.id === id ? { ...item, text: editingSupportForm.text.trim(), note: editingSupportForm.note.trim() } : item
        )
      }
    }));
    setEditingSupportId(null);
    setEditingSupportForm({ text: '', note: '' });
  };

  const handleCancelEditSupport = () => {
    setEditingSupportId(null);
    setEditingSupportForm({ text: '', note: '' });
  };

  const handleMoveSupportItem = (index, direction) => {
    const list = [...(data.servicesOffered?.patientSupport || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        patientSupport: list
      }
    }));
  };

  const handleDeleteSupportItem = (id) => {
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        patientSupport: (prev.servicesOffered?.patientSupport || []).filter(item => item.id !== id)
      }
    }));
    if (editingSupportId === id) {
      setEditingSupportId(null);
    }
  };

  // Counselling helpers
  const handleAddCounselItem = () => {
    if (!newCounselItem.text.trim()) return;
    const newItem = {
      id: `cs-${Date.now()}`,
      text: newCounselItem.text.trim(),
      note: newCounselItem.note.trim(),
      enabled: true
    };
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        counselling: [...(prev.servicesOffered?.counselling || []), newItem]
      }
    }));
    setNewCounselItem({ text: '', note: '' });
  };

  const handleStartEditCounsel = (item) => {
    setEditingCounselId(item.id);
    setEditingCounselForm({ text: item.text || '', note: item.note || '' });
  };

  const handleSaveEditCounsel = (id) => {
    if (!editingCounselForm.text.trim()) return;
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        counselling: (prev.servicesOffered?.counselling || []).map(item =>
          item.id === id ? { ...item, text: editingCounselForm.text.trim(), note: editingCounselForm.note.trim() } : item
        )
      }
    }));
    setEditingCounselId(null);
    setEditingCounselForm({ text: '', note: '' });
  };

  const handleCancelEditCounsel = () => {
    setEditingCounselId(null);
    setEditingCounselForm({ text: '', note: '' });
  };

  const handleMoveCounselItem = (index, direction) => {
    const list = [...(data.servicesOffered?.counselling || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        counselling: list
      }
    }));
  };

  const handleDeleteCounselItem = (id) => {
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        counselling: (prev.servicesOffered?.counselling || []).filter(item => item.id !== id)
      }
    }));
    if (editingCounselId === id) {
      setEditingCounselId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Content Manager</span>
          <h2 className="text-2xl font-bold text-slate-800">Spiritual Care Services</h2>
          <p className="text-xs text-slate-500">Edit Department Overview, MATCH Acronym values, and Services Offered bullet lists</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Saved Successfully
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 bg-[#132A4C] hover:bg-[#1e3a8a] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-base">save</span>
            <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">article</span>
          <span>Overview & MATCH Acronym</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('services_offered')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeSubTab === 'services_offered'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">checklist</span>
          <span>Services Offered Bullet Lists</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeSubTab === 'contact'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">contact_phone</span>
          <span>Helpline & Desk Contact</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & MATCH ACRONYM */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Hero Banner text */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">web</span>
              Page Hero Header
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={data.hero?.badge || ''}
                  onChange={(e) => setData(p => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={data.hero?.title || ''}
                  onChange={(e) => setData(p => ({ ...p, hero: { ...p.hero, title: e.target.value } }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle / Summary</label>
                <textarea
                  rows={2}
                  value={data.hero?.subtitle || ''}
                  onChange={(e) => setData(p => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Overview Content TipTap / Rich Text Editor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">edit_document</span>
              Department Narrative & Overview Content
            </h3>
            <div className="min-h-[220px]">
              <RichTextEditor
                content={data.overview?.content || ''}
                onChange={(html) => setData(p => ({ ...p, overview: { ...p.overview, content: html } }))}
              />
            </div>
          </div>

          {/* MATCH Acronym Items Editor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-500">spellcheck</span>
                  MATCH Acronym Breakdown Items
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full font-bold">
                    {(data.overview?.acronymItems || []).length} Values
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">Configure each letter, core value keyword, and clinical description:</p>
              </div>
            </div>

            <div className="space-y-3">
              {(data.overview?.acronymItems || []).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#132A4C] text-white flex items-center justify-center font-serif font-bold text-xl shrink-0 shadow-sm">
                    {item.letter || (item.word ? item.word.charAt(0).toUpperCase() : '?')}
                  </div>
                  <div className="w-16 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Letter</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={item.letter || ''}
                      onChange={(e) => handleAcronymChange(idx, 'letter', e.target.value.toUpperCase())}
                      className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-center text-slate-800 bg-white uppercase outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="w-full md:w-44 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Value Keyword</label>
                    <input
                      type="text"
                      value={item.word || ''}
                      onChange={(e) => handleAcronymChange(idx, 'word', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Description / Meaning</label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleAcronymChange(idx, 'description', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-orange-500"
                    />
                  </div>
                  <div className="flex items-center gap-1 shrink-0 self-end md:self-center mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={() => handleMoveAcronymItem(idx, -1)}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                      title="Move Up"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_upward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveAcronymItem(idx, 1)}
                      disabled={idx === (data.overview?.acronymItems?.length || 0) - 1}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                      title="Move Down"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_downward</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAcronymItem(idx)}
                      className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center text-slate-400 transition-colors"
                      title="Delete Item"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Acronym Item */}
            <div className="p-4 bg-orange-50/50 border border-dashed border-orange-300 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                <span className="material-symbols-outlined text-sm text-orange-600">add_circle</span>
                <span>Add New Acronym Value Item</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Letter</label>
                  <input
                    type="text"
                    maxLength={3}
                    placeholder="e.g. M"
                    value={newAcronymItem.letter}
                    onChange={(e) => setNewAcronymItem(p => ({ ...p, letter: e.target.value.toUpperCase() }))}
                    className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-center text-slate-800 bg-white uppercase outline-none focus:border-orange-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Value Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g. Mercy"
                    value={newAcronymItem.word}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewAcronymItem(p => ({
                        ...p,
                        word: val,
                        letter: p.letter || (val.trim() ? val.trim().charAt(0).toUpperCase() : '')
                      }));
                    }}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-orange-500"
                  />
                </div>
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Description / Meaning</label>
                  <input
                    type="text"
                    placeholder="e.g. Compassionate bedside care..."
                    value={newAcronymItem.description}
                    onChange={(e) => setNewAcronymItem(p => ({ ...p, description: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white outline-none focus:border-orange-500"
                  />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddAcronymItem}
                    disabled={!newAcronymItem.word.trim()}
                    className="w-full bg-[#132A4C] hover:bg-[#1e3a8a] text-white py-1.5 rounded-lg text-xs font-bold transition-colors disabled:opacity-40 flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    <span>Add Item</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES OFFERED BULLET LISTS */}
      {activeSubTab === 'services_offered' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Patient Support Services */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">volunteer_activism</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Patient Support Services</h3>
                  <span className="text-xs text-slate-500">Inpatient care, bedside rounds, and prayers</span>
                </div>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">
                {(data.servicesOffered?.patientSupport || []).length} Items
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5 flex-1 max-h-[500px] overflow-y-auto hide-scrollbar pr-1">
              {(data.servicesOffered?.patientSupport || []).map((item, idx) => {
                const isEditing = editingSupportId === item.id;
                if (isEditing) {
                  return (
                    <div key={item.id || idx} className="p-3.5 bg-blue-50/50 border-2 border-blue-400 rounded-xl space-y-2.5 shadow-xs animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold text-blue-900 uppercase mb-0.5">Service Title</label>
                        <input
                          type="text"
                          autoFocus
                          value={editingSupportForm.text}
                          onChange={(e) => setEditingSupportForm(p => ({ ...p, text: e.target.value }))}
                          placeholder="Service Title..."
                          className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-blue-900 uppercase mb-0.5">Note / Scope / Timing (optional)</label>
                        <input
                          type="text"
                          value={editingSupportForm.note}
                          onChange={(e) => setEditingSupportForm(p => ({ ...p, note: e.target.value }))}
                          placeholder="Note or timing..."
                          className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEditSupport(item.id)}
                          disabled={!editingSupportForm.text.trim()}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditSupport}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className="material-symbols-outlined text-blue-600 text-base mt-0.5 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block break-words">{item.text}</span>
                        {item.note && <span className="text-[11px] text-slate-500 block mt-0.5 break-words">{item.note}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEditSupport(item)}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 flex items-center justify-center text-slate-500 transition-colors"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSupportItem(idx, -1)}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSupportItem(idx, 1)}
                        disabled={idx === (data.servicesOffered?.patientSupport?.length || 0) - 1}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSupportItem(item.id)}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center text-slate-400 transition-colors"
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Item */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <input
                type="text"
                placeholder="Service Title (e.g. Daily Bedside Rounds)"
                value={newSupportItem.text}
                onChange={(e) => setNewSupportItem(p => ({ ...p, text: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="Note / Timing (optional)"
                value={newSupportItem.note}
                onChange={(e) => setNewSupportItem(p => ({ ...p, note: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSupportItem}
                disabled={!newSupportItem.text.trim()}
                className="w-full bg-[#132A4C] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Support Service Item
              </button>
            </div>
          </div>

          {/* Column 2: Counselling Services */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">psychology</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Counselling Services</h3>
                  <span className="text-xs text-slate-500">Individual, family, and bereavement solace</span>
                </div>
              </div>
              <span className="text-xs bg-orange-50 text-orange-700 font-bold px-2.5 py-0.5 rounded-full">
                {(data.servicesOffered?.counselling || []).length} Items
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5 flex-1 max-h-[500px] overflow-y-auto hide-scrollbar pr-1">
              {(data.servicesOffered?.counselling || []).map((item, idx) => {
                const isEditing = editingCounselId === item.id;
                if (isEditing) {
                  return (
                    <div key={item.id || idx} className="p-3.5 bg-orange-50/50 border-2 border-orange-400 rounded-xl space-y-2.5 shadow-xs animate-fade-in">
                      <div>
                        <label className="block text-[10px] font-bold text-orange-950 uppercase mb-0.5">Counselling Topic</label>
                        <input
                          type="text"
                          autoFocus
                          value={editingCounselForm.text}
                          onChange={(e) => setEditingCounselForm(p => ({ ...p, text: e.target.value }))}
                          placeholder="Counselling Topic..."
                          className="w-full border border-orange-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-orange-950 uppercase mb-0.5">Note / Scope (optional)</label>
                        <input
                          type="text"
                          value={editingCounselForm.note}
                          onChange={(e) => setEditingCounselForm(p => ({ ...p, note: e.target.value }))}
                          placeholder="Note or scope..."
                          className="w-full border border-orange-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-600 bg-white outline-none focus:ring-2 focus:ring-orange-500/20"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleSaveEditCounsel(item.id)}
                          disabled={!editingCounselForm.text.trim()}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-sm">check</span>
                          <span>Save</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelEditCounsel}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={item.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className="material-symbols-outlined text-orange-500 text-base mt-0.5 shrink-0">check_circle</span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 block break-words">{item.text}</span>
                        {item.note && <span className="text-[11px] text-slate-500 block mt-0.5 break-words">{item.note}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 self-center">
                      <button
                        type="button"
                        onClick={() => handleStartEditCounsel(item)}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 flex items-center justify-center text-slate-500 transition-colors"
                        title="Edit Item"
                      >
                        <span className="material-symbols-outlined text-xs">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCounselItem(idx, -1)}
                        disabled={idx === 0}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Up"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_upward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCounselItem(idx, 1)}
                        disabled={idx === (data.servicesOffered?.counselling?.length || 0) - 1}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 disabled:opacity-30 transition-colors"
                        title="Move Down"
                      >
                        <span className="material-symbols-outlined text-xs">arrow_downward</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCounselItem(item.id)}
                        className="w-6 h-6 rounded border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 flex items-center justify-center text-slate-400 transition-colors"
                        title="Delete Item"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Item */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <input
                type="text"
                placeholder="Counselling Topic (e.g. Grief & Bereavement Counseling)"
                value={newCounselItem.text}
                onChange={(e) => setNewCounselItem(p => ({ ...p, text: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
              <input
                type="text"
                placeholder="Note / Scope (optional)"
                value={newCounselItem.note}
                onChange={(e) => setNewCounselItem(p => ({ ...p, note: e.target.value }))}
                className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCounselItem}
                disabled={!newCounselItem.text.trim()}
                className="w-full bg-[#132A4C] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1e3a8a] transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Counselling Service Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT & HELPLINE */}
      {activeSubTab === 'contact' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">call</span>
            Spiritual Care Helpline & Desk Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Block Title</label>
              <input
                type="text"
                value={data.contact?.title || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, title: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number(s) (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(data.contact?.phones) ? data.contact.phones.join(', ') : data.contact?.phones || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, phones: e.target.value.split(',').map(s => s.trim()) } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Emergency 24x7 Helpline</label>
              <input
                type="text"
                value={data.contact?.emergencyPhone || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, emergencyPhone: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none text-red-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Working Days</label>
              <input
                type="text"
                value={data.contact?.days || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, days: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Timings</label>
              <input
                type="text"
                value={data.contact?.timings || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, timings: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={data.contact?.email || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Location / Desk</label>
              <input
                type="text"
                value={data.contact?.location || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, location: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Advisory Note</label>
              <textarea
                rows={2}
                value={data.contact?.note || ''}
                onChange={(e) => setData(p => ({ ...p, contact: { ...p.contact, note: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onClose={() => setAlertModal(p => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
