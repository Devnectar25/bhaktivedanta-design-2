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

  // Acronym update helper
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

  // Add Support Item
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

  // Delete Support Item
  const handleDeleteSupportItem = (id) => {
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        patientSupport: (prev.servicesOffered?.patientSupport || []).filter(item => item.id !== id)
      }
    }));
  };

  // Add Counselling Item
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

  // Delete Counselling Item
  const handleDeleteCounselItem = (id) => {
    setData(prev => ({
      ...prev,
      servicesOffered: {
        ...prev.servicesOffered,
        counselling: (prev.servicesOffered?.counselling || []).filter(item => item.id !== id)
      }
    }));
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
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500">spellcheck</span>
                MATCH Acronym Breakdown Items
              </h3>
              <p className="text-xs text-slate-500 mt-1">Configure each letter, core value keyword, and clinical description:</p>
            </div>

            <div className="space-y-3">
              {(data.overview?.acronymItems || []).map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#132A4C] text-white flex items-center justify-center font-serif font-bold text-xl shrink-0 shadow-sm">
                    {item.letter}
                  </div>
                  <div className="w-full md:w-48 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Value Keyword</label>
                    <input
                      type="text"
                      value={item.word || ''}
                      onChange={(e) => handleAcronymChange(idx, 'word', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-[11px] font-bold text-slate-600 mb-0.5">Description / Meaning</label>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleAcronymChange(idx, 'description', e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES OFFERED BULLET LISTS */}
      {activeSubTab === 'services_offered' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Patient Support Services */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">volunteer_activism</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Patient Support Services</h3>
                <span className="text-xs text-slate-500">Inpatient care, bedside rounds, and prayers</span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 flex-1 max-h-[460px] overflow-y-auto pr-1">
              {(data.servicesOffered?.patientSupport || []).map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-orange-500 text-base mt-0.5">check_circle</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{item.text}</span>
                      {item.note && <span className="text-[11px] text-slate-500 block mt-0.5">{item.note}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSupportItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Delete Item"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
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
                className="w-full bg-[#132A4C] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Support Service Item
              </button>
            </div>
          </div>

          {/* Column 2: Counselling Services */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">psychology</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Counselling Services</h3>
                <span className="text-xs text-slate-500">Individual, family, and bereavement solace</span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 flex-1 max-h-[460px] overflow-y-auto pr-1">
              {(data.servicesOffered?.counselling || []).map((item, idx) => (
                <div key={item.id || idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-orange-500 text-base mt-0.5">check_circle</span>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">{item.text}</span>
                      {item.note && <span className="text-[11px] text-slate-500 block mt-0.5">{item.note}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCounselItem(item.id)}
                    className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                    title="Delete Item"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
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
                className="w-full bg-[#132A4C] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-1.5"
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
