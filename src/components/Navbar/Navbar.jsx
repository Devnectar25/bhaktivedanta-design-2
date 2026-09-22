import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { getSpecialitiesState, getServicesState, getPatientCornerState, getSpiritualCareState } from '../../utils/api';
import { defaultServicesState, ensureStandardServiceTabs } from '../../data/defaultServices';
import { defaultPatientCornerState, ensureStandardPatientCornerTabs } from '../../data/defaultPatientCorner';
import { defaultSpiritualCareState, defaultSpiritualSections, ensureStandardSpiritualSections } from '../../data/defaultSpiritualCare';
import { createSlug } from '../../pages/DetailPage/DetailPage';

const getSpiritualRoute = (secOrLink) => {
  const id = (secOrLink?.id || secOrLink?.section?.id || '').toLowerCase().trim();
  const name = (secOrLink?.name || secOrLink?.title || secOrLink?.section?.title || '').toLowerCase().trim();
  if (id === 'spiritual-care-services' || name.includes('services')) return '/spiritual-care';
  if (id === 'educational-programmes' || name.includes('educational')) return '/spiritual-care/educational-programmes';
  if (id === 'spiritual-retreats' || name.includes('retreats')) return '/spiritual-care/spiritual-retreats';
  if (id === 'publications' || name.includes('publication') || name.includes('paper')) return '/spiritual-care/publications-papers';
  const slug = secOrLink?.slug || secOrLink?.section?.slug || id || createSlug(name);
  return `/spiritual-care/${slug}`;
};

// Helper function to dynamically split items evenly into N columns so all items are included without overflow/omission
const splitIntoColumns = (items, numCols) => {
  const result = Array.from({ length: numCols }, () => []);
  if (!items || items.length === 0) return result;

  const perCol = Math.ceil(items.length / numCols);
  for (let i = 0; i < numCols; i++) {
    const start = i * perCol;
    const end = start + perCol;
    result[i] = items.slice(start, end);
  }
  return result;
};

const menuStructure = [
  {
    name: 'Specialities',
    type: 'mega-menu',
    to: '#specialities'
  },
  {
    name: 'Services',
    type: 'services-mega-menu',
    to: '#services'
  },
  {
    name: 'Patients Corner',
    type: 'patients-mega-menu',
    to: '#patients',
    columns: [
      {
        title: 'Patient Guide',
        links: [
          { name: 'Admission', href: '#patients' },
          { name: 'Empanelled Corporate / TPA / Insurances', href: '#patients' },
          { name: 'Patients Rights & Responsibilities', href: '#patients' },
          { name: 'Visitors Policy', href: '#patients' },
          { name: 'International Patient', href: '#patients' }
        ]
      },
      {
        title: 'Consultations',
        links: [
          { name: 'Find A Doctor', href: '#doctors' },
          { name: 'Book Appointment', href: '#contact' },
          { name: 'Online Consultation', href: '#patients' },
          { name: 'Video Consultation', href: '#patients' },
          { name: 'Patient Report', href: '#patients' }
        ]
      },
      {
        title: 'Quick Links',
        links: [
          { name: 'Feedback', href: '#testimonials' },
          { name: 'Announcements', href: '#patients' },
          { name: 'Blogs', href: '#patients' },
          { name: 'OPD Schedule', href: '#patients' },
          { name: 'Health Checkup', href: '#patients' }
        ]
      }
    ]
  },
  {
    name: 'Spiritual care',
    type: 'dropdown',
    to: '/spiritual-care',
    links: [
      { name: 'Spiritual care Services', href: '/spiritual-care' },
      { name: 'Educational Programmes', href: '/spiritual-care/educational-programmes' },
      { name: 'Spiritual care Retreats', href: '/spiritual-care/spiritual-retreats' },
      { name: 'Publications & Paper Presentations', href: '/spiritual-care/publications-papers' }
    ]
  },
  {
    name: 'Education & Medical Research',
    type: 'patients-mega-menu',
    to: '/education/dnb-program',
    columns: [
      {
        links: [
          { name: 'DNB Program', to: '/education/dnb-program' },
          { name: 'Nursing Program', to: '/education/nursing-program' },
          { name: 'CME', to: '/education/cme' },
          { name: 'CNE', to: '/education/cne' },
          { name: 'Spiritual care Certificate Course', to: '/education/spiritual-care-course' }
        ]
      },
      {
        title: 'Medical Research',
        hasArrow: true,
        links: [
          { name: 'Clinical Research Course', to: '/education/clinical-research-course' },
          { name: 'Clinical Trials', to: '/education/clinical-trials' },
          { name: 'Institutional Ethics Committee', to: '/education/ethics-committee' },
          { name: 'Publications', to: '/education/publications' },
          { name: 'Government Accreditation', to: '/education/government-accreditation' }
        ]
      }
    ]
  },
  {
    name: 'Our Associate Centre',
    type: 'patients-mega-menu',
    to: '#associate',
    columns: [
      {
        links: [
          { name: 'Swami Shraddhanand Hospital', href: '#associate' },
          { name: 'Sheth P. V. Doshi Hospital', href: '#associate' },
          { name: 'Primary Health Care Centre - Pophran', href: '#associate' },
          { name: 'Hamrapur Healthcare Centre', href: '#associate' },
          { name: 'Ambiste Healthcare Centre', href: '#associate' }
        ]
      },
      {
        links: [
          { name: 'Bhaktivedanta Polyclinic', href: '#associate' },
          { name: 'Bhaktivedanta Hospital - Vrindavan', href: '#associate' },
          { name: 'Bhaktivedanta Eye Hospital - Barsana', href: '#associate' },
          { name: 'Saksham Community Health Centre - Dhuktan', href: '#associate' }
        ]
      }
    ]
  },
  {
    name: 'Careers',
    type: 'link',
    to: '/careers'
  },
  {
    name: 'About us',
    type: 'dropdown',
    to: '#about',
    links: [
      { name: 'About Hospital', href: '#about' },
      { name: 'Vision, Mission, Quality Policy, Values', href: '#about' },
      { name: 'Awards & Accreditation', href: '#about' },
      { name: 'Events & Hospital In News', href: '#developments' },
      { name: 'Shri Chaitanya Health and Care Trust', href: '#about' },
      { name: 'New Developments & Updates', href: '#developments' },
      { name: 'Our Management Team', href: '#about' },
      { name: 'Our Spiritual Advisors', href: '#about' }
    ]
  }
];

const EmblemLogo = () => (
  <svg
    viewBox="0 0 400 400"
    className="nabh-logo"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Bhaktivedanta Emblem"
  >
    <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M 200,60 C 215,85 228,110 215,135 C 205,155 190,165 200,185 C 205,170 218,155 220,135 C 224,105 210,80 200,60 Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M 200,60 C 185,90 175,120 185,145 C 190,158 198,168 200,185" />
      <path d="M 215,135 C 225,120 226,100 220,85" />

      <path d="M 200,155 C 180,185 180,215 200,245 C 220,215 220,185 200,155 Z" />

      <path d="M 200,155 C 160,180 150,220 185,245" />
      <path d="M 200,155 C 240,180 250,220 215,245" />
      <path d="M 152,175 C 140,205 155,235 185,245" />
      <path d="M 248,175 C 260,205 245,235 215,245" />

      <path d="M 152,175 C 120,200 115,230 155,255 C 175,258 190,250 200,245" />
      <path d="M 248,175 C 280,200 285,230 245,255 C 225,258 210,250 200,245" />

      <path d="M 115,210 C 125,250 160,270 200,270 C 240,270 275,250 285,210 C 265,245 230,260 200,260 C 170,260 135,245 115,210 Z" />
    </g>

    <text x="200" y="305" textAnchor="middle" fontFamily="'Cinzel', 'Trajan Pro', 'Georgia', serif" fontSize="25" fontWeight="700" letterSpacing="3" fill="currentColor">BHAKTIVEDANTA</text>
    <text x="200" y="338" textAnchor="middle" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="21" fontWeight="700" letterSpacing="6" fill="currentColor">HOSPITAL</text>
    <text x="200" y="368" textAnchor="middle" fontFamily="'Montserrat', 'Inter', sans-serif" fontSize="16" fontWeight="600" letterSpacing="4.5" fill="currentColor">HARE KRISHNA</text>
  </svg>
);

const Navbar = ({ onSelectSpeciality, onSelectPatientGuide, onOpenAppointment, solid = false }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '';
  const [scrolled, setScrolled] = useState(false);
  const isSolid = solid || !isHomePage || scrolled;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [specialitiesData, setSpecialitiesData] = useState(defaultSpecialitiesState);
  const [activeMegaCategory, setActiveMegaCategory] = useState(null);

  const [servicesData, setServicesData] = useState(defaultServicesState);
  const [activeServiceCategory, setActiveServiceCategory] = useState(null);
  const [patientCornerData, setPatientCornerData] = useState(defaultPatientCornerState);
  const [spiritualCareData, setSpiritualCareData] = useState(() => ensureStandardSpiritualSections(defaultSpiritualCareState));
  const [openNavDropdown, setOpenNavDropdown] = useState(null);

  const isDropdownOpen = Boolean(openNavDropdown || activeMegaCategory || activeServiceCategory);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Invalidate stale cached state if it has fewer than 36 specialities
    const cached = localStorage.getItem('bhaktivedanta_specialities_state');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (!parsed.specialities || parsed.specialities.length < 36) {
          localStorage.removeItem('bhaktivedanta_specialities_state');
        }
      } catch (e) {
        localStorage.removeItem('bhaktivedanta_specialities_state');
      }
    }

    const fetchSpecialities = () => {
      getSpecialitiesState(defaultSpecialitiesState).then(res => {
        if (res && res.categories) {
          if (res.specialities) res.specialities.forEach(ensureStandardTabs);
          setSpecialitiesData(res);
        } else {
          setSpecialitiesData(defaultSpecialitiesState);
        }
      }).catch(err => {
        console.warn('Navbar could not load live specialities:', err);
      });
    };

    const fetchServices = () => {
      getServicesState(defaultServicesState).then(res => {
        if (res && res.categories) {
          if (res.services) res.services.forEach(ensureStandardServiceTabs);
          setServicesData(res);
        } else {
          setServicesData(defaultServicesState);
        }
      }).catch(err => {
        console.warn('Navbar could not load live services:', err);
      });
    };

    const fetchPatientCorner = () => {
      getPatientCornerState(defaultPatientCornerState).then(res => {
        if (res && res.categories) {
          if (res.guides) res.guides.forEach(ensureStandardPatientCornerTabs);
          setPatientCornerData(res);
        } else {
          setPatientCornerData(defaultPatientCornerState);
        }
      }).catch(err => {
        console.warn('Navbar could not load live patient corner:', err);
      });
    };

    const fetchSpiritualCare = () => {
      getSpiritualCareState(defaultSpiritualCareState).then(res => {
        const validated = ensureStandardSpiritualSections(res || defaultSpiritualCareState);
        setSpiritualCareData(validated);
      }).catch(err => {
        console.warn('Navbar could not load live spiritual care:', err);
      });
    };

    // Initial fetch on mount
    fetchSpecialities();
    fetchServices();
    fetchPatientCorner();
    fetchSpiritualCare();

    const handleSync = (e) => {
      if (!e || !e.key || e.key === 'bhaktivedanta_specialities_state') {
        fetchSpecialities();
      }
      if (!e || !e.key || e.key === 'bhaktivedanta_services_state') {
        fetchServices();
      }
      if (!e || !e.key || e.key === 'bhaktivedanta_patient_corner_state') {
        fetchPatientCorner();
      }
      if (!e || !e.key || e.key === 'bhaktivedanta_spiritual_care_state') {
        fetchSpiritualCare();
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handlePatientGuideClick = (guideOrName) => {
    let targetGuide = null;
    const guides = patientCornerData.guides || defaultPatientCornerState.guides || [];

    if (typeof guideOrName === 'object' && guideOrName !== null) {
      targetGuide = guideOrName;
    } else {
      const normalizedName = (guideOrName || '').toLowerCase().trim();
      targetGuide = guides.find(g => {
        const gTitle = (g.title || g.name || '').toLowerCase().trim();
        const gSlug = (g.slug || '').toLowerCase().trim();
        return (
          gTitle === normalizedName ||
          gSlug === normalizedName ||
          gTitle.includes(normalizedName) ||
          normalizedName.includes(gTitle) ||
          (normalizedName === 'admission' && (gSlug === 'admission' || gTitle.includes('admission'))) ||
          (normalizedName.includes('empanelled') && (gSlug.includes('insurance') || gSlug.includes('empanelled') || gTitle.includes('insurance') || gTitle.includes('tpa'))) ||
          (normalizedName.includes('visitor') && (gSlug.includes('visitor') || gTitle.includes('visitor') || gTitle.includes('icu'))) ||
          (normalizedName.includes('right') && (gSlug.includes('right') || gTitle.includes('right'))) ||
          (normalizedName.includes('international') && (gSlug.includes('intl') || gSlug.includes('international') || gTitle.includes('international'))) ||
          (normalizedName.includes('consultation') && (gSlug.includes('consultation') || gTitle.includes('consultation'))) ||
          (normalizedName.includes('report') && (gSlug.includes('report') || gTitle.includes('report'))) ||
          (normalizedName.includes('schedule') && (gSlug.includes('schedule') || gTitle.includes('schedule') || gTitle.includes('opd'))) ||
          (normalizedName.includes('checkup') && (gSlug.includes('checkup') || gTitle.includes('checkup') || gTitle.includes('package')))
        );
      });
    }

    if (!targetGuide) {
      const name = typeof guideOrName === 'string' ? guideOrName : 'Patient Guide';
      targetGuide = {
        id: `guide-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title: name,
        name: name,
        category: 'Patients Corner',
        categoryName: 'Patients Corner',
        tabs: [
          {
            id: 't1',
            title: 'Overview',
            type: 'rich_text',
            enabled: true,
            content: `<p>Welcome to Bhaktivedanta Hospital & Research Institute — ${name}. Please contact our helpdesk or admission counter for further details.</p>`
          }
        ]
      };
    }

    if (onSelectPatientGuide) {
      onSelectPatientGuide(targetGuide, targetGuide.category || targetGuide.categoryName || 'Patients Corner');
    } else if (onSelectSpeciality) {
      onSelectSpeciality(targetGuide, targetGuide.category || targetGuide.categoryName || 'Patients Corner');
    }
  };

  const handleSpiritualCareClick = (sectionOrName) => {
    let targetSection = null;

    if (typeof sectionOrName === 'object' && sectionOrName !== null) {
      targetSection = sectionOrName;
    } else {
      const normalized = (sectionOrName || '').toLowerCase().trim();
      const allSections = spiritualCareData.sections || defaultSpiritualSections;
      targetSection = allSections.find(s => 
        s.id === normalized || 
        (s.title && s.title.toLowerCase() === normalized) || 
        (s.title && s.title.toLowerCase().includes(normalized)) ||
        (s.title && normalized.includes(s.title.toLowerCase()))
      );
    }

    if (!targetSection) {
      const title = typeof sectionOrName === 'string' ? sectionOrName : 'Spiritual Care';
      targetSection = {
        id: `spiritual-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        title,
        name: title,
        category: 'Spiritual Care',
        categoryName: 'Spiritual Care',
        isSpiritualCare: true,
        layout: 'flexible',
        blocks: []
      };
    }

    const payload = {
      ...targetSection,
      name: targetSection.title || targetSection.name || 'Spiritual Care',
      title: targetSection.title || targetSection.name || 'Spiritual Care',
      category: 'Spiritual Care',
      categoryName: 'Spiritual Care',
      isSpiritualCare: true
    };

    if (onSelectSpeciality) {
      onSelectSpeciality(payload, 'Spiritual Care');
    } else if (onSelectPatientGuide) {
      onSelectPatientGuide(payload, 'Spiritual Care');
    }
  };

  const toggleMobileDropdown = (name) => {
    if (activeMobileDropdown === name) {
      setActiveMobileDropdown(null);
    } else {
      setActiveMobileDropdown(name);
    }
  };

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false);
    setActiveMobileDropdown(null);
  };

  return (
    <header className={`navbar-header ${isSolid ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Top tier - Logo, Emergency and Actions bar */}
      <div className="navbar-top-tier">
        <div className="container top-tier-container">
          <Link to="/" className="logo-section">
            <img src="/icon.png" alt="Emblem" className="logo-icon" />
            <img src="/logo.png" alt="Bhaktivedanta Hospital" className="logo-text" />
          </Link>

          <div className="emergency-badge">
            <span className="emergency-label">For Emergency & Appointments</span>
            <span className="emergency-number">079 6900 2222</span>
          </div>

          <div className="top-right-section">
            <EmblemLogo />
            <button className="search-icon-btn" aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </button>
            <Link to="/contact" className="contact-us-link">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Bottom tier - Sticky navigation */}
      <div className="navbar-bottom-tier">
        <div className="container bottom-tier-container">
          {/* Mobile Header Bar */}
          <div className="mobile-header-bar">
            <Link to="/" className="mobile-logo-section">
              <img src="/icon.png" alt="Emblem" className="logo-icon" />
              <img src="/logo.png" alt="Bhaktivedanta" className="logo-text" />
            </Link>

            <button
              className={`mobile-toggle-btn ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <div className="desktop-nav-menu">
            <div className="nav-menu-links">
              {/* Home Text Link */}
              {isHomePage ? (
                <a href="#home" className="nav-link-item-simple">
                  Home
                </a>
              ) : (
                <Link to="/" className="nav-link-item-simple">
                  Home
                </Link>
              )}

              {/* Dynamic menu structure */}
              {menuStructure.map((menuItem) => {
                if (menuItem.type === 'mega-menu') {
                  const categoriesList = specialitiesData.categories?.filter(c => c.status) || [];
                  const currentCat = categoriesList.find(c => c.id === activeMegaCategory);
                  const catSpecs = currentCat
                    ? (specialitiesData.specialities?.filter(s => s.categoryId === currentCat.id && s.status) || [])
                    : [];
                  const columns = splitIntoColumns(catSpecs, catSpecs.length > 8 ? 3 : 2);

                  return (
                    <div
                      key={menuItem.name}
                      className="nav-item-dropdown-container specialities-nav-item"
                      onMouseEnter={() => setOpenNavDropdown(menuItem.name)}
                      onMouseLeave={() => {
                        setOpenNavDropdown(null);
                        setActiveMegaCategory(null);
                      }}
                    >
                      <a href={menuItem.to} className="nav-dropdown-trigger">
                        {menuItem.name}
                      </a>

                      <div className={`specialities-flyout-wrapper ${currentCat ? 'has-subpanel' : ''}`}>
                        {/* FIRST VIEW: Category menu list */}
                        <div className="specialities-category-menu">
                          {categoriesList.map(cat => {
                            const isActive = activeMegaCategory === cat.id;
                            return (
                              <div
                                key={cat.id}
                                className={`specialities-category-item ${isActive ? 'active' : ''}`}
                                onMouseEnter={() => setActiveMegaCategory(cat.id)}
                                onClick={() => setActiveMegaCategory(cat.id)}
                              >
                                <span className="category-item-text">{cat.name}</span>
                                <span className="material-symbols-outlined category-item-arrow">
                                  chevron_right
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* FLYOUT VIEW: Sub-specialities shown after hovering/going to a category */}
                        {currentCat && (
                          <div className="specialities-subpanel animate-flyout-fade" key={currentCat.id}>
                            <div className="specialities-subpanel-header">
                              <h3 className="specialities-subpanel-title">{currentCat.name}</h3>
                              <span className="specialities-subpanel-badge">{catSpecs.length} Specialities</span>
                            </div>
                            {catSpecs.length > 0 ? (
                              <div className={`specialities-grid ${catSpecs.length > 8 ? 'grid-3-col' : 'grid-2-col'}`}>
                                {columns.map((colItems, colIdx) => (
                                  <ul key={colIdx} className="specialities-subpanel-list">
                                    {colItems.map((s, itemIdx) => (
                                      <li key={s.id} style={{ animationDelay: `${itemIdx * 0.02}s` }} className="animate-item-pop">
                                        <Link
                                          to={`/specialities/${s.slug || createSlug(s.name)}`}
                                          className="speciality-link-btn"
                                          onClick={() => {
                                            setActiveMegaCategory(null);
                                            setOpenNavDropdown(null);
                                          }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-btn-text">{s.name}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                ))}
                              </div>
                            ) : (
                              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                <p style={{ margin: 0, fontWeight: 600 }}>{currentCat.description || 'Specialities coming soon under this category.'}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'services-mega-menu') {
                  const categoriesList = servicesData.categories?.filter(c => c.status) || [];
                  const currentCat = categoriesList.find(c => c.id === activeServiceCategory);
                  const catServices = currentCat
                    ? (servicesData.services?.filter(s => s.categoryId === currentCat.id && s.status) || [])
                    : [];
                  const columns = splitIntoColumns(catServices, catServices.length > 8 ? 3 : 2);

                  return (
                    <div
                      key={menuItem.name}
                      className="nav-item-dropdown-container services-nav-item"
                      onMouseEnter={() => setOpenNavDropdown(menuItem.name)}
                      onMouseLeave={() => {
                        setOpenNavDropdown(null);
                        setActiveServiceCategory(null);
                      }}
                    >
                      <a href={menuItem.to} className="nav-dropdown-trigger">
                        {menuItem.name}
                      </a>

                      <div className={`services-flyout-wrapper ${currentCat ? 'has-subpanel' : ''}`}>
                        {/* FIRST VIEW: Category menu list */}
                        <div className="services-category-menu">
                          {categoriesList.map(cat => {
                            const isActive = activeServiceCategory === cat.id;
                            return (
                              <div
                                key={cat.id}
                                className={`services-category-item ${isActive ? 'active' : ''}`}
                                onMouseEnter={() => setActiveServiceCategory(cat.id)}
                                onClick={() => setActiveServiceCategory(cat.id)}
                              >
                                <span className="category-item-text">{cat.name}</span>
                                <span className="material-symbols-outlined category-item-arrow">
                                  chevron_right
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* FLYOUT VIEW: Sub-services shown after hovering/going to a category */}
                        {currentCat && (
                          <div className="services-subpanel animate-flyout-fade" key={currentCat.id}>
                            <div className="services-subpanel-header">
                              <h3 className="services-subpanel-title">{currentCat.name}</h3>
                              <span className="services-subpanel-badge">{catServices.length} Services</span>
                            </div>
                            {catServices.length > 0 ? (
                              <div className={`services-grid ${catServices.length > 8 ? 'grid-3-col' : 'grid-2-col'}`}>
                                {columns.map((colItems, colIdx) => (
                                  <ul key={colIdx} className="services-subpanel-list">
                                    {colItems.map((s, itemIdx) => (
                                      <li key={s.id} style={{ animationDelay: `${itemIdx * 0.02}s` }} className="animate-item-pop">
                                        <Link
                                          to={`/services/${s.slug || createSlug(s.name)}`}
                                          className="speciality-link-btn"
                                          onClick={() => {
                                            setActiveServiceCategory(null);
                                            setOpenNavDropdown(null);
                                          }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-btn-text">{s.name}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                ))}
                              </div>
                            ) : (
                              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                                <p style={{ margin: 0, fontWeight: 600 }}>{currentCat.description || 'Services coming soon under this category.'}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'patients-mega-menu') {
                  let columnsToRender = menuItem.columns;
                  if (menuItem.name === 'Patients Corner') {
                    const publishedGuides = (patientCornerData.guides || [])
                      .filter(g => g.status === 'Published' || g.status === true || (g.status && g.status !== 'Draft'))
                      .sort((a, b) => (parseInt(a.displayOrder || a.order, 10) || 0) - (parseInt(b.displayOrder || b.order, 10) || 0));

                    const dynamicGuideLinks = publishedGuides.map(g => ({
                      name: g.title || g.name,
                      href: '#patients',
                      guide: g
                    }));

                    columnsToRender = [
                      {
                        title: 'Patient Guide',
                        links: dynamicGuideLinks.length > 0 ? dynamicGuideLinks : (menuItem.columns[0]?.links || [])
                      },
                      menuItem.columns[1] || { title: 'Consultations', links: [] },
                      menuItem.columns[2] || { title: 'Quick Links', links: [] }
                    ];
                  }

                  return (
                    <div
                      key={menuItem.name}
                      className="nav-item-dropdown-container patients-nav-item"
                      onMouseEnter={() => setOpenNavDropdown(menuItem.name)}
                      onMouseLeave={() => setOpenNavDropdown(null)}
                    >
                      {menuItem.to && menuItem.to.startsWith('/') ? (
                        <Link to={menuItem.to} className="nav-dropdown-trigger">
                          {menuItem.name}
                        </Link>
                      ) : (
                        <a href={menuItem.to} className="nav-dropdown-trigger">
                          {menuItem.name}
                        </a>
                      )}

                      <div
                        className={`patients-mega-menu-wrapper animate-flyout-fade ${menuItem.name === 'Education & Medical Research' ? 'education-mega-menu-wrapper' : ''}`}
                        style={{
                          width: menuItem.name === 'Education & Medical Research' ? '540px' : columnsToRender.length === 2 ? '580px' : '860px',
                          left: 0
                        }}
                      >
                        <div
                          className="patients-mega-menu-grid"
                          style={{ gridTemplateColumns: `repeat(${columnsToRender.length}, 1fr)` }}
                        >
                          {columnsToRender.map((col, colIdx) => (
                            <div key={colIdx} className="patients-mega-menu-column">
                              {col.title && (
                                <h4 className={`patients-column-title ${col.hasArrow ? 'has-arrow-title' : ''}`}>
                                  <span>{col.title}</span>
                                  {col.hasArrow && (
                                    <span className="material-symbols-outlined dropdown-arrow-sub" style={{ fontSize: '1.25rem', verticalAlign: 'middle', marginLeft: '4px' }}>
                                      expand_more
                                    </span>
                                  )}
                                </h4>
                              )}
                              <ul className="patients-column-list">
                                {col.links.map((link, lIdx) => {
                                  const isAppointment = link.name === 'Book Appointment';
                                  const isHashLink = link.href === '#doctors' || link.href === '#testimonials';
                                  const isPatientGuide = menuItem.name === 'Patients Corner' && !isAppointment && !isHashLink;

                                  return (
                                    <li key={lIdx} className="patients-column-item">
                                      {link.to ? (
                                        <Link
                                          to={link.to}
                                          className="patients-column-link"
                                          onClick={() => setOpenNavDropdown(null)}
                                        >
                                          {menuItem.name !== 'Education & Medical Research' && <span className="link-btn-bullet"></span>}
                                          <span className="link-text">{link.name}</span>
                                        </Link>
                                      ) : isAppointment ? (
                                        <button
                                          type="button"
                                          className="patients-column-link"
                                          onClick={() => {
                                            onOpenAppointment();
                                            setOpenNavDropdown(null);
                                          }}
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', font: 'inherit', textAlign: 'left' }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-text">{link.name}</span>
                                        </button>
                                      ) : isPatientGuide ? (
                                        <Link
                                          to={`/patients-corner/${link.guide?.slug || createSlug(link.name)}`}
                                          className="patients-column-link"
                                          onClick={() => setOpenNavDropdown(null)}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-text">{link.name}</span>
                                        </Link>
                                      ) : (
                                        <a href={link.href} className="patients-column-link">
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-text">{link.name}</span>
                                        </a>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'dropdown') {
                  const isAboutUs = menuItem.name.toLowerCase().includes('about');
                  const isSpiritualCare = menuItem.name.toLowerCase().includes('spiritual');
                  const spiritualSections = (spiritualCareData.sections || defaultSpiritualSections)
                    .filter(s => s.enabled !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const effectiveLinks = isSpiritualCare
                    ? spiritualSections.map(s => ({ name: s.title, href: `#${s.id}`, section: s }))
                    : menuItem.links;

                  return (
                    <div
                      key={menuItem.name}
                      className={`nav-item-dropdown-container ${isAboutUs ? 'about-us-nav-item' : ''}`}
                      onMouseEnter={() => setOpenNavDropdown(menuItem.name)}
                      onMouseLeave={() => setOpenNavDropdown(null)}
                    >
                      {menuItem.to && menuItem.to.startsWith('/') ? (
                        <Link
                          to={menuItem.to}
                          className="nav-dropdown-trigger"
                          onClick={() => setOpenNavDropdown(null)}
                        >
                          {menuItem.name}
                        </Link>
                      ) : (
                        <a
                          href={menuItem.to}
                          className="nav-dropdown-trigger"
                        >
                          {menuItem.name}
                        </a>
                      )}
                      <div className={`simple-dropdown-menu ${isAboutUs ? 'about-us-dropdown-menu' : ''}`}>
                        <ul className="dropdown-list patients-column-list">
                          {effectiveLinks.map((link, lIdx) => (
                            <li key={lIdx} className="patients-column-item">
                              {isSpiritualCare ? (
                                <Link
                                  to={getSpiritualRoute(link)}
                                  className="patients-column-link"
                                  onClick={() => setOpenNavDropdown(null)}
                                >
                                  <span className="link-btn-bullet"></span>
                                  <span className="link-text">{link.name}</span>
                                </Link>
                              ) : (
                                <a href={link.href} className="patients-column-link">
                                  <span className="link-btn-bullet"></span>
                                  <span className="link-text">{link.name}</span>
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                }

                if (menuItem.to && menuItem.to.startsWith('/')) {
                  return (
                    <Link key={menuItem.name} to={menuItem.to} className="nav-link-item-simple">
                      {menuItem.name}
                    </Link>
                  );
                }

                return (
                  <a key={menuItem.name} href={menuItem.to} className="nav-link-item-simple">
                    {menuItem.name}
                  </a>
                );
              })}
            </div>

            <div className="nav-appointment-action">
              <button type="button" onClick={onOpenAppointment} className="btn-book-appointment">
                Book Appointment
              </button>
              <div className={`appointment-dropdown-menu ${isDropdownOpen || !isHomePage || isSolid ? 'dropdown-active-hidden' : ''}`}>
                <a href="#patients" className="appointment-dropdown-btn">
                  <span className="material-symbols-outlined">assignment</span>
                  <span>Patients Report</span>
                </a>
                <a href="#testimonials" className="appointment-dropdown-btn">
                  <span className="material-symbols-outlined">support_agent</span>
                  <span>Feedback</span>
                </a>
              </div>
            </div>
          </div>

          {/* Mobile Drawer (Responsive Overlay) */}
          <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-drawer-content">
              {/* Home Link */}
              {isHomePage ? (
                <a href="#home" className="mobile-nav-link-simple first-link" onClick={handleMobileLinkClick}>
                  <span className="material-symbols-outlined inline-icon">home</span> Home
                </a>
              ) : (
                <Link to="/" className="mobile-nav-link-simple first-link" onClick={handleMobileLinkClick}>
                  <span className="material-symbols-outlined inline-icon">home</span> Home
                </Link>
              )}

              {/* Dynamic Accordions */}
              {menuStructure.map((menuItem) => {
                if (menuItem.type === 'mega-menu') {
                  const isOpen = activeMobileDropdown === menuItem.name;
                  return (
                    <div key={menuItem.name} className="mobile-accordion-item">
                      <button
                        className={`mobile-accordion-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleMobileDropdown(menuItem.name)}
                      >
                        {menuItem.name}
                        <span className="material-symbols-outlined accordion-icon">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <div className={`mobile-accordion-content ${isOpen ? 'show' : ''}`}>
                        {specialitiesData.categories
                          ?.filter(c => c.status)
                          .map(cat => {
                            const catSpecs = specialitiesData.specialities?.filter(s => s.categoryId === cat.id && s.status);
                            if (!catSpecs || catSpecs.length === 0) return null;
                            return (
                              <div key={cat.id} className="mobile-sub-category">
                                <span className="mobile-sub-category-title">{cat.name}</span>
                                <div className="mobile-sub-links">
                                  {catSpecs.map(spec => (
                                    <Link
                                      key={spec.id}
                                      to={`/specialities/${spec.slug || createSlug(spec.name)}`}
                                      className="mobile-sub-link-a"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {spec.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'services-mega-menu') {
                  const isOpen = activeMobileDropdown === menuItem.name;
                  return (
                    <div key={menuItem.name} className="mobile-accordion-item">
                      <button
                        className={`mobile-accordion-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleMobileDropdown(menuItem.name)}
                      >
                        {menuItem.name}
                        <span className="material-symbols-outlined accordion-icon">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <div className={`mobile-accordion-content ${isOpen ? 'show' : ''}`}>
                        {servicesData.categories
                          ?.filter(c => c.status)
                          .map(cat => {
                            const catServices = servicesData.services?.filter(s => s.categoryId === cat.id && s.status);
                            if (!catServices || catServices.length === 0) return null;
                            return (
                              <div key={cat.id} className="mobile-sub-category">
                                <span className="mobile-sub-category-title">{cat.name}</span>
                                <div className="mobile-sub-links">
                                  {catServices.map(service => (
                                    <Link
                                      key={service.id}
                                      to={`/services/${service.slug || createSlug(service.name)}`}
                                      className="mobile-sub-link-a"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {service.name}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'patients-mega-menu') {
                  const isOpen = activeMobileDropdown === menuItem.name;
                  let columnsToRender = menuItem.columns;
                  if (menuItem.name === 'Patients Corner') {
                    const publishedGuides = (patientCornerData.guides || [])
                      .filter(g => g.status === 'Published' || g.status === true || (g.status && g.status !== 'Draft'))
                      .sort((a, b) => (parseInt(a.displayOrder || a.order, 10) || 0) - (parseInt(b.displayOrder || b.order, 10) || 0));

                    const dynamicGuideLinks = publishedGuides.map(g => ({
                      name: g.title || g.name,
                      href: '#patients',
                      guide: g
                    }));

                    columnsToRender = [
                      {
                        title: 'Patient Guide',
                        links: dynamicGuideLinks.length > 0 ? dynamicGuideLinks : (menuItem.columns[0]?.links || [])
                      },
                      menuItem.columns[1] || { title: 'Consultations', links: [] },
                      menuItem.columns[2] || { title: 'Quick Links', links: [] }
                    ];
                  }

                  return (
                    <div key={menuItem.name} className="mobile-accordion-item">
                      <button
                        className={`mobile-accordion-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleMobileDropdown(menuItem.name)}
                      >
                        {menuItem.name}
                        <span className="material-symbols-outlined accordion-icon">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <div className={`mobile-accordion-content ${isOpen ? 'show' : ''}`}>
                        {columnsToRender.map((col, colIdx) => (
                          <div key={colIdx} className="mobile-sub-category">
                            {col.title && (
                              <span className="mobile-sub-category-title" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <span>{col.title}</span>
                                {col.hasArrow && (
                                  <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>
                                    expand_more
                                  </span>
                                )}
                              </span>
                            )}
                            <div className="mobile-sub-links">
                              {col.links.map((link, lIdx) => {
                                const isAppointment = link.name === 'Book Appointment';
                                const isHashLink = link.href === '#doctors' || link.href === '#testimonials';
                                const isPatientGuide = menuItem.name === 'Patients Corner' && !isAppointment && !isHashLink;

                                if (link.to) {
                                  return (
                                    <Link
                                      key={lIdx}
                                      to={link.to}
                                      className="mobile-sub-link-a"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {link.name}
                                    </Link>
                                  );
                                }

                                if (isAppointment) {
                                  return (
                                    <button
                                      key={lIdx}
                                      className="mobile-sub-link-btn"
                                      onClick={() => {
                                        onOpenAppointment();
                                        handleMobileLinkClick();
                                      }}
                                    >
                                      {link.name}
                                    </button>
                                  );
                                }

                                if (isPatientGuide) {
                                  return (
                                    <Link
                                      key={lIdx}
                                      to={`/patients-corner/${link.guide?.slug || createSlug(link.name)}`}
                                      className="mobile-sub-link-a"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {link.name}
                                    </Link>
                                  );
                                }

                                return (
                                  <a
                                    key={lIdx}
                                    href={link.href}
                                    className="mobile-sub-link-a"
                                    onClick={handleMobileLinkClick}
                                  >
                                    {link.name}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'dropdown') {
                  const isOpen = activeMobileDropdown === menuItem.name;
                  const isSpiritualCare = menuItem.name.toLowerCase().includes('spiritual');
                  const spiritualSections = (spiritualCareData.sections || defaultSpiritualSections)
                    .filter(s => s.enabled !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const effectiveLinks = isSpiritualCare
                    ? spiritualSections.map(s => ({ name: s.title, href: `#${s.id}`, section: s }))
                    : menuItem.links;

                  return (
                    <div key={menuItem.name} className="mobile-accordion-item">
                      <button
                        className={`mobile-accordion-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => toggleMobileDropdown(menuItem.name)}
                      >
                        {menuItem.name}
                        <span className="material-symbols-outlined accordion-icon">
                          {isOpen ? 'expand_less' : 'expand_more'}
                        </span>
                      </button>

                      <div className={`mobile-accordion-content ${isOpen ? 'show' : ''}`}>
                        <div className="mobile-sub-links">
                          {effectiveLinks.map((link, lIdx) => (
                            isSpiritualCare ? (
                              <Link
                                key={lIdx}
                                to={getSpiritualRoute(link)}
                                className="mobile-sub-link-a"
                                onClick={handleMobileLinkClick}
                              >
                                {link.name}
                              </Link>
                            ) : (
                              <a
                                key={lIdx}
                                href={link.href}
                                className="mobile-sub-link-a"
                                onClick={handleMobileLinkClick}
                              >
                                {link.name}
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (menuItem.to && menuItem.to.startsWith('/')) {
                  return (
                    <Link
                      key={menuItem.name}
                      to={menuItem.to}
                      className="mobile-nav-link-simple"
                      onClick={handleMobileLinkClick}
                    >
                      {menuItem.name}
                    </Link>
                  );
                }

                return (
                  <a
                    key={menuItem.name}
                    href={menuItem.to}
                    className="mobile-nav-link-simple"
                    onClick={handleMobileLinkClick}
                  >
                    {menuItem.name}
                  </a>
                );
              })}

              <div className="mobile-drawer-footer">
                <button
                  type="button"
                  className="btn-book-appointment-mobile"
                  onClick={() => {
                    onOpenAppointment();
                    handleMobileLinkClick();
                  }}
                >
                  Book Appointment
                </button>
                <div className="mobile-drawer-emergency">
                  <span className="emergency-label">For Emergency & Appointments</span>
                  <span className="emergency-number">079 6900 2222</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
