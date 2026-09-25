import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialEvents, saveEvents } from '../../../data/adminState';
import { showConfirmDialog } from '../../../utils/swal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    initialEvents().then(data => setEvents(data));
  }, []);

  const saveAndSetEvents = (newEvents) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const handleDelete = async (id) => {
    const res = await showConfirmDialog("Delete Event", "Are you sure you want to delete this event?", "Yes, Delete");
    if (res.isConfirmed) {
      const updated = events.filter(evt => evt.id !== id);
      saveAndSetEvents(updated);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Statuses');
    setCurrentPage(1);
  };

  // Filter list
  const filtered = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          evt.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // simple heuristic categorization, default events has title terms
    let category = 'Outreach';
    if (evt.title.toLowerCase().includes('camp') || evt.title.toLowerCase().includes('check-up')) {
      category = 'Health Camp';
    } else if (evt.title.toLowerCase().includes('cme') || evt.title.toLowerCase().includes('surgery') || evt.title.toLowerCase().includes('seminar')) {
      category = 'Seminar';
    }

    const matchesCategory = selectedCategory === 'All Categories' || category === selectedCategory;
    const matchesStatus = selectedStatus === 'All Statuses' || evt.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEvents = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filtered.length, totalPages, currentPage]);

  const totalCount = events.length;
  const upcomingCount = events.filter(e => e.status === 'Upcoming' || e.status === 'Scheduled').length;
  const completedCount = events.filter(e => e.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Action Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-slate-400 mb-1">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Events</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Events Management</h2>
          <p className="text-sm text-slate-500">Manage community health checkup camps, medical seminars, and hospital public events.</p>
        </div>
        <Link 
          to="/admin/add-event" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Event</span>
        </Link>
      </div>

      {/* Summary Cards Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Events</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{totalCount}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">Active list</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Upcoming</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">upcoming</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{upcomingCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Scheduled next</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Completed</span>
            <div className="w-9 h-9 bg-green-50 text-green-700 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">task_alt</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{completedCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Successfully run</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Featured</span>
            <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">star</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">2</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Shown on home pages</p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Event</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="w-[180px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Category</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All Categories</option>
            <option>Health Camp</option>
            <option>Seminar</option>
            <option>Workshop</option>
            <option>Outreach</option>
          </select>
        </div>
        <div className="w-[150px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Status</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option>All Statuses</option>
            <option>Upcoming</option>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all animate-none"
        >
          Reset
        </button>
      </div>

      {/* Events Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3">Event Details</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date &amp; Venue</th>
              <th className="px-4 py-3">Timings</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-slate-400 font-medium">No matching events found.</td>
              </tr>
            ) : (
              paginatedEvents.map((evt) => {
                let category = 'Outreach';
                if (evt.title.toLowerCase().includes('camp') || evt.title.toLowerCase().includes('check-up')) {
                  category = 'Health Camp';
                } else if (evt.title.toLowerCase().includes('cme') || evt.title.toLowerCase().includes('surgery') || evt.title.toLowerCase().includes('seminar')) {
                  category = 'Seminar';
                }

                return (
                  <tr key={evt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-800 text-sm leading-snug">{evt.title}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{evt.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md text-[10px] font-bold">
                        {category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{evt.date}</p>
                      <p className="text-[10px] text-slate-400">{evt.venue}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 font-medium">{evt.time}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        evt.status === 'Upcoming' || evt.status === 'Scheduled'
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : evt.status === 'Completed'
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => navigate(`/admin/add-event?edit=${evt.id}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                          title="Edit Event"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(evt.id)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                          title="Delete Event"
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

        {/* Pagination Controls Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <p className="text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-700">{filtered.length > 0 ? startIndex + 1 : 0}</span> to{' '}
              <span className="font-bold text-slate-700">{Math.min(endIndex, filtered.length)}</span> of{' '}
              <span className="font-bold text-slate-700">{filtered.length}</span> events
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="Previous Page"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                    currentPage === pageNum
                      ? 'bg-[#1e3a8a] text-white border border-[#1e3a8a]'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold flex items-center justify-center transition-all shadow-sm active:scale-95"
                title="Next Page"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
