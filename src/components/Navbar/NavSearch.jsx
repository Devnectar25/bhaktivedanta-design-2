import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import associateCentresData from '../../data/associateCentresData';
import { defaultSpecialitiesState } from '../../data/defaultSpecialities';
import { defaultServicesState } from '../../data/defaultServices';
import { defaultPatientCornerState } from '../../data/defaultPatientCorner';
import { getDoctors } from '../../utils/api';

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

const STATIC_PAGES = [
  { id: 'p-home', title: 'Home Page', path: '/', category: 'Page', keywords: ['home', 'main'] },
  { id: 'p-contact', title: 'Contact Us', path: '/contact', category: 'Page', keywords: ['contact', 'address', 'phone', 'helpdesk', 'whatsapp', 'emergency'] },
  { id: 'p-careers', title: 'Careers & Job Openings', path: '/careers', category: 'Page', keywords: ['career', 'jobs', 'vacancy', 'nursing', 'hiring'] },
  { id: 'p-feedback', title: 'Patient Feedback', path: '/feedback', category: 'Page', keywords: ['feedback', 'rating', 'review', 'complaint'] },
  { id: 'p-testimonials', title: 'Patient Testimonials & Reviews', path: '/testimonials', category: 'Page', keywords: ['testimonials', 'reviews', 'stories'] },
  
  // About Us
  { id: 'p-about', title: 'About Bhaktivedanta Hospital', path: '/about-us/about-hospital', category: 'About Us', keywords: ['about', 'hospital', 'nabh'] },
  { id: 'p-history', title: 'History Timeline', path: '/about-us/about-hospital#history', category: 'About Us', keywords: ['history', 'timeline', 'milestones'] },
  { id: 'p-chairman', title: "Chairman's Message", path: '/about-us/about-hospital#chairman', category: 'About Us', keywords: ['chairman', 'message', 'director'] },
  { id: 'p-inspiration', title: 'Our Inspiration', path: '/about-us/about-hospital#inspiration', category: 'About Us', keywords: ['inspiration', 'prabhupada', 'spiritual'] },
  { id: 'p-logo', title: 'Hospital Logo & Meaning', path: '/about-us/about-hospital#logo', category: 'About Us', keywords: ['logo', 'symbol', 'emblem'] },
  { id: 'p-vision', title: 'Vision, Mission & Quality Policy', path: '/about-us/about-hospital#vision-mission', category: 'About Us', keywords: ['vision', 'mission', 'values', 'quality'] },
  { id: 'p-awards', title: 'Awards & Accreditations', path: '/about-us/about-hospital#awards', category: 'About Us', keywords: ['awards', 'accreditation', 'nabh'] },
  { id: 'p-events', title: 'Events & News', path: '/about-us/about-hospital#events', category: 'About Us', keywords: ['events', 'news', 'press'] },
  { id: 'p-trust', title: 'Shri Chaitanya Health & Care Trust', path: '/about-us/sri-chaitanya-health-care-and-trust-cst', category: 'About Us', keywords: ['trust', 'chaitanya', 'charity'] },
  { id: 'p-management', title: 'Management Team', path: '/about-us/our-management-team', category: 'About Us', keywords: ['management', 'team', 'directors', 'trustees'] },
  { id: 'p-developments', title: 'New Developments & Updates', path: '/about-us/new-developments-updates', category: 'About Us', keywords: ['new developments', 'updates', 'clinical'] },
  { id: 'p-spiritual-advisors', title: 'Spiritual Advisors', path: '/about-us/spiritual-advisors', category: 'About Us', keywords: ['spiritual advisors', 'mentors'] },

  // Education & Research
  { id: 'p-dnb', title: 'DNB Program (National Board)', path: '/education/dnb-program', category: 'Education', keywords: ['dnb', 'diplomate', 'residency'] },
  { id: 'p-nursing-edu', title: 'Nursing Education Program', path: '/education/nursing-program', category: 'Education', keywords: ['nursing', 'nurse', 'gnm'] },
  { id: 'p-cme', title: 'CME (Continuing Medical Education)', path: '/education/cme', category: 'Education', keywords: ['cme', 'education', 'workshops'] },
  { id: 'p-cne', title: 'CNE (Continuing Nursing Education)', path: '/education/cne', category: 'Education', keywords: ['cne', 'nursing education'] },
  { id: 'p-research', title: 'Clinical Research Course & Trials', path: '/education/clinical-research-course', category: 'Education', keywords: ['research', 'clinical trials', 'gcp'] },
  { id: 'p-ethics', title: 'Institutional Ethics Committee', path: '/education/ethics-committee', category: 'Education', keywords: ['ethics', 'committee', 'iec'] },

  // Spiritual Care
  { id: 'p-sc-services', title: 'Spiritual Care Services', path: '/spiritual-care/spiritual-care-services', category: 'Spiritual Care', keywords: ['spiritual care', 'prayers', 'counseling'] },
  { id: 'p-sc-programs', title: 'Educational Programmes in Spiritual Care', path: '/spiritual-care/educational-programmes', category: 'Spiritual Care', keywords: ['programmes', 'mindfulness'] },
  { id: 'p-sc-retreats', title: 'Spiritual Retreats', path: '/spiritual-care/spiritual-retreats', category: 'Spiritual Care', keywords: ['retreats', 'wellness', 'meditation'] },

  // Help & Support
  { id: 'p-faqs', title: 'Frequently Asked Questions (FAQs)', path: '/faqs', category: 'Help & Support', keywords: ['faq', 'faqs', 'frequently asked questions', 'questions', 'help', 'answers'] },

  // Patient Services & Portals
  { id: 'p-ehr-appointment', title: 'Book Appointment (EHR Portal)', path: 'https://his.bhaktivedantahospital.com/EHR/', category: 'Patient Portal', keywords: ['appointment', 'book appointment', 'consultation', 'doctor appointment', 'opd', 'ehr', 'his', 'schedule'] },
  { id: 'p-ehr-report', title: 'Patient Report (EHR Portal)', path: 'https://his.bhaktivedantahospital.com/EHR/', category: 'Patient Portal', keywords: ['patient report', 'patients report', 'lab report', 'reports', 'test results', 'ehr', 'his', 'investigation'] }
];

export default function NavSearch({ isScrolled }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [doctorsList, setDoctorsList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load doctors live from database API
  useEffect(() => {
    let isMounted = true;
    getDoctors().then(data => {
      if (isMounted && Array.isArray(data)) {
        setDoctorsList(data);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Build searchable index
  const searchIndex = useMemo(() => {
    const items = [...STATIC_PAGES];

    // Associate Centres
    if (associateCentresData && typeof associateCentresData === 'object') {
      Object.values(associateCentresData).forEach(centre => {
        if (!centre?.slug) return;
        items.push({
          id: `ac-${centre.slug}`,
          title: centre.title,
          path: `/our-associate-centre/${centre.slug}`,
          category: 'Associate Centre',
          description: centre.address || '',
          keywords: ['associate centre', 'branch', centre.slug]
        });
      });
    }

    // Specialities
    if (defaultSpecialitiesState?.specialities) {
      defaultSpecialitiesState.specialities.forEach(spec => {
        const specName = spec.name || spec.title;
        if (!specName) return;
        const slug = toSlug(specName);
        items.push({
          id: `spec-${slug}`,
          title: specName,
          path: `/specialities/${slug}`,
          category: 'Speciality',
          description: spec.shortDescription || '',
          keywords: ['speciality', 'treatment', 'doctor', specName]
        });
      });
    }

    // Services
    if (defaultServicesState?.services) {
      defaultServicesState.services.forEach(serv => {
        const servName = serv.name || serv.title;
        if (!servName) return;
        const slug = toSlug(servName);
        items.push({
          id: `serv-${slug}`,
          title: servName,
          path: `/services/${slug}`,
          category: 'Service',
          description: serv.shortDescription || '',
          keywords: ['service', 'facility', servName]
        });
      });
    }

    // Patient Corner Guides
    if (defaultPatientCornerState?.guides) {
      defaultPatientCornerState.guides.forEach(guide => {
        const guideName = guide.name || guide.title;
        if (!guideName) return;
        const slug = guide.slug || toSlug(guideName);
        items.push({
          id: `guide-${slug}`,
          title: guideName,
          path: `/patients-corner/${slug}`,
          category: 'Patient Guide',
          description: '',
          keywords: ['guide', 'patient', guideName]
        });
      });
    }

    // Doctors from Database
    if (Array.isArray(doctorsList)) {
      doctorsList.forEach(doc => {
        const docName = doc.name || doc.doctorName;
        if (!docName) return;
        const dept = doc.department || doc.speciality || 'Consultant Specialist';
        items.push({
          id: `doc-${doc.id || toSlug(docName)}`,
          title: docName.startsWith('Dr.') ? docName : `Dr. ${docName}`,
          path: '/#doctors',
          category: 'Doctor',
          description: dept,
          keywords: ['doctor', docName, dept]
        });
      });
    }

    return items;
  }, [doctorsList]);

  // Filter results: only when user types 3 or more characters
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 3) return [];

    return searchIndex.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(trimmed);
      const descMatch = (item.description || '').toLowerCase().includes(trimmed);
      const categoryMatch = (item.category || '').toLowerCase().includes(trimmed);
      const kwMatch = (item.keywords || []).some(k => String(k).toLowerCase().includes(trimmed));
      return titleMatch || descMatch || categoryMatch || kwMatch;
    }).slice(0, 8); // Max 8 suggestions
  }, [query, searchIndex]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchResults]);

  const handleSelect = (item) => {
    if (!item?.path) return;
    setIsOpen(false);
    setQuery('');

    if (item.path.startsWith('http')) {
      window.open(item.path, '_blank', 'noopener,noreferrer');
      return;
    }

    if (item.path.includes('#')) {
      const [route, hash] = item.path.split('#');
      navigate(route || '/');
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      navigate(item.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, searchResults.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        handleSelect(searchResults[selectedIndex]);
      }
    }
  };

  return (
    <div className={`nav-compact-search-wrapper ${isOpen ? 'open' : ''}`} ref={containerRef}>
      {!isOpen ? (
        <button
          type="button"
          className="search-icon-btn"
          aria-label="Open search"
          title="Search website"
          onClick={() => setIsOpen(true)}
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      ) : (
        <div className="nav-compact-search-box">
          <span className="material-symbols-outlined nav-search-inner-icon">search</span>
          <input
            ref={inputRef}
            type="text"
            className="nav-compact-search-input"
            placeholder="Search .."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="nav-compact-search-close"
            onClick={() => {
              setIsOpen(false);
              setQuery('');
            }}
            title="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Dropdown suggestions: shown only after 3 or 4 characters */}
      {isOpen && query.trim().length >= 3 && (
        <div className="nav-compact-search-dropdown">
          {searchResults.length > 0 ? (
            <div className="nav-compact-results-list">
              <div className="nav-compact-results-header">
                Suggestions ({searchResults.length})
              </div>
              {searchResults.map((item, idx) => (
                <div
                  key={item.id}
                  className={`nav-compact-result-row ${idx === selectedIndex ? 'active' : ''}`}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                >
                  <div className="nav-compact-result-main">
                    <span className="nav-compact-result-title">{item.title}</span>
                    <span className="nav-compact-result-cat">{item.category}</span>
                  </div>
                  {item.description && (
                    <span className="nav-compact-result-desc">{item.description}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="nav-compact-empty">
              No matching pages found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
