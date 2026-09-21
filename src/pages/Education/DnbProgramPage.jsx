import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Share2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  GraduationCap,
  Building2,
  Award,
  FlaskConical,
  HeartHandshake,
  X,
  PhoneCall,
  Calendar
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';
import { dnbProgramData } from '../../data/dnbProgramData';
import { getEducationResearchState, submitDnbInquiry, getEducationPrograms } from '../../utils/api';
import Swal from 'sweetalert2';
import './EducationSectionPage.css';
import './DnbProgramPage.css';

const DnbProgramPage = () => {
  const location = useLocation();
  const [programData, setProgramData] = useState(dnbProgramData);
  const [customPrograms, setCustomPrograms] = useState([]);
  const [activeTab, setActiveTab] = useState('specialities');
  const [openAccordions, setOpenAccordions] = useState({ 'dnb-gm': true });
  const [testimonialSubtab, setTestimonialSubtab] = useState('achievements');
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Form State
  const [inquiryForm, setInquiryForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    specialty: 'DNB General Medicine',
    neetScore: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Read URL hash on load (e.g. #facilities, #research, #holistic) and load dynamic admin data
  useEffect(() => {
    window.scrollTo(0, 0);
    const hash = location.hash.replace('#', '');
    if (hash) {
      if (['specialities', 'facilities', 'testimonials', 'research', 'holistic'].includes(hash)) {
        setActiveTab(hash === 'testimonials' ? 'testimonials' : hash);
      }
    }

    const loadDynamicData = () => {
      Promise.all([
        getEducationResearchState(dnbProgramData),
        getEducationPrograms([])
      ])
        .then(([data, progs]) => {
          if (data && typeof data === 'object') {
            setProgramData((prev) => ({
              ...prev,
              ...data
            }));
          }
          if (progs && Array.isArray(progs)) {
            setCustomPrograms(progs);
          }
        })
        .catch((err) => {
          console.warn('Could not load dynamic education research state:', err);
        });
    };

    loadDynamicData();

    const handleSync = () => {
      loadDynamicData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [location.hash]);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'DNB Program | Bhaktivedanta Hospital & Research Institute',
          text: 'Explore NBE accredited DNB post-graduate residency programs at Bhaktivedanta Hospital.',
          url: window.location.href
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const toggleAccordion = (id) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!inquiryForm.candidateName.trim()) errors.candidateName = 'Full name is required';
    if (!inquiryForm.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiryForm.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!inquiryForm.phone.trim()) {
      errors.phone = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(inquiryForm.phone.replace(/\D/g, ''))) {
      errors.phone = 'Please enter a 10-digit mobile number';
    }
    return errors;
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    const refNumber = `DNB-INQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      ...inquiryForm,
      id: refNumber,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    try {
      await submitDnbInquiry(payload);
    } catch (err) {
      console.warn('Inquiry submit fallback:', err);
    }

    // Response delay
    setTimeout(async () => {
      setSubmitting(false);
      setIsInquiryModalOpen(false);

      await Swal.fire({
        icon: 'success',
        title: 'Inquiry Submitted!',
        html: `
          <div style="text-align: center; padding: 0.5rem 0;">
            <p style="color: #475569; font-size: 0.95rem; margin-bottom: 0.75rem;">
              Thank you, <strong>${inquiryForm.candidateName}</strong>! Your inquiry regarding <strong>${inquiryForm.specialty}</strong> has been received by our Academic Medicine Department.
            </p>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; color: #1e3a8a; padding: 8px 18px; border-radius: 8px; font-weight: 700; display: inline-block; font-size: 0.95rem; letter-spacing: 0.5px;">
              Reference ID: ${refNumber}
            </div>
            <p style="color: #64748b; font-size: 0.82rem; margin-top: 0.85rem; line-height: 1.5;">
              Our Academic Coordinator will contact you at <strong>${inquiryForm.email}</strong> or <strong>${inquiryForm.phone}</strong> regarding seat eligibility, curriculum, and counselling guidelines.
            </p>
          </div>
        `,
        confirmButtonText: 'Understood',
        confirmButtonColor: '#f58634'
      });

      // Reset
      setInquiryForm({
        candidateName: '',
        email: '',
        phone: '',
        specialty: 'DNB General Medicine',
        neetScore: '',
        message: ''
      });
    }, 600);
  };

  return (
    <div className="dnb-page-wrapper">
      {/* Top Navbar */}
      <Navbar solid={true} onOpenAppointment={() => setIsAppointmentModalOpen(true)} />

      {/* Breadcrumbs */}
      <div className="dnb-breadcrumb-bar">
        <div className="dnb-breadcrumb-container">
          <nav className="dnb-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="dnb-breadcrumb-link">
              Home
            </Link>
            <span className="dnb-breadcrumb-separator">/</span>
            <span className="dnb-breadcrumb-link">Education & Medical Research</span>
            <span className="dnb-breadcrumb-separator">/</span>
            <span className="dnb-breadcrumb-current">DNB Program</span>
          </nav>

          <button className="dnb-share-btn" onClick={handleShare} aria-label="Share this page">
            <Share2 size={16} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Education Navigation Tabs */}
      <div className="edu-nav-tabs-bar">
        <div className="edu-nav-tabs-container">
          <Link
            to="/education/dnb-program"
            className="edu-nav-tab active"
          >
            DNB Program
          </Link>
          <Link
            to="/education/nursing-program"
            className="edu-nav-tab"
          >
            Nursing School
          </Link>
          <Link
            to="/education/cme"
            className="edu-nav-tab"
          >
            CME
          </Link>
          <Link
            to="/education/cne"
            className="edu-nav-tab"
          >
            CNE
          </Link>
          <Link
            to="/education/spiritual-care-course"
            className="edu-nav-tab"
          >
            Spiritual Care
          </Link>
          <Link
            to="/education/clinical-research-course"
            className="edu-nav-tab"
          >
            Clinical Research (PGCR)
          </Link>
          <Link
            to="/education/clinical-trials"
            className="edu-nav-tab"
          >
            Clinical Trials
          </Link>
          <Link
            to="/education/ethics-committee"
            className="edu-nav-tab"
          >
            Ethics Committee
          </Link>
          <Link
            to="/education/publications"
            className="edu-nav-tab"
          >
            Publications
          </Link>
          <Link
            to="/education/government-accreditation"
            className="edu-nav-tab"
          >
            Accreditations
          </Link>
          {(customPrograms || []).map((p) => (
            <Link
              key={p.id || p.slug}
              to={`/education/${p.slug}`}
              className="edu-nav-tab"
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>

      {shareFeedback && <div className="dnb-share-toast">Page link copied to clipboard!</div>}

      {/* Main Body */}
      <main className="dnb-main-container">
        {/* Page Title & Intro */}
        <header className="dnb-header-section">
          <h1 className="dnb-page-title">{programData.title}</h1>
        </header>

        <section className="dnb-intro-card">
          <p className="dnb-intro-text">{programData.heroIntro}</p>

          {/* Seat Matrix Table (Matching Screenshot 3) */}
          <div className="dnb-table-container">
            <h2 className="dnb-seats-label">Existing DNB Programs:</h2>
            <table className="dnb-seats-table">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>Specialty</th>
                  <th>No. of seats</th>
                </tr>
              </thead>
              <tbody>
                {(programData.seatsMatrix || []).map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.specialty}</td>
                    <td>{item.seats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quote */}
          <div className="dnb-quote-box">
            <p className="dnb-quote-text">{programData.quote}</p>
          </div>

          {/* Director Video Section */}
          {programData.directorVideo?.embedUrl && (
            <div className="dnb-video-section">
              <div className="dnb-video-card">
                <div className="dnb-video-wrapper">
                  <iframe
                    src={programData.directorVideo.embedUrl}
                    title={programData.directorVideo.title || "Director's Desk"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                {programData.directorVideo.title && (
                  <div className="dnb-video-caption">{programData.directorVideo.title}</div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 5 Interactive Tabs (Matching Screenshot 4) */}
        <div className="dnb-tabs-nav-container">
          <div className="dnb-tabs-nav" role="tablist">
            <button
              className={`dnb-tab-btn ${activeTab === 'specialities' ? 'active' : ''}`}
              onClick={() => setActiveTab('specialities')}
              role="tab"
              aria-selected={activeTab === 'specialities'}
            >
              Specialities
            </button>
            <button
              className={`dnb-tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}
              onClick={() => setActiveTab('facilities')}
              role="tab"
              aria-selected={activeTab === 'facilities'}
            >
              Facilities
            </button>
            <button
              className={`dnb-tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
              onClick={() => setActiveTab('testimonials')}
              role="tab"
              aria-selected={activeTab === 'testimonials'}
            >
              Testimonial's
            </button>
            <button
              className={`dnb-tab-btn ${activeTab === 'research' ? 'active' : ''}`}
              onClick={() => setActiveTab('research')}
              role="tab"
              aria-selected={activeTab === 'research'}
            >
              Research
            </button>
            <button
              className={`dnb-tab-btn ${activeTab === 'holistic' ? 'active' : ''}`}
              onClick={() => setActiveTab('holistic')}
              role="tab"
              aria-selected={activeTab === 'holistic'}
            >
              Holistic program
            </button>
          </div>
        </div>

        {/* Tab 1: Specialities */}
        {activeTab === 'specialities' && (
          <div className="dnb-tab-panel">
            <div className="dnb-specialties-accordion">
              {(programData.specialities || []).map((spec) => {
                const isOpen = Boolean(openAccordions[spec.id]);
                return (
                  <div key={spec.id} className={`dnb-accordion-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="dnb-accordion-header"
                      onClick={() => toggleAccordion(spec.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="dnb-accordion-title-wrap">
                        <span className="dnb-accordion-icon-sign">{isOpen ? '−' : '+'}</span>
                        <span className="dnb-accordion-title">{spec.title}</span>
                        <span className="dnb-accordion-badge">{spec.seats} Seats</span>
                      </div>
                      {isOpen ? <ChevronUp size={20} color="#f58634" /> : <ChevronDown size={20} color="#94a3b8" />}
                    </button>

                    {isOpen && (
                      <div className="dnb-accordion-content">
                        <h3 className="dnb-spec-section-title">About Department</h3>
                        <p className="dnb-spec-desc">{spec.about}</p>
                        {spec.aboutHighlight && <p className="dnb-spec-highlight">{spec.aboutHighlight}</p>}

                        {spec.integratedMedicine && (
                          <div className="dnb-integrated-card">
                            <h4 className="dnb-integrated-title">Integrated Medicine Paradigm</h4>
                            <p className="dnb-integrated-text">{spec.integratedMedicine}</p>
                          </div>
                        )}

                        {spec.faculties && spec.faculties.length > 0 && (
                          <>
                            <h3 className="dnb-spec-section-title">Faculties &amp; Teaching Consultants</h3>
                            <div className="dnb-faculties-grid">
                              {spec.faculties.map((f, fIdx) => (
                                <div key={fIdx} className="dnb-faculty-card">
                                  <div className="dnb-faculty-img-col">
                                    <img
                                      src={f.image}
                                      alt={f.name}
                                      className="dnb-faculty-img"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                  <div className="dnb-faculty-info-col">
                                    <div>
                                      <h4 className="dnb-faculty-name">{f.name}</h4>
                                      <div className="dnb-faculty-designation">{f.designation}</div>
                                      <div className="dnb-faculty-meta">
                                        <strong>Qualification:</strong> {f.qualification}
                                      </div>
                                      <div className="dnb-faculty-meta">
                                        <strong>Experience:</strong> {f.experience}
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="dnb-faculty-apt-btn"
                                      onClick={() => setIsAppointmentModalOpen(true)}
                                    >
                                      Consult Faculty
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {spec.academicSchedule && (
                          <>
                            <h3 className="dnb-spec-section-title">Academic Schedule &amp; Teaching Program</h3>
                            <div className="dnb-table-responsive">
                              <table className="dnb-schedule-table">
                                <thead>
                                  <tr>
                                    <th>Day</th>
                                    <th>Academic Schedule</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {spec.academicSchedule.map((s, sIdx) => (
                                    <tr key={sIdx}>
                                      <td>{s.day}</td>
                                      <td>{s.schedule}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </>
                        )}

                        {spec.videos && spec.videos.length > 0 && (
                          <div className="dnb-accordion-videos">
                            {spec.videos.map((vUrl, vIdx) => (
                              <div key={vIdx} className="dnb-video-wrapper">
                                <iframe
                                  src={vUrl}
                                  title={`${spec.title} Overview`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Facilities (Matching Screenshot 5) */}
        {activeTab === 'facilities' && (
          <div className="dnb-tab-panel">
            <h2 className="dnb-spec-section-title" style={{ marginBottom: '1.5rem' }}>
              Academic &amp; Resident Facilities
            </h2>
            <div className="dnb-facilities-grid">
              {(programData.facilities || []).map((fac, idx) => (
                <div key={idx} className="dnb-facility-card">
                  <div className="dnb-facility-img-wrap">
                    <img src={fac.image} alt={fac.title} className="dnb-facility-img" />
                    <div className="dnb-facility-overlay">
                      <h3 className="dnb-facility-label">{fac.title}</h3>
                      <span className="dnb-facility-caption">{fac.caption}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Digital Library */}
            <div className="dnb-digital-lib-card">
              <div className="dnb-digital-lib-content">
                <div>
                  <h3 className="dnb-spec-section-title">{programData.digitalLibrary?.title || 'Digital Library'}</h3>
                  <p className="dnb-spec-desc">{programData.digitalLibrary?.description}</p>
                  <ul style={{ paddingLeft: '1.2rem', color: '#475569', fontSize: '0.92rem', lineHeight: '1.75' }}>
                    <li>Full-text access to PubMed, ScienceDirect & UpToDate</li>
                    <li>NBE online thesis repository and dissertation support</li>
                    <li>24/7 dedicated high-speed study terminals</li>
                  </ul>
                </div>
                {programData.digitalLibrary?.image && (
                  <img
                    src={programData.digitalLibrary.image}
                    alt="Digital Library"
                    className="dnb-digital-lib-img"
                  />
                )}
              </div>
            </div>

            {/* List of CME 2023 */}
            <div className="dnb-cme-card">
              <h3 className="dnb-cme-title">Conferences &amp; List of CME Programs</h3>
              <ul className="dnb-cme-list">
                {(programData.cmeList2023 || []).map((cme, cmeIdx) => (
                  <li key={cmeIdx} className="dnb-cme-item">
                    <span className="dnb-cme-bullet">•</span>
                    <span>{cme}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Testimonial's */}
        {activeTab === 'testimonials' && (
          <div className="dnb-tab-panel">
            <div className="dnb-subtabs-nav">
              <button
                className={`dnb-subtab-btn ${testimonialSubtab === 'achievements' ? 'active' : ''}`}
                onClick={() => setTestimonialSubtab('achievements')}
              >
                Students Achievements
              </button>
              <button
                className={`dnb-subtab-btn ${testimonialSubtab === 'testimonials' ? 'active' : ''}`}
                onClick={() => setTestimonialSubtab('testimonials')}
              >
                Students Testimonials
              </button>
            </div>

            {testimonialSubtab === 'achievements' ? (
              <div>
                {(programData.testimonials?.achievements || []).map((ach) => (
                  <div key={ach.id} className="dnb-achievement-card">
                    <div className="dnb-achievement-images">
                      <img src={ach.photo} alt={ach.studentName} className="dnb-achievement-img" />
                      <img src={ach.certificate} alt="Certificate" className="dnb-achievement-img" />
                    </div>
                    <div className="dnb-achievement-award">{ach.award}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ maxWidth: '750px', margin: '0 auto' }}>
                <div className="dnb-video-wrapper">
                  <iframe
                    src={programData.testimonials?.video}
                    title="DNB Student Testimonials"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Research */}
        {activeTab === 'research' && (
          <div className="dnb-tab-panel">
            <h2 className="dnb-spec-section-title">About the Medical Research Department</h2>
            <p className="dnb-research-overview">{programData.research?.overview}</p>

            <div className="dnb-research-pillars">
              {(programData.research?.pillars || []).map((pil, pIdx) => (
                <div key={pIdx} className="dnb-pillar-card">
                  <h4 className="dnb-pillar-title">{pil.title}</h4>
                  <p className="dnb-pillar-desc">{pil.desc}</p>
                </div>
              ))}
            </div>

            {/* Publications */}
            <h3 className="dnb-section-subtitle">DNB Thesis &amp; High-Impact Publications</h3>
            <div className="dnb-table-responsive">
              <table className="dnb-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Authors / Citation</th>
                    <th>Publication Title</th>
                    <th style={{ width: '80px' }}>Year</th>
                    <th>Journal Name</th>
                  </tr>
                </thead>
                <tbody>
                  {(programData.research?.publications || []).map((pub) => (
                    <tr key={pub.sr}>
                      <td>{pub.sr}</td>
                      <td>{pub.citation}</td>
                      <td>
                        <strong>{pub.title}</strong>
                      </td>
                      <td>{pub.year}</td>
                      <td>{pub.journal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Ethics Committee */}
            <h3 className="dnb-section-subtitle">
              Institutional Ethics Committee for Biomedical and Health Research
            </h3>
            <div className="dnb-table-responsive">
              <table className="dnb-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Name of Member</th>
                    <th>Qualification</th>
                    <th>Role / Designation in EC</th>
                  </tr>
                </thead>
                <tbody>
                  {(programData.research?.ethicsCommittee || []).map((m) => (
                    <tr key={m.sr}>
                      <td>{m.sr}</td>
                      <td>
                        <strong>{m.name}</strong>
                      </td>
                      <td>{m.qualification}</td>
                      <td>
                        <span
                          style={{
                            background: '#eff6ff',
                            color: '#1e3a8a',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            fontSize: '0.82rem'
                          }}
                        >
                          {m.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Scientific Research Committee */}
            <h3 className="dnb-section-subtitle">Scientific Research Committee (SRC)</h3>
            <div className="dnb-table-responsive">
              <table className="dnb-data-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Sr. No.</th>
                    <th>Name of Member</th>
                    <th>Qualification</th>
                    <th>Role in SRC</th>
                  </tr>
                </thead>
                <tbody>
                  {(programData.research?.scientificCommittee || []).map((m) => (
                    <tr key={m.sr}>
                      <td>{m.sr}</td>
                      <td>
                        <strong>{m.name}</strong>
                      </td>
                      <td>{m.qualification}</td>
                      <td>{m.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Holistic Program (CDCC) */}
        {activeTab === 'holistic' && (
          <div className="dnb-tab-panel">
            <div className="dnb-holistic-banner">
              <h2 className="dnb-holistic-title">{programData.holisticProgram?.title}</h2>
              <div className="dnb-holistic-subtitle">{programData.holisticProgram?.subtitle}</div>
              <p className="dnb-holistic-intro">{programData.holisticProgram?.intro}</p>
              <div className="dnb-holistic-mission">{programData.holisticProgram?.sacredMission}</div>
            </div>

            <h3 className="dnb-spec-section-title" style={{ marginBottom: '1.5rem' }}>
              Four Core Objectives of CDCC Mentorship
            </h3>

            <div className="dnb-objectives-grid">
              {(programData.holisticProgram?.objectives || []).map((obj, oIdx) => (
                <div key={oIdx} className="dnb-objective-card">
                  <div className="dnb-objective-icon">
                    <HeartHandshake size={22} />
                  </div>
                  <h4 className="dnb-objective-title">{obj.title}</h4>
                  <p className="dnb-objective-desc">{obj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admissions & Inquiries CTA Banner */}
        <section className="dnb-cta-banner">
          <h2 className="dnb-cta-title">Apply or Inquire About DNB Residency</h2>
          <p className="dnb-cta-desc">
            Admissions for DNB programs are governed through the National Board of Examinations in Medical Sciences
            (NBEMS) centralized counselling. For candidate inquiries, seat confirmations, and hospital visits:
          </p>
          <div className="dnb-cta-actions">
            <button className="dnb-btn-primary" onClick={() => setIsInquiryModalOpen(true)}>
              Submit DNB Inquiry
            </button>
            <a href="tel:07969002222" className="dnb-btn-secondary" style={{ textDecoration: 'none' }}>
              Call Academic Desk: 079 6900 2222
            </a>
          </div>
        </section>
      </main>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="dnb-modal-overlay" onClick={() => setIsInquiryModalOpen(false)}>
          <div className="dnb-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="dnb-modal-header">
              <h3 className="dnb-modal-title">DNB Admission &amp; Course Inquiry</h3>
              <button
                className="dnb-modal-close-btn"
                onClick={() => setIsInquiryModalOpen(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="dnb-modal-body">
              <form onSubmit={handleInquirySubmit}>
                <div className="dnb-form-group">
                  <label className="dnb-form-label">Candidate Full Name *</label>
                  <input
                    type="text"
                    name="candidateName"
                    value={inquiryForm.candidateName}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Rohan Sharma"
                    className="dnb-form-input"
                  />
                  {formErrors.candidateName && <div className="dnb-form-error">{formErrors.candidateName}</div>}
                </div>

                <div className="dnb-form-group">
                  <label className="dnb-form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={inquiryForm.email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                    className="dnb-form-input"
                  />
                  {formErrors.email && <div className="dnb-form-error">{formErrors.email}</div>}
                </div>

                <div className="dnb-form-group">
                  <label className="dnb-form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={inquiryForm.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="dnb-form-input"
                  />
                  {formErrors.phone && <div className="dnb-form-error">{formErrors.phone}</div>}
                </div>

                <div className="dnb-form-group">
                  <label className="dnb-form-label">DNB Specialty of Interest *</label>
                  <select
                    name="specialty"
                    value={inquiryForm.specialty}
                    onChange={handleInputChange}
                    className="dnb-form-select"
                  >
                    {programData.seatsMatrix.map((s) => (
                      <option key={s.id} value={s.specialty}>
                        {s.specialty} ({s.seats} Seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="dnb-form-group">
                  <label className="dnb-form-label">NEET-PG Rank / Score (Optional)</label>
                  <input
                    type="text"
                    name="neetScore"
                    value={inquiryForm.neetScore}
                    onChange={handleInputChange}
                    placeholder="e.g. All India Rank 12450"
                    className="dnb-form-input"
                  />
                </div>

                <div className="dnb-form-group">
                  <label className="dnb-form-label">Questions / Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={inquiryForm.message}
                    onChange={handleInputChange}
                    placeholder="Inquire about hostel, stipend, clinical rotation, or verification..."
                    className="dnb-form-textarea"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="dnb-btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {submitting ? 'Submitting Inquiry...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default DnbProgramPage;
