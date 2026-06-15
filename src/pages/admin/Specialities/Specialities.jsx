import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../../data/defaultSpecialities';
import { getSpecialitiesState, saveSpecialitiesState } from '../../../utils/api';

const Specialities = () => {
  const [state, setState] = useState(defaultSpecialitiesState);

  const navigate = useNavigate();

  useEffect(() => {
    getSpecialitiesState(defaultSpecialitiesState).then(res => {
      if (res && res.specialities) {
        res.specialities.forEach(ensureStandardTabs);
      }
      setState(res);
    });
  }, []);

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
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Specialities</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-800">Specialities &amp; Categories</h2>
          <p className="text-sm text-slate-500 font-medium">Manage clinical speciality groups and specific healthcare departments.</p>
        </div>
        <div className="flex gap-2">
          <Link 
            to="/admin/add-category" 
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">create_new_folder</span>
            <span>Add Category</span>
          </Link>
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
        
        {/* Left Columns: Specialities List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-bold text-sm text-[#1e3a8a]">Active Speciality Departments</h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Total: {state.specialities.length}
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {state.specialities.map(spec => {
                const cat = state.categories.find(c => c.id === spec.categoryId);
                return (
                  <div key={spec.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <span className="material-symbols-outlined text-xl">{spec.icon || 'star'}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm leading-snug">{spec.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Category: {cat ? cat.name : 'Unassigned'}
                        </p>
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
                        <p className="text-[10px] text-slate-400 font-semibold">Order: {cat.order} • {count} Specialities</p>
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
