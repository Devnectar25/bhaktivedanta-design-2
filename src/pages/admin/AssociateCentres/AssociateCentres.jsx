import React, { useState, useEffect } from 'react';
import { 
  Building2, Plus, Search, Edit2, Trash2, ExternalLink, MapPin, 
  Phone, CheckCircle2, XCircle, AlertCircle, RefreshCw, X, Layers, Activity,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  getAssociateCentres, 
  createAssociateCentre, 
  updateAssociateCentre, 
  deleteAssociateCentre 
} from '../../../utils/api';
import associateCentresData from '../../../data/associateCentresData';

// Fallback seed array from associateCentresData
const defaultFallbackCentres = Object.values(associateCentresData).map((c) => ({
  id: `ac-${c.slug}`,
  slug: c.slug,
  title: c.title,
  centreType: c.slug.includes('polyclinic') ? 'Multi-Speciality Polyclinic'
    : c.slug.includes('eye') ? 'Specialized Ophthalmology Hospital'
    : c.slug.includes('hospital') ? 'Charitable Multi-Disciplinary Hospital'
    : 'Primary Health Care Centre',
  bannerImg: c.bannerImg || '',
  address: c.address || '',
  phone: c.phone || '',
  highlights: c.highlights || [],
  overview: c.overview || [],
  services: c.services || [],
  communityServices: c.communityServices || [],
  mapSrc: c.mapSrc || '',
  status: 'Active'
}));

function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export default function AssociateCentres() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [centreToDelete, setCentreToDelete] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [formTab, setFormTab] = useState('basic');
  const [errors, setErrors] = useState({});

  // Form State (Starts completely empty)
  const initialForm = {
    title: '',
    slug: '',
    centreType: '',
    bannerImg: '',
    address: '',
    phone: '',
    mapSrc: '',
    status: 'Active',
    highlightsText: '',
    overviewText: '',
    servicesText: '',
    communityServicesText: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Load centres (Newest first)
  const loadCentres = async () => {
    setLoading(true);
    try {
      const data = await getAssociateCentres(defaultFallbackCentres);
      const list = Array.isArray(data) && data.length > 0 ? data : defaultFallbackCentres;
      // Ensure newest added centres appear first
      const sorted = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setCentres(sorted);
    } catch (err) {
      console.warn('Error loading associate centres:', err);
      setCentres(defaultFallbackCentres);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCentres();

    const handleUpdate = () => loadCentres();
    window.addEventListener('associate_centres_updated', handleUpdate);
    return () => window.removeEventListener('associate_centres_updated', handleUpdate);
  }, []);

  // Filter centres
  const filteredCentres = centres.filter(c => {
    const matchesSearch = 
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.centreType || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'ALL' || c.centreType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCentres.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCentres = filteredCentres.slice(startIndex, endIndex);

  // Keep currentPage within bounds when items change
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filteredCentres.length, totalPages, currentPage]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCentre(null);
    setFormData(initialForm);
    setErrors({});
    setFormTab('basic');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (c) => {
    setEditingCentre(c);
    setErrors({});
    
    // Parse highlights
    const highlightsText = Array.isArray(c.highlights)
      ? c.highlights.map(h => typeof h === 'string' ? h : h.text || '').join('\n')
      : '';

    // Parse overview
    const overviewText = Array.isArray(c.overview)
      ? c.overview.join('\n\n')
      : (c.overview || '');

    // Parse services
    const servicesText = Array.isArray(c.services)
      ? c.services.join('\n')
      : (c.services || '');

    // Parse community services
    const communityServicesText = Array.isArray(c.communityServices)
      ? c.communityServices.map(cs => typeof cs === 'string' ? cs : cs.name || '').join('\n')
      : '';

    setFormData({
      title: c.title || '',
      slug: c.slug || '',
      centreType: c.centreType || 'Charitable Multi-Disciplinary Hospital',
      bannerImg: c.bannerImg || '',
      address: c.address || '',
      phone: c.phone || '',
      mapSrc: c.mapSrc || '',
      status: c.status || 'Active',
      highlightsText,
      overviewText,
      servicesText,
      communityServicesText
    });

    setFormTab('basic');
    setIsModalOpen(true);
  };

  // Field change with auto-clearing validation error
  const handleFieldChange = (field, val) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Auto-fill slug from title & clear errors
  const handleTitleChange = (val) => {
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingCentre ? prev.slug : slugify(val)
    }));
    if (errors.title || errors.slug) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy.title;
        delete copy.slug;
        return copy;
      });
    }
  };

  // Step-by-step and full-form validation
  const validateStep = (step) => {
    const errs = {};

    if (step === 'basic' || step === 'all') {
      if (!formData.title?.trim()) {
        errs.title = 'Centre Title is required';
      } else if (formData.title.trim().length < 3) {
        errs.title = 'Title must be at least 3 characters';
      }

      if (!formData.slug?.trim()) {
        errs.slug = 'URL Slug is required';
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug.trim())) {
        errs.slug = 'Slug must only contain lowercase letters, numbers, and hyphens (e.g. swami-hospital)';
      }

      if (!formData.centreType?.trim()) {
        errs.centreType = 'Centre Type is required (e.g. Charitable Multi-Disciplinary Hospital)';
      }

      if (!formData.address?.trim()) {
        errs.address = 'Physical Address is required';
      } else if (formData.address.trim().length < 8) {
        errs.address = 'Address must be at least 8 characters';
      }

      if (!formData.phone?.trim()) {
        errs.phone = 'Contact Phone number is required';
      }

      if (formData.bannerImg?.trim() && !/^https?:\/\//i.test(formData.bannerImg.trim())) {
        errs.bannerImg = 'Banner Image must be a valid URL starting with http:// or https://';
      }

      if (formData.mapSrc?.trim() && !/^https?:\/\//i.test(formData.mapSrc.trim())) {
        errs.mapSrc = 'Google Maps URL must be a valid URL starting with http:// or https://';
      }
    }

    if (step === 'overview' || step === 'all') {
      const highlights = (formData.highlightsText || '')
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean);
      if (highlights.length === 0) {
        errs.highlightsText = 'Please provide at least 1 overview highlight bullet point';
      }

      if (!formData.overviewText?.trim()) {
        errs.overviewText = 'Detailed Overview description is required';
      } else if (formData.overviewText.trim().length < 15) {
        errs.overviewText = 'Overview text must be at least 15 characters';
      }
    }

    if (step === 'services' || step === 'all') {
      const services = (formData.servicesText || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      if (services.length === 0) {
        errs.servicesText = 'Please provide at least 1 clinical / hospital service';
      }
    }

    return errs;
  };

  // Next Step button handler with validation
  const handleNextStep = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const stepErrs = validateStep(formTab);
    if (Object.keys(stepErrs).length > 0) {
      setErrors(stepErrs);
      return;
    }
    setErrors({});
    setFormTab(prev => (prev === 'basic' ? 'overview' : 'services'));
  };

  // Tab click handler with validation
  const handleTabClick = (targetTab) => {
    const isForward = 
      (formTab === 'basic' && (targetTab === 'overview' || targetTab === 'services')) ||
      (formTab === 'overview' && targetTab === 'services');

    if (isForward) {
      const stepErrs = validateStep(formTab);
      if (Object.keys(stepErrs).length > 0) {
        setErrors(stepErrs);
        return;
      }
    }
    setErrors({});
    setFormTab(targetTab);
  };

  // Save handler (Create or Update)
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Validate entire form across all 3 steps
    const allErrors = validateStep('all');
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      // Auto-switch to the earliest tab containing an error so user sees it immediately
      if (allErrors.title || allErrors.slug || allErrors.centreType || allErrors.address || allErrors.phone || allErrors.bannerImg || allErrors.mapSrc) {
        setFormTab('basic');
      } else if (allErrors.highlightsText || allErrors.overviewText) {
        setFormTab('overview');
      } else if (allErrors.servicesText) {
        setFormTab('services');
      }
      return;
    }

    setSaveLoading(true);

    try {
      // Format highlights
      const highlights = formData.highlightsText
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean)
        .map((text, idx) => ({
          text,
          icon: `/images/oac-${(idx % 3) + 1}.png`
        }));

      // Format overview paragraphs
      const overview = formData.overviewText
        .split('\n\n')
        .map(p => p.trim())
        .filter(Boolean);

      // Format services
      const services = formData.servicesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      // Format community services
      const communityServices = formData.communityServicesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean)
        .map((name, idx) => ({
          name,
          icon: `/images/oacs-${(idx % 3) + 1}.png`
        }));

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        centreType: formData.centreType,
        bannerImg: formData.bannerImg.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        mapSrc: formData.mapSrc.trim(),
        status: formData.status,
        highlights,
        overview,
        services,
        communityServices
      };

      if (editingCentre) {
        await updateAssociateCentre(editingCentre.id, payload);
      } else {
        await createAssociateCentre(payload);
      }

      setIsModalOpen(false);
      await loadCentres();
    } catch (err) {
      console.error('Error saving associate centre:', err);
      alert('Failed to save associate centre. Please check backend connection.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Quick Status Toggle
  const handleToggleStatus = async (centre) => {
    const newStatus = centre.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateAssociateCentre(centre.id, { status: newStatus });
      await loadCentres();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!centreToDelete) return;
    setIsDeleting(true);
    try {
      await deleteAssociateCentre(centreToDelete.id);
      setCentreToDelete(null);
      await loadCentres();
    } catch (err) {
      console.error('Error deleting centre:', err);
      alert('Failed to delete centre.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Distinct types for filter
  const distinctTypes = Array.from(new Set(centres.map(c => c.centreType).filter(Boolean)));

  return (
    <div className="space-y-4 font-sans pb-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Building2 className="text-orange-500" size={26} />
            Our Associate Centres
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage associate hospitals, clinics, and outreach healthcare units with live database sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCentres}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-sm text-sm transition"
          >
            <Plus size={18} />
            Add New Centre
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Centres</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">{centres.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-green-500">Active Centres</span>
          <div className="text-2xl font-bold text-green-600 mt-1">
            {centres.filter(c => c.status === 'Active').length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-500">Hospitals</span>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {centres.filter(c => (c.centreType || '').toLowerCase().includes('hospital')).length}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">Outreach / Clinics</span>
          <div className="text-2xl font-bold text-orange-600 mt-1">
            {centres.filter(c => !(c.centreType || '').toLowerCase().includes('hospital')).length}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search centres, address, type..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Centre Types</option>
            {distinctTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Centres Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="animate-spin text-orange-500" size={24} />
            <span>Loading associate centres from database...</span>
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Building2 className="mx-auto text-slate-300 mb-2" size={36} />
            <p className="font-medium text-slate-600">No associate centres found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search criteria or add a new centre</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-3">Centre Name & Slug</th>
                    <th className="px-3 py-3">Type</th>
                    <th className="px-3 py-3">Location / Address</th>
                    <th className="px-3 py-3">Contact</th>
                    <th className="px-2 py-3 text-center">Services</th>
                    <th className="px-2 py-3 text-center">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCentres.map((c) => (
                    <tr key={c.id || c.slug} className="hover:bg-slate-50/70 transition">
                      <td className="px-3 py-2.5 max-w-[220px]">
                        <div className="font-bold text-slate-800 text-sm truncate" title={c.title}>{c.title}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono truncate">
                          /our-associate-centre/{c.slug}
                        </div>
                      </td>

                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span className="inline-block bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">
                          {c.centreType || 'Associate Centre'}
                        </span>
                      </td>

                      <td className="px-3 py-2.5 text-slate-600 max-w-[200px] truncate" title={c.address}>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                          <span className="truncate">{c.address || '—'}</span>
                        </div>
                      </td>

                      <td className="px-3 py-2.5 text-slate-600 font-mono text-xs whitespace-nowrap">
                        {c.phone ? (
                          <div className="flex items-center gap-1">
                            <Phone size={12} className="text-slate-400 flex-shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        ) : '—'}
                      </td>

                      <td className="px-2 py-2.5 text-center whitespace-nowrap">
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {(c.services || []).length} services
                        </span>
                      </td>

                      <td className="px-2 py-2.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border transition ${
                            c.status === 'Active'
                              ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {c.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {c.status || 'Active'}
                        </button>
                      </td>

                      <td className="px-3 py-2.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <a
                            href={`/our-associate-centre/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="View on Live Website"
                          >
                            <ExternalLink size={15} />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded transition"
                            title="Edit Centre"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setCentreToDelete(c)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Centre"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Footer */}
            {totalPages > 1 && (
              <div className="p-3.5 border-t border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <p className="text-slate-500 font-medium">
                  Showing <span className="font-bold text-slate-700">{filteredCentres.length > 0 ? startIndex + 1 : 0}</span> to{' '}
                  <span className="font-bold text-slate-700">{Math.min(endIndex, filteredCentres.length)}</span> of{' '}
                  <span className="font-bold text-slate-700">{filteredCentres.length}</span> associate centres
                </p>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold flex items-center justify-center transition shadow-sm active:scale-95"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition shadow-sm active:scale-95 ${
                        currentPage === pageNum
                          ? 'bg-orange-600 text-white border border-orange-600'
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
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-600 font-bold flex items-center justify-center transition shadow-sm active:scale-95"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add / Edit Centre Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {editingCentre ? `Edit Centre: ${editingCentre.title}` : 'Add New Associate Centre'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Changes will sync directly to the database and update on the live website
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Tabs */}
            <div className="flex border-b border-slate-200 px-6 gap-4 text-xs font-bold uppercase tracking-wider bg-white">
              <button
                type="button"
                onClick={() => handleTabClick('basic')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                  formTab === 'basic' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>1. Basic & Contact</span>
                {(errors.title || errors.slug || errors.centreType || errors.address || errors.phone || errors.bannerImg || errors.mapSrc) && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleTabClick('overview')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                  formTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>2. Highlights & Overview</span>
                {(errors.highlightsText || errors.overviewText) && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleTabClick('services')}
                className={`py-3 border-b-2 flex items-center gap-1.5 transition ${
                  formTab === 'services' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>3. Services & Schemes</span>
                {errors.servicesText && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNextStep(e);
                }
              }}
            >
              <div className="p-6 max-h-[68vh] overflow-y-auto space-y-4">
                {/* TAB 1: BASIC & CONTACT */}
                {formTab === 'basic' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Centre Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Swami Shraddhanand Hospital"
                          className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                            errors.title
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                        />
                        {errors.title && (
                          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="flex-shrink-0" />
                            <span>{errors.title}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          URL Slug <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.slug}
                          onChange={(e) => handleFieldChange('slug', slugify(e.target.value))}
                          placeholder="e.g. swami-shraddhanand-hospital"
                          className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition ${
                            errors.slug
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                        />
                        {errors.slug && (
                          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="flex-shrink-0" />
                            <span>{errors.slug}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Centre Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.centreType}
                          onChange={(e) => handleFieldChange('centreType', e.target.value)}
                          placeholder="e.g. Charitable Multi-Disciplinary Hospital"
                          className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                            errors.centreType
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                        />
                        {errors.centreType && (
                          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="flex-shrink-0" />
                            <span>{errors.centreType}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Banner Image URL</label>
                      <input
                        type="url"
                        value={formData.bannerImg}
                        onChange={(e) => handleFieldChange('bannerImg', e.target.value)}
                        placeholder="https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/..."
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition ${
                          errors.bannerImg
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {errors.bannerImg && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{errors.bannerImg}</span>
                        </p>
                      )}
                      {formData.bannerImg && !errors.bannerImg && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-slate-200 h-28 w-full max-w-sm">
                          <img
                            src={formData.bannerImg}
                            alt="preview"
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Full Physical Address <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={2}
                        value={formData.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        placeholder="e.g. Nirmal Village, Nirmal Road, Vasai (W), Dist. Palghar - 401 304, Maharashtra, India."
                        className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                          errors.address
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {errors.address && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Contact Phone <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          placeholder="e.g. +91 70456 94147 / +91 82918 18030"
                          className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                            errors.phone
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="flex-shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Google Maps Embed URL</label>
                        <input
                          type="text"
                          value={formData.mapSrc}
                          onChange={(e) => handleFieldChange('mapSrc', e.target.value)}
                          placeholder="https://www.google.com/maps/embed?..."
                          className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition ${
                            errors.mapSrc
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                        />
                        {errors.mapSrc && (
                          <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={12} className="flex-shrink-0" />
                            <span>{errors.mapSrc}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: HIGHLIGHTS & OVERVIEW */}
                {formTab === 'overview' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Overview Highlight Bullet Points (1 per line) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-slate-400 mb-2">
                        These appear as the 3 featured highlight boxes at the top of the Overview tab.
                      </p>
                      <textarea
                        rows={3}
                        value={formData.highlightsText}
                        onChange={(e) => handleFieldChange('highlightsText', e.target.value)}
                        placeholder="Enter 1 key highlight per line..."
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition ${
                          errors.highlightsText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {errors.highlightsText && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{errors.highlightsText}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Detailed Overview Paragraphs (Separate paragraphs by an empty blank line) <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={5}
                        value={formData.overviewText}
                        onChange={(e) => handleFieldChange('overviewText', e.target.value)}
                        placeholder="Enter detailed hospital overview paragraphs here..."
                        className={`w-full px-3 py-2 border rounded-lg text-sm transition ${
                          errors.overviewText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {errors.overviewText && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{errors.overviewText}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: SERVICES & COMMUNITY SCHEMES */}
                {formTab === 'services' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Clinical & Hospital Services (1 per line) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-slate-400 mb-2">
                        These appear in the 2-column bulleted list inside the Services tab.
                      </p>
                      <textarea
                        rows={5}
                        value={formData.servicesText}
                        onChange={(e) => handleFieldChange('servicesText', e.target.value)}
                        placeholder="Enter 1 clinical service per line (e.g. ICU, Outpatient, Dialysis)..."
                        className={`w-full px-3 py-2 border rounded-lg text-sm font-mono transition ${
                          errors.servicesText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                        }`}
                      />
                      {errors.servicesText && (
                        <p className="text-xs text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={12} className="flex-shrink-0" />
                          <span>{errors.servicesText}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Community Services & Schemes (1 per line)
                      </label>
                      <p className="text-xs text-slate-400 mb-2">
                        Featured circular cards below the services table (e.g. Cataract Surgeries, Camps, MJPJAY Scheme).
                      </p>
                      <textarea
                        rows={3}
                        value={formData.communityServicesText}
                        onChange={(e) => handleFieldChange('communityServicesText', e.target.value)}
                        placeholder="Enter 1 community scheme per line (e.g. Cataract Surgeries, Camps)..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-sm transition"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  {formTab !== 'basic' && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFormTab(formTab === 'services' ? 'overview' : 'basic');
                      }}
                      className="px-3 py-2 text-slate-600 hover:text-slate-800 text-sm font-medium"
                    >
                      ← Back
                    </button>
                  )}
                  {formTab !== 'services' ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-lg shadow-sm transition disabled:opacity-50 flex items-center gap-2"
                    >
                      {saveLoading && <RefreshCw size={14} className="animate-spin" />}
                      {editingCentre ? 'Save Changes' : 'Create Centre'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {centreToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle size={28} />
              <h3 className="text-lg font-bold text-slate-800">Delete Associate Centre?</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <strong className="text-slate-800">"{centreToDelete.title}"</strong>? 
              This will remove it from both the admin database and the public website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCentreToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <RefreshCw size={14} className="animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
