import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  FileText,
  Activity,
  HeartPulse,
  Building2,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  Compass
} from 'lucide-react';
import { associateCentresData } from '../../data/associateCentresData';
import { defaultSpecialitiesState } from '../../data/defaultSpecialities';
import { defaultServicesState } from '../../data/defaultServices';
import { defaultPatientCornerState } from '../../data/defaultPatientCorner';
import { getDoctors } from '../../utils/api';
import defaultDoctors from '../../data/defaultDoctors.json';
import './SearchModal.css';

// Helper to create clean URL slugs
const toSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Static Website Pages
const STATIC_PAGES = [
  // Core Main Pages
  {
    id: 'page-home',
    title: 'Home Page',
    path: '/',
    category: 'Pages',
    description: 'Bhaktivedanta Hospital main landing page, emergency contacts, hospital highlights, and departments',
    keywords: ['home', 'main', 'landing', 'emergency', 'overview']
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    path: '/contact',
    category: 'Pages',
    description: 'Hospital location, emergency numbers (079 6900 2222), WhatsApp support, map, and enquiry form',
    keywords: ['contact', 'address', 'phone', 'helpdesk', 'whatsapp', 'helpline', 'enquiry', 'map', 'emergency']
  },
  {
    id: 'page-careers',
    title: 'Careers & Job Openings',
    path: '/careers',
    category: 'Pages',
    description: 'Join our team – Clinical, nursing, administrative, and research career opportunities',
    keywords: ['career', 'jobs', 'vacancy', 'nursing', 'hiring', 'doctor jobs', 'work with us', 'employment']
  },
  {
    id: 'page-feedback',
    title: 'Patient Feedback',
    path: '/feedback',
    category: 'Pages',
    description: 'Submit your patient care experience, suggestions, hospital ratings, and feedback',
    keywords: ['feedback', 'rating', 'review', 'complaint', 'suggestion', 'experience']
  },
  {
    id: 'page-testimonials',
    title: 'Patient Reviews & Stories of Hope',
    path: '/testimonials',
    category: 'Pages',
    description: 'Verified patient recovery stories, VIP testimonials, and heartfelt medical care experiences',
    keywords: ['testimonials', 'reviews', 'stories', 'patient experience', 'vip', 'healing']
  },

  // About Us Sub-sections
  {
    id: 'about-hospital',
    title: 'About Bhaktivedanta Hospital',
    path: '/about-us/about-hospital',
    category: 'About Us',
    description: 'Hospital foundation, NABH accreditation, holistic medical care, and healthcare journey',
    keywords: ['about', 'hospital', 'foundation', 'nabh', 'overview']
  },
  {
    id: 'about-history',
    title: 'History Timeline of Hospital',
    path: '/about-us/about-hospital#history',
    category: 'About Us',
    description: 'Chronological milestone journey of hospital from inception to multi-specialty excellence',
    keywords: ['history', 'timeline', 'milestones', 'foundation year', 'journey']
  },
  {
    id: 'about-chairman',
    title: "Chairman's Message",
    path: '/about-us/about-hospital#chairman',
    category: 'About Us',
    description: 'Guiding vision and message from the Chairman of Bhaktivedanta Hospital',
    keywords: ['chairman', 'message', 'director', 'leadership']
  },
  {
    id: 'about-inspiration',
    title: 'Our Inspiration',
    path: '/about-us/about-hospital#inspiration',
    category: 'About Us',
    description: 'The divine inspiration, compassion, and Vedic philosophy guiding the hospital',
    keywords: ['inspiration', 'prabhupada', 'spiritual', 'divine', 'philosophy']
  },
  {
    id: 'about-logo',
    title: 'Hospital Logo & Symbolism',
    path: '/about-us/about-hospital#logo',
    category: 'About Us',
    description: 'The significance, emblem, and spiritual meaning behind the Bhaktivedanta Hospital logo',
    keywords: ['logo', 'symbol', 'meaning', 'emblem']
  },
  {
    id: 'about-vision-mission',
    title: 'Vision, Mission, Values & Quality Policy',
    path: '/about-us/about-hospital#vision-mission',
    category: 'About Us',
    description: 'Our hospital pledge, patient care standards, holistic values, and mission',
    keywords: ['vision', 'mission', 'values', 'quality', 'policy', 'ethics']
  },
  {
    id: 'about-awards',
    title: 'Awards & Accreditations',
    path: '/about-us/about-hospital#awards',
    category: 'About Us',
    description: 'National healthcare honors, NABH certificates, medical quality accreditations',
    keywords: ['awards', 'accreditation', 'nabh', 'recognition', 'certificates']
  },
  {
    id: 'about-events',
    title: 'Events & Hospital In News',
    path: '/about-us/about-hospital#events',
    category: 'About Us',
    description: 'Recent hospital events, medical symposiums, media articles, and press releases',
    keywords: ['events', 'news', 'press', 'media', 'seminars', 'articles']
  },
  {
    id: 'about-trust',
    title: 'Shri Chaitanya Health & Care Trust',
    path: '/about-us/sri-chaitanya-health-care-and-trust-cst',
    category: 'About Us',
    description: 'Charitable health trust powering humanitarian, rural, and community medical care',
    keywords: ['trust', 'chaitanya', 'charity', 'cst', 'humanitarian', 'donation', 'community']
  },
  {
    id: 'about-management',
    title: 'Our Management Team',
    path: '/about-us/our-management-team',
    category: 'About Us',
    description: 'Governing board, managing trustees, executive directors, and medical administrators',
    keywords: ['management', 'team', 'directors', 'trustees', 'leadership', 'board']
  },
  {
    id: 'about-developments',
    title: 'New Developments & Updates',
    path: '/about-us/new-developments-updates',
    category: 'About Us',
    description: 'Hospital expansions, advanced equipment inaugurations, clinical updates, and medical camps',
    keywords: ['new developments', 'updates', 'clinical', 'camps', 'symposiums', 'equipment', 'latest']
  },
  {
    id: 'about-spiritual-advisors',
    title: 'Our Spiritual Advisors',
    path: '/about-us/spiritual-advisors',
    category: 'About Us',
    description: 'Spiritual mentors, counselors, and advisors guiding the devotional ethics of the hospital',
    keywords: ['spiritual advisors', 'gurus', 'mentors', 'counseling', 'wisdom', 'devotional']
  },

  // Education & Medical Research
  {
    id: 'edu-dnb',
    title: 'DNB Program (National Board)',
    path: '/education/dnb-program',
    category: 'Education',
    description: 'Post-graduate medical residency courses accredited by the National Board of Examinations',
    keywords: ['dnb', 'diplomate', 'residency', 'post graduate', 'medical education', 'fellowship']
  },
  {
    id: 'edu-nursing',
    title: 'Nursing Education Program',
    path: '/education/nursing-program',
    category: 'Education',
    description: 'Professional nursing diplomas, hands-on clinical rotations, and specialty care training',
    keywords: ['nursing', 'nurse training', 'gnm', 'bsc nursing', 'clinical care']
  },
  {
    id: 'edu-cme',
    title: 'CME (Continuing Medical Education)',
    path: '/education/cme',
    category: 'Education',
    description: 'Accredited medical conferences, clinical workshops, and specialist symposiums',
    keywords: ['cme', 'continuing medical education', 'conferences', 'workshops', 'symposiums']
  },
  {
    id: 'edu-cne',
    title: 'CNE (Continuing Nursing Education)',
    path: '/education/cne',
    category: 'Education',
    description: 'Upskilling certifications and modern nursing practice updates',
    keywords: ['cne', 'continuing nursing education', 'nurse workshops']
  },
  {
    id: 'edu-clinical-research',
    title: 'Clinical Research Course & Trials',
    path: '/education/clinical-research-course',
    category: 'Education',
    description: 'GCP certified clinical trials, methodology courses, and ethics training',
    keywords: ['clinical research', 'clinical trials', 'gcp', 'research course']
  },
  {
    id: 'edu-ethics',
    title: 'Institutional Ethics Committee',
    path: '/education/ethics-committee',
    category: 'Education',
    description: 'Institutional Ethics Committee guidelines, trial approvals, and patient safety oversight',
    keywords: ['ethics', 'committee', 'iec', 'patient safety', 'approvals']
  },

  // Spiritual Care
  {
    id: 'spiritual-services',
    title: 'Spiritual Care Services',
    path: '/spiritual-care/spiritual-care-services',
    category: 'Spiritual Care',
    description: 'Holistic healing, daily bedside prayers, spiritual counseling, and patient emotional support',
    keywords: ['spiritual care', 'prayers', 'counseling', 'healing', 'bhakti', 'meditation']
  },
  {
    id: 'spiritual-programmes',
    title: 'Educational Programmes in Spiritual Care',
    path: '/spiritual-care/educational-programmes',
    category: 'Spiritual Care',
    description: 'Workshops in mindfulness, ethical medicine, compassion in healthcare, and holistic living',
    keywords: ['educational programmes', 'mindfulness', 'ethics in healthcare', 'holistic']
  },
  {
    id: 'spiritual-retreats',
    title: 'Spiritual Retreats & Rejuvenation',
    path: '/spiritual-care/spiritual-retreats',
    category: 'Spiritual Care',
    description: 'Wellness retreats, inner healing camps, and spiritual rejuvenation for patients and families',
    keywords: ['retreats', 'rejuvenation', 'wellness', 'inner peace']
  }
];

const FILTER_TABS = [
  { key: 'all', label: 'All Results' },
  { key: 'Pages', label: 'Pages' },
  { key: 'Specialities', label: 'Specialities' },
  { key: 'Services', label: 'Services' },
  { key: 'Associate Centres', label: 'Associate Centres' },
  { key: 'Doctors', label: 'Doctors' }
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);
  const navigate = useNavigate();

  // Load doctors dynamically
  useEffect(() => {
    let isMounted = true;
    getDoctors(defaultDoctors).then(data => {
      if (isMounted && Array.isArray(data)) {
        setDoctorsList(data);
      }
    }).catch(() => {
      if (isMounted) setDoctorsList(defaultDoctors);
    });
    return () => { isMounted = false; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setActiveFilter('all');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Build Comprehensive Dynamic Search Index
  const searchIndex = useMemo(() => {
    const items = [...STATIC_PAGES];

    // 1. Add Associate Centres
    if (associateCentresData && typeof associateCentresData === 'object') {
      Object.values(associateCentresData).forEach(centre => {
        if (!centre?.slug) return;
        items.push({
          id: `ac-${centre.slug}`,
          title: centre.title,
          path: `/our-associate-centre/${centre.slug}`,
          category: 'Associate Centres',
          description: `${centre.address || ''} • Services: ${(centre.services || []).slice(0, 4).join(', ')}`,
          keywords: ['associate centre', 'hospital', 'branch', centre.slug, ...(centre.services || [])]
        });
      });
    }

    // 2. Add Specialities & Super Specialities
    if (defaultSpecialitiesState?.categories) {
      defaultSpecialitiesState.categories.forEach(cat => {
        (cat.specialities || []).forEach(spec => {
          const specName = spec.name || spec.title;
          if (!specName) return;
          const slug = toSlug(specName);
          items.push({
            id: `spec-${slug}`,
            title: specName,
            path: `/specialities/${slug}`,
            category: 'Specialities',
            description: `${cat.name || 'Speciality'} • Comprehensive clinical treatment, diagnostics, and surgical care`,
            keywords: ['speciality', 'treatment', 'doctor', 'surgery', cat.name || '', specName]
          });
        });
      });
    }

    // 3. Add Services & Facilities
    if (defaultServicesState?.categories) {
      defaultServicesState.categories.forEach(cat => {
        (cat.services || []).forEach(serv => {
          const servName = serv.name || serv.title;
          if (!servName) return;
          const slug = toSlug(servName);
          items.push({
            id: `serv-${slug}`,
            title: servName,
            path: `/services/${slug}`,
            category: 'Services',
            description: `${cat.name || 'Hospital Service'} • Advanced hospital infrastructure, 24/7 patient care facility`,
            keywords: ['service', 'facility', 'icu', 'emergency', 'diagnostics', servName, cat.name || '']
          });
        });
      });
    }

    // 4. Add Patient Corner Guides
    if (defaultPatientCornerState?.categories) {
      defaultPatientCornerState.categories.forEach(cat => {
        (cat.guides || []).forEach(guide => {
          const guideName = guide.name || guide.title;
          if (!guideName) return;
          const slug = toSlug(guideName);
          items.push({
            id: `guide-${slug}`,
            title: guideName,
            path: `/patients-corner/${slug}`,
            category: 'Pages',
            description: `Patient guide • Information on ${guideName.toLowerCase()}, protocols, and hospital guidelines`,
            keywords: ['patient guide', 'admission', 'insurance', 'tpa', 'visitor', guideName]
          });
        });
      });
    }

    // 5. Add Doctors
    if (Array.isArray(doctorsList)) {
      doctorsList.forEach(doc => {
        const docName = doc.name || doc.doctorName;
        if (!docName) return;
        const dept = doc.department || doc.speciality || 'Consultant Specialist';
        const quals = doc.qualification || doc.degrees || '';
        items.push({
          id: `doc-${doc.id || toSlug(docName)}`,
          title: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
          path: `/#doctors`,
          category: 'Doctors',
          description: `${dept} ${quals ? `• ${quals}` : ''}`,
          keywords: ['doctor', 'consultant', 'physician', 'surgeon', 'specialist', docName, dept, quals]
        });
      });
    }

    return items;
  }, [doctorsList]);

  // Filter results based on search query and active tab
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let results = searchIndex;

    // Apply text filter
    if (trimmed) {
      results = results.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(trimmed);
        const descMatch = (item.description || '').toLowerCase().includes(trimmed);
        const categoryMatch = (item.category || '').toLowerCase().includes(trimmed);
        const keywordMatch = (item.keywords || []).some(k => String(k).toLowerCase().includes(trimmed));
        return titleMatch || descMatch || categoryMatch || keywordMatch;
      });
    }

    // Apply category tab filter
    if (activeFilter !== 'all') {
      results = results.filter(item => item.category === activeFilter);
    }

    // When query is empty and 'all' is selected, show top recommendations
    if (!trimmed && activeFilter === 'all') {
      return searchIndex.slice(0, 8);
    }

    return results.slice(0, 30); // Show up to 30 most relevant
  }, [query, activeFilter, searchIndex]);

  // Keep selection within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('.search-result-item.active');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  // Navigate to target
  const handleSelect = (item) => {
    if (!item?.path) return;
    onClose();

    // Check if it's a hash link on current page
    if (item.path.includes('#')) {
      const [route, hash] = item.path.split('#');
      navigate(route || '/');
      setTimeout(() => {
        const targetEl = document.getElementById(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation within list
  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, filteredResults.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelect(filteredResults[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  // Category Icon helper
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Specialities':
        return <Activity size={18} className="cat-icon specialities" />;
      case 'Services':
        return <HeartPulse size={18} className="cat-icon services" />;
      case 'Associate Centres':
        return <Building2 size={18} className="cat-icon associate" />;
      case 'Doctors':
        return <User size={18} className="cat-icon doctors" />;
      case 'Education':
        return <GraduationCap size={18} className="cat-icon education" />;
      case 'Spiritual Care':
        return <Sparkles size={18} className="cat-icon spiritual" />;
      default:
        return <FileText size={18} className="cat-icon page" />;
    }
  };

  return (
    <div
      className="search-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search website"
    >
      <div className="search-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Search Input Bar */}
        <div className="search-input-wrapper">
          <Search size={22} className="search-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="search-input-field"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search pages, specialities, doctors, services, associate centres..."
            aria-autocomplete="list"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button
            type="button"
            className="search-close-btn"
            onClick={onClose}
            title="Close (Esc)"
          >
            <span className="search-key-badge">ESC</span>
          </button>
        </div>

        {/* Filter Category Pills */}
        <div className="search-filter-pills">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              type="button"
              className={`search-filter-pill ${activeFilter === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveFilter(tab.key);
                inputRef.current?.focus();
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Results / Suggestions Area */}
        <div className="search-results-area" ref={resultsContainerRef}>
          {filteredResults.length > 0 ? (
            <div className="search-results-list">
              <div className="search-results-meta">
                <span>
                  {query.trim()
                    ? `Found ${filteredResults.length} matching result${filteredResults.length > 1 ? 's' : ''}`
                    : 'Popular & Recommended Pages'}
                </span>
                <span className="search-nav-hint">Use ↑ ↓ keys to navigate, Enter to open</span>
              </div>

              {filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    className={`search-result-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="result-icon-box">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="result-content-box">
                      <div className="result-title-row">
                        <span className="result-title">{item.title}</span>
                        <span className={`result-category-badge cat-${item.category.toLowerCase().replace(/\s+/g, '-')}`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="result-desc">{item.description}</p>
                    </div>

                    <div className="result-action-box">
                      <ArrowRight size={16} className="result-arrow-icon" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="search-empty-state">
              <Compass size={40} className="empty-icon text-slate-400" />
              <h4 className="empty-title">No results found for "{query}"</h4>
              <p className="empty-subtitle">
                Try searching for cardiology, emergency, contact, oncology, doctors, careers, or associate centres.
              </p>
              <div className="empty-suggestions-tags">
                <span onClick={() => { setQuery('Cardiology'); inputRef.current?.focus(); }}>Cardiology</span>
                <span onClick={() => { setQuery('Contact'); inputRef.current?.focus(); }}>Contact Us</span>
                <span onClick={() => { setQuery('Emergency'); inputRef.current?.focus(); }}>Emergency</span>
                <span onClick={() => { setQuery('Doctors'); inputRef.current?.focus(); }}>Doctors</span>
                <span onClick={() => { setQuery('Careers'); inputRef.current?.focus(); }}>Careers</span>
                <span onClick={() => { setQuery('Associate'); inputRef.current?.focus(); }}>Associate Centres</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="search-modal-footer">
          <div className="footer-shortcut-hint">
            <span className="key-tag"><CornerDownLeft size={12} /></span>
            <span>Select</span>
          </div>
          <div className="footer-shortcut-hint">
            <span className="key-tag">↑</span>
            <span className="key-tag">↓</span>
            <span>Navigate</span>
          </div>
          <div className="footer-shortcut-hint">
            <span className="key-tag">ESC</span>
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
