import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initialTestimonials, saveTestimonials } from '../../../data/adminState';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  useEffect(() => {
    initialTestimonials().then(data => setTestimonials(data));
  }, []);

  const saveAndSetTestimonials = (newTests) => {
    setTestimonials(newTests);
    saveTestimonials(newTests);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      const updated = testimonials.filter(t => t.id !== id);
      saveAndSetTestimonials(updated);
    }
  };

  const handleToggleStatus = (id) => {
    const updated = testimonials.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'Approved' ? 'Pending' : 'Approved';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    saveAndSetTestimonials(updated);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  const filtered = testimonials.filter(t => {
    const matchesSearch = t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.disease.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Testimonials</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Patient Testimonials</h2>
          <p className="text-sm text-slate-500 font-medium">Manage and approve patient feedback to display on the website.</p>
        </div>
        <Link 
          to="/admin/add-testimonial" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Testimonial</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Testimonial</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search patient, content or disease..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Approved</option>
            <option>Pending</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Disease / Treatment</th>
              <th className="px-4 py-3">Review Message</th>
              <th className="px-4 py-3 text-center">Rating</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No testimonials found.</td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-800 text-sm leading-snug">{t.patientName}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 font-semibold">{t.disease}</td>
                  <td className="px-4 py-3 max-w-sm text-slate-500">{t.content}</td>
                  <td className="px-4 py-3 text-center font-bold text-amber-500">
                    {'★'.repeat(t.rating || 5)}{'☆'.repeat(5 - (t.rating || 5))}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Approved'
                        ? 'bg-green-50 text-green-600 border border-green-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => handleToggleStatus(t.id)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          t.status === 'Approved'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                        }`}
                        title={t.status === 'Approved' ? 'Set to Pending' : 'Approve Testimonial'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {t.status === 'Approved' ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/add-testimonial?edit=${t.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit testimonial"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(t.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete testimonial"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Testimonials;
