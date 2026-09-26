import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, Plus, Search, Edit3, Trash2, Eye, EyeOff, 
  CheckCircle2, AlertCircle, RefreshCw, X, ArrowUpDown,
  Filter, Layers, Calendar, Building, ShieldCheck, Stethoscope, Heart
} from 'lucide-react';
import { getFaqs, createFaq, updateFaq, deleteFaq } from '../../../utils/api';
import Swal, { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../utils/swal';

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: HelpCircle },
  { id: 'appointment', label: 'Appointments & OPD', icon: Calendar },
  { id: 'admission', label: 'Admission & Inpatient', icon: Building },
  { id: 'insurance', label: 'Insurance & TPA', icon: ShieldCheck },
  { id: 'emergency', label: 'Emergency & Diagnostics', icon: Stethoscope },
  { id: 'spiritual', label: 'Spiritual Care & Visitors', icon: Heart }
];

const CATEGORY_MAP = {
  appointment: 'Appointments & OPD',
  admission: 'Admission & Inpatient',
  insurance: 'Insurance & TPA',
  emergency: 'Emergency & Diagnostics',
  spiritual: 'Spiritual Care & Visitors'
};

const CATEGORY_COLORS = {
  appointment: { bg: 'bg-blue-50 text-blue-700 border-blue-200' },
  admission: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  insurance: { bg: 'bg-purple-50 text-purple-700 border-purple-200' },
  emergency: { bg: 'bg-rose-50 text-rose-700 border-rose-200' },
  spiritual: { bg: 'bg-amber-50 text-amber-700 border-amber-200' }
};

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Form State
  const initialForm = {
    question: '',
    answer: '',
    category: 'appointment',
    order: 1,
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const loadFaqs = async () => {
    setLoading(true);
    try {
      const data = await getFaqs();
      if (Array.isArray(data)) {
        setFaqs(data);
      }
    } catch (err) {
      console.warn('Failed to load FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();

    const handleUpdate = () => loadFaqs();
    window.addEventListener('faqs_updated', handleUpdate);
    window.addEventListener('admin_data_updated', handleUpdate);

    return () => {
      window.removeEventListener('faqs_updated', handleUpdate);
      window.removeEventListener('admin_data_updated', handleUpdate);
    };
  }, []);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesStatus = statusFilter === 'all' || faq.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        faq.question?.toLowerCase().includes(q) ||
        faq.answer?.toLowerCase().includes(q) ||
        faq.categoryLabel?.toLowerCase().includes(q);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [faqs, selectedCategory, statusFilter, searchQuery]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: selectedCategory !== 'all' ? selectedCategory : 'appointment',
      order: faqs.length + 1,
      status: 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'appointment',
      order: faq.order || 1,
      status: faq.status || 'Active'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Quick Toggle Status
  const handleToggleStatus = async (faq) => {
    const newStatus = faq.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateFaq(faq.id, { ...faq, status: newStatus });
      setFaqs(prev => prev.map(f => f.id === faq.id ? { ...f, status: newStatus } : f));
      showToast(`FAQ marked as ${newStatus}`);
    } catch (err) {
      showErrorAlert('Error', 'Failed to update FAQ status');
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faq) => {
    const confirm = await showConfirmDialog(
      'Delete FAQ?',
      `Are you sure you want to permanently delete: "${faq.question.slice(0, 60)}..."?`
    );

    if (confirm.isConfirmed) {
      try {
        await deleteFaq(faq.id);
        setFaqs(prev => prev.filter(f => f.id !== faq.id));
        showSuccessAlert('Deleted!', 'The FAQ has been removed successfully.');
      } catch (err) {
        showErrorAlert('Error', 'Failed to delete FAQ. Please try again.');
      }
    }
  };

  // Save (Create or Update)
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.question.trim()) {
      errors.question = 'Question text is required.';
    }
    if (!formData.answer.trim()) {
      errors.answer = 'Answer text is required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaveLoading(true);
    try {
      const payload = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category,
        categoryLabel: CATEGORY_MAP[formData.category] || 'General',
        order: Number(formData.order) || 1,
        status: formData.status
      };

      if (editingFaq) {
        const updated = await updateFaq(editingFaq.id, payload);
        setFaqs(prev => prev.map(f => f.id === editingFaq.id ? { ...f, ...payload } : f));
        showSuccessAlert('Updated!', 'FAQ updated successfully.');
      } else {
        const created = await createFaq(payload);
        if (created) {
          setFaqs(prev => [...prev, created]);
        } else {
          loadFaqs();
        }
        showSuccessAlert('Created!', 'New FAQ added successfully.');
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Save FAQ failed:', err);
      showErrorAlert('Save Failed', err.message || 'Could not save FAQ changes');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border border-emerald-200 bg-white max-w-md animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-xs font-semibold text-slate-800">{toastMsg}</p>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <HelpCircle className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold text-amber-600 tracking-wider uppercase bg-amber-50/80 px-2.5 py-1 rounded-md">
              Hospital Help Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            FAQs Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Manage frequently asked questions, answers, and categories displayed on the public hospital website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={loadFaqs}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            title="Refresh FAQs"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#0e3b64] hover:bg-[#082642] rounded-xl shadow-sm transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New FAQ
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-medium">Total Questions</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{faqs.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all categories</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-medium">Active Public</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {faqs.filter(f => f.status === 'Active').length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Visible to patients</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-medium">Categories</div>
          <div className="text-2xl font-bold text-indigo-600 mt-1">5</div>
          <div className="text-[11px] text-indigo-500 mt-0.5">Core patient domains</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
          <div className="text-slate-400 text-xs font-medium">Draft / Inactive</div>
          <div className="text-2xl font-bold text-slate-400 mt-1">
            {faqs.filter(f => f.status !== 'Active').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Hidden from public</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by question, keyword, or answer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fea619]/40 focus:border-[#fea619] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#fea619]/40"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? faqs.length 
              : faqs.filter(f => f.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0e3b64] text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#fea619]' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQs List Section */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-[#fea619] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-500">Loading hospital FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No FAQs Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery 
                ? `No questions matched your search "${searchQuery}". Try a different keyword.`
                : 'No FAQs have been added to this category yet.'}
            </p>
            <div className="mt-4 flex justify-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Clear Search
                </button>
              )}
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0e3b64] hover:bg-[#082642] rounded-lg shadow-sm"
              >
                + Add FAQ
              </button>
            </div>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isExpanded = expandedFaqId === faq.id;
            const catColors = CATEGORY_COLORS[faq.category] || { bg: 'bg-slate-100 text-slate-700 border-slate-200' };

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-xl border transition-all ${
                  isExpanded ? 'border-amber-300 ring-2 ring-amber-100 shadow-md' : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Header row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div 
                    className="flex-1 cursor-pointer select-none"
                    onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {/* Order Badge */}
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{faq.order || index + 1}
                      </span>

                      {/* Category Badge */}
                      <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${catColors.bg}`}>
                        {faq.categoryLabel || CATEGORY_MAP[faq.category] || 'General'}
                      </span>

                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        faq.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${faq.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {faq.status || 'Active'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(faq)}
                      className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
                        faq.status === 'Active'
                          ? 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={faq.status === 'Active' ? 'Hide from public' : 'Show on public'}
                    >
                      {faq.status === 'Active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(faq)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                      title="Edit Question & Answer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFaq(faq)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title={isExpanded ? 'Collapse Answer' : 'Expand Answer'}
                    >
                      <span className="text-xs font-bold">{isExpanded ? '▲' : '▼'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/60 rounded-b-xl animate-in fade-in duration-150">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Answer
                    </div>
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                    {faq.updatedAt && (
                      <div className="text-[10px] text-slate-400 mt-2 text-right">
                        Last modified: {new Date(faq.updatedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveFaq} className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Category & Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#fea619]/40"
                  >
                    <option value="appointment">Appointments & OPD</option>
                    <option value="admission">Admission & Inpatient</option>
                    <option value="insurance">Insurance & TPA</option>
                    <option value="emergency">Emergency & Diagnostics</option>
                    <option value="spiritual">Spiritual Care & Visitors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#fea619]/40"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Display Order Position
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="e.g. 1, 2, 3"
                  className="w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#fea619]/40"
                />
                <span className="text-[11px] text-slate-400 ml-2">Lower numbers appear first.</span>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. What are the hospital visiting hours?"
                  value={formData.question}
                  onChange={(e) => {
                    setFormData({ ...formData, question: e.target.value });
                    if (formErrors.question) setFormErrors({ ...formErrors, question: null });
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                    formErrors.question
                      ? 'border-rose-400 ring-rose-200'
                      : 'border-slate-200 focus:ring-[#fea619]/40 focus:border-[#fea619]'
                  }`}
                />
                {formErrors.question && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.question}</p>
                )}
              </div>

              {/* Answer Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="6"
                  placeholder="Write clear, comprehensive instructions or answers for patients..."
                  value={formData.answer}
                  onChange={(e) => {
                    setFormData({ ...formData, answer: e.target.value });
                    if (formErrors.answer) setFormErrors({ ...formErrors, answer: null });
                  }}
                  className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 leading-relaxed transition-all ${
                    formErrors.answer
                      ? 'border-rose-400 ring-rose-200'
                      : 'border-slate-200 focus:ring-[#fea619]/40 focus:border-[#fea619]'
                  }`}
                ></textarea>
                {formErrors.answer && (
                  <p className="text-[11px] text-rose-500 mt-1">{formErrors.answer}</p>
                )}
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saveLoading}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0e3b64] hover:bg-[#082642] shadow-sm transition-all disabled:opacity-50"
                >
                  {saveLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  {saveLoading ? 'Saving...' : editingFaq ? 'Update FAQ' : 'Save FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
