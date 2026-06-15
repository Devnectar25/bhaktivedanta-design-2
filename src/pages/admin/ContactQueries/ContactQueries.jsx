import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initialQueries, saveQueries } from '../../../data/adminState';

const ContactQueries = () => {
  const [queries, setQueries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');

  const navigate = useNavigate();

  useEffect(() => {
    initialQueries().then(data => setQueries(data));
  }, []);

  const saveAndSetQueries = (newQueries) => {
    setQueries(newQueries);
    saveQueries(newQueries);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      const updated = queries.filter(q => q.id !== id);
      saveAndSetQueries(updated);
    }
  };

  const handleResolve = (id) => {
    const updated = queries.map(q => {
      if (q.id === id) {
        return { ...q, status: 'Resolved' };
      }
      return q;
    });
    saveAndSetQueries(updated);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('All Types');
    setSelectedStatus('All Statuses');
    setSelectedPriority('All Priorities');
  };

  // Filter logic
  const filtered = queries.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    // heuristics for query type
    let qType = 'General Inquiry';
    if (q.subject.toLowerCase().includes('appointment') || q.message.toLowerCase().includes('appointment')) {
      qType = 'Appointment';
    } else if (q.subject.toLowerCase().includes('billing') || q.subject.toLowerCase().includes('package')) {
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

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Contact Queries</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Contact Queries Management</h2>
          <p className="text-sm text-slate-500">Manage website contact form submissions and patient inquiries efficiently.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/add-query')}
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Manual Query</span>
        </button>
      </div>

      {/* Summary Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-blue-600">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Queries</p>
          <h3 className="font-bold text-xl text-slate-800">{totalCount}</h3>
          <p className="text-[10px] text-green-600 font-bold mt-1">Live submissions</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-amber-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Pending Queries</p>
          <h3 className="font-bold text-xl text-slate-800">{pendingCount}</h3>
          <p className="text-[10px] text-amber-600 font-bold mt-1">Requires action</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-green-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Resolved</p>
          <h3 className="font-bold text-xl text-slate-800">{resolvedCount}</h3>
          <p className="text-[10px] text-green-600 font-bold mt-1">Closed queries</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-indigo-600">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">High Priority</p>
          <h3 className="font-bold text-xl text-slate-800">1</h3>
          <p className="text-[10px] text-red-500 font-bold mt-1">Urgent attention</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-slate-400">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Archived</p>
          <h3 className="font-bold text-xl text-slate-800">0</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1">Inactive records</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm border-l-4 border-l-[#fea619]">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Today</p>
          <h3 className="font-bold text-xl text-slate-800">2</h3>
          <p className="text-[10px] text-slate-500 font-bold mt-1">Last 24 hours</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Patients/Email/Subject</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Query Type</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option>All Types</option>
            <option>General Inquiry</option>
            <option>Appointment</option>
            <option>Billing</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Resolved</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Priority</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
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
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Reset
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Query ID</th>
              <th className="px-4 py-3">Patient Details</th>
              <th className="px-4 py-3">Subject &amp; Message</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Date Received</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No matching queries found.</td>
              </tr>
            ) : (
              filtered.map((q) => {
                let qType = 'General Inquiry';
                if (q.subject.toLowerCase().includes('appointment') || q.message.toLowerCase().includes('appointment')) {
                  qType = 'Appointment';
                } else if (q.subject.toLowerCase().includes('billing') || q.subject.toLowerCase().includes('package')) {
                  qType = 'Billing';
                }

                let qPriority = 'Medium';
                if (q.subject.toLowerCase().includes('urgent') || q.message.toLowerCase().includes('emergency') || q.subject.toLowerCase().includes('available')) {
                  qPriority = 'High';
                }

                return (
                  <tr key={q.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-[#1e3a8a]">{q.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{q.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{q.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700 truncate">{q.subject}</span>
                        <span className="text-[10px] text-slate-400 truncate mt-0.5">{q.message}</span>
                        <span className="bg-slate-100 text-slate-600 rounded-full w-fit mt-1 px-2 py-0.5 text-[9px] font-bold">
                          {qType}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        qPriority === 'High'
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : qPriority === 'Medium'
                          ? 'bg-amber-50 text-amber-600 border border-amber-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {qPriority}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-600 whitespace-nowrap">{q.date || '15 Jun, 2026'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        q.status === 'Resolved'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {q.status === 'Pending' && (
                          <button 
                            onClick={() => handleResolve(q.id)}
                            className="w-7 h-7 rounded bg-green-50 hover:bg-green-100 text-green-600 border border-green-100 flex items-center justify-center transition-all"
                            title="Mark as Resolved"
                          >
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                          </button>
                        )}
                        <button 
                          onClick={() => alert(`Subject: ${q.subject}\nFrom: ${q.name} (${q.email})\nMessage: ${q.message}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                          title="View Message"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(q.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                          title="Delete Query"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
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
    </div>
  );
};

export default ContactQueries;
