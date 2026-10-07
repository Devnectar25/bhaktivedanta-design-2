import React, { useState, useEffect } from 'react';
import {
  Building2, Plus, Search, Edit2, Trash2, ExternalLink, MapPin,
  Phone, CheckCircle2, XCircle, AlertCircle, RefreshCw, X, Layers, Activity,
  ChevronLeft, ChevronRight, Sparkles, Check, Lock, ShieldAlert
} from 'lucide-react';
import Swal from 'sweetalert2';
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Maximum slots rule: exactly 10 centres allowed
  const MAX_CENTRES = 10;
  const isSlotLimitReached = centres.length >= MAX_CENTRES;

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

  // Load centres (Newest first, guaranteeing Barsana is always fetched and included)
  const loadCentres = async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (forceRefresh) {
        localStorage.removeItem('bhaktivedanta_associate_centres_cache');
      }
      const data = await getAssociateCentres(defaultFallbackCentres);
      let list = Array.isArray(data) && data.length > 0 ? data : defaultFallbackCentres;

      // Always guarantee that all foundational associate centres (including Bhaktivedanta Eye Hospital - Barsana)
      // are present in the list, even if local cache or backend returned a partial list
      defaultFallbackCentres.forEach(fallback => {
        const exists = list.some(
          c => c.slug === fallback.slug ||
            c.id === fallback.id ||
            (c.title || '').toLowerCase().replace(/[-–—\s]/g, '').includes(fallback.title.toLowerCase().replace(/[-–—\s]/g, '')) ||
            (c.slug || '').includes('barsana')
        );
        if (!exists) {
          list = [...list, fallback];
        }
      });

      // Ensure newest added centres appear first
      const sorted = [...list].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setCentres(sorted);
      // Synchronize back to cache so Barsana is permanently preserved in local cache too
      localStorage.setItem('bhaktivedanta_associate_centres_cache', JSON.stringify(sorted));
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

  // Open Create Modal (Blocked if all 10 slots are completed)
  const handleOpenCreate = () => {
    if (isSlotLimitReached) {
      Swal.fire({
        icon: 'warning',
        title: 'All 10 Slots Completed',
        text: 'The Associate Center only allows up to 10 associates. Once all 10 slots are completed, there is no option to add any additional associates. Please delete an existing centre if you need to add a new one.',
        confirmButtonColor: '#ea580c'
      });
      return;
    }
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

    // Extract clean 10-digit mobile number if available
    const rawDigits = (c.phone || '').replace(/\D/g, '');
    const cleanPhone = rawDigits.length >= 10 ? rawDigits.slice(-10) : rawDigits;

    setFormData({
      title: c.title || '',
      slug: c.slug || '',
      centreType: c.centreType || 'Charitable Multi-Disciplinary Hospital',
      bannerImg: c.bannerImg || '',
      address: c.address || '',
      phone: cleanPhone,
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

  // Comprehensive Step-by-Step and Full-Form Validation
  const validateStep = (step) => {
    const errs = {};

    if (step === 'basic' || step === 'all') {
      const cleanTitle = (formData.title || '').trim();
      if (!cleanTitle) {
        errs.title = 'Centre Title is required';
      } else if (cleanTitle.length < 3) {
        errs.title = 'Title must be at least 3 characters';
      } else if (cleanTitle.length > 100) {
        errs.title = 'Title cannot exceed 100 characters';
      }

      const cleanSlug = (formData.slug || '').trim();
      if (!cleanSlug) {
        errs.slug = 'URL Slug is required';
      } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) {
        errs.slug = 'Slug must only contain lowercase letters, numbers, and hyphens (e.g. swami-hospital)';
      } else if (cleanSlug.length < 3) {
        errs.slug = 'Slug must be at least 3 characters';
      } else if (cleanSlug.length > 80) {
        errs.slug = 'Slug cannot exceed 80 characters';
      }

      const cleanType = (formData.centreType || '').trim();
      if (!cleanType) {
        errs.centreType = 'Centre Type is required (e.g. Charitable Multi-Disciplinary Hospital)';
      } else if (cleanType.length < 3) {
        errs.centreType = 'Centre Type must be at least 3 characters';
      }

      const cleanAddress = (formData.address || '').trim();
      if (!cleanAddress) {
        errs.address = 'Physical Address is required';
      } else if (cleanAddress.length < 8) {
        errs.address = 'Physical address must be at least 8 characters';
      } else if (cleanAddress.length > 300) {
        errs.address = 'Address cannot exceed 300 characters';
      }

      // STRICT MOBILE NUMBER VALIDATION: Exactly 10 numeric digits, starting with 6, 7, 8, 9
      const cleanPhone = (formData.phone || '').replace(/\D/g, '');
      if (!cleanPhone) {
        errs.phone = '10-digit mobile number is required';
      } else if (cleanPhone.length !== 10) {
        errs.phone = `Mobile number must be exactly 10 digits (currently ${cleanPhone.length} digits)`;
      } else if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        errs.phone = 'Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9';
      }

      if (formData.bannerImg?.trim()) {
        const bImg = formData.bannerImg.trim();
        if (!/^https?:\/\//i.test(bImg) && !bImg.startsWith('/')) {
          errs.bannerImg = 'Banner Image must be a valid URL starting with http://, https://, or a local path /';
        }
      }

      if (formData.mapSrc?.trim()) {
        const mMap = formData.mapSrc.trim();
        if (!/^https?:\/\//i.test(mMap)) {
          errs.mapSrc = 'Google Maps URL must be a valid URL starting with http:// or https://';
        }
      }
    }

    if (step === 'overview' || step === 'all') {
      const highlights = (formData.highlightsText || '')
        .split('\n')
        .map(t => t.trim())
        .filter(Boolean);
      if (highlights.length === 0) {
        errs.highlightsText = 'Please provide at least 1 overview highlight bullet point';
      } else {
        const shortHighlight = highlights.find(h => h.length < 5);
        if (shortHighlight) {
          errs.highlightsText = 'Each highlight bullet point must be at least 5 characters long';
        }
      }

      const cleanOverview = (formData.overviewText || '').trim();
      if (!cleanOverview) {
        errs.overviewText = 'Detailed Overview description is required';
      } else if (cleanOverview.length < 20) {
        errs.overviewText = `Overview text must be at least 20 characters (currently ${cleanOverview.length} chars)`;
      }
    }

    if (step === 'services' || step === 'all') {
      const services = (formData.servicesText || '')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      if (services.length === 0) {
        errs.servicesText = 'Please provide at least 1 clinical / hospital service';
      } else {
        const shortService = services.find(s => s.length < 2);
        if (shortService) {
          errs.servicesText = 'Each service must be at least 2 characters';
        }
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

      // Format clean 10-digit phone
      const cleanPhone = (formData.phone || '').replace(/\D/g, '');
      const formattedPhone = cleanPhone.length === 10
        ? `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`
        : formData.phone.trim();

      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        centreType: formData.centreType,
        bannerImg: formData.bannerImg.trim(),
        address: formData.address.trim(),
        phone: formattedPhone,
        mapSrc: formData.mapSrc.trim(),
        status: formData.status,
        highlights,
        overview,
        services,
        communityServices
      };

      if (!editingCentre && isSlotLimitReached) {
        Swal.fire({
          icon: 'warning',
          title: 'Maximum 10 Slots Completed',
          text: 'The Associate Center only allows up to 10 associates. Once all 10 slots are completed, there is no option to add any additional associates.',
          confirmButtonColor: '#ea580c'
        });
        return;
      }

      if (editingCentre) {
        await updateAssociateCentre(editingCentre.id, payload);
        Swal.fire({
          icon: 'success',
          title: 'Associate Centre Updated!',
          text: `"${payload.title}" details have been updated successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        await createAssociateCentre(payload);
        Swal.fire({
          icon: 'success',
          title: 'Associate Centre Created!',
          text: `"${payload.title}" has been added (Slot #${centres.length + 1} of 10). It is now live on the hospital website.`,
          timer: 2200,
          showConfirmButton: false
        });
      }

      setIsModalOpen(false);
      await loadCentres();
    } catch (err) {
      console.error('Error saving associate centre:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save Centre',
        text: err?.response?.data?.error || err.message || 'Please check your connection and try again.'
      });
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
      const title = centreToDelete.title;
      setCentreToDelete(null);
      await loadCentres();
      Swal.fire({
        icon: 'success',
        title: 'Centre Deleted',
        text: `"${title}" has been removed.`,
        timer: 1800,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error deleting centre:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Delete',
        text: err?.message || 'Could not delete the associate centre.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Distinct types for filter
  const distinctTypes = Array.from(new Set(centres.map(c => c.centreType).filter(Boolean)));

  // Aesthetic styling helpers
  const getTypeBadgeStyle = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('ophthalmology') || t.includes('eye')) {
      return 'bg-amber-50 text-amber-800 border-amber-200/80';
    }
    if (t.includes('polyclinic')) {
      return 'bg-sky-50 text-sky-800 border-sky-200/80';
    }
    if (t.includes('hospital')) {
      return 'bg-purple-50 text-purple-800 border-purple-200/80';
    }
    if (t.includes('outreach') || t.includes('tribal')) {
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    }
    return 'bg-blue-50 text-blue-800 border-blue-200/80';
  };

  const getMonogram = (title = '') => {
    const words = title.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return (title.slice(0, 2) || 'BV').toUpperCase();
  };

  const getMonogramGradient = (index) => {
    const gradients = [
      'from-blue-600 to-indigo-600',
      'from-emerald-600 to-teal-600',
      'from-purple-600 to-violet-600',
      'from-orange-500 to-amber-600',
      'from-rose-500 to-pink-600',
      'from-cyan-600 to-blue-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="flex flex-col -mt-3.5 h-[calc(100vh-108px)] max-h-[calc(100vh-108px)] font-sans overflow-hidden">
      {/* Global CSS to completely suppress all scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .no-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}</style>

      {/* Sleek Executive Header & Filter Toolbar */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-xl px-3.5 py-1.5 shadow-[0_2px_10px_-2px_rgba(30,58,138,0.05)] flex flex-wrap items-center justify-between gap-2.5 flex-shrink-0">
        {/* Left: Title & Inline Status Chips */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white flex items-center justify-center shadow-xs">
              <Building2 size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight leading-tight">
                Associate Centres
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">Network Units & Hospitals</span>
            </div>
          </div>

          {/* Slot Capacity Badge */}
          {isSlotLimitReached ? (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300/80 shadow-2xs"
              title="All 10 slots filled. Maximum limit reached."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              All 10 Slots Full (10/10)
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-300/80 shadow-2xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {centres.length}/10 Slots ({MAX_CENTRES - centres.length} available)
            </span>
          )}

          {/* Quick Stats Chips */}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-200/70 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            {centres.filter(c => c.status === 'Active').length} Active
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50/80 border border-purple-200/70 px-2 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            {centres.filter(c => (c.centreType || '').toLowerCase().includes('hospital')).length} Hospitals
          </span>
        </div>

        {/* Right: Search, Filters & Action Button */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {/* Search Box */}
          <div className="relative w-44 sm:w-56 group">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search centres, location..."
              className="w-full pl-8 pr-6 py-0.5 h-8 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-orange-400 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 border border-slate-200 rounded-lg px-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition cursor-pointer max-w-[130px]"
          >
            <option value="ALL">All Centre Types</option>
            {distinctTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-8 border border-slate-200 rounded-lg px-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={() => loadCentres(true)}
            disabled={loading}
            className="h-8 w-8 inline-flex items-center justify-center text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg hover:shadow-2xs transition active:scale-95"
            title="Refresh List (Fetches fresh from database)"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin text-orange-500' : ''} />
          </button>

          {/* Add / Limit Reached Button */}
          {!isSlotLimitReached ? (
            <button
              onClick={handleOpenCreate}
              className="h-8 inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold px-3 rounded-lg text-xs shadow-xs hover:shadow transition active:scale-95 whitespace-nowrap"
            >
              <Plus size={14} />
              <span>Add Centre</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreate}
              className="h-8 inline-flex items-center gap-1.5 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-600 hover:text-amber-800 font-bold px-2.5 rounded-lg text-xs transition cursor-pointer select-none whitespace-nowrap"
              title="All 10 slots completed. Click to see limit details."
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>10/10 Slots Full</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card (Fills remaining height with zero window scroll and zero scrollbars) */}
      <div className="flex-1 min-h-0 bg-white rounded-xl shadow-[0_2px_12px_rgba(15,23,42,0.04)] border border-slate-200/90 flex flex-col mt-2 overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-slate-400">
            <RefreshCw className="animate-spin text-orange-500" size={20} />
            <span className="text-xs">Loading associate centres...</span>
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-slate-400">
            <Building2 className="mx-auto text-slate-300 mb-1" size={28} />
            <p className="font-semibold text-slate-600 text-xs">No associate centres found</p>
            <p className="text-[11px] text-slate-400">Try adjusting your search criteria or add a new centre</p>
          </div>
        ) : (
          <>
            {/* Scroll-free Table Body (No scrollbar) */}
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-xs border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider text-[10.5px]">
                  <tr>
                    <th className="px-3 py-2">Centre Name & Route</th>
                    <th className="px-3 py-2">Category Type</th>
                    <th className="px-3 py-2">Location / Physical Address</th>
                    <th className="px-3 py-2">Contact Phone</th>
                    <th className="px-2 py-2 text-center">Services</th>
                    <th className="px-2 py-2 text-center">Status</th>
                    <th className="px-3 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedCentres.map((c, idx) => (
                    <tr key={c.id || c.slug} className="group hover:bg-blue-50/30 transition-colors">
                      {/* Col 1: Avatar Monogram + Title + Slug */}
                      <td className="px-3 py-1.5 max-w-[230px]">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${getMonogramGradient(idx)} text-white flex items-center justify-center font-bold text-[10.5px] flex-shrink-0 shadow-2xs tracking-tighter`}>
                            {getMonogram(c.title)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-800 text-xs truncate group-hover:text-blue-700 transition-colors" title={c.title}>
                              {c.title}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-0.5">
                              <span className="text-slate-300">/</span>{c.slug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Stylized Category Pill */}
                      <td className="px-3 py-1.5 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10.5px] font-semibold border ${getTypeBadgeStyle(c.centreType)} leading-tight`}>
                          {c.centreType || 'Associate Centre'}
                        </span>
                      </td>

                      {/* Col 3: Location / Address */}
                      <td className="px-3 py-1.5 text-slate-600 max-w-[210px] truncate text-[11px]" title={c.address}>
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin size={12} className="text-slate-400 flex-shrink-0 group-hover:text-orange-500 transition-colors" />
                          <span className="truncate">{c.address || '—'}</span>
                        </div>
                      </td>

                      {/* Col 4: Contact Phone */}
                      <td className="px-3 py-1.5 text-slate-700 font-mono text-[11px] whitespace-nowrap">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-emerald-600 flex-shrink-0" />
                            <span className="font-semibold">{c.phone}</span>
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Col 5: Services */}
                      <td className="px-2 py-1.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200/70 px-2 py-0.5 rounded-full text-[10.5px] font-bold">
                          <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                          {(c.services || []).length} services
                        </span>
                      </td>

                      {/* Col 6: Status Toggle */}
                      <td className="px-2 py-1.5 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(c)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border transition-all active:scale-95 ${c.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 shadow-2xs'
                              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                            }`}
                          title="Click to toggle active status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                          {c.status || 'Active'}
                        </button>
                      </td>

                      {/* Col 7: Actions */}
                      <td className="px-3 py-1.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                          <a
                            href={`/our-associate-centre/${c.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition hover:shadow-2xs active:scale-90"
                            title="View on Live Website"
                          >
                            <ExternalLink size={13} />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(c)}
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 flex items-center justify-center transition hover:shadow-2xs active:scale-90"
                            title="Edit Centre"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setCentreToDelete(c)}
                            className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition hover:shadow-2xs active:scale-90"
                            title="Delete Centre"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Compact Bottom Bar (Capacity summary & Pagination) */}
            <div className="px-3 py-1.5 border-t border-slate-200/90 bg-gradient-to-r from-slate-50/90 via-white to-slate-50/90 flex flex-wrap items-center justify-between gap-2 text-xs flex-shrink-0">
              {/* Left: Capacity and Count */}
              <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                {isSlotLimitReached ? (
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-800 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    All 10 Slots Full (10/10 max)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded-md border border-emerald-200/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {centres.length}/10 Slots ({MAX_CENTRES - centres.length} slot remaining)
                  </span>
                )}
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  Showing <strong className="text-slate-800">{filteredCentres.length > 0 ? startIndex + 1 : 0}</strong> to{' '}
                  <strong className="text-slate-800">{Math.min(endIndex, filteredCentres.length)}</strong> of{' '}
                  <strong className="text-slate-800">{filteredCentres.length}</strong> associate centres
                </span>
              </div>

              {/* Right: Rows per page and page nav */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rows:</span>
                  <select
                    value={itemsPerPage >= 9999 ? 'all' : itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(e.target.value === 'all' ? 9999 : Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-slate-200 rounded-md px-1.5 py-0.5 bg-white text-slate-700 font-semibold text-[11px] focus:ring-1 focus:ring-orange-500 cursor-pointer shadow-2xs"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value="all">All</option>
                  </select>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-bold flex items-center justify-center transition shadow-2xs"
                      title="Previous Page"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="text-[11px] font-bold text-slate-700 px-1.5">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="w-6 h-6 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-bold flex items-center justify-center transition shadow-2xs"
                      title="Next Page"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Centre Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Building2 size={18} className="text-orange-600" />
                  {editingCentre ? `Edit Centre: ${editingCentre.title}` : 'Add New Associate Centre'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete all required fields below. Contact mobile number must be exactly 10 digits.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Tabs */}
            <div className="flex border-b border-slate-200 px-5 gap-3 text-xs font-bold uppercase tracking-wider bg-white">
              <button
                type="button"
                onClick={() => handleTabClick('basic')}
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${formTab === 'basic' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
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
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${formTab === 'overview' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
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
                className={`py-2.5 border-b-2 flex items-center gap-1.5 transition ${formTab === 'services' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'
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
              <div className="p-5 max-h-[62vh] overflow-y-auto space-y-3.5">
                {/* Global Error Banner if errors exist on current tab */}
                {Object.keys(errors).length > 0 && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-semibold flex items-center gap-2">
                    <AlertCircle size={15} className="flex-shrink-0 text-red-600" />
                    <span>Please correct the highlighted validation errors before continuing.</span>
                  </div>
                )}

                {/* TAB 1: BASIC & CONTACT */}
                {formTab === 'basic' && (
                  <div className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Centre Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => handleTitleChange(e.target.value)}
                          placeholder="e.g. Swami Shraddhanand Hospital"
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${errors.title
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                            }`}
                        />
                        {errors.title && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={11} className="flex-shrink-0" />
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
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-mono transition ${errors.slug
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                            }`}
                        />
                        {errors.slug && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={11} className="flex-shrink-0" />
                            <span>{errors.slug}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Centre Type <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.centreType}
                          onChange={(e) => handleFieldChange('centreType', e.target.value)}
                          placeholder="e.g. Charitable Multi-Disciplinary Hospital"
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${errors.centreType
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                            }`}
                        />
                        {errors.centreType && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={11} className="flex-shrink-0" />
                            <span>{errors.centreType}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
                        <select
                          value={formData.status}
                          onChange={(e) => handleFieldChange('status', e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
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
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${errors.address
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                      />
                      {errors.address && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} className="flex-shrink-0" />
                          <span>{errors.address}</span>
                        </p>
                      )}
                    </div>

                    {/* Contact Phone & Maps in 2 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* STRICT 10-DIGIT MOBILE NUMBER FIELD */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase text-slate-600">
                            Mobile Number <span className="text-red-500">*</span>
                          </label>
                          <span className={`text-[11px] font-mono font-bold ${formData.phone?.length === 10 && /^[6-9]\d{9}$/.test(formData.phone)
                              ? 'text-emerald-600'
                              : 'text-slate-400'
                            }`}>
                            {formData.phone ? formData.phone.length : 0}/10 digits
                            {formData.phone?.length === 10 && /^[6-9]\d{9}$/.test(formData.phone) && ' ✓'}
                          </span>
                        </div>
                        <div className="relative flex rounded-lg shadow-2xs">
                          <span className="inline-flex items-center px-2.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-bold select-none">
                            +91
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            value={formData.phone}
                            onChange={(e) => {
                              // Enforce ONLY numeric digits and maximum 10 digits
                              const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
                              handleFieldChange('phone', cleanDigits);
                            }}
                            placeholder="Enter 10-digit mobile number"
                            className={`w-full px-3 py-1.5 border rounded-r-lg text-xs sm:text-sm font-mono tracking-wider transition ${errors.phone
                                ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                                : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                              }`}
                          />
                        </div>
                        {errors.phone ? (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={11} className="flex-shrink-0" />
                            <span>{errors.phone}</span>
                          </p>
                        ) : (
                          <p className="text-[10px] text-slate-400 mt-1">
                            Only 10 numbers allowed (starts with 6, 7, 8, 9).
                          </p>
                        )}
                      </div>

                      {/* Google Maps Embed URL */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Google Maps Embed URL</label>
                        <input
                          type="text"
                          value={formData.mapSrc}
                          onChange={(e) => handleFieldChange('mapSrc', e.target.value)}
                          placeholder="https://www.google.com/maps/embed?..."
                          className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-mono transition ${errors.mapSrc
                              ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                              : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                            }`}
                        />
                        {errors.mapSrc && (
                          <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                            <AlertCircle size={11} className="flex-shrink-0" />
                            <span>{errors.mapSrc}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Banner Image URL */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Banner Image URL</label>
                      <input
                        type="url"
                        value={formData.bannerImg}
                        onChange={(e) => handleFieldChange('bannerImg', e.target.value)}
                        placeholder="https://.../hospital_associates/example.jpg"
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-mono transition ${errors.bannerImg
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                      />
                      {errors.bannerImg && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} className="flex-shrink-0" />
                          <span>{errors.bannerImg}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: HIGHLIGHTS & OVERVIEW */}
                {formTab === 'overview' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Overview Highlight Bullet Points (1 per line) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-1.5">
                        These appear as the featured highlight cards at the top of the Overview tab.
                      </p>
                      <textarea
                        rows={3}
                        value={formData.highlightsText}
                        onChange={(e) => handleFieldChange('highlightsText', e.target.value)}
                        placeholder="Enter 1 key highlight per line (e.g. 50+ Bedded Multi-Speciality Hospital)..."
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-mono transition ${errors.highlightsText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                      />
                      {errors.highlightsText && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} className="flex-shrink-0" />
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
                        placeholder="Enter detailed hospital overview paragraphs here (at least 20 characters)..."
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm transition ${errors.overviewText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                      />
                      {errors.overviewText && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} className="flex-shrink-0" />
                          <span>{errors.overviewText}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: SERVICES & COMMUNITY SCHEMES */}
                {formTab === 'services' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Clinical & Hospital Services (1 per line) <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mb-1.5">
                        These appear in the bulleted service cards on the live centre page.
                      </p>
                      <textarea
                        rows={5}
                        value={formData.servicesText}
                        onChange={(e) => handleFieldChange('servicesText', e.target.value)}
                        placeholder="Enter 1 clinical service per line (e.g. ICU, Outpatient, Dialysis, Pharmacy)..."
                        className={`w-full px-3 py-1.5 border rounded-lg text-xs sm:text-sm font-mono transition ${errors.servicesText
                            ? 'border-red-500 bg-red-50/20 focus:ring-2 focus:ring-red-400 focus:border-red-500'
                            : 'border-slate-300 focus:ring-2 focus:ring-orange-500'
                          }`}
                      />
                      {errors.servicesText && (
                        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
                          <AlertCircle size={11} className="flex-shrink-0" />
                          <span>{errors.servicesText}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Community Services & Schemes (1 per line)
                      </label>
                      <p className="text-[11px] text-slate-400 mb-1.5">
                        Featured schemes below the services list (e.g. Cataract Surgeries, Health Camps, MJPJAY Scheme).
                      </p>
                      <textarea
                        rows={3}
                        value={formData.communityServicesText}
                        onChange={(e) => handleFieldChange('communityServicesText', e.target.value)}
                        placeholder="Enter 1 community scheme per line..."
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm font-mono focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition"
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
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs sm:text-sm font-medium"
                    >
                      ← Back
                    </button>
                  )}
                  {formTab !== 'services' ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs sm:text-sm font-semibold transition"
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {saveLoading && <RefreshCw size={13} className="animate-spin" />}
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-3.5">
            <div className="flex items-center gap-2.5 text-red-600">
              <AlertCircle size={24} />
              <h3 className="text-base font-bold text-slate-800">Delete Associate Centre?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">"{centreToDelete.title}"</strong>?
              This will remove it from both the admin database and the public website, freeing up 1 slot.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => setCentreToDelete(null)}
                disabled={isDeleting}
                className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition disabled:opacity-50 flex items-center gap-1.5"
              >
                {isDeleting && <RefreshCw size={13} className="animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
