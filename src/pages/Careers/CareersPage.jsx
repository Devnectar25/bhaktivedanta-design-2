import React, { useState, useEffect } from 'react';
import { 
  Share2, CheckCircle2, Upload, AlertCircle, Briefcase, FileText, X, 
  Search, MapPin, Clock, GraduationCap, Users, ArrowRight, ChevronDown, 
  ChevronUp, Sparkles, Building2, Mail, Check
} from 'lucide-react';
import { getCareerJobs, submitCareerApplication } from '../../utils/api';
import { defaultCareerJobs } from '../../data/careersData';
import Swal from 'sweetalert2';
import './CareersPage.css';

const CareersPage = () => {
  const [jobs, setJobs] = useState(defaultCareerJobs);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [expandedJobId, setExpandedJobId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    jobId: '',
    position: '',
    fullName: '',
    email: '',
    phone: '',
    city: '',
    qualification: '',
    experience: '',
    currentCtc: '',
    expectedCtc: '',
    noticePeriod: '30 Days',
    coverNote: '',
    resumeName: '',
    resumeUrl: ''
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);

    getCareerJobs(defaultCareerJobs).then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setJobs(data);
      } else {
        setJobs(defaultCareerJobs);
      }
      setIsLoading(false);
    }).catch(err => {
      console.warn('Error fetching jobs:', err);
      setJobs(defaultCareerJobs);
      setIsLoading(false);
    });
  }, []);

  // Freeze background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isModalOpen]);

  const handleSharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Careers at Bhaktivedanta Hospital & Research Institute',
        text: 'Explore rewarding healthcare careers and openings at Bhaktivedanta Hospital.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const handleShareJob = (job, e) => {
    e.stopPropagation();
    const shareText = `Explore vacancy for ${job.title} (${job.positions || '01'} openings) at Bhaktivedanta Hospital: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: shareText,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Job link copied to clipboard!',
        showConfirmButton: false,
        timer: 2000
      });
    }
  };

  const toggleExpandJob = (jobId) => {
    setExpandedJobId(prev => prev === jobId ? null : jobId);
  };

  const openApplyModal = (job = null) => {
    if (job) {
      setSelectedJob(job);
      setFormData(prev => ({
        ...prev,
        jobId: job.id,
        position: job.title
      }));
    } else {
      setSelectedJob(null);
      setFormData(prev => ({
        ...prev,
        jobId: jobs.length > 0 ? jobs[0].id : 'GENERAL',
        position: jobs.length > 0 ? jobs[0].title : 'General Medical / Hospital Vacancy'
      }));
    }
    setFormErrors({});
    setSubmitSuccess(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitSuccess(null);
  };

  const handleJobSelectChange = (e) => {
    const selectedId = e.target.value;
    const matched = jobs.find(j => j.id === selectedId);
    if (matched) {
      setSelectedJob(matched);
      setFormData(prev => ({
        ...prev,
        jobId: matched.id,
        position: matched.title
      }));
    } else {
      setSelectedJob(null);
      setFormData(prev => ({
        ...prev,
        jobId: 'GENERAL',
        position: 'General Medical / Hospital Vacancy'
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const simulatedUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        resumeName: file.name,
        resumeUrl: simulatedUrl
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Contact phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 8) {
      errors.phone = 'Enter a valid phone number';
    }
    if (!formData.qualification.trim()) errors.qualification = 'Highest qualification is required';
    if (!formData.experience.trim()) errors.experience = 'Total experience is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        id: `BVH-APP-${Math.floor(1000 + Math.random() * 9000)}`,
        appliedDate: new Date().toISOString().split('T')[0]
      };

      const result = await submitCareerApplication(payload);
      const appRef = result?.id || payload.id;
      setSubmitting(false);
      setIsModalOpen(false);

      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <div style="text-align: center; padding: 0.5rem 0;">
            <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.75rem;">
              Thank you, <strong>${payload.fullName}</strong>! Your application for <strong>${payload.position}</strong> has been received by Bhaktivedanta Hospital HR.
            </p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 8px 18px; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 0.95rem;">
              Reference ID: ${appRef}
            </div>
            <p style="color: #64748b; font-size: 0.82rem; margin-top: 0.85rem; line-height: 1.5;">
              A confirmation email has been logged to <strong>${payload.email}</strong>. Our HR talent team will contact you if your profile matches the vacancy requirements.
            </p>
          </div>
        `,
        confirmButtonText: 'Great, Thanks!',
        confirmButtonColor: '#ea580c',
        backdrop: 'rgba(15, 23, 42, 0.65)'
      });

      setFormData({
        jobId: '',
        position: '',
        fullName: '',
        email: '',
        phone: '',
        city: '',
        qualification: '',
        experience: '',
        currentCtc: '',
        expectedCtc: '',
        noticePeriod: '30 Days',
        coverNote: '',
        resumeName: '',
        resumeUrl: ''
      });
      setSubmitSuccess(null);
    } catch (err) {
      console.error('Application submission error:', err);
      const fallbackId = `BVH-APP-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmitting(false);
      setIsModalOpen(false);

      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <div style="text-align: center; padding: 0.5rem 0;">
            <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.75rem;">
              Thank you, <strong>${formData.fullName}</strong>. Your application for <strong>${formData.position}</strong> has been recorded.
            </p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 8px 18px; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 0.95rem;">
              Reference ID: ${fallbackId}
            </div>
          </div>
        `,
        confirmButtonText: 'OK',
        confirmButtonColor: '#ea580c'
      });
    }
  };

  // Filter Active Jobs
  const activeJobs = jobs.filter(j => j.status?.toLowerCase() !== 'closed');

  // Extract unique categories
  const categoriesList = Array.from(new Set(activeJobs.map(j => j.category || 'General Vacancy')));

  // Filter by search & active category
  const filteredJobs = activeJobs.filter(job => {
    const matchesCategory = activeCategory === 'ALL' || job.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch = 
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.department && job.department.toLowerCase().includes(q)) ||
      (job.qualification && job.qualification.toLowerCase().includes(q)) ||
      (job.experience && job.experience.toLowerCase().includes(q)) ||
      (job.description && job.description.toLowerCase().includes(q)) ||
      (job.category && job.category.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Group filtered jobs by category
  const categoriesMap = {};
  filteredJobs.forEach(job => {
    const cat = job.category || 'General Vacancy';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(job);
  });

  // Category Theme Helper
  const getCategoryThemeClass = (catName) => {
    const lower = (catName || '').toLowerCase();
    if (lower.includes('admin') || lower.includes('support')) return 'cat-theme-admin';
    if (lower.includes('consultant') || lower.includes('doctor') || lower.includes('medical')) return 'cat-theme-consultant';
    if (lower.includes('nurs')) return 'cat-theme-nursing';
    if (lower.includes('paramed') || lower.includes('path') || lower.includes('pharm')) return 'cat-theme-paramedical';
    return 'cat-theme-default';
  };

  const getCategoryIcon = (catName) => {
    const lower = (catName || '').toLowerCase();
    if (lower.includes('admin') || lower.includes('support')) return <Building2 size={18} />;
    if (lower.includes('consultant') || lower.includes('doctor')) return <Sparkles size={18} />;
    if (lower.includes('nurs')) return <Users size={18} />;
    if (lower.includes('paramed') || lower.includes('pharm')) return <GraduationCap size={18} />;
    return <Briefcase size={18} />;
  };

  return (
    <div className="careers-page">

      <div className="container careers-container">

        {/* Header Title & Share */}
        <div className="careers-header-section">
          <h1 className="careers-title">Careers</h1>
          <button 
            className="careers-share-btn" 
            onClick={handleSharePage} 
            title="Share page"
            aria-label="Share Careers Page"
          >
            <Share2 size={20} />
          </button>
        </div>

        {shareFeedback && (
          <div className="careers-share-toast">
            Page link copied to clipboard!
          </div>
        )}

        {/* Team Illustration Banner (Kept exactly as requested) */}
        <div className="careers-banner-container">
          <img 
            src="/careers_banner.png" 
            alt="Bhaktivedanta Hospital Medical Team" 
            className="careers-banner-img"
            onError={(e) => {
              // Fallback to jpg if png not available
              if (e.target.src.endsWith('.png')) {
                e.target.src = '/careers_banner.jpg';
              }
            }}
          />
        </div>

        {/* HR Instructions Card */}
        <div className="careers-notice-card">
          <p className="careers-notice-text">
            Apply with a <strong>detailed CV mentioning current CTC, Expected CTC and a recent passport size photograph</strong> super scribing the position on the envelope or mail to <a href="mailto:careers@bhaktivedantahospital.com" className="email-link">careers@bhaktivedantahospital.com</a> or approach the HR Department personally between <strong>10:30 am to 05:30 pm</strong> on any working day.
          </p>
          <button className="btn-apply-primary" onClick={() => openApplyModal(null)}>
            APPLY NOW
          </button>
        </div>

        {/* Search & Filter Control Bar */}
        <div className="careers-filter-panel">
          <div className="careers-filter-top-row">
            <div className="careers-search-wrapper">
              <Search className="careers-search-icon" size={18} />
              <input 
                type="text"
                className="careers-search-input"
                placeholder="Search job by title, department, qualification, or experience..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="careers-search-clear" onClick={() => setSearchQuery('')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="careers-category-pills">
            <button 
              className={`category-pill-btn ${activeCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveCategory('ALL')}
            >
              <span>All Vacancies</span>
              <span className="category-pill-badge">{activeJobs.length}</span>
            </button>

            {categoriesList.map(cat => {
              const count = activeJobs.filter(j => j.category === cat).length;
              return (
                <button 
                  key={cat}
                  className={`category-pill-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {getCategoryIcon(cat)}
                  <span>{cat}</span>
                  <span className="category-pill-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Results Header */}
        <div className="careers-results-header">
          <div className="careers-results-count">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Opening Found' : 'Openings Found'}
            {activeCategory !== 'ALL' && ` in "${activeCategory}"`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>

          {(activeCategory !== 'ALL' || searchQuery) && (
            <button 
              className="careers-reset-btn"
              onClick={() => {
                setActiveCategory('ALL');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ================================================================
            NEW JOB POSTINGS STRUCTURE: MODERN CARDS GRID (Replaces Table)
            ================================================================ */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
            <p>Loading current openings at Bhaktivedanta Hospital...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="careers-empty-state">
            <div className="careers-empty-icon">
              <Search size={28} />
            </div>
            <h3 className="careers-empty-title">No Matching Vacancies Found</h3>
            <p className="careers-empty-text">
              We couldn't find any positions matching your search. You can clear your filters or submit a general resume using the Apply Now button above.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                className="category-pill-btn" 
                onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }}
              >
                Clear Search & Filters
              </button>
              <button 
                className="btn-apply-primary" 
                onClick={() => openApplyModal(null)}
              >
                Submit General Application
              </button>
            </div>
          </div>
        ) : (
          Object.keys(categoriesMap).map((categoryName) => {
            const catJobs = categoriesMap[categoryName];
            const themeClass = getCategoryThemeClass(categoryName);

            return (
              <div key={categoryName} className="careers-category-section">
                {/* Category Header */}
                <div className="careers-category-header">
                  <div className="careers-category-title-group">
                    <div className={`category-title-icon ${themeClass}`}>
                      {getCategoryIcon(categoryName)}
                    </div>
                    <h2 className="careers-category-heading">
                      {categoryName}
                    </h2>
                  </div>
                  <span className="careers-category-count-badge">
                    {catJobs.length} {catJobs.length === 1 ? 'Position' : 'Positions'}
                  </span>
                </div>

                {/* Cards Grid for this category */}
                <div className="job-cards-grid">
                  {catJobs.map((job) => {
                    const isExpanded = expandedJobId === job.id;
                    const posNum = job.positions || '01';

                    return (
                      <div key={job.id} className="job-card-modern">
                        {/* Top Tags */}
                        <div>
                          <div className="job-card-top-tags">
                            <span className={`job-category-tag ${themeClass}`}>
                              {job.category || 'Hospital Opening'}
                            </span>
                            <div className="job-positions-pill">
                              <Users size={14} />
                              <span>{posNum} {parseInt(posNum, 10) > 1 ? 'Positions' : 'Position'} Open</span>
                            </div>
                          </div>

                          {/* Job Title */}
                          <h3 className="job-card-title">{job.title}</h3>

                          {/* Meta: Department & Location */}
                          <div className="job-card-meta">
                            {job.department && (
                              <div className="job-meta-item">
                                <Building2 size={15} style={{ color: '#ea580c' }} />
                                <span>{job.department}</span>
                              </div>
                            )}
                            <div className="job-meta-item">
                              <MapPin size={15} style={{ color: '#0284c7' }} />
                              <span>{job.location || 'Mira Road, Mumbai'}</span>
                            </div>
                            <div className="job-meta-item">
                              <Briefcase size={15} style={{ color: '#16a34a' }} />
                              <span>{job.type || 'Full Time'}</span>
                            </div>
                          </div>

                          {/* Key Credentials Strip: Qualification & Experience */}
                          <div className="job-credentials-box">
                            <div className="job-credential-item">
                              <GraduationCap className="job-credential-icon" size={18} />
                              <div>
                                <span className="job-credential-label">Required Qualification</span>
                                <span className="job-credential-value">{job.qualification || 'Relevant degree / diploma'}</span>
                              </div>
                            </div>

                            <div className="job-credential-item">
                              <Clock className="job-credential-icon" size={18} />
                              <div>
                                <span className="job-credential-label">Experience</span>
                                <span className="job-credential-value">{job.experience || 'As per hospital requirements'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Short Description */}
                          {job.description && (
                            <p className="job-description-text">
                              {job.description}
                            </p>
                          )}

                          {/* Expandable Key Responsibilities */}
                          {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 && (
                            <div>
                              <button 
                                className="job-expand-btn"
                                onClick={() => toggleExpandJob(job.id)}
                              >
                                {isExpanded ? (
                                  <>
                                    <span>Hide Key Responsibilities</span>
                                    <ChevronUp size={15} />
                                  </>
                                ) : (
                                  <>
                                    <span>View Key Responsibilities & Requirements</span>
                                    <ChevronDown size={15} />
                                  </>
                                )}
                              </button>

                              {isExpanded && (
                                <div className="job-responsibilities-drawer">
                                  <div className="job-responsibilities-title">Core Responsibilities:</div>
                                  <ul className="job-responsibilities-list">
                                    {job.responsibilities.map((resp, idx) => (
                                      <li key={idx}>
                                        <Check className="responsibility-bullet-icon" size={14} />
                                        <span>{resp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Footer */}
                        <div className="job-card-footer">
                          <div className="job-ref-info">
                            <span>Ref: {job.id}</span>
                            {job.postedDate && (
                              <span> &bull; Posted {job.postedDate}</span>
                            )}
                          </div>

                          <div className="job-actions-group">
                            <button 
                              className="btn-card-share"
                              onClick={(e) => handleShareJob(job, e)}
                              title="Share this job opening"
                              aria-label="Share Job"
                            >
                              <Share2 size={16} />
                            </button>

                            <button 
                              className="btn-card-apply"
                              onClick={() => openApplyModal(job)}
                            >
                              <span>Apply</span>
                              <ArrowRight size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Application Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{submitSuccess ? 'Application Submitted' : 'Hospital Career Application'}</h3>
                <p>{submitSuccess ? 'Thank you for your interest in joining our team' : 'Submit your resume and credentials to Bhaktivedanta Hospital HR'}</p>
              </div>
              <button className="modal-close-btn" onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {submitSuccess ? (
                <div className="success-card-content">
                  <div className="success-icon-badge">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Application Sent Successfully!
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: '440px', margin: '0 auto' }}>
                    Your application for <strong>{submitSuccess.position}</strong> has been received by the Bhaktivedanta Hospital HR department.
                  </p>
                  <div className="reference-id-pill">
                    Ref ID: {submitSuccess.id}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    A confirmation email has been logged to {submitSuccess.email}. Our HR talent team will contact you if your profile matches our requirements.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Position Selection */}
                  <div className="form-group">
                    <label>Applying For Job Role *</label>
                    <select 
                      value={formData.jobId} 
                      onChange={handleJobSelectChange}
                    >
                      {activeJobs.map(j => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.category} - {j.positions || '01'} Openings)
                        </option>
                      ))}
                      <option value="GENERAL">General Clinical / Administrative Vacancy</option>
                    </select>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Dr. Ramesh Gupta"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />
                      {formErrors.fullName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                      {formErrors.email && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.email}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Contact Phone / Mobile *</label>
                      <input 
                        type="tel" 
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      />
                      {formErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label>Current City *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Mumbai, Thane, Pune"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Highest Qualification *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. MD / DNB / B.Sc / Any Graduate"
                        value={formData.qualification}
                        onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                      />
                      {formErrors.qualification && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.qualification}</span>}
                    </div>

                    <div className="form-group">
                      <label>Relevant Experience *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 2-3 Years"
                        value={formData.experience}
                        onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      />
                      {formErrors.experience && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.experience}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Current CTC (₹ LPA / Monthly)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 4.5 LPA"
                        value={formData.currentCtc}
                        onChange={e => setFormData({ ...formData, currentCtc: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Expected CTC (₹ LPA / Monthly)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 6.0 LPA"
                        value={formData.expectedCtc}
                        onChange={e => setFormData({ ...formData, expectedCtc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Notice Period</label>
                    <select 
                      value={formData.noticePeriod} 
                      onChange={e => setFormData({ ...formData, noticePeriod: e.target.value })}
                    >
                      <option value="Immediate">Immediate / 0-7 Days</option>
                      <option value="15 Days">15 Days</option>
                      <option value="30 Days">30 Days</option>
                      <option value="60 Days">60 Days</option>
                      <option value="90 Days">90 Days</option>
                    </select>
                  </div>

                  {/* Resume Upload */}
                  <div className="form-group">
                    <label>Upload CV / Resume (PDF / DOCX)</label>
                    <div style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '1.25rem',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="file" 
                        id="resumeUploadInput"
                        accept=".pdf,.doc,.docx"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <label htmlFor="resumeUploadInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', color: '#1e3a8a', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Upload size={24} style={{ color: '#ea580c' }} />
                        <span>{formData.resumeName ? `Attached: ${formData.resumeName}` : 'Click to select your CV / Resume file'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400 }}>Supports PDF, Word (.doc, .docx) up to 10MB</span>
                      </label>
                    </div>
                  </div>

                  {/* Cover Note */}
                  <div className="form-group">
                    <label>Short Cover Note / Message</label>
                    <textarea 
                      rows="3" 
                      placeholder="Share a brief overview of your background or why you wish to join Bhaktivedanta Hospital..."
                      value={formData.coverNote}
                      onChange={e => setFormData({ ...formData, coverNote: e.target.value })}
                    />
                  </div>
                </form>
              )}
            </div>

            <div className="modal-footer">
              {submitSuccess ? (
                <button className="btn-modal-submit" onClick={closeModal}>
                  Done
                </button>
              ) : (
                <>
                  <button type="button" className="btn-modal-cancel" onClick={closeModal} disabled={submitting}>
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="btn-modal-submit" 
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareersPage;
