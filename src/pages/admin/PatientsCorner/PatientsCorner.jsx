import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { defaultPatientCornerState } from '../../../data/defaultPatientCorner';
import { getPatientCornerState, deletePatientCornerGuide, updatePatientCornerGuide } from '../../../utils/api';
import ConfirmModal from '../../../components/admin/ConfirmModal/ConfirmModal';

const PatientsCorner = () => {
  const [state, setState] = useState(defaultPatientCornerState);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Custom Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    targetId: null,
    title: '',
    itemName: '',
    message: ''
  });

  const navigate = useNavigate();

  const fetchGuidesData = () => {
    getPatientCornerState(defaultPatientCornerState).then(res => {
      if (res && res.guides) {
        setState(res);
      } else {
        setState(defaultPatientCornerState);
      }
    });
  };

  useEffect(() => {
    fetchGuidesData();

    const handleSync = () => {
      fetchGuidesData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  const openDeleteModal = (guide) => {
    setDeleteModal({
      isOpen: true,
      targetId: guide.id,
      title: 'Delete Patient Guide?',
      itemName: guide.title,
      message: 'Are you sure you want to remove this patient guide? It will be permanently deleted along with all its tabs and sections.'
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.targetId) return;
    try {
      await deletePatientCornerGuide(deleteModal.targetId);
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
      fetchGuidesData();
    } catch (err) {
      console.error('Error deleting guide:', err);
    } finally {
      setDeleteModal({ isOpen: false, targetId: null, title: '', itemName: '', message: '' });
    }
  };

  const handleToggleStatus = async (guide) => {
    const nextStatus = guide.status === 'Published' ? 'Draft' : 'Published';
    try {
      await updatePatientCornerGuide(guide.id, { ...guide, status: nextStatus });
      window.dispatchEvent(new Event('admin_data_updated'));
      window.dispatchEvent(new Event('storage'));
      fetchGuidesData();
    } catch (err) {
      console.error('Error toggling guide status:', err);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
    setCurrentPage(1);
  };

  const categories = state.categories || [];
  const guides = state.guides || [];

  const filtered = guides.filter(g => {
    const matchesSearch = (g.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (g.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (g.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const isPublished = g.status === 'Published';
    let matchesStatus = true;
    if (selectedStatus === 'Published') matchesStatus = isPublished;
    if (selectedStatus === 'Draft') matchesStatus = !isPublished;

    const matchesCat = selectedCategory === 'All Categories' || g.categoryId === selectedCategory || g.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCat;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedGuides = filtered.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filtered.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
            <span>Dashboard</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-600 font-bold">Patients Corner</span>
          </nav>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-800">Patients Corner Management</h2>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-100">
              {filtered.length} {filtered.length === 1 ? 'Guide' : 'Guides'}
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            Manage patient guidelines, admission rules, and dynamic section content shown to patients.
          </p>
        </div>
        <Link 
          to="/admin/add-patient-guide" 
          className="flex items-center gap-2 bg-[#fea619] hover:bg-amber-500 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          <span>Add Patient Guide</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
              search
            </span>
            <input 
              type="text" 
              placeholder="Search guides by title, category, keywords..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Filter */}
          <select 
            value={selectedCategory} 
            onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All Categories">All Categories ({guides.length})</option>
            {categories.map(c => {
              const count = guides.filter(g => g.categoryId === c.id || g.category_id === c.id).length;
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({count})
                </option>
              );
            })}
          </select>

          {/* Status Filter */}
          <select 
            value={selectedStatus} 
            onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="All Status">All Status</option>
            <option value="Published">Published ({guides.filter(g => g.status === 'Published').length})</option>
            <option value="Draft">Draft ({guides.filter(g => g.status !== 'Published').length})</option>
          </select>
        </div>

        {(searchTerm || selectedCategory !== 'All Categories' || selectedStatus !== 'All Status') && (
          <button 
            onClick={handleResetFilters}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 self-end md:self-center"
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Guides Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-5 py-3.5">Guide Title</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5 text-center">Structure</th>
                <th className="px-4 py-3.5 text-center">Order</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {paginatedGuides.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-5 py-12 text-center text-slate-400">
                    <span className="material-symbols-outlined text-4xl mb-2 text-slate-300">search_off</span>
                    <p className="font-bold text-slate-600 text-sm">No Patient Guides found</p>
                    <p className="text-xs text-slate-400 mt-1">Try changing your search term or filter parameters.</p>
                  </td>
                </tr>
              ) : (
                paginatedGuides.map((g) => {
                  const isPublished = g.status === 'Published';
                  const tabCount = Array.isArray(g.tabs) ? g.tabs.length : 0;
                  const totalSections = (g.tabs || []).reduce((acc, t) => acc + (Array.isArray(t.sections) ? t.sections.length : 0), 0);

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Title & Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200/50">
                            <span className="material-symbols-outlined text-base">article</span>
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs leading-snug">{g.title || 'Untitled Guide'}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">/{g.slug || g.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          {g.category || 'Inpatient Guide'}
                        </span>
                      </td>

                      {/* Tabs & Sections Count */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-bold text-[11px]">
                          <span className="material-symbols-outlined text-xs text-amber-500">tab</span>
                          <span>{tabCount} Tabs</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-slate-500 font-normal">{totalSections} Secs</span>
                        </div>
                      </td>

                      {/* Display Order */}
                      <td className="px-4 py-3.5 text-center font-bold text-slate-700">
                        #{g.displayOrder || 1}
                      </td>

                      {/* Status Toggle */}
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(g)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer border ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/edit-patient-guide/${g.id}`}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit Guide & Tabs"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => openDeleteModal(g)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Guide"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
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
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Showing <span className="font-bold text-slate-700">{filtered.length === 0 ? 0 : startIndex + 1}</span> to{' '}
            <span className="font-bold text-slate-700">{Math.min(endIndex, filtered.length)}</span> of{' '}
            <span className="font-bold text-slate-700">{filtered.length}</span> guides
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                      currentPage === pageNum
                        ? 'bg-[#fea619] text-slate-900 shadow-sm font-extrabold'
                        : 'border border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        itemName={deleteModal.itemName}
        message={deleteModal.message}
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ isOpen: false, targetId: null, title: '', itemName: '', message: '' })}
      />
    </div>
  );
};

export default PatientsCorner;
