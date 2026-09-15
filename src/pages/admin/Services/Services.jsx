import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { defaultServicesState, ensureStandardServiceTabs } from '../../../data/defaultServices';
import { getServicesState, saveServicesState } from '../../../utils/api';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

const Services = () => {
  const [state, setState] = useState(defaultServicesState);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Custom Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null,
    title: '',
    itemName: '',
    message: ''
  });

  const navigate = useNavigate();

  const fetchServicesData = () => {
    getServicesState(defaultServicesState).then(res => {
      if (res && res.services) {
        res.services.forEach(ensureStandardServiceTabs);
        setState(res);
      } else {
        setState(defaultServicesState);
      }
    });
  };

  useEffect(() => {
    fetchServicesData();

    const handleSync = () => {
      fetchServicesData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  const saveState = (newState) => {
    setState(newState);
    saveServicesState(newState).then(() => {
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
    });
  };

  const openDeleteModal = (srv) => {
    setDeleteModal({
      isOpen: true,
      targetId: srv.id,
      title: 'Delete Healthcare Service?',
      itemName: srv.name,
      message: 'Are you sure you want to remove this service? It will be permanently deleted from patient navigation, mega menu, and department directories.'
    });
  };

  const confirmDelete = () => {
    if (!deleteModal.targetId) return;
    const updatedServices = state.services.filter(s => s.id !== deleteModal.targetId);
    const newState = { ...state, services: updatedServices };
    saveState(newState);
    setDeleteModal({ isOpen: false, targetId: null, title: '', itemName: '', message: '' });
  };

  const handleToggleStatus = (id) => {
    const updatedServices = state.services.map(srv => {
      if (srv.id === id) {
        const nextStatus = srv.status === 'Active' || srv.status === true ? false : true;
        return { ...srv, status: nextStatus };
      }
      return srv;
    });
    const newState = { ...state, services: updatedServices };
    saveState(newState);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
    setCurrentPage(1);
  };

  const categories = state.categories || [];
  const categoriesMap = {};
  categories.forEach(c => { categoriesMap[c.id] = c.name; });

  const filtered = (state.services || []).filter(srv => {
    const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (srv.description || srv.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const isAct = srv.status === 'Active' || srv.status === true;
    let matchesStatus = true;
    if (selectedStatus === 'Active') matchesStatus = isAct;
    if (selectedStatus === 'Draft') matchesStatus = !isAct;

    const matchesCat = selectedCategory === 'All Categories' || srv.categoryId === selectedCategory;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filtered.length, totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Services</span>
          </nav>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Healthcare Services</h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
              {filtered.length} {filtered.length === 1 ? 'Service' : 'Services'}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage live clinical offerings and support services shown to patients.</p>
        </div>
        <Link 
          to="/admin/add-service" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add New Service</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px] space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase px-1">Quick Search</label>
          <input 
            type="text"
            className="w-full bg-white border border-slate-200 focus:border-slate-300 px-3 py-1.5 text-xs rounded-lg outline-none"
            placeholder="Search service name or keyword..."
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
            <option value="All Categories">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
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
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        <button 
          onClick={handleResetFilters}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      {/* Services Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-slate-500 font-bold uppercase">
              <th className="px-4 py-3 w-16">Icon</th>
              <th className="px-4 py-3">Service Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-center">Total Tabs</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedServices.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-medium">No matching services found.</td>
              </tr>
            ) : (
              paginatedServices.map((srv) => {
                const isActive = srv.status === 'Active' || srv.status === true;
                const tabCount = Array.isArray(srv.tabs) ? srv.tabs.length : 5;
                const catName = categoriesMap[srv.categoryId] || 'Healthcare Services';

                return (
                  <tr key={srv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-10 h-8 rounded bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">{srv.icon || 'medical_services'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm leading-snug">{srv.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold line-clamp-1 max-w-sm mt-0.5">
                          {srv.description || srv.shortDescription || 'No description provided.'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2.5 py-1 bg-slate-100 border border-slate-200/80 rounded-md text-[11px] font-semibold text-slate-700">
                        {catName}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-500">{srv.slug || `/${srv.id}`}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">{tabCount}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-green-50 text-green-600 border border-green-100'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}>
                        {isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => handleToggleStatus(srv.id)}
                          className={`w-7 h-7 rounded flex items-center justify-center border transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-600 border-amber-200'
                              : 'bg-green-50 hover:bg-green-100 text-green-600 border-green-200'
                          }`}
                          title={isActive ? 'Set as Draft' : 'Publish'}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isActive ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/edit-service/${srv.id}`)}
                          className="w-7 h-7 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
                          title="Edit Details"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button 
                          onClick={() => openDeleteModal(srv)}
                          className="w-7 h-7 rounded bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 flex items-center justify-center transition-all cursor-pointer"
                          title="Delete"
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

        {/* Pagination Footer */}
        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} services
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Previous
              </button>
              <span className="px-3 py-1 font-bold text-slate-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDelete}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        message={deleteModal.message}
        confirmText="Delete Service"
        isDestructive={true}
      />
    </div>
  );
};

export default Services;

