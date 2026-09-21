import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import {
  Share2,
  CheckCircle2,
  Award,
  BookOpen,
  Building2,
  FlaskConical,
  Users,
  ShieldCheck,
  Calendar,
  GraduationCap,
  HeartHandshake,
  FileText,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sparkles,
  X
} from 'lucide-react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';
import { dnbProgramData } from '../../data/dnbProgramData';
import { getEducationResearchState, submitDnbInquiry, getEducationPrograms } from '../../utils/api';
import Swal from 'sweetalert2';
import './EducationSectionPage.css';

// Slug to database key mapping
const SECTION_KEY_MAP = {
  'nursing-program': 'nursingProgram',
  'nursing': 'nursingProgram',
  'cme': 'cmeProgram',
  'cne': 'cneProgram',
  'spiritual-care-course': 'spiritualCareCourse',
  'spiritual-care': 'spiritualCareCourse',
  'clinical-research-course': 'clinicalResearchCourse',
  'pgcr': 'clinicalResearchCourse',
  'clinical-trials': 'clinicalTrials',
  'ethics-committee': 'ethicsCommittee',
  'publications': 'publications',
  'government-accreditation': 'governmentAccreditation'
};

const EducationSectionPage = () => {
  const { sectionSlug } = useParams();
  const location = useLocation();

  // Determine section key
  const pathSegment = sectionSlug || location.pathname.split('/').filter(Boolean).pop() || 'nursing-program';
  const sectionKey = SECTION_KEY_MAP[pathSegment] || null;

  const [eduState, setEduState] = useState(dnbProgramData);
  const [customProgramsList, setCustomProgramsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Inquiry Form
  const [inquiryForm, setInquiryForm] = useState({
    candidateName: '',
    email: '',
    phone: '',
    specialty: '',
    neetScore: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, [pathSegment]);

  const loadData = async () => {
    try {
      const [data, progs] = await Promise.all([
        getEducationResearchState(null),
        getEducationPrograms([])
      ]);
      if (data) {
        setEduState(data);
      }
      if (progs && Array.isArray(progs)) {
        setCustomProgramsList(progs);
      }
    } catch (err) {
      console.warn('Error loading education research state:', err);
    } finally {
      setLoading(false);
    }
  };

  const allCustomPrograms = [
    ...(eduState?.customPrograms || []),
    ...customProgramsList
  ];
  const customProgram = allCustomPrograms.find(
    (p) => p.slug === pathSegment || p.id === pathSegment
  );
  const isCustomProgram = Boolean(customProgram && !SECTION_KEY_MAP[pathSegment]);
  const currentSection = isCustomProgram
    ? customProgram
    : (sectionKey ? eduState?.[sectionKey] : null) || customProgram || eduState?.nursingProgram;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentSection?.title || 'Education & Research'} | Bhaktivedanta Hospital`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.candidateName.trim() || !inquiryForm.email.trim()) {
      Swal.fire('Error', 'Name and Email are required', 'error');
      return;
    }

    setSubmitting(true);
    const refNumber = `EDU-INQ-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      ...inquiryForm,
      id: refNumber,
      specialty: inquiryForm.specialty || currentSection?.title || 'Academic Program',
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'New'
    };

    try {
      await submitDnbInquiry(payload);
      setIsInquiryModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Inquiry Submitted!',
        html: `
          <p>Thank you, <strong>${inquiryForm.candidateName}</strong>! Your inquiry for <strong>${payload.specialty}</strong> has been logged in our academic database.</p>
          <p style="margin-top: 8px; color: #1e3a8a; font-weight: bold;">Reference ID: ${refNumber}</p>
        `,
        confirmButtonColor: '#ea580c'
      });
      setInquiryForm({ candidateName: '', email: '', phone: '', specialty: '', neetScore: '', message: '' });
    } catch (err) {
      Swal.fire('Error', 'Could not submit inquiry', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="edu-page-wrapper">
      <Navbar solid={true} onOpenAppointment={() => setIsAppointmentModalOpen(true)} />

      {/* Breadcrumb Bar */}
      <div className="edu-breadcrumb-bar">
        <div className="edu-breadcrumb-container">
          <nav className="edu-breadcrumbs">
            <Link to="/" className="edu-breadcrumb-link">Home</Link>
            <span className="edu-breadcrumb-separator">/</span>
            <Link to="/education/dnb-program" className="edu-breadcrumb-link">Education &amp; Medical Research</Link>
            <span className="edu-breadcrumb-separator">/</span>
            <span className="edu-breadcrumb-current">{currentSection?.title || 'Program Overview'}</span>
          </nav>

          <button onClick={handleShare} className="edu-share-btn" title="Share Page">
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Education Navigation Tabs */}
      <div className="edu-nav-tabs-bar">
        <div className="edu-nav-tabs-container">
          <Link
            to="/education/dnb-program"
            className="edu-nav-tab"
          >
            DNB Program
          </Link>
          <Link
            to="/education/nursing-program"
            className={`edu-nav-tab ${pathSegment === 'nursing-program' || pathSegment === 'nursing' ? 'active' : ''}`}
          >
            Nursing School
          </Link>
          <Link
            to="/education/cme"
            className={`edu-nav-tab ${pathSegment === 'cme' ? 'active' : ''}`}
          >
            CME
          </Link>
          <Link
            to="/education/cne"
            className={`edu-nav-tab ${pathSegment === 'cne' ? 'active' : ''}`}
          >
            CNE
          </Link>
          <Link
            to="/education/spiritual-care-course"
            className={`edu-nav-tab ${pathSegment === 'spiritual-care-course' || pathSegment === 'spiritual-care' ? 'active' : ''}`}
          >
            Spiritual Care
          </Link>
          <Link
            to="/education/clinical-research-course"
            className={`edu-nav-tab ${pathSegment === 'clinical-research-course' || pathSegment === 'pgcr' ? 'active' : ''}`}
          >
            Clinical Research (PGCR)
          </Link>
          <Link
            to="/education/clinical-trials"
            className={`edu-nav-tab ${pathSegment === 'clinical-trials' ? 'active' : ''}`}
          >
            Clinical Trials
          </Link>
          <Link
            to="/education/ethics-committee"
            className={`edu-nav-tab ${pathSegment === 'ethics-committee' ? 'active' : ''}`}
          >
            Ethics Committee
          </Link>
          <Link
            to="/education/publications"
            className={`edu-nav-tab ${pathSegment === 'publications' ? 'active' : ''}`}
          >
            Publications
          </Link>
          <Link
            to="/education/government-accreditation"
            className={`edu-nav-tab ${pathSegment === 'government-accreditation' ? 'active' : ''}`}
          >
            Accreditations
          </Link>
          {allCustomPrograms.map((p) => (
            <Link
              key={p.id || p.slug}
              to={`/education/${p.slug}`}
              className={`edu-nav-tab ${pathSegment === p.slug ? 'active' : ''}`}
            >
              {p.title}
            </Link>
          ))}
        </div>
      </div>

      {shareFeedback && <div className="edu-share-toast">Page link copied to clipboard!</div>}

      {/* Main Content Area */}
      <main className="edu-main-container">
        {/* Section Header Card */}
        <section className="edu-hero-card">
          {currentSection?.badge && (
            <span className="edu-badge-pill">
              <ShieldCheck size={14} />
              {currentSection.badge}
            </span>
          )}
          <h1 className="edu-hero-title">
            {currentSection?.title || 'Academic Program'}
          </h1>
          {currentSection?.subtitle && (
            <p className="edu-hero-subtitle">
              {currentSection.subtitle}
            </p>
          )}
          <p className="edu-hero-desc">
            {currentSection?.overview || 'Comprehensive clinical training and medical education program at Bhaktivedanta Hospital & Research Institute.'}
          </p>
          <div className="edu-hero-actions">
            <button
              onClick={() => {
                setInquiryForm((prev) => ({ ...prev, specialty: currentSection?.title || '' }));
                setIsInquiryModalOpen(true);
              }}
              className="edu-btn-primary"
            >
              Apply / Course Inquiry
            </button>
            <Link
              to="/education/dnb-program"
              className="edu-btn-secondary"
            >
              View DNB Residency
            </Link>
          </div>
        </section>

        {/* 1. NURSING PROGRAM VIEW */}
        {sectionKey === 'nursingProgram' && currentSection && (
          <>
            {/* Quick Facts */}
            <div className="edu-stats-grid">
              <div className="edu-stat-card">
                <span className="edu-stat-label">Established</span>
                <div className="edu-stat-val">{currentSection.established || '2005'}</div>
                <span className="edu-stat-sub">20+ Years Excellence</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Annual Intake</span>
                <div className="edu-stat-val">{currentSection.intakeSeats || 30} Seats</div>
                <span className="edu-stat-sub">Recognized by MNC &amp; INC</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Course Duration</span>
                <div className="edu-stat-val">{currentSection.duration || '3 Years'}</div>
                <span className="edu-stat-sub">Full Time Diploma</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Clinical Bed Strength</span>
                <div className="edu-stat-val">100+ Beds</div>
                <span className="edu-stat-sub">Direct In-Hospital Rotations</span>
              </div>
            </div>

            {/* Courses Offered */}
            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <GraduationCap size={22} />
                  Nursing Courses &amp; Diplomas Offered
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.courses || []).map((c, idx) => (
                  <div key={idx} className="edu-item-box">
                    <div className="edu-item-top">
                      <div className="edu-item-header">
                        <h3 className="edu-item-title">{c.name}</h3>
                        <span className="edu-item-tag">{c.duration} • {c.seats} Seats</span>
                      </div>
                      <p className="edu-item-desc">{c.description}</p>
                    </div>
                    <div className="edu-item-meta">
                      <strong>Eligibility:</strong> {c.eligibility}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Training Features */}
            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <Award size={22} />
                  Clinical Training Infrastructure &amp; Highlights
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.keyFeatures || []).map((f, idx) => (
                  <div key={idx} className="edu-item-box">
                    <div className="edu-item-top">
                      <h4 className="edu-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                        {f.title}
                      </h4>
                      <p className="edu-item-desc">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact & Campus Info */}
            {currentSection.contactInfo && (
              <div className="edu-contact-strip">
                <span className="edu-contact-title">
                  School of Nursing Campus &amp; Admission Office
                </span>
                <div className="edu-contact-grid">
                  <div className="edu-contact-item">
                    <MapPin size={16} />
                    <span>{currentSection.contactInfo.campus}</span>
                  </div>
                  <div className="edu-contact-item">
                    <PhoneCall size={16} />
                    <span>{currentSection.contactInfo.phone}</span>
                  </div>
                  <div className="edu-contact-item">
                    <Mail size={16} />
                    <span>{currentSection.contactInfo.email}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 2. CME VIEW */}
        {sectionKey === 'cmeProgram' && currentSection && (
          <div className="edu-content-card">
            <div className="edu-card-header">
              <h2 className="edu-card-title">
                <Calendar size={22} />
                Accredited Continuing Medical Education Conferences
              </h2>
              {currentSection.accreditationBadge && (
                <span className="edu-badge-blue">{currentSection.accreditationBadge}</span>
              )}
            </div>

            <div className="edu-table-responsive">
              <table className="edu-table">
                <thead>
                  <tr>
                    <th>Conference Topic / CME Title</th>
                    <th>Schedule Date</th>
                    <th style={{ textAlign: 'center' }}>Credit Points</th>
                    <th>Key Faculty / Department</th>
                  </tr>
                </thead>
                <tbody>
                  {(currentSection.upcomingAndRecent || []).map((cme, idx) => (
                    <tr key={idx}>
                      <td className="strong">{cme.topic}</td>
                      <td>{cme.date}</td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="edu-badge-blue">
                          {cme.creditHours}
                        </span>
                      </td>
                      <td>{cme.faculty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. CNE VIEW */}
        {sectionKey === 'cneProgram' && currentSection && (
          <div className="edu-content-card">
            <div className="edu-card-header">
              <h2 className="edu-card-title">
                <BookOpen size={22} />
                CNE Training Focus Areas &amp; Clinical Competencies
              </h2>
            </div>
            <div className="edu-items-grid">
              {(currentSection.focusAreas || []).map((fa, idx) => (
                <div key={idx} className="edu-item-box">
                  <div className="edu-item-top">
                    <h3 className="edu-item-title">{fa.title}</h3>
                    <p className="edu-item-desc">{fa.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SPIRITUAL CARE COURSE */}
        {sectionKey === 'spiritualCareCourse' && currentSection && (
          <>
            {currentSection.quote && (
              <div className="edu-quote-banner">
                <p className="edu-quote-text">
                  "{currentSection.quote}"
                </p>
              </div>
            )}

            <div className="edu-stats-grid">
              <div className="edu-stat-card">
                <span className="edu-stat-label">Introduced</span>
                <div className="edu-stat-val">{currentSection.introducedYear || '2010'}</div>
                <span className="edu-stat-sub">14+ Years of Spiritual Medicine</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Program Duration</span>
                <div className="edu-stat-val">6 Months</div>
                <span className="edu-stat-sub">Hybrid &amp; Practical Mentorship</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Pedagogy</span>
                <div className="edu-stat-val">Bedside &amp; Theory</div>
                <span className="edu-stat-sub">Experiential Patient Care</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Certification</span>
                <div className="edu-stat-val">Accredited</div>
                <span className="edu-stat-sub">Bhaktivedanta Institute</span>
              </div>
            </div>

            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <HeartHandshake size={22} />
                  Four Core Dimensions of Holistic Spiritual Care
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.dimensions || []).map((d, idx) => (
                  <div key={idx} className="edu-item-box">
                    <div className="edu-item-top">
                      <span className="edu-item-tag" style={{ alignSelf: 'flex-start' }}>
                        Dimension 0{idx + 1}
                      </span>
                      <h4 className="edu-item-title" style={{ marginTop: '0.4rem' }}>{d.title}</h4>
                      <p className="edu-item-desc">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {currentSection.eligibility && (
                <div className="edu-info-box">
                  <strong>Course Eligibility:</strong>
                  <span>{currentSection.eligibility}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* 5. CLINICAL RESEARCH COURSE (PGCR) */}
        {sectionKey === 'clinicalResearchCourse' && currentSection && (
          <>
            <div className="edu-stats-grid">
              <div className="edu-stat-card">
                <span className="edu-stat-label">Course Duration</span>
                <div className="edu-stat-val">{currentSection.duration}</div>
                <span className="edu-stat-sub">Comprehensive Program</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Admissions Cycle</span>
                <div className="edu-stat-val" style={{ color: '#ea580c' }}>{currentSection.admissionsOpen}</div>
                <span className="edu-stat-sub">Annual Academic Intake</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Internship</span>
                <div className="edu-stat-val" style={{ color: '#16a34a' }}>Live Hospital Trials</div>
                <span className="edu-stat-sub">Guaranteed 6-Month Rotations</span>
              </div>
            </div>

            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <BookOpen size={22} />
                  Structured Academic Modules &amp; Curriculum
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.modules || []).map((m) => (
                  <div key={m.moduleNo} className="edu-item-box">
                    <div className="edu-item-top">
                      <span className="edu-item-tag" style={{ alignSelf: 'flex-start' }}>
                        Module {m.moduleNo}
                      </span>
                      <h4 className="edu-item-title" style={{ marginTop: '0.4rem' }}>{m.title}</h4>
                      <p className="edu-item-desc">{m.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {currentSection.eligibility && (
                <div className="edu-info-box">
                  <strong>Program Eligibility:</strong>
                  <span>{currentSection.eligibility}</span>
                </div>
              )}

              {currentSection.placementSupport && (
                <div className="edu-info-box-orange">
                  <strong>Placement Assistance:</strong>
                  <span>{currentSection.placementSupport}</span>
                </div>
              )}
            </div>
          </>
        )}

        {/* 6. CLINICAL TRIALS */}
        {sectionKey === 'clinicalTrials' && currentSection && (
          <>
            <div className="edu-stats-grid">
              <div className="edu-stat-card">
                <span className="edu-stat-label">Experience</span>
                <div className="edu-stat-val">Since 2013</div>
                <span className="edu-stat-sub">10+ Years Excellence</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Accreditation</span>
                <div className="edu-stat-val" style={{ color: '#1c5296' }}>NABH Accredited</div>
                <span className="edu-stat-sub">1st in Maharashtra</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">GCP Investigators</span>
                <div className="edu-stat-val">25+ PIs</div>
                <span className="edu-stat-sub">Certified Clinicians</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Audits Track Record</span>
                <div className="edu-stat-val" style={{ color: '#16a34a' }}>Zero 483 / Warning</div>
                <span className="edu-stat-sub">100% Compliant</span>
              </div>
            </div>

            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <Building2 size={22} />
                  GCP-Compliant Infrastructure &amp; Dedicated Facilities
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.infrastructure || []).map((inf, idx) => (
                  <div key={idx} className="edu-item-box">
                    <div className="edu-item-top">
                      <h4 className="edu-item-title">{inf.facility}</h4>
                      <p className="edu-item-desc">{inf.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentSection.therapeuticAreas && (
              <div className="edu-content-card">
                <div className="edu-card-header">
                  <h2 className="edu-card-title">
                    <FlaskConical size={22} />
                    Therapeutic Specialties &amp; Clinical Trial Experience
                  </h2>
                </div>
                <div className="edu-tag-list">
                  {currentSection.therapeuticAreas.map((area, idx) => (
                    <span key={idx} className="edu-tag-pill">{area}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 7. ETHICS COMMITTEES */}
        {sectionKey === 'ethicsCommittee' && currentSection && (
          <>
            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <ShieldCheck size={22} />
                  Statutory Ethics Committees
                </h2>
              </div>
              <div className="edu-items-grid">
                {(currentSection.committees || []).map((comm) => (
                  <div key={comm.id} className="edu-item-box">
                    <div className="edu-item-top">
                      <h3 className="edu-item-title">{comm.name}</h3>
                      <span className="edu-stat-sub" style={{ fontWeight: 600 }}>{comm.regAuthority}</span>
                      <div className="edu-reg-box" style={{ marginTop: '0.4rem' }}>
                        <strong>Registration No:</strong> {comm.regNumber}
                      </div>
                      <p className="edu-item-desc" style={{ marginTop: '0.5rem' }}>{comm.mandate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {currentSection.guidingPrinciples && (
              <div className="edu-content-card">
                <div className="edu-card-header">
                  <h2 className="edu-card-title">
                    <Award size={22} />
                    Guiding Ethical Principles &amp; Directives
                  </h2>
                </div>
                <ul className="edu-list-simple">
                  {currentSection.guidingPrinciples.map((gp, idx) => (
                    <li key={idx} className="edu-list-item">
                      <CheckCircle2 size={16} />
                      <span>{gp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ethics Committee Members from DNB program state */}
            {eduState?.research?.ethicsCommittee && (
              <div className="edu-content-card">
                <div className="edu-card-header">
                  <h2 className="edu-card-title">
                    <Users size={22} />
                    Current Committee Member Roster
                  </h2>
                </div>
                <div className="edu-table-responsive">
                  <table className="edu-table">
                    <thead>
                      <tr>
                        <th style={{ width: '60px' }}>Sr</th>
                        <th>Member Name</th>
                        <th>Qualification</th>
                        <th>Role / Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eduState.research.ethicsCommittee.map((m) => (
                        <tr key={m.sr}>
                          <td className="strong">{m.sr}</td>
                          <td className="strong">{m.name}</td>
                          <td>{m.qualification}</td>
                          <td>
                            <span className="edu-badge-blue">{m.role}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* 8. PUBLICATIONS VIEW */}
        {sectionKey === 'publications' && (
          <div className="edu-content-card">
            <div className="edu-card-header">
              <h2 className="edu-card-title">
                <FileText size={22} />
                Indexed Clinical Publications &amp; Theses ({eduState?.research?.publications?.length || 0})
              </h2>
            </div>
            <div className="edu-table-responsive">
              <table className="edu-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Sr</th>
                    <th>Authors</th>
                    <th>Title</th>
                    <th style={{ width: '90px' }}>Year</th>
                    <th>Journal / Citation</th>
                  </tr>
                </thead>
                <tbody>
                  {(eduState?.research?.publications || []).map((pub) => (
                    <tr key={pub.sr}>
                      <td className="strong">{pub.sr}</td>
                      <td style={{ color: '#475569' }}>{pub.citation}</td>
                      <td className="strong">{pub.title}</td>
                      <td>{pub.year}</td>
                      <td>
                        <span className="edu-badge-blue">{pub.journal}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. GOVERNMENT ACCREDITATION VIEW */}
        {sectionKey === 'governmentAccreditation' && currentSection && (
          <div className="edu-content-card">
            <div className="edu-card-header">
              <h2 className="edu-card-title">
                <Award size={22} />
                Statutory Approvals, Registrations &amp; Accreditations
              </h2>
            </div>
            <div className="edu-items-grid">
              {(currentSection.badges || []).map((b, idx) => (
                <div key={idx} className="edu-item-box">
                  <div className="edu-item-top">
                    <span className="edu-badge-blue" style={{ alignSelf: 'flex-start' }}>
                      {b.authority}
                    </span>
                    <h4 className="edu-item-title" style={{ marginTop: '0.4rem' }}>{b.title}</h4>
                    <p className="edu-item-desc">{b.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. CUSTOM DYNAMIC PROGRAM VIEW */}
        {isCustomProgram && currentSection && (
          <>
            {/* Quick Metrics Grid */}
            <div className="edu-stats-grid">
              <div className="edu-stat-card">
                <span className="edu-stat-label">Program Duration</span>
                <div className="edu-stat-val" style={{ fontSize: '1.25rem' }}>{currentSection.duration || '1 Year'}</div>
                <span className="edu-stat-sub">Academic Schedule</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Intake Seats</span>
                <div className="edu-stat-val" style={{ color: '#ea580c', fontSize: '1.25rem' }}>
                  {currentSection.seats ? `${currentSection.seats} Seats` : 'Contact Office'}
                </div>
                <span className="edu-stat-sub">Annual Admissions</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Academic Category</span>
                <div className="edu-stat-val" style={{ color: '#1c5296', fontSize: '1rem', textTransform: 'none' }}>
                  {currentSection.category || 'Academic Program'}
                </div>
                <span className="edu-stat-sub">Specialty Training</span>
              </div>
              <div className="edu-stat-card">
                <span className="edu-stat-label">Accreditation Status</span>
                <div className="edu-stat-val" style={{ color: '#16a34a', fontSize: '1rem', textTransform: 'none' }}>
                  {currentSection.badge || 'Approved'}
                </div>
                <span className="edu-stat-sub">Statutory Recognition</span>
              </div>
            </div>

            {/* Eligibility Box */}
            {currentSection.eligibility && (
              <div className="edu-info-box-orange">
                <div className="edu-info-header">
                  <CheckCircle2 size={18} />
                  <span>Candidate Eligibility &amp; Admission Criteria</span>
                </div>
                <p className="edu-info-text">{currentSection.eligibility}</p>
              </div>
            )}

            {/* Department Overview */}
            <div className="edu-content-card">
              <div className="edu-card-header">
                <h2 className="edu-card-title">
                  <BookOpen size={22} />
                  Program Overview &amp; Clinical Curriculum
                </h2>
              </div>
              <p className="edu-hero-desc" style={{ padding: '0 0.5rem', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                {currentSection.overview}
              </p>
            </div>

            {/* Key Training Highlights */}
            {Array.isArray(currentSection.highlights) && currentSection.highlights.length > 0 && (
              <div className="edu-content-card">
                <div className="edu-card-header">
                  <h2 className="edu-card-title">
                    <Award size={22} />
                    Core Highlights &amp; Clinical Rotations
                  </h2>
                </div>
                <div className="edu-items-grid">
                  {currentSection.highlights.map((h, idx) => (
                    <div key={idx} className="edu-item-box">
                      <div className="edu-item-top">
                        <h4 className="edu-item-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle2 size={16} style={{ color: '#16a34a', flexShrink: 0 }} />
                          {typeof h === 'string' ? h : (h.title || 'Highlight')}
                        </h4>
                        {typeof h === 'object' && h.desc && <p className="edu-item-desc">{h.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Strip */}
            {currentSection.contactInfo && (
              <div className="edu-contact-strip">
                <span className="edu-contact-title">
                  Department Secretariat &amp; Admissions Office
                </span>
                <div className="edu-contact-grid">
                  <div className="edu-contact-item">
                    <MapPin size={16} />
                    <span>{currentSection.contactInfo.campus || 'Bhaktivedanta Hospital Campus, Mira Road'}</span>
                  </div>
                  <div className="edu-contact-item">
                    <PhoneCall size={16} />
                    <span>{currentSection.contactInfo.phone || '022 2845 8000'}</span>
                  </div>
                  <div className="edu-contact-item">
                    <Mail size={16} />
                    <span>{currentSection.contactInfo.email || 'education@bhaktivedantahospital.com'}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Unified Call to Action Banner */}
        <section className="edu-cta-banner">
          <div>
            <h3 className="edu-cta-title">Interested in Our Academic &amp; Research Programs?</h3>
            <p className="edu-cta-desc">
              Submit your inquiry or contact the Academic Medicine &amp; Research Secretariat.
            </p>
          </div>
          <button
            onClick={() => {
              setInquiryForm((prev) => ({ ...prev, specialty: currentSection?.title || '' }));
              setIsInquiryModalOpen(true);
            }}
            className="edu-cta-btn"
          >
            Submit Program Inquiry
          </button>
        </section>
      </main>

      {/* Inquiry Modal */}
      {isInquiryModalOpen && (
        <div className="edu-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsInquiryModalOpen(false); }}>
          <div className="edu-modal-box">
            <div className="edu-modal-header">
              <h3 className="edu-modal-title">
                Course Inquiry — {currentSection?.title || 'Academic Program'}
              </h3>
              <button onClick={() => setIsInquiryModalOpen(false)} className="edu-modal-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit}>
              <div className="edu-form-group">
                <label className="edu-form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. / Nurse Name"
                  value={inquiryForm.candidateName}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, candidateName: e.target.value })}
                  className="edu-form-input"
                />
              </div>

              <div className="edu-form-row">
                <div className="edu-form-group">
                  <label className="edu-form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="edu-form-input"
                  />
                </div>
                <div className="edu-form-group">
                  <label className="edu-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="edu-form-input"
                  />
                </div>
              </div>

              <div className="edu-form-group">
                <label className="edu-form-label">Program / Course</label>
                <input
                  type="text"
                  readOnly
                  value={inquiryForm.specialty || currentSection?.title || ''}
                  className="edu-form-input"
                  style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#475569' }}
                />
              </div>

              <div className="edu-form-group">
                <label className="edu-form-label">Message / Query</label>
                <textarea
                  rows="3"
                  placeholder="Ask about batch timings, eligibility, syllabus or fees..."
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  className="edu-form-textarea"
                ></textarea>
              </div>

              <div className="edu-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsInquiryModalOpen(false)}
                  className="edu-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="edu-btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </div>
  );
};

export default EducationSectionPage;
