import React, { useState, useEffect } from 'react';
import { getAppErrors, addAppError, updateAppError, clearAppErrors } from '../../../utils/api';
import { showConfirmDialog } from '../../../utils/swal';

const defaultErrors = [
  {
    id: 'ERR-901',
    timestamp: '2026-08-26 10:45:12',
    level: 'Error',
    source: 'Database Query',
    message: 'Supabase real-time connection failure: Node 20 WebSocket initialization',
    endpoint: '/api/specialities-state',
    status: 'Resolved',
    details: 'Configured globalThis.WebSocket fallback via ws transport.'
  },
  {
    id: 'ERR-902',
    timestamp: '2026-08-26 08:30:00',
    level: 'Warning',
    source: 'CORS Middleware',
    message: 'CORS header missing for origin http://127.0.0.1:5173',
    endpoint: '/api/doctors',
    status: 'Resolved',
    details: 'Updated CORS allowed origins in server.js middleware.'
  },
  {
    id: 'ERR-903',
    timestamp: '2026-08-25 18:22:40',
    level: 'Critical',
    source: 'API Gateway',
    message: 'HTTP 500: Database table bv_doctors not found in Supabase schema',
    endpoint: '/api/doctors',
    status: 'Investigating',
    details: 'Database table bv_doctors requires verification in Supabase dashboard.'
  }
];

function cleanDetailsText(details) {
  if (!details || typeof details !== 'string') return '';
  let str = details.trim();
  const marker = str.indexOf('Details / Stack:\n');
  if (marker !== -1) {
    str = str.substring(marker + 'Details / Stack:\n'.length).trim();
  }
  str = str.replace(/^(\[[A-Za-z]+:\s*[^\]]+\]\s*)+/g, '').trim();
  return str;
}

function formatTimestampDisplay(ts) {
  if (!ts) return { date: 'N/A', time: '' };
  if (ts.includes(',')) {
    const parts = ts.split(',');
    return { date: parts[0].trim(), time: parts.slice(1).join(',').trim() };
  }
  if (ts.includes(' ')) {
    const parts = ts.split(' ');
    return { date: parts[0].trim(), time: parts.slice(1).join(' ').trim() };
  }
  return { date: ts, time: '' };
}

const ApplicationErrors = () => {
  const [errors, setErrors] = useState([]);
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedError, setSelectedError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchErrors = () => {
      getAppErrors(defaultErrors).then(data => setErrors(data || defaultErrors));
    };

    fetchErrors();
    window.addEventListener('admin_data_updated', fetchErrors);
    window.addEventListener('app_errors_updated', fetchErrors);
    return () => {
      window.removeEventListener('admin_data_updated', fetchErrors);
      window.removeEventListener('app_errors_updated', fetchErrors);
    };
  }, []);

  const handleClearAll = async () => {
    const res = await showConfirmDialog("Clear Error Logs", "Are you sure you want to clear all error log history?", "Yes, Clear All");
    if (res.isConfirmed) {
      clearAppErrors().then(() => setErrors([]));
    }
  };

  const handleSimulateError = () => {
    const simulated = {
      id: `ERR-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString(),
      level: 'Error',
      source: 'System Diagnostic Test',
      message: 'Simulated runtime check exception triggered from Admin Console.',
      endpoint: '/api/health-check',
      status: 'Investigating',
      details: 'Stacktrace: at Object.SimulateDiagnostic (ApplicationErrors.jsx:45:12)'
    };

    addAppError(simulated).then(() => {
      getAppErrors(defaultErrors).then(data => setErrors(data || defaultErrors));
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    const match = errors.find(e => e.id === id);
    if (!match) return;

    const updated = { ...match, status: newStatus };
    updateAppError(id, updated).then(() => {
      setErrors(prev => prev.map(e => e.id === id ? updated : e));
      if (selectedError && selectedError.id === id) {
        setSelectedError(updated);
      }
    });
  };

  const filteredErrors = errors.filter(e => {
    const msg = e.message || '';
    const src = e.source || '';
    const ep = e.endpoint || '';
    const matchesSearch = msg.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          src.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ep.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'All' || e.level === levelFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusStatusFilter(e.status, statusFilter);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Reset to page 1 when filters change
  const prevFilters = React.useRef({ searchTerm, levelFilter, statusFilter });
  if (prevFilters.current.searchTerm !== searchTerm ||
      prevFilters.current.levelFilter !== levelFilter ||
      prevFilters.current.statusFilter !== statusFilter) {
    prevFilters.current = { searchTerm, levelFilter, statusFilter };
    if (currentPage !== 1) setCurrentPage(1);
  }

  function statusStatusFilter(itemStatus, filterVal) {
    if (filterVal === 'All') return true;
    return itemStatus === filterVal;
  }

  const criticalCount = errors.filter(e => e.level === 'Critical').reduce((acc, e) => acc + (parseInt(e.count, 10) || 1), 0);
  const errorCount = errors.filter(e => e.level === 'Error').reduce((acc, e) => acc + (parseInt(e.count, 10) || 1), 0);
  const warningCount = errors.filter(e => e.level === 'Warning').reduce((acc, e) => acc + (parseInt(e.count, 10) || 1), 0);

  const totalPages = Math.max(1, Math.ceil(filteredErrors.length / ITEMS_PER_PAGE));
  const paginatedErrors = filteredErrors.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="space-y-4 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Application Error &amp; System Logs</span>
          </nav>
          <h2 className="text-xl font-bold text-slate-800">Application Error Monitoring</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleSimulateError}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-base">bug_report</span>
            <span>Trigger Diagnostic Test</span>
          </button>
          <button 
            onClick={handleClearAll}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">delete_sweep</span>
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Server API Status</span>
            <p className="text-base font-bold text-green-600 mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online (Port 5000)
            </p>
          </div>
          <span className="material-symbols-outlined text-2xl text-green-500/80">dns</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Critical Exceptions</span>
            <p className="text-xl font-bold text-red-600 mt-0.5">{criticalCount}</p>
          </div>
          <span className="material-symbols-outlined text-2xl text-red-500/80">error</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Standard Errors</span>
            <p className="text-xl font-bold text-amber-600 mt-0.5">{errorCount}</p>
          </div>
          <span className="material-symbols-outlined text-2xl text-amber-500/80">warning</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">System Warnings</span>
            <p className="text-xl font-bold text-blue-600 mt-0.5">{warningCount}</p>
          </div>
          <span className="material-symbols-outlined text-2xl text-blue-500/80">info</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[220px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Logs</label>
          <input 
            type="text" 
            placeholder="Search log text, endpoint, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
          />
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Severity Level</label>
          <select 
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Critical">Critical</option>
            <option value="Error">Error</option>
            <option value="Warning">Warning</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-white border border-slate-200 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Errors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-x-auto w-full">
        <table className="w-full min-w-[1020px] text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap w-[145px]">Timestamp</th>
              <th className="px-4 py-2 whitespace-nowrap w-[95px]">Level</th>
              <th className="px-4 py-2 w-[210px] min-w-[180px]">Source &amp; Endpoint</th>
              <th className="px-4 py-2 min-w-[340px]">Error Message &amp; Details</th>
              <th className="px-4 py-2 whitespace-nowrap w-[155px]">Status</th>
              <th className="px-4 py-2 text-right whitespace-nowrap w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredErrors.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">
                  No application errors logged. System is operating normally!
                </td>
              </tr>
            ) : (
              paginatedErrors.map((err) => {
                const ts = formatTimestampDisplay(err.timestamp);
                const cleanDetails = cleanDetailsText(err.details);

                return (
                  <tr key={err.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 whitespace-nowrap align-middle">
                      <div className="font-mono text-xs font-semibold text-slate-700">{ts.date}</div>
                      {ts.time && <div className="font-mono text-[10px] text-slate-400 mt-0.5">{ts.time}</div>}
                    </td>

                    <td className="px-4 py-2.5 whitespace-nowrap align-middle">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        err.level === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' :
                        err.level === 'Error' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {err.level}
                      </span>
                    </td>

                    <td className="px-4 py-2.5 align-middle">
                      <div className="font-bold text-slate-800 text-xs">{err.source}</div>
                      {err.endpoint && (
                        <div className="mt-1">
                          <span className="font-mono text-[10px] text-slate-700 bg-slate-100 border border-slate-200/90 px-2 py-0.5 rounded font-medium inline-block break-all select-all">
                            {err.endpoint}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3.5 align-middle max-w-[340px]">
                      <div className="text-xs font-medium text-slate-800 truncate" title={err.message}>
                        {err.message}
                      </div>
                      {(cleanDetails || err.count > 1) && (
                        <button
                          onClick={() => setSelectedError(err)}
                          className="mt-1 text-[10px] font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          View more →
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-2.5 whitespace-nowrap align-middle">
                      <select
                        value={err.status}
                        onChange={(e) => handleUpdateStatus(err.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-full px-3 py-1 border cursor-pointer outline-none transition-colors ${
                          err.status === 'Resolved'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : err.status === 'Investigating'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <option value="Investigating">Investigating</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-4 py-2.5 text-right whitespace-nowrap align-middle">
                      <button
                        onClick={() => setSelectedError(err)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all text-xs flex items-center gap-1 ml-auto active:scale-95"
                        title="Inspect complete log in modal"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredErrors.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredErrors.length)}</span> of <span className="font-semibold text-slate-700">{filteredErrors.length}</span> errors
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
              title="Previous page"
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
                      currentPage === p
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
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
              title="Next page"
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

      {/* Error Details Modal */}
      {selectedError && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-100 font-sans">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Error Diagnostic Details - {selectedError.id}</h3>
              <button onClick={() => setSelectedError(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Level</span>
                  <div className="font-bold text-slate-800">{selectedError.level}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Source</span>
                  <div className="font-bold text-slate-800">{selectedError.source}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Occurrences</span>
                  <div className="font-bold text-purple-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">repeat</span>
                    {selectedError.count || 1} {(selectedError.count || 1) === 1 ? 'time' : 'times'}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Timestamp</span>
                  <div className="font-mono text-slate-700">{selectedError.timestamp}</div>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Endpoint</span>
                  <div className="font-mono text-slate-700">{selectedError.endpoint || 'N/A'}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <div className="bg-red-50 text-red-900 border border-red-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed break-words">
                  {selectedError.message}
                </div>
              </div>

              {cleanDetailsText(selectedError.details) && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stack trace / Diagnostic Notes</label>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto select-text whitespace-pre-wrap leading-relaxed">
                    {cleanDetailsText(selectedError.details)}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    selectedError.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedError.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  {selectedError.status !== 'Resolved' ? (
                    <button 
                      onClick={() => handleUpdateStatus(selectedError.id, 'Resolved')}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-sm"
                    >
                      Mark Resolved
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleUpdateStatus(selectedError.id, 'Investigating')}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-sm"
                    >
                      Reopen Error
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedError(null)} 
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
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

export default ApplicationErrors;
