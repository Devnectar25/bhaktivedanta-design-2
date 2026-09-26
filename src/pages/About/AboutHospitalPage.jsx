import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Building2,
  Calendar,
  UserCheck,
  Sparkles,
  Award,
  Share2,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Clock,
  BookOpen,
  Utensils,
  Layers,
  Target,
  Trophy,
  Newspaper
} from 'lucide-react';
import AppointmentModal from '../../components/AppointmentModal/AppointmentModal';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './AboutHospitalPage.css';

const LotusWatermark = () => (
  <svg
    viewBox="0 0 120 120"
    className="about-vmv-watermark"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="25" y="25" width="70" height="70" stroke="#c2410c" strokeWidth="1" strokeOpacity="0.18" fill="none" rx="6" />
    <rect x="25" y="25" width="70" height="70" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.18" fill="none" rx="6" transform="rotate(45 60 60)" />
    <circle cx="60" cy="60" r="42" stroke="#ea580c" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="3 2" />
    <path
      d="M60 28 C52 42 46 52 60 76 C74 52 68 42 60 28 Z"
      stroke="#c2410c"
      strokeWidth="1.2"
      strokeOpacity="0.28"
      fill="#f97316"
      fillOpacity="0.04"
    />
    <path
      d="M42 40 C38 52 44 64 60 76 C50 64 46 52 42 40 Z"
      stroke="#c2410c"
      strokeWidth="1.1"
      strokeOpacity="0.25"
      fill="#f97316"
      fillOpacity="0.03"
    />
    <path
      d="M78 40 C82 52 76 64 60 76 C70 64 74 52 78 40 Z"
      stroke="#c2410c"
      strokeWidth="1.1"
      strokeOpacity="0.25"
      fill="#f97316"
      fillOpacity="0.03"
    />
    <path
      d="M28 54 C32 64 44 72 60 76 C44 72 32 64 28 54 Z"
      stroke="#c2410c"
      strokeWidth="1"
      strokeOpacity="0.22"
      fill="#f97316"
      fillOpacity="0.02"
    />
    <path
      d="M92 54 C88 64 76 72 60 76 C76 72 88 64 92 54 Z"
      stroke="#c2410c"
      strokeWidth="1"
      strokeOpacity="0.22"
      fill="#f97316"
      fillOpacity="0.02"
    />
    <path
      d="M36 82 C44 88 76 88 84 82"
      stroke="#ea580c"
      strokeWidth="1.2"
      strokeOpacity="0.25"
      strokeLinecap="round"
    />
  </svg>
);

const TAB_TITLES = {
  about: 'About Hospital',
  'vision-mission': 'Vision, Mission & Values',
  awards: 'Awards & Accreditation',
  events: 'Events & Hospital In News',
  history: 'History of Hospital',
  chairman: "Chairman's Message",
  inspiration: 'Our Inspiration',
  logo: 'Hospital Logo & Symbolism',
  all: 'All Sections'
};

const AboutHospitalPage = () => {
  const location = useLocation();
  const [aboutData, setAboutData] = useState(defaultAboutUsData);
  const [activeSection, setActiveSection] = useState('about');
  const [eventsSubTab, setEventsSubTab] = useState('events'); // 'events' | 'news'
  const [shareFeedback, setShareFeedback] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // Card Read More / Read Less toggles
  const [expandedVision, setExpandedVision] = useState(false);
  const [expandedQuality, setExpandedQuality] = useState(false);
  const [expandedValues, setExpandedValues] = useState(false);

  // History timeline pagination (10 items per page)
  const [historyPage, setHistoryPage] = useState(1);
  const historyPerPage = 10;

  useEffect(() => {
    loadData();

    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  // Listen to URL hash change (#vision-mission, #awards, #events, #hospital-in-news, #history, #chairman, #inspiration, #logo, #about)
  useEffect(() => {
    const hash = (location.hash || '').replace('#', '').toLowerCase();
    if (hash === 'awards-accreditation' || hash === 'awards') {
      setActiveSection('awards');
    } else if (hash === 'events' || hash === 'events-news') {
      setActiveSection('events');
      setEventsSubTab('events');
    } else if (hash === 'hospital-in-news' || hash === 'news') {
      setActiveSection('events');
      setEventsSubTab('news');
    } else if (hash && (['about', 'vision-mission', 'awards', 'events', 'history', 'chairman', 'inspiration', 'logo', 'all'].includes(hash) || hash.startsWith('custom_') || hash.startsWith('custom-'))) {
      setActiveSection(hash);
    } else {
      setActiveSection('about');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.hash]);

  const loadData = async () => {
    try {
      const raw = await getAboutUsState(defaultAboutUsData);
      const data = (raw && raw.data && (raw.data.aboutHospital || raw.data.visionMissionValues))
        ? raw.data
        : raw;
      if (data && typeof data === 'object') {
        setAboutData(data);
      }
    } catch (err) {
      console.warn('Could not load About Us state:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${TAB_TITLES[activeSection] || 'About Us'} | Bhaktivedanta Hospital`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const handleTabClick = (tabKey) => {
    setActiveSection(tabKey);
    window.location.hash = tabKey;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { aboutHospital, history, chairmansMessage, ourInspiration, logo, visionMissionValues, awardsAccreditation, eventsAndNews } = aboutData;
  const vmv = visionMissionValues || defaultAboutUsData.visionMissionValues;
  const awardsData = awardsAccreditation || defaultAboutUsData.awardsAccreditation;
  const eventsNewsData = eventsAndNews || defaultAboutUsData.eventsAndNews;

  return (
    <div className="about-page-wrapper">
      {shareFeedback && <div className="about-share-toast">Page link copied to clipboard!</div>}

      {/* Horizontal Sub-Navigation Tabs Bar */}
      <div className="about-nav-tabs-bar">
        <div className="about-nav-tabs-container">
          <button
            type="button"
            onClick={() => handleTabClick('about')}
            className={`about-nav-tab ${activeSection === 'about' ? 'active' : ''}`}
          >
            About Hospital
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('vision-mission')}
            className={`about-nav-tab ${activeSection === 'vision-mission' ? 'active' : ''}`}
          >
            Vision, Mission &amp; Values
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('awards')}
            className={`about-nav-tab ${activeSection === 'awards' ? 'active' : ''}`}
          >
            Awards &amp; Accreditation
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('events')}
            className={`about-nav-tab ${activeSection === 'events' ? 'active' : ''}`}
          >
            Events &amp; News
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('history')}
            className={`about-nav-tab ${activeSection === 'history' ? 'active' : ''}`}
          >
            History of Hospital
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('chairman')}
            className={`about-nav-tab ${activeSection === 'chairman' ? 'active' : ''}`}
          >
            Chairman's Message
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('inspiration')}
            className={`about-nav-tab ${activeSection === 'inspiration' ? 'active' : ''}`}
          >
            Our Inspiration
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('logo')}
            className={`about-nav-tab ${activeSection === 'logo' ? 'active' : ''}`}
          >
            Hospital Logo
          </button>
          {(aboutData.customSections || []).map((sec) => {
            const secKey = sec.id?.startsWith('custom_') ? sec.id : `custom_${sec.id}`;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleTabClick(secKey)}
                className={`about-nav-tab ${activeSection === secKey ? 'active' : ''}`}
              >
                {sec.title}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleTabClick('all')}
            className={`about-nav-tab ${activeSection === 'all' ? 'active' : ''}`}
          >
            View All
          </button>
        </div>
      </div>

      <main className="about-main-container">
        {/* SECTION 1: ABOUT HOSPITAL (Active on 'about' or 'all') */}
        {(activeSection === 'about' || activeSection === 'all') && (
          <section id="about" className="about-section-block">
            <div className="about-hero-card">
              {aboutHospital?.badge && (
                <span className="about-badge-pill">
                  <ShieldCheck size={15} />
                  {aboutHospital.badge}
                </span>
              )}
              <h1 className="about-hero-title">{aboutHospital?.title || 'Bhaktivedanta Hospital & Research Institute'}</h1>
              {aboutHospital?.tagline && (
                <p className="about-hero-tagline">{aboutHospital.tagline}</p>
              )}
              <p className="about-hero-intro">{aboutHospital?.heroIntro}</p>

              <div className="about-paragraphs-list">
                {(aboutHospital?.descriptionParagraphs || []).map((para, pIdx) => (
                  <p key={pIdx} className="about-desc-para">{para}</p>
                ))}
              </div>

              {/* Quick Stats Grid */}
              <div className="about-stats-grid">
                {(aboutHospital?.stats || []).map((stat, sIdx) => (
                  <div key={sIdx} className="about-stat-card">
                    <div className="about-stat-value">{stat.value}</div>
                    <div className="about-stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Highlights & Features */}
            <div className="about-features-container">
              <h2 className="about-block-heading">
                <HeartHandshake size={22} className="about-heading-icon" />
                Our Core Commitments to Patient Well-Being
              </h2>
              <div className="about-features-grid">
                {(aboutHospital?.features || []).map((feat, fIdx) => (
                  <div key={fIdx} className="about-feature-box">
                    <div className="about-feature-indicator"></div>
                    <h3 className="about-feature-title">{feat.title}</h3>
                    <p className="about-feature-desc">{feat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: VISION, MISSION, QUALITY POLICY & VALUES (Active on 'vision-mission' or 'all') */}
        {(activeSection === 'vision-mission' || activeSection === 'all') && (
          <section id="vision-mission" className="about-section-block">
            {activeSection === 'all' && (
              <div className="about-block-header">
                <span className="about-section-pretitle">Guiding Philosophy</span>
                <h2 className="about-block-heading">
                  <Target size={22} className="about-heading-icon" />
                  {vmv?.title || 'Vision, Mission, Quality Policy & Values'}
                </h2>
                {vmv?.subtitle && <p className="about-block-subtext">{vmv.subtitle}</p>}
              </div>
            )}

            <div className="about-vmv-container">
              {/* Top Row: 3 Equal Cards */}
              <div className="about-vmv-top-grid">
                {/* 1. Our Vision */}
                <div className="about-vmv-card">
                  <h3 className="about-vmv-heading">{vmv?.vision?.title || 'Our Vision'}</h3>
                  <ul className="about-vmv-bullets">
                    {(vmv?.vision?.points || [])
                      .slice(0, expandedVision ? vmv.vision.points.length : 3)
                      .map((pt, pIdx) => (
                        <li key={pIdx} className="about-vmv-bullet-item">
                          <span className="about-vmv-bullet-dot">•</span>
                          <span className="about-vmv-bullet-text">{pt}</span>
                        </li>
                      ))}
                  </ul>
                  {(vmv?.vision?.points?.length || 0) > 3 && (
                    <button
                      type="button"
                      onClick={() => setExpandedVision(!expandedVision)}
                      className="about-vmv-readmore-btn"
                    >
                      {expandedVision ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                  <LotusWatermark />
                </div>

                {/* 2. Our Mission */}
                <div className="about-vmv-card about-vmv-mission-card">
                  <h3 className="about-vmv-heading">{vmv?.mission?.title || 'Our Mission'}</h3>
                  <p className="about-vmv-mission-quote">
                    "{vmv?.mission?.statement}"
                  </p>
                  <LotusWatermark />
                </div>

                {/* 3. Quality Policy */}
                <div className="about-vmv-card">
                  <h3 className="about-vmv-heading">{vmv?.qualityPolicy?.title || 'Quality Policy'}</h3>
                  <p className="about-vmv-policy-text">
                    {vmv?.qualityPolicy?.intro}
                    {expandedQuality && (
                      <span className="about-vmv-policy-expanded"> {vmv?.qualityPolicy?.fullText}</span>
                    )}
                  </p>
                  {vmv?.qualityPolicy?.fullText && (
                    <button
                      type="button"
                      onClick={() => setExpandedQuality(!expandedQuality)}
                      className="about-vmv-readmore-btn"
                    >
                      {expandedQuality ? 'Read Less' : 'Read More'}
                    </button>
                  )}
                  <LotusWatermark />
                </div>
              </div>

              {/* Bottom Row: 1 Full-Width Card (Our Values) */}
              <div className="about-vmv-card about-vmv-values-card">
                <h3 className="about-vmv-heading">{vmv?.values?.title || 'Our Values'}</h3>
                <p className="about-vmv-values-intro">
                  {vmv?.values?.intro}
                  {expandedValues && (
                    <span className="about-vmv-values-expanded">
                      {' '}
                      {vmv?.values?.fullText?.split('\n\n')?.map((para, idx) => (
                        <span key={idx} className="about-vmv-expanded-para">
                          {para}
                        </span>
                      ))}
                    </span>
                  )}
                </p>

                {expandedValues && vmv?.values?.pillars && vmv.values.pillars.length > 0 && (
                  <div className="about-vmv-pillars-grid">
                    {vmv.values.pillars.map((pillar, pIdx) => (
                      <div key={pIdx} className="about-vmv-pillar-badge">
                        <span className="about-vmv-pillar-icon">✦</span>
                        <span className="about-vmv-pillar-title">{pillar}</span>
                      </div>
                    ))}
                  </div>
                )}

                {vmv?.values?.fullText && (
                  <button
                    type="button"
                    onClick={() => setExpandedValues(!expandedValues)}
                    className="about-vmv-readmore-btn"
                  >
                    {expandedValues ? 'Read Less' : 'Read More'}
                  </button>
                )}
                <LotusWatermark />
              </div>
            </div>
          </section>
        )}

        {/* SECTION: AWARDS & ACCREDITATION (Active on 'awards' or 'all') */}
        {(activeSection === 'awards' || activeSection === 'all') && (
          <section id="awards" className="about-section-block">
            <div className="about-awards-header">
              <h2 className="about-awards-main-title">
                {awardsData?.title || 'Awards & Accreditation'}
              </h2>
            </div>

            {/* Accreditation Block */}
            <div className="about-accreditation-block">
              <h3 className="about-awards-subheading">
                {awardsData?.accreditation?.heading || 'Accreditation'}
              </h3>
              <p className="about-accreditation-text">
                {awardsData?.accreditation?.description}
              </p>
            </div>

            {/* Awards & Recognition Block */}
            <div className="about-awards-gallery-block">
              <h3 className="about-awards-subheading">
                {awardsData?.awards?.heading || 'Awards & Recognition'}
              </h3>

              <div className="about-awards-grid">
                {(awardsData?.awards?.items || []).map((item, idx) => (
                  <div key={item.id || idx} className="about-award-card">
                    <div
                      className="about-award-card-image"
                      style={{ backgroundImage: `url('${item.imageUrl}')` }}
                    />
                    <div className="about-award-card-overlay">
                      <h4 className="about-award-card-title">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION: EVENTS & HOSPITAL IN NEWS (Active on 'events' or 'all') */}
        {(activeSection === 'events' || activeSection === 'all') && (
          <section id="events" className="about-section-block about-events-section-block">
            {/* Sub-tab Navigation (Events | Hospital In News) matching Screenshots */}
            <div className="about-events-subtab-bar">
              <button
                type="button"
                onClick={() => setEventsSubTab('events')}
                className={`about-events-subtab-btn ${eventsSubTab === 'events' ? 'active' : ''}`}
              >
                Events
              </button>
              <button
                type="button"
                onClick={() => setEventsSubTab('news')}
                className={`about-events-subtab-btn ${eventsSubTab === 'news' ? 'active' : ''}`}
              >
                Hospital In News
              </button>
            </div>

            {/* TAB 1: EVENTS LIST */}
            {eventsSubTab === 'events' && (
              <div className="about-events-list">
                {(eventsNewsData?.events || []).map((ev, idx) => (
                  <div key={ev.id || idx} className="about-event-row-card">
                    <div className="about-event-thumb-wrap">
                      <img
                        src={ev.imageUrl}
                        alt={ev.title}
                        className="about-event-thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80';
                        }}
                      />
                    </div>
                    <div className="about-event-content">
                      <h3 className="about-event-title">
                        {ev.link ? (
                          <a href={ev.link} target="_blank" rel="noopener noreferrer">
                            {ev.title}
                          </a>
                        ) : (
                          ev.title
                        )}
                      </h3>
                      {ev.description && (
                        <p className="about-event-desc">{ev.description}</p>
                      )}
                      {ev.link && (
                        <a
                          href={ev.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about-event-readmore"
                        >
                          Read More
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: HOSPITAL IN NEWS (2-COLUMN GRID) */}
            {eventsSubTab === 'news' && (
              <div className="about-news-grid">
                {(eventsNewsData?.hospitalInNews || []).map((news, idx) => (
                  <div key={news.id || idx} className="about-news-card">
                    {/* Lotus Watermark */}
                    <div className="about-news-watermark-wrap">
                      <LotusWatermark />
                    </div>

                    <div className="about-news-thumb-wrap">
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="about-news-thumb"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>
                    <div className="about-news-content">
                      <h3 className="about-news-title">
                        {news.link ? (
                          <a href={news.link} target="_blank" rel="noopener noreferrer">
                            {news.title}
                          </a>
                        ) : (
                          news.title
                        )}
                      </h3>
                      {news.link && (
                        <a
                          href={news.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="about-news-link-action"
                        >
                          <ExternalLink size={12} />
                          <span>{news.link.toLowerCase().endsWith('.pdf') ? 'View Newspaper PDF' : 'Read Article'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* SECTION 2: HISTORY OF HOSPITAL (Active on 'history' or 'all') */}
        {(activeSection === 'history' || activeSection === 'all') && (() => {
          // Sort in decreasing order (newest/latest year first)
          const sortedHistory = [...(history || [])].sort((a, b) => {
            const yearA = parseInt((a?.year || '').toString().match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt((b?.year || '').toString().match(/\d{4}/)?.[0] || '0', 10);
            if (yearB !== yearA) return yearB - yearA;
            return (b.sr || 0) - (a.sr || 0);
          });
          const totalHistoryItems = sortedHistory.length;
          const totalHistoryPages = Math.max(1, Math.ceil(totalHistoryItems / historyPerPage));
          const paginatedHistory = sortedHistory.slice(
            (historyPage - 1) * historyPerPage,
            historyPage * historyPerPage
          );

          return (
            <section id="history" className="about-section-block">
              <div className="about-block-header">
                <span className="about-section-pretitle">Heritage &amp; Milestones</span>
                <h2 className="about-block-heading">
                  <Calendar size={22} className="about-heading-icon" />
                  History of Hospital (1986 to Present)
                </h2>
                <p className="about-block-subtext">
                  Tracing our inspirational evolution from voluntary medical outreach camps to an advanced multi-speciality research hospital.
                </p>
              </div>

              <div className="about-timeline-container">
                <div className="about-timeline-line"></div>
                {paginatedHistory.map((milestone, mIdx) => (
                  <div key={milestone.sr || mIdx} className="about-timeline-item">
                    <div className="about-timeline-badge">
                      <span>{milestone.year}</span>
                    </div>
                    <div className="about-timeline-content">
                      <div className="about-timeline-header">
                        <h3 className="about-timeline-title">{milestone.title}</h3>
                        {milestone.location && (
                          <span className="about-timeline-location">
                            <MapPin size={13} /> {milestone.location}
                          </span>
                        )}
                      </div>
                      <p className="about-timeline-detail">{milestone.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* History Timeline Pagination (10 items per page) */}
              {totalHistoryPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-200">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing <strong className="text-slate-800">{(historyPage - 1) * historyPerPage + 1}</strong> to{' '}
                    <strong className="text-slate-800">{Math.min(historyPage * historyPerPage, totalHistoryItems)}</strong> of{' '}
                    <strong className="text-slate-800">{totalHistoryItems}</strong> milestones
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={historyPage === 1}
                      onClick={() => {
                        setHistoryPage(p => Math.max(1, p - 1));
                        document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                      <ChevronLeft size={14} /> Previous
                    </button>
                    {Array.from({ length: totalHistoryPages }, (_, i) => i + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setHistoryPage(pageNum);
                          document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          historyPage === pageNum
                            ? 'bg-orange-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={historyPage === totalHistoryPages}
                      onClick={() => {
                        setHistoryPage(p => Math.min(totalHistoryPages, p + 1));
                        document.getElementById('history')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all"
                    >
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </section>
          );
        })()}

        {/* SECTION 3: CHAIRMAN'S MESSAGE (Active on 'chairman' or 'all') */}
        {(activeSection === 'chairman' || activeSection === 'all') && (
          <section id="chairman" className="about-section-block">
            <div className="about-block-header">
              <span className="about-section-pretitle">Leadership Vision</span>
              <h2 className="about-block-heading">
                <UserCheck size={22} className="about-heading-icon" />
                Message from the Desk of the Chairman
              </h2>
            </div>

            <div className="about-chairman-card">
              <div className="about-chairman-header">
                <div className="about-chairman-avatar">
                  <UserCheck size={36} />
                </div>
                <div className="about-chairman-info">
                  <h3 className="about-chairman-name">{chairmansMessage?.name || 'Mr. Hrishikesh A. Mafatlal'}</h3>
                  <p className="about-chairman-role">{chairmansMessage?.designation || 'Chairman, Shri Chaitanya Seva Trust'}</p>
                </div>
              </div>

              {chairmansMessage?.introQuote && (
                <div className="about-quote-box">
                  <p className="about-quote-text">"{chairmansMessage.introQuote}"</p>
                </div>
              )}

              <div className="about-chairman-body">
                {(chairmansMessage?.paragraphs || []).map((p, idx) => (
                  <p key={idx} className="about-chairman-para">{p}</p>
                ))}
              </div>

              {chairmansMessage?.closingPrayer && (
                <div className="about-chairman-closing">
                  <p className="about-closing-text">{chairmansMessage.closingPrayer}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 4: OUR INSPIRATION (Active on 'inspiration' or 'all') */}
        {(activeSection === 'inspiration' || activeSection === 'all') && (
          <section id="inspiration" className="about-section-block">
            <div className="about-block-header">
              <span className="about-section-pretitle">Guiding Lights</span>
              <h2 className="about-block-heading">
                <Sparkles size={22} className="about-heading-icon" />
                Our Inspiration
              </h2>
              <p className="about-block-subtext">
                Our service culture is dedicated to the spiritual principles and social welfare teachings of our revered mentors.
              </p>
            </div>

            {/* 1. Srila Prabhupada Tribute Card */}
            {ourInspiration?.prabhupada && (
              <div className="about-inspiration-card">
                <div className="about-inspiration-header">
                  <div className="about-inspiration-icon-box gold">
                    <BookOpen size={26} />
                  </div>
                  <div>
                    <h3 className="about-inspiration-title">{ourInspiration.prabhupada.title}</h3>
                    <p className="about-inspiration-subtitle">{ourInspiration.prabhupada.subtitle}</p>
                  </div>
                </div>

                {ourInspiration.prabhupada.quote && (
                  <div className="about-inspiration-quote gold-border">
                    <p>"{ourInspiration.prabhupada.quote}"</p>
                  </div>
                )}

                <div className="about-inspiration-paras">
                  {(ourInspiration.prabhupada.paragraphs || []).map((para, idx) => (
                    <p key={idx} className="about-insp-para">{para}</p>
                  ))}
                </div>

                {ourInspiration.prabhupada.highlights && (
                  <div className="about-insp-highlights-grid">
                    {ourInspiration.prabhupada.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="about-insp-highlight-item">
                        <span className="about-insp-h-val">{h.value}</span>
                        <span className="about-insp-h-lbl">{h.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. H.H. Radhanath Swami Maharaj Tribute Card */}
            {ourInspiration?.radhanathSwami && (
              <div className="about-inspiration-card">
                <div className="about-inspiration-header">
                  <div className="about-inspiration-icon-box orange">
                    <Utensils size={26} />
                  </div>
                  <div>
                    <h3 className="about-inspiration-title">{ourInspiration.radhanathSwami.title}</h3>
                    <p className="about-inspiration-subtitle">{ourInspiration.radhanathSwami.subtitle}</p>
                  </div>
                </div>

                {ourInspiration.radhanathSwami.quote && (
                  <div className="about-inspiration-quote orange-border">
                    <p>"{ourInspiration.radhanathSwami.quote}"</p>
                  </div>
                )}

                <div className="about-inspiration-paras">
                  {(ourInspiration.radhanathSwami.paragraphs || []).map((para, idx) => (
                    <p key={idx} className="about-insp-para">{para}</p>
                  ))}
                </div>

                {ourInspiration.radhanathSwami.highlights && (
                  <div className="about-insp-highlights-grid">
                    {ourInspiration.radhanathSwami.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="about-insp-highlight-item">
                        <span className="about-insp-h-val">{h.value}</span>
                        <span className="about-insp-h-lbl">{h.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* SECTION 5: HOSPITAL LOGO & SYMBOLISM (Active on 'logo' or 'all') */}
        {(activeSection === 'logo' || activeSection === 'all') && (
          <section id="logo" className="about-section-block">
            <div className="about-block-header">
              <span className="about-section-pretitle">Emblem Anatomy</span>
              <h2 className="about-block-heading">
                <Award size={22} className="about-heading-icon" />
                {logo?.title || 'Hospital Logo & Sacred Symbolism'}
              </h2>
              {logo?.intro && (
                <p className="about-block-subtext">{logo.intro}</p>
              )}
            </div>

            <div className="about-logo-elements-grid">
              {(logo?.elements || []).map((elem, eIdx) => (
                <div key={eIdx} className="about-logo-card">
                  <div className="about-logo-card-top">
                    <span className="about-logo-number">{elem.sr}</span>
                    {elem.color && (
                      <span className="about-logo-color-badge">{elem.color}</span>
                    )}
                  </div>
                  <h3 className="about-logo-name">{elem.name}</h3>
                  <p className="about-logo-desc">{elem.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CUSTOM SECTIONS RENDERING */}
        {(aboutData.customSections || []).map((sec) => {
          const secKey = sec.id?.startsWith('custom_') ? sec.id : `custom_${sec.id}`;
          if (activeSection !== secKey && activeSection !== 'all') return null;

          return (
            <section key={sec.id} id={secKey} className="about-section-block">
              <div className="about-block-header">
                {sec.badge && <span className="about-section-pretitle">{sec.badge}</span>}
                <h2 className="about-block-heading">{sec.title}</h2>
                {sec.description && <p className="about-block-subtext">{sec.description}</p>}
              </div>

              {sec.bannerImage && (
                <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', maxHeight: '380px', border: '1px solid #e2e8f0' }}>
                  <img
                    src={sec.bannerImage}
                    alt={sec.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              {sec.content && (
                <div className="about-paragraphs-list" style={{ marginBottom: '24px' }}>
                  {sec.content.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx} className="about-paragraph">{para}</p>
                  ))}
                </div>
              )}

              {Array.isArray(sec.items) && sec.items.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
                  {sec.items.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      style={{
                        background: '#fff',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                    >
                      {item.imageUrl && (
                        <div style={{ height: '180px', overflow: 'hidden', background: '#f1f5f9' }}>
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          {item.badge && (
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#ea580c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {item.badge}
                            </span>
                          )}
                          <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginTop: '4px' }}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px', lineHeight: '1.6' }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        {item.link && (
                          <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: '#ea580c', textDecoration: 'none' }}
                            >
                              Learn More <ExternalLink size={13} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {/* Bottom CTA Banner */}
        <section className="about-cta-banner">
          <div>
            <h3 className="about-cta-title">Experience Compassionate Healthcare</h3>
            <p className="about-cta-desc">
              Book a consultation or visit Bhaktivedanta Hospital &amp; Research Institute in Mira Road.
            </p>
          </div>
          <a
            href="https://his.bhaktivedantahospital.com/EHR/"
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta-btn"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Book Appointment
          </a>
        </section>
      </main>

      <AppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} />
    </div>
  );
};

export default AboutHospitalPage;
