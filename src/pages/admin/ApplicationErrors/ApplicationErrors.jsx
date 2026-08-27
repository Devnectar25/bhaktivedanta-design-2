import React, { useState, useEffect } from 'react';
import { getAppErrors, addAppError, updateAppError, clearAppErrors } from '../../../utils/api';

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

const ApplicationErrors = () => {
  const [errors, setErrors] = useState([]);
  const [levelFilter, setLevelFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedError, setSelectedError] = useState(null);

  useEffect(() => {
    getAppErrors(defaultErrors).then(data => setErrors(data || defaultErrors));
  }, []);

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all error log history?")) {
      clearAppErrors().then(() => setErrors([]));
    }
  };

  const handleSimulateError = () => {
    const simulated = {
      id: `ERR-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString(),
      level: ['Error', 'Warning', 'Critical'][Math.floor(Math.random() * 3)],
      source: 'System Diagnostic Test',
      message: 'Simulated runtime check exception triggered from Admin Console.',
      endpoint: '/api/health-check',
      status: 'Investigating',
      details: 'Stacktrace: at Object.SimulateDiagnostic (ApplicationErrors.jsx:45:12)'
    };

    addAppError(simulated).then(() => {
      setErrors(prev => [simulated, ...prev]);
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
    const matchesSearch = e.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (e.endpoint && e.endpoint.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = levelFilter === 'All' || e.level === levelFilter;
    const matchesStatus = statusFilter === 'All' || e.status === statusStatusFilter(e.status, statusFilter);
    return matchesSearch && matchesLevel && matchesStatus;
  });

  function statusStatusFilter(itemStatus, filterVal) {
    if (filterVal === 'All') return true;
    return itemStatus === filterVal;
  }

  const criticalCount = errors.filter(e => e.level === 'Critical').length;
  const errorCount = errors.filter(e => e.level === 'Error').length;
  const warningCount = errors.filter(e => e.level === 'Warning').length;

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Application Error &amp; System Logs</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Application Error Monitoring</h2>
          <p className="text-sm text-slate-500">Monitor backend API exceptions, frontend runtime errors, database queries, and system logs</p>
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
        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Server API Status</span>
            <p className="text-lg font-bold text-green-600 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
              Online (Port 5000)
            </p>
          </div>
          <span className="material-symbols-outlined text-3xl text-green-500/80">dns</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Critical Exceptions</span>
            <p className="text-2xl font-bold text-red-600 mt-1">{criticalCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-red-500/80">error</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Standard Errors</span>
            <p className="text-2xl font-bold text-amber-600 mt-1">{errorCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-amber-500/80">warning</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">System Warnings</span>
            <p className="text-2xl font-bold text-blue-600 mt-1">{warningCount}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-blue-500/80">info</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
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
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Level</th>
              <th className="px-4 py-3">Source &amp; Endpoint</th>
              <th className="px-4 py-3">Error Message</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
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
              filteredErrors.map((err) => (
                <tr key={err.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{err.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      err.level === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse' :
                      err.level === 'Error' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                      {err.level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">{err.source}</div>
                    {err.endpoint && <div className="font-mono text-[10px] text-slate-400">{err.endpoint}</div>}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="font-medium text-slate-800 truncate" title={err.message}>
                      {err.message}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      err.status === 'Resolved' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {err.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button 
                        onClick={() => setSelectedError(err)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all text-xs flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                        Inspect
                      </button>
                      {err.status !== 'Resolved' ? (
                        <button 
                          onClick={() => handleUpdateStatus(err.id, 'Resolved')}
                          className="px-2.5 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 font-bold border border-green-200 transition-all text-xs"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleUpdateStatus(err.id, 'Investigating')}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold border border-amber-200 transition-all text-xs"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Timestamp</span>
                  <div className="font-mono text-slate-700">{selectedError.timestamp}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Endpoint</span>
                  <div className="font-mono text-slate-700">{selectedError.endpoint || 'N/A'}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <div className="bg-red-50 text-red-900 border border-red-100 p-3 rounded-lg font-mono text-[11px] leading-relaxed">
                  {selectedError.message}
                </div>
              </div>

              {selectedError.details && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stack trace / Diagnostic Notes</label>
                  <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                    {selectedError.details}
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
