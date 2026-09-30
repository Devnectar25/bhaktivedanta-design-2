import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQueries, deleteQuery, updateQuery } from '../../../utils/api';
import Swal, { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../utils/swal';
import { initialQueries } from '../../../data/adminState';

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const navigate = useNavigate();

  const loadQueries = async () => {
    setLoading(true);
    try {
      const defaultData = await initialQueries();
      const data = await getQueries(defaultData);
      setQueries(Array.isArray(data) ? data : defaultData);
    } catch (err) {
      console.error("Failed to load contact queries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, []);

  const handleDelete = async (id) => {
    const res = await showConfirmDialog('Delete Query?', 'Are you sure you want to delete this contact query?');
    if (res.isConfirmed) {
      deleteQuery(id, queries).then(() => {
        setQueries(prev => prev.filter(q => q.id !== id));
        showSuccessAlert('Deleted!', 'Contact query deleted successfully.');
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updated = { status: newStatus };
    updateQuery(id, updated, queries).then(() => {
      setQueries(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
    });
  };

  const handleViewDetails = (q) => {
    Swal.fire({
      title: `<div style="text-align: left; font-size: 1.1rem; font-weight: 700; color: #0f172a;">${q.subject || 'Patient Query Details'}</div>`,
      html: `
        <div style="text-align: left; font-family: Inter, sans-serif; font-size: 0.875rem; color: #334155; line-height: 1.6;">
          <div style="margin-bottom: 12px; padding: 12px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
            <div style="font-weight: 700; color: #1e3a8a; font-size: 0.9rem;">${q.name}</div>
            <div style="color: #64748b; font-size: 0.8rem; margin-top: 2px;">
              Email: <a href="mailto:${q.email}" style="color: #2563eb; font-weight: 600;">${q.email}</a> ${q.phone ? `| Phone: <span style="font-weight: 600;">${q.phone}</span>` : ''}
            </div>
            <div style="color: #64748b; font-size: 0.8rem; margin-top: 4px;">
              Received: <strong>${q.date || 'N/A'}</strong> | Status: <span style="font-weight: 700; color: ${q.status === 'Resolved' ? '#16a34a' : '#d97706'};">${q.status}</span>
            </div>
          </div>
          <div style="font-weight: 700; font-size: 0.75rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Query Message</div>
          <div style="background: #ffffff; padding: 12px 14px; border-radius: 10px; border: 1px solid #cbd5e1; white-space: pre-wrap; font-size: 0.875rem; color: #0f172a; max-height: 220px; overflow-y: auto;">${q.message || 'No message content provided.'}</div>
        </div>
      `,
      confirmButtonText: 'Close',
      confirmButtonColor: '#1e3a8a',
      customClass: {
        popup: 'rounded-2xl font-sans',
        confirmButton: 'px-6 py-2.5 rounded-lg font-bold text-sm'
      }
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedStatus('All Statuses');
    setSelectedPriority('All Priorities');
  };

  // Filter logic
  const filtered = queries.filter(q => {
    const qName = q.name || '';
    const qEmail = q.email || '';
    const qSubject = q.subject || '';
    const qMessage = q.message || '';

    const matchesSearch = qName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          qEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          qSubject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // heuristics for query type
    let qType = 'General Inquiry';
    if (qSubject.toLowerCase().includes('appointment') || qMessage.toLowerCase().includes('appointment')) {
      qType = 'Appointment';
    } else if (qSubject.toLowerCase().includes('billing') || qSubject.toLowerCase().includes('package')) {
      qType = 'Billing';
    }

    const matchesType = selectedType === 'All Types' || qType === selectedType;
    const matchesStatus = selectedStatus === 'All Statuses' || q.status === selectedStatus;
    
    // heuristics for priority
    let qPriority = 'Medium';
    if (q.subject.toLowerCase().includes('urgent') || q.message.toLowerCase().includes('emergency') || q.subject.toLowerCase().includes('available')) {
      qPriority = 'High';
    }

    const matchesPriority = selectedPriority === 'All Priorities' || qPriority === selectedPriority;

    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const totalCount = queries.length;
  const pendingCount = queries.filter(q => q.status === 'Pending').length;
  const resolvedCount = queries.filter(q => q.status === 'Resolved').length;

  // Reset page when filters change
  const prevFilters = React.useRef({ searchTerm, selectedType, selectedStatus, selectedPriority });
  if (
    prevFilters.current.searchTerm !== searchTerm ||
    prevFilters.current.selectedType !== selectedType ||
    prevFilters.current.selectedStatus !== selectedStatus ||
    prevFilters.current.selectedPriority !== selectedPriority
  ) {
    prevFilters.current = { searchTerm, selectedType, selectedStatus, selectedPriority };
    if (currentPage !== 1) setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedQueries = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-0.5 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Contact Queries</span>
          </nav>
          <h2 className="text-xl font-bold text-slate-800">Contact Queries Management</h2>
        </div>
        <button
          onClick={() => navigate('/admin/add-query')}
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-base">add</span>
          <span>Add Manual Query</span>
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm">
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
          <span className="w-2 h-2 rounded-full bg-blue-600"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total</span>
          <span className="text-sm font-bold text-slate-800">{totalCount}</span>
        </div>
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Pending</span>
          <span className="text-sm font-bold text-amber-600">{pendingCount}</span>
        </div>
        <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Resolved</span>
          <span className="text-sm font-bold text-green-600">{resolvedCount}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">High Priority</span>
          <span className="text-sm font-bold text-red-600">{queries.filter(q => (q.subject||'').toLowerCase().includes('urgent') || (q.message||'').toLowerCase().includes('emergency')).length || 0}</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-200/60 flex flex-wrap gap-2 items-end">
        <div className="flex-1 min-w-[180px] space-y-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search</label>
          <input
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Name, email, or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[150px] space-y-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Type</label>
          <select
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option>All Types</option>
            <option>General Inquiry</option>
            <option>Appointment</option>
            <option>Billing</option>
          </select>
        </div>
        <div className="w-[130px] space-y-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Resolved</option>
          </select>
        </div>
        <div className="w-[130px] space-y-0.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Priority</label>
          <select
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <button
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-x-auto w-full">
        <table className="w-full min-w-[1020px] text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="px-4 py-2 whitespace-nowrap w-[100px]">Query ID</th>
              <th className="px-4 py-2 w-[180px] min-w-[150px]">Patient Details</th>
              <th className="px-4 py-2 min-w-[280px]">Subject &amp; Message</th>
              <th className="px-4 py-2 whitespace-nowrap w-[95px]">Priority</th>
              <th className="px-4 py-2 whitespace-nowrap w-[115px]">Date Received</th>
              <th className="px-4 py-2 whitespace-nowrap w-[100px]">Status</th>
              <th className="px-4 py-2 text-right whitespace-nowrap w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No matching queries found.</td>
              </tr>
            ) : (
              paginatedQueries.map((q) => {
                let qType = 'General Inquiry';
                const subLower = (q.subject || '').toLowerCase();
                const msgLower = (q.message || '').toLowerCase();
                if (subLower.includes('appointment') || msgLower.includes('appointment')) {
                  qType = 'Appointment';
                } else if (subLower.includes('billing') || subLower.includes('package')) {
                  qType = 'Billing';
                }

                let qPriority = 'Medium';
                if (subLower.includes('urgent') || msgLower.includes('emergency') || subLower.includes('available')) {
                  qPriority = 'High';
                }

                return (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2 font-bold font-mono text-[#1e3a8a] text-xs whitespace-nowrap align-middle">
                      {q.id}
                    </td>
                    <td className="px-4 py-2 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs">{q.name}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[160px]">{q.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 align-middle max-w-[280px]">
                      <div className="text-xs font-bold text-slate-800 truncate">{q.subject}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{q.message}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        qPriority === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : qPriority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {qPriority}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-slate-600 whitespace-nowrap align-middle text-xs">
                      {q.date || '15 Jun, 2026'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap align-middle">
                      <select
                        value={q.status || 'Pending'}
                        onChange={(e) => handleStatusChange(q.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-full px-2.5 py-1 border cursor-pointer outline-none transition-colors ${
                          q.status === 'Resolved'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : q.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-right whitespace-nowrap align-middle">
                      <div className="flex justify-end items-center gap-1.5">
                        <button
                          onClick={() => handleViewDetails(q)}
                          className="w-7 h-7 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center transition-all active:scale-95"
                          title="View Message"
                        >
                          <span className="material-symbols-outlined text-[15px]">visibility</span>
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="w-7 h-7 rounded-md bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 flex items-center justify-center transition-all active:scale-95"
                          title="Delete Query"
                        >
                          <span className="material-symbols-outlined text-[15px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span> of <span className="font-semibold text-slate-700">{filtered.length}</span> queries
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="First page"
            >
              <span className="material-symbols-outlined text-[14px]">first_page</span>
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Previous"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`dots-${idx}`} className="px-1.5 text-xs text-slate-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[28px] px-2 py-1 rounded text-xs font-bold transition-colors ${
                      currentPage === p ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              )
            }

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Next"
            >
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded text-xs font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title="Last page"
            >
              <span className="material-symbols-outlined text-[14px]">last_page</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactQueries;
