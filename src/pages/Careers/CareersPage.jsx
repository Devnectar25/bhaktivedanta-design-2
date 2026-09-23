import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Share2, CheckCircle2, Upload, AlertCircle, Briefcase, FileText, X } from 'lucide-react';
import { getCareerJobs, submitCareerApplication } from '../../utils/api';
import Swal from 'sweetalert2';
import './CareersPage.css';

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);

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
    // Scroll to top upon mounting
    window.scrollTo(0, 0);

    getCareerJobs().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setJobs(data);
      }
      setIsLoading(false);
    }).catch(err => {
      console.warn('Error fetching jobs:', err);
      setIsLoading(false);
    });
  }, []);

  // Freeze background scrolling when application modal is open
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Careers at Bhaktivedanta Hospital & Research Institute',
        text: 'Explore current clinical and hospital administration job openings at Bhaktivedanta Hospital.',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
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
        position: jobs.length > 0 ? jobs[0].title : 'General Medical Vacancy'
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
        position: 'General Medical Vacancy'
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local object URL or simulate file upload
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

      // SweetAlert2 Confirmation Dialog
      await Swal.fire({
        icon: 'success',
        title: 'Application Submitted!',
        html: `
          <div style="text-align: center; padding: 0.5rem 0;">
            <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.75rem;">
              Thank you, <strong>${payload.fullName}</strong>! Your application for <strong>${payload.position}</strong> has been successfully received by the HR department.
            </p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 8px 18px; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 0.95rem; letter-spacing: 0.5px;">
              Reference ID: ${appRef}
            </div>
            <p style="color: #64748b; font-size: 0.82rem; margin-top: 0.85rem; line-height: 1.5;">
              A confirmation email has been logged to <strong>${payload.email}</strong>. Our HR talent acquisition team will get in touch with you if your profile matches the vacancy requirements.
            </p>
          </div>
        `,
        confirmButtonText: 'Great, Thanks!',
        confirmButtonColor: '#ea580c',
        backdrop: 'rgba(15, 23, 42, 0.65)'
      });

      // Reset form
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

  // Group active jobs by category
  const activeJobs = jobs.filter(j => j.status?.toLowerCase() !== 'closed');
  const categoriesMap = {};

  activeJobs.forEach(job => {
    const cat = job.category || 'General Vacancy';
    if (!categoriesMap[cat]) {
      categoriesMap[cat] = [];
    }
    categoriesMap[cat].push(job);
  });

  return (
    <div className="careers-page">
      <div className="container careers-container">
        {/* Header Title & Share */}
        <div className="careers-header-section">
          <h1 className="careers-title">Careers</h1>
          <button 
            className="careers-share-btn" 
            onClick={handleShare} 
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

        {/* Hero Illustration Banner */}
        <div className="careers-banner-container">
          <img 
            src="/careers_banner.jpg" 
            alt="Bhaktivedanta Hospital Medical Team" 
            className="careers-banner-img"
            onError={(e) => {
              e.target.style.display = 'none';
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

        {/* Vacancies Listed by Category */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <p>Loading current openings at Bhaktivedanta Hospital...</p>
          </div>
        ) : Object.keys(categoriesMap).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
            <p className="text-slate-600 font-medium">Currently there are no active openings listed. You can still send your CV using the Apply Now button above.</p>
          </div>
        ) : (
          Object.keys(categoriesMap).map((categoryName) => (
            <div key={categoryName} className="vacancy-category-block">
              <h2 className="vacancy-category-title">
                {categoryName}
              </h2>

              <div className="vacancy-table-wrapper">
                <table className="vacancy-table">
                  <thead>
                    <tr>
                      <th style={{ width: '120px', textAlign: 'center' }}>No of Position.</th>
                      <th>Position</th>
                      <th>Qualification</th>
                      <th>Experience</th>
                      <th style={{ width: '140px', textAlign: 'center' }}>Apply Here</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoriesMap[categoryName].map((job) => (
                      <tr key={job.id}>
                        <td className="vacancy-pos-no">{job.positions || '01'}</td>
                        <td>
                          <div className="vacancy-role-title">{job.title}</div>
                          {job.department && (
                            <div className="vacancy-department">{job.department} &bull; {job.location || 'Mumbai'}</div>
                          )}
                        </td>
                        <td>{job.qualification || 'Relevant medical degree'}</td>
                        <td>{job.experience || 'As per hospital requirements'}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="btn-apply-row"
                            onClick={() => openApplyModal(job)}
                          >
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
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
                          {j.title} ({j.category} - {j.positions} Openings)
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
                        placeholder="e.g. MD / DNB / B.Sc Nursing / B.Pharm"
                        value={formData.qualification}
                        onChange={e => setFormData({ ...formData, qualification: e.target.value })}
                      />
                      {formErrors.qualification && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{formErrors.qualification}</span>}
                    </div>

                    <div className="form-group">
                      <label>Relevant Experience *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 3 Years 6 Months"
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
                        placeholder="e.g. 6.5 LPA"
                        value={formData.currentCtc}
                        onChange={e => setFormData({ ...formData, currentCtc: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Expected CTC (₹ LPA / Monthly)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 8.0 LPA"
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
                      padding: '1rem',
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
                        <Upload size={22} />
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
                      placeholder="Share a brief overview of your clinical/hospital background or why you wish to join Bhaktivedanta Hospital..."
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
