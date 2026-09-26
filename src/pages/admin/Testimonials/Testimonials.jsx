import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { 
  initialTestimonials, saveTestimonials, 
  initialReviews, saveReviews 
} from '../../../data/adminState';
import { deleteTestimonial, deleteReview, updateTestimonial, updateReview } from '../../../utils/api';
import { showConfirmDialog, showSuccessAlert } from '../../../utils/swal';

const Testimonials = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'reviews' ? 'reviews' : 'testimonials';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [testimonials, setTestimonials] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [tests, revs] = await Promise.all([
        initialTestimonials(),
        initialReviews()
      ]);
      setTestimonials(Array.isArray(tests) ? tests : []);
      setReviews(Array.isArray(revs) ? revs : []);
    } catch (err) {
      console.error('Failed to load testimonials/reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  // --- VIP Testimonials Handlers ---
  const handleDeleteTestimonial = async (id) => {
    const res = await showConfirmDialog("Delete Testimonial", "Are you sure you want to delete this VIP testimonial?", "Yes, Delete");
    if (res.isConfirmed) {
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      saveTestimonials(updated);
      deleteTestimonial(id).catch(e => console.warn(e));
      showSuccessAlert("Deleted", "VIP Testimonial removed successfully.");
    }
  };

  const handleToggleTestimonialStatus = (id) => {
    const target = testimonials.find(t => t.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Approved' ? 'Pending' : 'Approved';
    const updated = testimonials.map(t => t.id === id ? { ...t, status: nextStatus } : t);
    setTestimonials(updated);
    saveTestimonials(updated);
    updateTestimonial(id, { ...target, status: nextStatus }).catch(e => console.warn(e));
  };

  // --- Patient Reviews Handlers ---
  const handleDeleteReview = async (id) => {
    const res = await showConfirmDialog("Delete Review", "Are you sure you want to delete this patient review?", "Yes, Delete");
    if (res.isConfirmed) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      saveReviews(updated);
      deleteReview(id).catch(e => console.warn(e));
      showSuccessAlert("Deleted", "Patient review removed successfully.");
    }
  };

  const handleToggleReviewStatus = (id) => {
    const target = reviews.find(r => r.id === id);
    if (!target) return;
    const nextStatus = target.status === 'Approved' ? 'Pending' : 'Approved';
    const updated = reviews.map(r => r.id === id ? { ...r, status: nextStatus } : r);
    setReviews(updated);
    saveReviews(updated);
    updateReview(id, { ...target, status: nextStatus }).catch(e => console.warn(e));
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('All Status');
  };

  // Filtered lists
  const filteredTestimonials = testimonials.filter(t => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = (t.name || '').toLowerCase().includes(s) ||
                          (t.designation || '').toLowerCase().includes(s) ||
                          (t.content || '').toLowerCase().includes(s);
    const matchesStatus = selectedStatus === 'All Status' || t.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredReviews = reviews.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchesSearch = (r.patientName || '').toLowerCase().includes(s) ||
                          (r.disease || '').toLowerCase().includes(s) ||
                          (r.content || '').toLowerCase().includes(s);
    const matchesStatus = selectedStatus === 'All Status' || r.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Testimonials & Reviews</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Testimonials & Patient Reviews</h2>
          <p className="text-sm text-slate-500 font-medium">
            Manage dignitary endorsements (Why Choose Us panel) and patient reviews (Stories of Hope & Healing).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            title="Refresh from database"
          >
            <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>sync</span>
            <span>Refresh</span>
          </button>

          {activeTab === 'testimonials' ? (
            <Link 
              to="/admin/add-testimonial?type=testimonial" 
              className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add New Testimonial</span>
            </Link>
          ) : (
            <Link 
              to="/admin/add-testimonial?type=review" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add New Review</span>
            </Link>
          )}
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => handleTabChange('testimonials')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'testimonials'
              ? 'border-[#fea619] text-[#1e3a8a] bg-amber-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">hotel_class</span>
          <span>Dignitary Testimonials</span>
          <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
            {testimonials.length}
          </span>
        </button>

        <button
          onClick={() => handleTabChange('reviews')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span className="material-symbols-outlined text-lg">rate_review</span>
          <span>Patient Reviews</span>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">
            {activeTab === 'testimonials' ? 'Search Dignitaries & Quotes' : 'Search Patients & Treatments'}
          </label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder={activeTab === 'testimonials' ? "Search by name, organization or quote..." : "Search patient name, treatment or review..."}
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

      {/* Content Tables */}
      {activeTab === 'testimonials' ? (
        /* DIGNITARY / VIP TESTIMONIALS TABLE */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase">
                <th className="px-4 py-3">Dignitary / VIP</th>
                <th className="px-4 py-3">Designation & Organization</th>
                <th className="px-4 py-3">Endorsement / Quote</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-400 font-medium">
                    No dignitary testimonials found.
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={t.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'} 
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                          }}
                        />
                        <div>
                          <span className="font-bold text-slate-900 text-sm block leading-snug">{t.name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">ID: {t.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-semibold max-w-[220px]">
                      {t.designation}
                    </td>
                    <td className="px-4 py-3 max-w-md text-slate-500 leading-relaxed italic">
                      "{t.content}"
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Approved'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleToggleTestimonialStatus(t.id)}
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
                          onClick={() => navigate(`/admin/add-testimonial?type=testimonial&edit=${t.id}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                          title="Edit VIP testimonial"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                          title="Delete VIP testimonial"
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
      ) : (
        /* PATIENT REVIEWS TABLE */
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
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">
                    No patient reviews found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-extrabold flex items-center justify-center border border-blue-200 flex-shrink-0">
                          {(r.patientName || 'P').charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900 text-sm leading-snug">{r.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-semibold">{r.disease}</td>
                    <td className="px-4 py-3 max-w-sm text-slate-500">{r.content}</td>
                    <td className="px-4 py-3 text-center font-bold text-amber-500">
                      {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        r.status === 'Approved'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleToggleReviewStatus(r.id)}
                          className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                            r.status === 'Approved'
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                              : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                          }`}
                          title={r.status === 'Approved' ? 'Set to Pending' : 'Approve Review'}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {r.status === 'Approved' ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/add-testimonial?type=review&edit=${r.id}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                          title="Edit patient review"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteReview(r.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                          title="Delete patient review"
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
      )}
    </div>
  );
};

export default Testimonials;
