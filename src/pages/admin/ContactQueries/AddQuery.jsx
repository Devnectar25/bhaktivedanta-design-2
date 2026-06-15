import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialQueries, saveQueries } from '../../../data/adminState';

const AddQuery = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [queriesList, setQueriesList] = useState([]);

  useEffect(() => {
    setQueriesList(initialQueries());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !subject || !message) {
      alert("Please fill in all fields (Patient Name, Email, Subject, and Inquiry Message).");
      return;
    }

    const newQuery = {
      id: `QRY-${Date.now().toString().substring(8)}`,
      name,
      email,
      subject,
      message,
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'Pending'
    };

    const updatedList = [newQuery, ...queriesList];
    saveQueries(updatedList);
    navigate('/admin/contact-queries');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium font-sans">
        <span>Dashboard</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span>Contact Queries</span>
        <span className="material-symbols-outlined text-xs">chevron_right</span>
        <span className="text-slate-600 font-bold">Add Manual Query</span>
      </nav>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Add Manual Query</h2>
        <p className="text-sm text-slate-500 font-medium font-sans">Record phone-in patient queries or other manual requests in the system.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-4 text-xs text-slate-700 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Patient Name *</label>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
              placeholder="e.g. Suresh Patil"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-500 uppercase">Patient Email Address *</label>
            <input
              type="email"
              className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
              placeholder="suresh.patil@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Subject of Inquiry *</label>
          <input
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
            placeholder="Inquiry regarding Health Checkup Packages..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="font-bold text-slate-500 uppercase">Inquiry Message *</label>
          <textarea
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-2 rounded-lg outline-none font-medium"
            placeholder="Describe details of the patient's inquiry..."
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/admin/contact-queries')}
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#fea619] hover:bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-bold transition-all shadow-sm"
          >
            Save Query
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuery;
