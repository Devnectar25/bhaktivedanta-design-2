import React, { useState } from 'react';

const Settings = () => {
  const [hospitalName, setHospitalName] = useState('Bhaktivedanta Hospital & Research Institute');
  const [adminEmail, setAdminEmail] = useState('admin@bhaktivedantahospital.com');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 22 2945 2500');
  const [appointmentSlot, setAppointmentSlot] = useState('20 minutes');
  const [saveToast, setSaveToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast Alert */}
      {saveToast && (
        <div className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 p-4 rounded-xl shadow-lg border border-green-100 bg-white max-w-sm w-full animate-bounce">
          <span className="material-symbols-outlined text-[22px] text-green-500">check_circle</span>
          <span className="text-slate-700 font-semibold text-xs">Settings updated successfully!</span>
        </div>
      )}

      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
          <span>Dashboard</span>
          <span className="material-symbols-outlined text-xs">chevron_right</span>
          <span className="text-slate-600 font-bold">Settings</span>
        </nav>
        <h2 className="text-2xl font-bold text-slate-800">Hospital Portal Settings</h2>
        <p className="text-sm text-slate-500 font-medium">Configure global contact details, consultation defaults, and branding settings.</p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 space-y-6 text-xs text-slate-700">
        
        {/* Hospital Branding */}
        <section className="space-y-4">
          <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">domain</span>
            <span>Hospital Details</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Hospital Name</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2.5 rounded-lg outline-none font-medium" 
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Administrator Email</label>
              <input 
                type="email" 
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2.5 rounded-lg outline-none font-medium" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Clinical Parameters */}
        <section className="space-y-4">
          <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">medical_services</span>
            <span>Clinical Constants</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Emergency Contact Hotline</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2.5 rounded-lg outline-none font-medium" 
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-500 uppercase">Default Consultation Slot</label>
              <select 
                className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2.5 rounded-lg outline-none font-medium cursor-pointer" 
                value={appointmentSlot}
                onChange={(e) => setAppointmentSlot(e.target.value)}
              >
                <option value="15 minutes">15 minutes</option>
                <option value="20 minutes">20 minutes</option>
                <option value="30 minutes">30 minutes</option>
                <option value="45 minutes">45 minutes</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security Parameters */}
        <section className="space-y-4">
          <h3 className="font-bold text-sm text-[#1e3a8a] border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">security</span>
            <span>Security &amp; Backups</span>
          </h3>
          <div className="flex flex-col gap-2 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="font-semibold text-slate-600">Force multi-factor authentication (MFA) for Super Admins</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
              <span className="font-semibold text-slate-600">Enable automated daily local backups of database state</span>
            </label>
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button 
            type="submit" 
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-xs"
          >
            Save Settings
          </button>
        </div>

      </form>
    </div>
  );
};

export default Settings;
