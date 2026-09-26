import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getHospitalSettings, updateHospitalSettings, defaultHospitalSettings } from '../../../utils/api';
import HeroBanners from '../HeroBanners/HeroBanners';

const Settings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'general';
  const [formData, setFormData] = useState(defaultHospitalSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Settings updated successfully!');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Fetch live settings on mount
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getHospitalSettings().then((data) => {
      if (isMounted && data && typeof data === 'object') {
        setFormData({
          ...defaultHospitalSettings,
          ...data
        });
      }
    }).catch((err) => {
      console.warn('Could not load hospital settings:', err);
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await updateHospitalSettings(formData);
      if (res) {
        setToastMessage('Hospital settings updated & synced across website!');
        setSaveToast(true);
        setTimeout(() => setSaveToast(false), 3500);
      }
    } catch (err) {
      console.error('Failed to save hospital settings:', err);
      setToastMessage('Error saving settings. Please try again.');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setShowResetConfirm(false);
    setSaving(true);
    try {
      const res = await updateHospitalSettings(defaultHospitalSettings);
      setFormData(defaultHospitalSettings);
      setToastMessage('Settings successfully reset to factory defaults.');
      setSaveToast(true);
      setTimeout(() => setSaveToast(false), 3500);
    } catch (err) {
      console.error('Failed to reset settings:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-4 border-[#fea619] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-500">Loading Hospital Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-green-200 bg-white max-w-md w-full animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[24px] text-green-600">check_circle</span>
          <div>
            <p className="text-xs font-bold text-slate-800">Success</p>
            <p className="text-xs text-slate-600">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="material-symbols-outlined text-3xl">warning</span>
              <h3 className="text-base font-bold text-slate-900">Reset to Defaults?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to reset all hospital contact details, phone numbers, and address back to original factory defaults?
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Settings</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Admin Portal Settings</h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage hospital branding, contact parameters, emergency hotline, and homepage hero background banners.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'hero-banners' && activeTab !== 'heroBanners' && (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Reset to factory defaults"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset Defaults</span>
            </button>
          )}
        </div>
      </div>

      {/* Settings Section Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'general' })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab !== 'hero-banners' && activeTab !== 'heroBanners'
              ? 'bg-[#1e3a8a] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">domain</span>
          <span>General Hospital Information</span>
        </button>

        <button
          type="button"
          onClick={() => setSearchParams({ tab: 'hero-banners' })}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'hero-banners' || activeTab === 'heroBanners'
              ? 'bg-[#1e3a8a] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">wallpaper</span>
          <span>Hero Background Banners</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-extrabold ml-1">
            Max 10
          </span>
        </button>
      </div>

      {/* Tab 2: Hero Background Banners */}
      {(activeTab === 'hero-banners' || activeTab === 'heroBanners') ? (
        <div className="pt-2">
          <HeroBanners embedded={true} />
        </div>
      ) : (
        <>
          {/* Quick link highlight banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-4 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-amber-400">wallpaper</span>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Homepage Background Slider</h4>
                <p className="text-xs text-blue-100">Upload up to 10 high-resolution background images, reorder slides, and preview auto-rotation.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSearchParams({ tab: 'hero-banners' })}
              className="self-start sm:self-auto px-4 py-2 bg-[#fea619] hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors shadow flex items-center gap-1.5"
            >
              <span>Manage Hero Banners</span>
              <span className="material-symbols-outlined text-xs">arrow_forward</span>
            </button>
          </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. GENERAL HOSPITAL BRANDING */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">domain</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1e3a8a]">Hospital Branding &amp; Administration</h3>
                <p className="text-[11px] text-slate-400">Manage primary hospital identification and administrative contact.</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                <span>Official Hospital Name</span>
                <span className="text-amber-500">*</span>
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] px-3 py-2 rounded-lg outline-none font-medium transition-all" 
                value={formData.hospitalName || ''}
                onChange={(e) => handleChange('hospitalName', e.target.value)}
                placeholder="Bhaktivedanta Hospital & Research Institute"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                <span>Super Administrator Email</span>
                <span className="text-amber-500">*</span>
              </label>
              <input 
                type="email" 
                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] px-3 py-2 rounded-lg outline-none font-medium transition-all" 
                value={formData.adminEmail || ''}
                onChange={(e) => handleChange('adminEmail', e.target.value)}
                placeholder="admin@bhaktivedantahospital.com"
              />
            </div>
          </div>
        </section>

        {/* 2. EMERGENCY CONTACT HOTLINE */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-4 text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">medical_services</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1e3a8a]">Header Emergency Contact</h3>
                <p className="text-[11px] text-slate-400">Emergency &amp; appointment telephone number displayed in the top navbar and mobile drawer.</p>
              </div>
            </div>
          </div>
          <div className="space-y-1 max-w-md">
            <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
              <span>Emergency Hotline (Navbar Top Tier)</span>
              <span className="text-amber-500">*</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] pl-8 pr-3 py-2 rounded-lg outline-none font-medium transition-all" 
                value={formData.emergencyPhone || ''}
                onChange={(e) => handleChange('emergencyPhone', e.target.value)}
                placeholder="079 6900 2221"
                required
              />
              <span className="material-symbols-outlined text-[16px] text-red-500 absolute left-2.5 top-2.5">
                emergency
              </span>
            </div>
          </div>
        </section>

        {/* 3. FOOTER CONTACT DETAILS */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-5 text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1e3a8a] flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">contact_phone</span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1e3a8a]">Footer "Contact Us" Details</h3>
                <p className="text-[11px] text-slate-400">Controls the contact section displayed across the footer of every page.</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live in Footer
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Section Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>Section Heading</span>
                  <span className="text-amber-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] px-3 py-2 rounded-lg outline-none font-medium transition-all" 
                  value={formData.contactTitle || 'Contact Us'}
                  onChange={(e) => handleChange('contactTitle', e.target.value)}
                  placeholder="Contact Us"
                  required
                />
              </div>

              {/* Public Contact Phone */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>Phone Helpline</span>
                  <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] pl-8 pr-3 py-2 rounded-lg outline-none font-medium transition-all" 
                    value={formData.contactPhone || ''}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="079-69002222"
                    required
                  />
                  <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-2.5 top-2.5">
                    call
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WhatsApp Support Number */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>WhatsApp Number</span>
                  <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] pl-8 pr-3 py-2 rounded-lg outline-none font-medium transition-all" 
                    value={formData.contactWhatsapp || ''}
                    onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
                    placeholder="8400146262"
                    required
                  />
                  <span className="material-symbols-outlined text-[16px] text-green-600 absolute left-2.5 top-2.5">
                    chat
                  </span>
                </div>
              </div>

              {/* Official Email */}
              <div className="space-y-1">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>Public Inquiry Email</span>
                  <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] pl-8 pr-3 py-2 rounded-lg outline-none font-medium transition-all" 
                    value={formData.contactEmail || ''}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="info@bhaktivedantahospital.com"
                    required
                  />
                  <span className="material-symbols-outlined text-[16px] text-slate-400 absolute left-2.5 top-2.5">
                    mail
                  </span>
                </div>
              </div>
            </div>

            {/* Hospital Physical Address */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>Physical Hospital Address</span>
                  <span className="text-amber-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-normal">Press Enter to break lines in footer</span>
              </div>
              <textarea 
                rows={3}
                className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] p-3 rounded-lg outline-none font-medium transition-all leading-relaxed" 
                value={formData.contactAddress || ''}
                onChange={(e) => handleChange('contactAddress', e.target.value)}
                placeholder="Mira Road East, Thane,&#10;Maharashtra 401107"
                required
              />
            </div>

            {/* Google Maps Link */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-600 uppercase text-[11px] flex items-center gap-1">
                  <span>Google Maps Location URL</span>
                  <span className="text-amber-500">*</span>
                </label>
                {formData.mapUrl && (
                  <a 
                    href={formData.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-0.5 hover:underline"
                  >
                    <span>Test Map Link</span>
                    <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                )}
              </div>
              <div className="relative">
                <input 
                  type="url" 
                  className="w-full bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#1e3a8a] pl-8 pr-3 py-2 rounded-lg outline-none font-medium transition-all" 
                  value={formData.mapUrl || ''}
                  onChange={(e) => handleChange('mapUrl', e.target.value)}
                  placeholder="https://maps.app.goo.gl/..."
                  required
                />
                <span className="material-symbols-outlined text-[16px] text-red-500 absolute left-2.5 top-2.5">
                  location_on
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                This link opens when patients click "View on Map" in the footer.
              </p>
            </div>
          </div>
        </section>

        {/* Floating / Sticky Bottom Action Bar */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Last updated: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleString() : 'Just now'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="bg-[#fea619] hover:bg-amber-500 disabled:opacity-50 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      </>
      )}
    </div>
  );
};

export default Settings;
