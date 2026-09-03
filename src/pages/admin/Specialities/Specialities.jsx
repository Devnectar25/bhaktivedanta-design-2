import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';

const Specialities = () => {
  const [state, setState] = useState(defaultSpecialitiesState);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  useEffect(() => {
    // Invalidate stale cached state if it has fewer than 36 specialities
    const cached = localStorage.getItem('bhaktivedanta_specialities_state');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!parsed.specialities || parsed.specialities.length < 36) {
          localStorage.removeItem('bhaktivedanta_specialities_state');
        }
      } catch (e) {
        localStorage.removeItem('bhaktivedanta_specialities_state');
      }
    }

    getSpecialitiesState(defaultSpecialitiesState).then(res => {
      if (res && res.specialities && res.specialities.length >= 36) {
        res.specialities.forEach(ensureStandardTabs);
        setState(res);
      } else {
        setState(defaultSpecialitiesState);
      }
    });
  }, []);

  const totalPages = Math.ceil(state.specialities.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSpecialities = state.specialities.slice(startIndex, endIndex);

  // Clamp current page if items shrink
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [state.specialities.length, totalPages, currentPage]);

  const saveState = (newState) => {
    setState(newState);
    saveSpecialitiesState(newState);
  };

  const handleDeleteSpeciality = (id) => {
    if (window.confirm("Are you sure you want to remove this speciality? It will be removed from all lists.")) {
      const updatedSpecs = state.specialities.filter(s => s.id !== id);
      saveState({ ...state, specialities: updatedSpecs });
    }
  };

  const handleToggleSpecialityStatus = (id) => {
    const updatedSpecs = state.specialities.map(s => {
      if (s.id === id) {
        return { ...s, status: !s.status };
      }
      return s;
    });
    saveState({ ...state, specialities: updatedSpecs });
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category? All nested specialities will be unassigned.")) {
      const updatedCats = state.categories.filter(c => c.id !== id);
      const updatedSpecs = state.specialities.map(s => {
        if (s.categoryId === id) {
          return { ...s, categoryId: null };
        }
        return s;
      });
      saveState({ ...state, categories: updatedCats, specialities: updatedSpecs });
    }
  };

  const handleToggleCategoryStatus = (id) => {
    const updatedCats = state.categories.map(c => {
      if (c.id === id) {
        return { ...c, status: !c.status };
      }
      return c;
    });
    saveState({ ...state, categories: updatedCats });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 leading-tight">Specialities &amp; Categories</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage clinical speciality groups and specific healthcare departments.</p>
        </div>
        <div className="flex gap-2">
          {state.categories.length < 6 && (
            <Link 
              to="/admin/add-category" 
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">create_new_folder</span>
              <span>Add Category</span>
            </Link>
          )}
          <Link 
            to="/admin/add-speciality" 
            className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            <span>Add Speciality</span>
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Specialities List with Pagination */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#1e3a8a]">Active Speciality Departments</h3>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Total: {state.specialities.length}
                </span>
              </div>
              
              <div className="divide-y divide-slate-100">
                {paginatedSpecialities.map(spec => {
                  const cat = state.categories.find(c => c.id === spec.categoryId);
                  const adminTag = spec.adminId ? `${spec.adminId}${spec.adminName ? ` (${spec.adminName})` : ''}` : 'ADM-001 (Super Administrator)';
                  return (
                    <div key={spec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
                          <span className="material-symbols-outlined text-xl">{spec.icon || 'star'}</span>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm leading-snug">{spec.name}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-500 font-semibold">
                              Category: {cat ? cat.name : 'Unassigned'}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200" title={`Created/Updated by ${adminTag}`}>
                              <span className="material-symbols-outlined text-[12px] text-blue-600">badge</span>
                              <span>Admin ID: {spec.adminId || 'ADM-001'}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          spec.status 
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : 'bg-red-50 text-red-600 border border-red-100'
                        }`}>
                          {spec.status ? 'Live' : 'Hidden'}
                        </span>

                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleToggleSpecialityStatus(spec.id)}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                              spec.status
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                                : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                            }`}
                            title={spec.status ? 'Hide Speciality' : 'Show Speciality'}
                          >
                            <span className="material-symbols-outlined text-[16px]">
                              {spec.status ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                          <button 
                            onClick={() => navigate(`/admin/add-speciality?edit=${spec.id}`)}
                            className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                            title="Edit Tabs and Details"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteSpeciality(spec.id)}
                            className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <p className="text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-700">{startIndex + 1}</span> to <span className="font-bold text-slate-700">{Math.min(endIndex, state.specialities.length)}</span> of <span className="font-bold text-slate-700">{state.specialities.length}</span> specialities
                </p>

                <div className="flex items-center gap-1.5">
                  <button
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

        {/* Right Column: Categories Management */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#1e3a8a]">Speciality Categories</h3>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Total: {state.categories.length}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {state.categories.map(cat => {
                const count = state.specialities.filter(s => s.categoryId === cat.id).length;
                return (
                  <div key={cat.id} className="p-4 space-y-2 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-snug">{cat.name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-0.5">
                          <p className="text-[10px] text-slate-400 font-semibold">Order: {cat.order} • {count} Specialities</p>
                          <span className="text-slate-300">•</span>
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded text-[9px] font-bold border border-slate-200" title={`Admin: ${cat.adminId || 'ADM-001'}`}>
                            <span>Admin ID: {cat.adminId || 'ADM-001'}</span>
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cat.status 
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {cat.status ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex justify-end gap-1.5 pt-1">
                      <button 
                        onClick={() => handleToggleCategoryStatus(cat.id)}
                        className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${
                          cat.status
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                            : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                        }`}
                        title={cat.status ? 'Deactivate Category' : 'Activate Category'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {cat.status ? 'block' : 'check'}
                        </span>
                      </button>
                      <button 
                        onClick={() => navigate(`/admin/add-category?edit=${cat.id}`)}
                        className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all"
                        title="Edit Details"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all"
                        title="Delete Category"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Specialities;
