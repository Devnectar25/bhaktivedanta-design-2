import React, { useState, useEffect } from 'react';
import { getSpiritualCareState, saveSpiritualCareState } from '../../../utils/api';
import { defaultSpiritualCareState } from '../../../data/defaultSpiritualCare';
import RichTextEditor from '../../../components/admin/RichTextEditor/RichTextEditor';
import AlertModal from '../../../components/admin/AlertModal/AlertModal';

export default function SpiritualRetreatsManager() {
  const [retreats, setRetreats] = useState(defaultSpiritualCareState.retreats);
  const [activeSubTab, setActiveSubTab] = useState('bimonthly'); // 'bimonthly' | 'annual' | 'contact'
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'success' });

  // New activity form
  const [newActivity, setNewActivity] = useState({
    title: '',
    tag: '',
    caption: '',
    image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.retreats) {
        setRetreats(res.retreats);
      }
    });
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const fullState = await getSpiritualCareState(defaultSpiritualCareState);
      const updatedFullState = {
        ...fullState,
        retreats
      };
      await saveSpiritualCareState(updatedFullState);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      setAlertModal({
        isOpen: true,
        title: 'Retreats Content Saved',
        message: 'Bi-monthly and Annual retreats content updated successfully.',
        type: 'success'
      });
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setSaving(false);
      setAlertModal({
        isOpen: true,
        title: 'Save Failed',
        message: 'Unable to save retreats data.',
        type: 'error'
      });
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.title.trim()) return;
    const act = {
      id: `act-${Date.now()}`,
      title: newActivity.title.trim(),
      tag: newActivity.tag.trim() || 'Activity',
      caption: newActivity.caption.trim(),
      image: newActivity.image.trim() || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80',
      enabled: true
    };
    setRetreats(prev => ({
      ...prev,
      bimonthly: {
        ...prev.bimonthly,
        activities: [...(prev.bimonthly?.activities || []), act]
      }
    }));
    setNewActivity({
      title: '',
      tag: '',
      caption: '',
      image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80'
    });
  };

  const handleDeleteActivity = (id) => {
    setRetreats(prev => ({
      ...prev,
      bimonthly: {
        ...prev.bimonthly,
        activities: (prev.bimonthly?.activities || []).filter(a => a.id !== id)
      }
    }));
  };

  const handleUpdateActivity = (id, field, value) => {
    setRetreats(prev => ({
      ...prev,
      bimonthly: {
        ...prev.bimonthly,
        activities: (prev.bimonthly?.activities || []).map(a => a.id === id ? { ...a, [field]: value } : a)
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Content Manager</span>
          <h2 className="text-2xl font-bold text-slate-800">Spiritual Retreats</h2>
          <p className="text-xs text-slate-500">Edit Bi-Monthly activity schedule, Annual retreat narrative, and shared contact block</p>
        </div>
        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-fade-in">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Saved
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

      {/* Subtabs */}
      <div className="flex border-b border-slate-200 bg-white px-4 rounded-xl shadow-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('bimonthly')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeSubTab === 'bimonthly'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">calendar_month</span>
          <span>BI-Monthly Retreat & Activities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('annual')}
          className={`py-3 px-5 text-xs font-bold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
            activeSubTab === 'annual'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-base">wb_sunny</span>
          <span>Annual Pilgrimage Retreat</span>
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
          <span>Shared Retreats Contact Block</span>
        </button>
      </div>

      {/* TAB 1: BI-MONTHLY RETREAT */}
      {activeSubTab === 'bimonthly' && (
        <div className="space-y-6">
          {/* Intro Text */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">info</span>
              Bi-Monthly Retreat Intro & Overview
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={retreats.bimonthly?.title || ''}
                  onChange={(e) => setRetreats(p => ({ ...p, bimonthly: { ...p.bimonthly, title: e.target.value } }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Intro Narrative Text</label>
                <textarea
                  rows={3}
                  value={retreats.bimonthly?.intro || ''}
                  onChange={(e) => setRetreats(p => ({ ...p, bimonthly: { ...p.bimonthly, intro: e.target.value } }))}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Activity List Editor */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600">photo_library</span>
                  Retreat Activity Cards ({retreats.bimonthly?.activities?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">Manage activities shown in the Bi-Monthly retreat grid (e.g. Health Talk, Arati, Nature Walk)</p>
              </div>
            </div>

            {/* List of Activities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(retreats.bimonthly?.activities || []).map((act, idx) => (
                <div key={act.id || idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3 relative">
                  <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-300">
                    <img src={act.image} alt={act.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={act.title || ''}
                        onChange={(e) => handleUpdateActivity(act.id, 'title', e.target.value)}
                        className="font-bold text-xs text-slate-800 bg-white border border-slate-300 rounded px-2 py-0.5 w-36"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        className="text-slate-400 hover:text-red-500 p-0.5"
                        title="Delete Activity"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Tag / Category"
                      value={act.tag || ''}
                      onChange={(e) => handleUpdateActivity(act.id, 'tag', e.target.value)}
                      className="text-[11px] text-slate-600 bg-white border border-slate-300 rounded px-2 py-0.5 w-full"
                    />
                    <textarea
                      rows={2}
                      placeholder="Caption description"
                      value={act.caption || ''}
                      onChange={(e) => handleUpdateActivity(act.id, 'caption', e.target.value)}
                      className="text-[11px] text-slate-600 bg-white border border-slate-300 rounded px-2 py-0.5 w-full resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Activity Form */}
            <div className="p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50/50 space-y-3">
              <span className="text-xs font-bold text-slate-700 block">+ Add New Activity Card</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Activity Title (e.g. Yoga & Pranayama)"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity(p => ({ ...p, title: e.target.value }))}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Tag Badge (e.g. Wellness)"
                  value={newActivity.tag}
                  onChange={(e) => setNewActivity(p => ({ ...p, tag: e.target.value }))}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newActivity.image}
                  onChange={(e) => setNewActivity(p => ({ ...p, image: e.target.value }))}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white font-mono"
                />
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Short description / caption"
                    value={newActivity.caption}
                    onChange={(e) => setNewActivity(p => ({ ...p, caption: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddActivity}
                className="bg-[#132A4C] hover:bg-[#1e3a8a] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANNUAL RETREAT */}
      {activeSubTab === 'annual' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">temple_hindu</span>
            Annual Pilgrimage Retreat Narrative
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
            <input
              type="text"
              value={retreats.annual?.title || ''}
              onChange={(e) => setRetreats(p => ({ ...p, annual: { ...p.annual, title: e.target.value } }))}
              className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Narrative Content & Experience</label>
            <RichTextEditor
              content={retreats.annual?.intro || ''}
              onChange={(html) => setRetreats(p => ({ ...p, annual: { ...p.annual, intro: html } }))}
            />
          </div>
        </div>
      )}

      {/* TAB 3: SHARED CONTACT BLOCK */}
      {activeSubTab === 'contact' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">contact_mail</span>
              Shared Retreats Contact Information
            </h3>
            <p className="text-xs text-slate-500">This information is automatically shared across both Bi-Monthly and Annual retreat public pages:</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={retreats.contact?.title || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, title: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Numbers (comma separated)</label>
              <input
                type="text"
                value={Array.isArray(retreats.contact?.phones) ? retreats.contact.phones.join(', ') : retreats.contact?.phones || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, phones: e.target.value.split(',').map(s => s.trim()) } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Days</label>
              <input
                type="text"
                value={retreats.contact?.days || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, days: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hours / Timings</label>
              <input
                type="text"
                value={retreats.contact?.timings || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, timings: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Office Location</label>
              <input
                type="text"
                value={retreats.contact?.location || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, location: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={retreats.contact?.email || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Advisory Note</label>
              <textarea
                rows={2}
                value={retreats.contact?.note || ''}
                onChange={(e) => setRetreats(p => ({ ...p, contact: { ...p.contact, note: e.target.value } }))}
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>
      )}

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
