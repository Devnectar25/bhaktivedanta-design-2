import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { initialDoctors, saveDoctors } from '../../../data/adminState';
import { deleteDoctor } from '../../../utils/api';

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

  const handleDelete = (doc, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteDoctorModal(doc);
  };

  const confirmDeleteDoctor = async () => {
    if (!deleteDoctorModal) return;
    const targetId = deleteDoctorModal.id;
    const updated = doctors.filter(doc => doc.id !== targetId);
    setDoctors(updated);
    saveDoctors(updated);
    try {
      await deleteDoctor(targetId);
    } catch (err) {
      console.error("Failed to delete doctor:", err);
    }
    setDeleteDoctorModal(null);
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

  // Helper function to extract numeric years of experience
  const parseExpYears = (exp) => {
    if (!exp) return 0;
    const match = String(exp).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Filtered and sorted doctors list (most experienced doctor first)
  const filteredDoctors = useMemo(() => {
    const list = doctors.filter(doc => {
      const q = searchTerm.toLowerCase().trim();
      const nameMatch = !q || 
        (doc.name || '').toLowerCase().includes(q) ||
        (doc.qualifications || '').toLowerCase().includes(q) ||
        (doc.subSpeciality || '').toLowerCase().includes(q) ||
        (doc.department || '').toLowerCase().includes(q);
      
      const deptMatch = selectedDept === 'All Departments' || doc.department === selectedDept;
      
      let expMatch = true;
      const yrs = parseExpYears(doc.experience);
      if (selectedExp === '5+ Years') {
        expMatch = yrs >= 5;
      } else if (selectedExp === '10+ Years') {
        expMatch = yrs >= 10;
      } else if (selectedExp === '15+ Years') {
        expMatch = yrs >= 15;
      } else if (selectedExp === '20+ Years') {
        expMatch = yrs >= 20;
      }

      const availMatch = selectedAvail === 'All Status' || doc.availability === selectedAvail;

      return nameMatch && deptMatch && expMatch && availMatch;
    });

    // Sort by experience descending (most experienced doctor at top)
    return list.sort((a, b) => parseExpYears(b.experience) - parseExpYears(a.experience));
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

  // Modal state for viewing doctor profile popup & deletion confirmation popup
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [deleteDoctorModal, setDeleteDoctorModal] = useState(null);

  // Lock background body scroll when modal popup is open
  useEffect(() => {
    if (selectedDoctorModal || deleteDoctorModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDoctorModal, deleteDoctorModal]);

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
            <p className="text-[10px] text-slate-500 font-bold mt-1">Active registered doctors</p>
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
                  <td colSpan="7" className="px-4 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-3xl text-blue-500 animate-spin">progress_activity</span>
                      <span className="font-semibold text-slate-600">Loading doctors from database...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedDoctors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-400 font-medium">
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
                    <tr 
                      key={doc.id} 
                      className="hover:bg-blue-50/30 cursor-pointer transition-colors group"
                      onClick={() => setSelectedDoctorModal(doc)}
                      title={`Click to view profile of ${doc.name}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200 group-hover:border-blue-300 group-hover:shadow-xs transition-all">
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
                            <p className="font-bold text-slate-800 group-hover:text-blue-600 text-sm leading-snug truncate transition-colors" title={doc.name}>
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
                          <span className="font-semibold text-slate-800 group-hover:text-blue-600 leading-snug transition-colors">{doc.department}</span>
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(doc.id);
                          }}
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
                      <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedDoctorModal(doc);
                            }}
                            className="w-7 h-7 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="View Doctor Profile"
                          >
                            <span className="material-symbols-outlined text-[16px] pointer-events-none">visibility</span>
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate(`/admin/add-doctor?edit=${doc.id}`);
                            }}
                            className="w-7 h-7 rounded bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Edit Profile"
                          >
                            <span className="material-symbols-outlined text-[16px] pointer-events-none">edit</span>
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => handleDelete(doc, e)}
                            className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
                            title="Delete Doctor"
                          >
                            <span className="material-symbols-outlined text-[16px] pointer-events-none">delete</span>
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

      {/* Doctor Profile View Modal Popup */}
      {selectedDoctorModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDoctorModal(null)}
          style={{ overscrollBehavior: 'contain' }}
        >
          <div 
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1e3a8a] via-[#2563eb] to-[#1e3a8a] text-white p-6 relative">
              <button 
                onClick={() => setSelectedDoctorModal(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition-all"
                title="Close Modal"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>

              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/10 border-2 border-white/20 shadow-md">
                  <img 
                    src={selectedDoctorModal.image || `/doctor${((parseInt(selectedDoctorModal['sr.no'] || 1) - 1) % 4) + 1}.png`} 
                    alt={selectedDoctorModal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/doctor${((parseInt(selectedDoctorModal['sr.no'] || 1) - 1) % 4) + 1}.png`;
                    }}
                  />
                </div>
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedDoctorModal.status === 'Active' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}>
                      {selectedDoctorModal.status || 'Active'}
                    </span>
                    {selectedDoctorModal.featured === 'Yes' && (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">verified</span> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedDoctorModal.name}</h3>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">{selectedDoctorModal.subSpeciality || selectedDoctorModal.department}</p>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-slate-700">
              {/* Qualifications Block */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Qualifications & Credentials</span>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  {selectedDoctorModal.qualifications || 'Medical Specialist Consultant'}
                </p>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Department</span>
                  <p className="text-xs font-bold text-slate-800">{selectedDoctorModal.department}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Experience</span>
                  <p className="text-xs font-bold text-slate-800">{selectedDoctorModal.experience || '10+ Years'}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Availability</span>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                    selectedDoctorModal.availability === 'Available'
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : selectedDoctorModal.availability === 'Busy'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {selectedDoctorModal.availability || 'Available'}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Sub-Speciality</span>
                  <p className="text-xs font-semibold text-slate-800 line-clamp-1">{selectedDoctorModal.subSpeciality || 'General Practitioner'}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between gap-3">
              <button 
                onClick={() => setSelectedDoctorModal(null)}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-all"
              >
                Close
              </button>

              <button 
                onClick={() => {
                  const id = selectedDoctorModal.id;
                  setSelectedDoctorModal(null);
                  navigate(`/admin/add-doctor?edit=${id}`);
                }}
                className="px-4 py-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Edit Doctor Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Modern Deletion Confirmation Modal */}
      {deleteDoctorModal && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[999999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteDoctorModal(null)}
          style={{ overscrollBehavior: 'contain' }}
        >
          <div 
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative transform transition-all animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="p-6 text-center">
              {/* Warning Icon Circle */}
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-xs">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1.5">Remove Doctor Profile?</h3>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Are you sure you want to remove <strong className="text-slate-800 font-bold">{deleteDoctorModal.name}</strong>? This will remove the doctor from the hospital database.
              </p>

              {/* Doctor Summary Card */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 text-left flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                  <img 
                    src={deleteDoctorModal.image || `/doctor${((parseInt(deleteDoctorModal['sr.no'] || 1) - 1) % 4) + 1}.png`} 
                    alt={deleteDoctorModal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/doctor1.png`;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{deleteDoctorModal.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{deleteDoctorModal.department || deleteDoctorModal.qualifications}</p>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDeleteDoctorModal(null)}
                  className="flex-1 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all shadow-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteDoctor}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/20 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                  Delete Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
