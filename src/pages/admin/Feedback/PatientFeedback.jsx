import React, { useState, useEffect } from 'react';
import { getFeedback, updateFeedback, deleteFeedback } from '../../../utils/api';
import { showConfirmDialog, showSuccessAlert, showErrorAlert } from '../../../utils/swal';

const defaultFallbackFeedback = [
  {
    id: 'FBK-1001',
    name: 'Suresh Patil',
    phone: '+91 98201 44552',
    bhid: 'BH-8849',
    doctorName: 'Dr. Anand Sharma',
    serviceRatings: {
      doctorCare: 'Excellent',
      nursing: 'Good',
      cleanliness: 'Excellent',
      food: 'Good',
      overall: 'Excellent'
    },
    recommendation: 'Yes',
    comments: 'Very pleased with the doctors and nursing staff care.',
    status: 'New',
    timestamp: '2026-09-20 11:30:00'
  },
  {
    id: 'FBK-1002',
    name: 'Meena Rao',
    phone: '+91 98700 12345',
    bhid: 'BH-7402',
    doctorName: 'Dr. Rajesh Patel',
    serviceRatings: {
      doctorCare: 'Excellent',
      nursing: 'Excellent',
      cleanliness: 'Good',
      food: 'Average',
      overall: 'Good'
    },
    recommendation: 'Yes',
    comments: 'Prompt service and clean facilities.',
    status: 'Reviewed',
    timestamp: '2026-09-18 16:45:00'
  }
];

const PatientFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getFeedback(defaultFallbackFeedback);
      setFeedbackList(Array.isArray(data) ? data : defaultFallbackFeedback);
    } catch (err) {
      console.error('Failed to load feedback list:', err);
      setFeedbackList(defaultFallbackFeedback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    window.addEventListener('admin_data_updated', fetchList);
    return () => window.removeEventListener('admin_data_updated', fetchList);
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'New' ? 'Reviewed' : 'New';
    try {
      const match = feedbackList.find(f => f.id === id);
      if (!match) return;
      const updated = { ...match, status: newStatus };
      await updateFeedback(id, updated);
      setFeedbackList(prev => prev.map(f => f.id === id ? updated : f));
      if (selectedFeedback && selectedFeedback.id === id) {
        setSelectedFeedback(updated);
      }
      showSuccessAlert('Status Updated', `Feedback status updated to ${newStatus}.`);
    } catch (err) {
      showErrorAlert('Error', 'Failed to update feedback status.');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await showConfirmDialog(
      'Delete Feedback Record?',
      `Are you sure you want to delete feedback entry ${id}?`,
      'Yes, Delete Record'
    );
    if (confirm.isConfirmed) {
      try {
        await deleteFeedback(id);
        setFeedbackList(prev => prev.filter(f => f.id !== id));
        if (selectedFeedback && selectedFeedback.id === id) {
          setSelectedFeedback(null);
        }
        showSuccessAlert('Deleted!', 'Feedback record deleted successfully.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to delete record.');
      }
    }
  };

  const filteredList = feedbackList.filter(f => {
    const name = f.name || '';
    const phone = f.phone || '';
    const bhid = f.bhid || '';
    const doc = f.doctorName || '';
    const comments = f.comments || '';

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bhid.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          comments.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = feedbackList.length;
  const newCount = feedbackList.filter(f => f.status === 'New').length;
  const reviewedCount = feedbackList.filter(f => f.status === 'Reviewed').length;
  const positiveCount = feedbackList.filter(f => (f.serviceRatings?.overall === 'Excellent' || f.serviceRatings?.overall === 'Good')).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patient Feedback Collection</h2>
          <p className="text-sm text-slate-500">Monitor and review patient feedback submissions collected via the 4-step feedback form</p>
        </div>
        <a
          href="/feedback"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#0b5ed7] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 w-fit"
        >
          <span className="material-symbols-outlined text-base">open_in_new</span>
          <span>Open Public 4-Step Feedback Form</span>
        </a>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Submissions</span>
            <p className="text-2xl font-bold text-slate-800 mt-1">{totalCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-blue-500">rate_review</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">New Unreviewed</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{newCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-amber-500">mark_email_unread</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Reviewed Feedbacks</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{reviewedCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-emerald-500">verified</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Positive Ratings</span>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {totalCount > 0 ? `${Math.round((positiveCount / totalCount) * 100)}%` : '100%'}
            </p>
          </div>
          <span className="material-symbols-outlined text-3xl text-purple-500">thumb_up</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[240px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Feedback</label>
          <input
            type="text"
            placeholder="Search by patient name, phone, BHID, or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-blue-500 px-3 py-1.5 text-xs rounded-lg outline-none"
          />
        </div>

        <div className="w-[160px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status Filter</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Reviewed">Reviewed</option>
          </select>
        </div>
      </div>

      {/* Feedback List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-slate-400 font-medium text-xs flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span>Loading patient feedback entries...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-12 text-center text-slate-400 font-medium text-xs">
            No patient feedback submissions found.
          </div>
        ) : (
          <div className="w-full overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">ID &amp; Date</th>
                  <th className="px-4 py-3">Patient Details</th>
                  <th className="px-4 py-3">Doctor Name</th>
                  <th className="px-4 py-3">Overall Rating</th>
                  <th className="px-4 py-3">Recommend</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-[#0b5ed7]">{item.id}</div>
                      <div className="text-[10px] text-slate-400">{item.timestamp}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800">{item.name || 'Anonymous'}</div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2">
                        {item.phone && <span>📞 {item.phone}</span>}
                        {item.bhid && <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">BHID: {item.bhid}</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {item.doctorName || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.serviceRatings?.overall === 'Excellent' ? 'bg-emerald-100 text-emerald-800' :
                        item.serviceRatings?.overall === 'Good' ? 'bg-blue-100 text-blue-800' :
                        item.serviceRatings?.overall === 'Average' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {item.serviceRatings?.overall || 'Good'}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-bold">
                      <span className={item.recommendation === 'Yes' ? 'text-emerald-600' : item.recommendation === 'Maybe' ? 'text-amber-600' : 'text-rose-600'}>
                        {item.recommendation || 'Yes'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Reviewed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {item.status || 'New'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedFeedback(item)}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          Inspect
                        </button>
                        <button
                          onClick={() => handleToggleStatus(item.id, item.status)}
                          className={`px-2.5 py-1 rounded font-bold text-xs border ${
                            item.status === 'New'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                          }`}
                        >
                          {item.status === 'New' ? 'Mark Reviewed' : 'Reopen'}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-2 py-1 rounded bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 text-xs"
                          title="Delete Feedback"
                        >
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 border border-slate-100 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Patient Feedback Details</h3>
                <span className="text-xs font-mono text-[#0b5ed7] font-bold">{selectedFeedback.id}</span>
              </div>
              <button onClick={() => setSelectedFeedback(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Step 1 Details */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-[#0b5ed7] uppercase tracking-wide block">Step 1: वैयक्तिक माहिती (Personal Details)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</span>
                    <div className="font-bold text-slate-800">{selectedFeedback.name || 'Anonymous'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</span>
                    <div className="font-mono text-slate-800">{selectedFeedback.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">BHID</span>
                    <div className="font-mono text-slate-800">{selectedFeedback.bhid || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Doctor's Name</span>
                    <div className="font-bold text-slate-800">{selectedFeedback.doctorName || 'N/A'}</div>
                  </div>
                </div>
              </div>

              {/* Step 2 Details */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-[#0b5ed7] uppercase tracking-wide block">Step 2: सेवा (Service Ratings)</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>Doctor &amp; Clinical Care: <strong className="text-blue-700">{selectedFeedback.serviceRatings?.doctorCare || 'Good'}</strong></div>
                  <div>Nursing &amp; Ward Care: <strong className="text-blue-700">{selectedFeedback.serviceRatings?.nursing || 'Good'}</strong></div>
                  <div>Cleanliness &amp; Hygiene: <strong className="text-blue-700">{selectedFeedback.serviceRatings?.cleanliness || 'Good'}</strong></div>
                  <div>Food &amp; Dietary Services: <strong className="text-blue-700">{selectedFeedback.serviceRatings?.food || 'Good'}</strong></div>
                  <div className="col-span-2 pt-1 border-t border-slate-200">
                    Overall Hospital Experience: <strong className="text-purple-700 text-xs">{selectedFeedback.serviceRatings?.overall || 'Good'}</strong>
                  </div>
                </div>
              </div>

              {/* Step 3 Details */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold text-[#0b5ed7] uppercase tracking-wide block">Step 3: शिफारस करणे (Recommendation &amp; Remarks)</span>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Would Recommend Hospital?</span>
                  <span className="font-bold text-emerald-700">{selectedFeedback.recommendation || 'Yes'}</span>
                </div>
                {selectedFeedback.comments && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mt-1">Patient Comments / Feedback</span>
                    <p className="bg-white p-2.5 rounded border border-slate-200 text-slate-700 leading-relaxed font-sans">
                      {selectedFeedback.comments}
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[10px]">Submitted at {selectedFeedback.timestamp}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(selectedFeedback.id, selectedFeedback.status)}
                    className="px-4 py-1.5 rounded-lg bg-[#0b5ed7] text-white font-bold hover:bg-blue-700"
                  >
                    {selectedFeedback.status === 'New' ? 'Mark Reviewed' : 'Reopen'}
                  </button>
                  <button
                    onClick={() => setSelectedFeedback(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientFeedback;
