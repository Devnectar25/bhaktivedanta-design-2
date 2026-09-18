import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialDoctors, saveDoctors } from '../../../data/adminState';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedExp, setSelectedExp] = useState('Any Years');
  const [selectedAvail, setSelectedAvail] = useState('All Status');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 10, 15, 25, 50, 100, 'All'

  const navigate = useNavigate();

  const loadDoctorsData = () => {
    setLoading(true);
    initialDoctors().then(data => {
      if (Array.isArray(data)) {
        setDoctors(data);
      }
      setLoading(false);
    }).catch(err => {
      console.error("Failed to load doctors:", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDoctorsData();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor profile?")) {
      const updated = doctors.filter(doc => doc.id !== id);
      setDoctors(updated);
      saveDoctors(updated);
    }
  };

  const handleToggleFeatured = (id) => {
    const updated = doctors.map(doc => {
      if (doc.id === id) {
        return { ...doc, featured: doc.featured === 'Yes' ? 'No' : 'Yes' };
      }
      return doc;
    });
    setDoctors(updated);
    saveDoctors(updated);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedDept('All Departments');
    setSelectedExp('Any Years');
    setSelectedAvail('All Status');
    setCurrentPage(1);
  };

  // Dynamically extract all available departments from doctors dataset
  const allDepartments = useMemo(() => {
    const depts = new Set();
    doctors.forEach(d => {
      if (d.department && d.department.trim()) {
        depts.add(d.department.trim());
      }
    });
    return ['All Departments', ...Array.from(depts).sort()];
  }, [doctors]);

  // Filtered doctors list based on search and selected filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doc => {
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = !q || 
        (doc.name || '').toLowerCase().includes(q) ||
        (doc.qualifications || '').toLowerCase().includes(q) ||
        (doc.subSpeciality || '').toLowerCase().includes(q) ||
        (doc.department || '').toLowerCase().includes(q);
      
      const deptMatch = selectedDept === 'All Departments' || doc.department === selectedDept;
      
      let expMatch = true;
      if (selectedExp === '5+ Years') {
        const yrs = parseInt(doc.experience) || 0;
        expMatch = yrs >= 5;
      } else if (selectedExp === '10+ Years') {
        const yrs = parseInt(doc.experience) || 0;
        expMatch = yrs >= 10;
      } else if (selectedExp === '15+ Years') {
        const yrs = parseInt(doc.experience) || 0;
        expMatch = yrs >= 15;
      } else if (selectedExp === '20+ Years') {
        const yrs = parseInt(doc.experience) || 0;
        expMatch = yrs >= 20;
      }

      const availMatch = selectedAvail === 'All Status' || doc.availability === selectedAvail;

      return nameMatch && deptMatch && expMatch && availMatch;
    });
  }, [doctors, searchTerm, selectedDept, selectedExp, selectedAvail]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedExp, selectedAvail, pageSize]);

  // Pagination calculation
  const totalItems = filteredDoctors.length;
  const isAllPages = pageSize === 'All' || pageSize >= totalItems;
  const effectivePageSize = isAllPages ? totalItems : Number(pageSize);
  const totalPages = isAllPages || totalItems === 0 ? 1 : Math.ceil(totalItems / effectivePageSize);
  const startIndex = isAllPages ? 0 : (currentPage - 1) * effectivePageSize;
  const endIndex = isAllPages ? totalItems : Math.min(startIndex + effectivePageSize, totalItems);
  const paginatedDoctors = isAllPages ? filteredDoctors : filteredDoctors.slice(startIndex, endIndex);

  // Statistics
  const totalCount = doctors.length;
  const availableToday = doctors.filter(d => d.availability === 'Available').length;
  const featuredCount = doctors.filter(d => d.featured === 'Yes').length;
  const onLeaveCount = doctors.filter(d => d.availability === 'On Leave').length;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-1.5 text-slate-400 text-xs mb-2 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Doctors</span>
          </nav>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Doctors Directory</h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-slate-500">Live database directory of verified hospital doctors and medical specialists.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={loadDoctorsData}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm active:scale-95"
            title="Refresh list from database"
          >
            <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin' : ''}`}>sync</span>
            <span>Refresh</span>
          </button>
          <Link 
            to="/admin/add-doctor" 
            className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add New Doctor</span>
          </Link>
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Total Doctors</span>
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">groups</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{totalCount}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span> Live Supabase Directory (bv_doctors)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Available Today</span>
            <div className="w-9 h-9 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{availableToday}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Active staff on duty</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Featured Doctors</span>
            <div className="w-9 h-9 bg-amber-50 text-amber-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{featuredCount}</h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Shown on home pages</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/50 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">On Leave</span>
            <div className="w-9 h-9 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">event_busy</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-slate-800">{onLeaveCount}</h3>
            <p className="text-[10px] text-red-500 font-bold mt-1">Temporary absences</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[220px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Search Doctors</label>
          <div className="relative">
            <input 
              type="text"
              className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100 pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none transition-all"
              placeholder="Search by Dr. Name, Speciality, Qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              search
            </span>
          </div>
        </div>

        <div className="w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Department</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-blue-400 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {allDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="w-[140px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Experience</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-blue-400 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
          >
            <option>Any Years</option>
            <option>5+ Years</option>
            <option>10+ Years</option>
            <option>15+ Years</option>
            <option>20+ Years</option>
          </select>
        </div>

        <div className="w-[140px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Availability</label>
          <select 
            className="w-full bg-white border border-slate-200 focus:border-blue-400 px-3 py-1.5 text-xs rounded-lg outline-none cursor-pointer"
            value={selectedAvail}
            onChange={(e) => setSelectedAvail(e.target.value)}
          >
            <option>All Status</option>
            <option>Available</option>
            <option>Busy</option>
            <option>On Leave</option>
          </select>
        </div>

        <button 
          onClick={handleClearFilters}
          className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold transition-all"
        >
          Clear Filters
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">
              Showing <span className="font-bold text-slate-900">{totalItems === 0 ? 0 : startIndex + 1}</span> to <span className="font-bold text-slate-900">{endIndex}</span> of <span className="font-bold text-slate-900">{totalItems}</span> doctors
            </span>
            {totalItems !== totalCount && (
              <span className="text-slate-400">(filtered from {totalCount} total)</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Rows per page:</span>
            <select
              className="bg-white border border-slate-200 rounded px-2 py-1 text-xs font-semibold outline-none cursor-pointer focus:border-blue-400"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value === 'All' ? 'All' : Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value="All">All ({totalItems})</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-4 py-3 w-16 text-center">#</th>
                <th className="px-4 py-3">Doctor Info</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-blue-500 animate-spin">progress_activity</span>
                      <span className="font-semibold text-slate-600">Loading doctors from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-slate-400 font-medium">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-3xl text-slate-300">person_off</span>
                      <p className="text-sm font-semibold text-slate-600">No doctors match the selected criteria.</p>
                      <button 
                        onClick={handleClearFilters}
                        className="mt-2 text-blue-600 hover:underline text-xs font-bold"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedDoctors.map((doc, idx) => {
                  const displayIndex = startIndex + idx + 1;
                  const avatarNum = ((parseInt(doc['sr.no'] || displayIndex) - 1) % 4) + 1;
                  const fallbackAvatar = `/doctor${avatarNum}.png`;

                  return (
                    <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 text-center font-bold text-slate-400 text-[11px]">
                        {doc['sr.no'] || displayIndex}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                            <img 
                              alt={doc.name} 
                              className="w-full h-full object-cover" 
                              src={doc.image || fallbackAvatar} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = fallbackAvatar;
                              }}
                            />
                          </div>
                          <div className="min-w-0 max-w-[260px]">
                            <p className="font-bold text-slate-800 text-sm leading-snug truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-slate-500 font-medium line-clamp-1" title={doc.qualifications}>
                              {doc.qualifications}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col max-w-[220px]">
                          <span className="font-semibold text-slate-800 leading-snug">{doc.department}</span>
                          <span className="text-[10px] text-slate-500 line-clamp-1" title={doc.subSpeciality}>
                            {doc.subSpeciality}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700 whitespace-nowrap">
                        {doc.experience}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.availability === 'Available' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : doc.availability === 'Busy'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {doc.availability}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button 
                          onClick={() => handleToggleFeatured(doc.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            doc.featured === 'Yes'
                              ? 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                          }`}
                          title="Toggle featured status"
                        >
                          {doc.featured}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${doc.status === 'Active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                          <span className="font-semibold text-slate-600">{doc.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex justify-end gap-1.5">
                          <button 
                            onClick={() => navigate(`/admin/add-doctor?edit=${doc.id}`)}
                            className="w-7 h-7 rounded bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition-all"
                            title="Edit Profile"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                            title="Delete Doctor"
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

        {/* Pagination Footer */}
        {!isAllPages && totalPages > 1 && (
          <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-500">
              Page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="First Page"
              >
                <span className="material-symbols-outlined text-xs">first_page</span>
              </button>

              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Previous
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#fea619] text-slate-900 font-extrabold shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Next
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                title="Last Page"
              >
                <span className="material-symbols-outlined text-xs">last_page</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;
