import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { getSpecialitiesState, getServicesState, getPatientCornerState, getEducationPrograms, getEducationResearchState, getAssociateCentres, getHospitalSettings, defaultHospitalSettings } from '../../utils/api';
import { defaultServicesState, ensureStandardServiceTabs } from '../../data/defaultServices';
import { defaultPatientCornerState, ensureStandardPatientCornerTabs } from '../../data/defaultPatientCorner';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState, defaultSpiritualSections, ensureStandardSpiritualSections } from '../../data/defaultSpiritualCare';
import { createSlug } from '../../pages/DetailPage/DetailPage';
import NavSearch from './NavSearch';

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
          { name: 'Book Appointment', href: 'https://his.bhaktivedantahospital.com/EHR/', isExternal: true },
          { name: 'Online Consultation', href: '#patients' },
          { name: 'Video Consultation', href: '#patients' },
          { name: 'Patient Report', href: 'https://his.bhaktivedantahospital.com/EHR/', isExternal: true }
        ]
      },
      {
        title: 'Quick Links',
        links: [
          { name: 'Feedback', to: '/feedback' },
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
    to: '#spiritual-care',
    links: [
      { name: 'Spiritual care Services', href: '#spiritual-care-services' },
      { name: 'Educational Programmes', href: '#educational-programmes' },
      { name: 'Spiritual care Retreats', href: '#spiritual-retreats' },
      { name: 'Publications & Paper Presentations', href: '#publications' }
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
    type: 'dropdown',
    to: '/our-associate-centre/swami-shraddhanand-hospital',
    links: [
      { name: 'Swami Shraddhanand Hospital', href: '/our-associate-centre/swami-shraddhanand-hospital' },
      { name: 'Sheth P. V. Doshi Hospital', href: '/our-associate-centre/sheth-pb-doshi-hospital' },
      { name: 'Primary Health Care Centre – Pophran', href: '/our-associate-centre/primary-health-care-centre-pophran' },
      { name: 'Hamrapur Healthcare Centre', href: '/our-associate-centre/hamrapur-healthcare-centre' },
      { name: 'Ambiste Healthcare Centre', href: '/our-associate-centre/ambiste-healthcare-centre' },
      { name: 'Bhaktivedanta Polyclinic', href: '/our-associate-centre/bhaktivedanta-polyclinic' },
      { name: 'Bhaktivedanta Hospital – Vrindavan', href: '/our-associate-centre/bhaktivedanta-hospital-vrindavan' },
      { name: 'Bhaktivedanta Eye Hospital – Barsana', href: '/our-associate-centre/bhaktivedanta-eye-hospital-barsana' },
      { name: 'Saksham Community Health Centre – Dhuktan', href: '/our-associate-centre/saksham-community-health-centre-dhuktan' }
    ]
  },
  {
    name: 'Careers',
    type: 'link',
    to: '/careers'
  },
  {
    name: 'About Us',
    type: 'dropdown',
    to: '/about-us/about-hospital',
    links: [
      {
        name: 'About Hospital',
        href: '/about-us/about-hospital',
        hasSubmenu: true,
        subLinks: [
          { name: 'History of Hospital', href: '/about-us/about-hospital#history' },
          { name: "Chairman's message", href: '/about-us/about-hospital#chairman' },
          { name: 'Our inspiration', href: '/about-us/about-hospital#inspiration' },
          { name: 'Logo', href: '/about-us/about-hospital#logo' }
        ]
      },
      { name: 'Vision, Mission, Quality Policy, Values', href: '/about-us/about-hospital#vision-mission' },
      { name: 'Awards & Accreditation', href: '/about-us/about-hospital#awards' },
      { name: 'Events & Hospital In News', href: '/about-us/about-hospital#events' },
      { name: 'Shri Chaitanya Health and Care Trust', href: '/about-us/sri-chaitanya-health-care-and-trust-cst' },
      { name: 'New Developments & Updates', href: '/about-us/new-developments-updates' },
      { name: 'Our Management Team', href: '/about-us/our-management-team' },
      { name: 'Our Spiritual Advisors', href: '/about-us/spiritual-advisors' }
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

  const resolveNavHref = (href) => {
    if (!href) return '#';
    if (href.startsWith('#') && !isHomePage) {
      return `/${href}`;
    }
    return href;
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [specialitiesData, setSpecialitiesData] = useState(defaultSpecialitiesState);
  const [activeMegaCategory, setActiveMegaCategory] = useState(null);

  const [servicesData, setServicesData] = useState(defaultServicesState);
  const [activeServiceCategory, setActiveServiceCategory] = useState(null);
  const [patientCornerData, setPatientCornerData] = useState(defaultPatientCornerState);
  const [spiritualCareData, setSpiritualCareData] = useState(() => ensureStandardSpiritualSections(defaultSpiritualCareState));
  const [customEducationPrograms, setCustomEducationPrograms] = useState([]);
  const [aboutHospitalOpen, setAboutHospitalOpen] = useState(true);
  const [openNavDropdown, setOpenNavDropdown] = useState(null);
  const [associateCentresListState, setAssociateCentresListState] = useState([]);
  const [hospitalSettings, setHospitalSettings] = useState(defaultHospitalSettings);

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

    const fetchEducationPrograms = () => {
      Promise.all([
        getEducationPrograms([]),
        getEducationResearchState(null)
      ]).then(([progs, state]) => {
        const list = [
          ...(state?.customPrograms || []),
          ...(Array.isArray(progs) ? progs : [])
        ];
        const unique = Array.from(new Map(list.filter(Boolean).map(p => [p.slug || p.id, p])).values());
        const standardSlugs = new Set([
          'dnb-program', 'nursing-program', 'cme', 'cne', 'spiritual-care-course',
          'clinical-research-course', 'clinical-trials', 'ethics-committee', 'publications', 'government-accreditation',
          'dnb-general-medicine', 'dnb-paediatrics', 'dnb-ophthalmology', 'dnb-obstetrics-gynaecology',
          'diploma-radio-diagnosis', 'dnb-urology', 'dnb-anesthesiology'
        ]);
        const dynamicOnly = unique.filter(p => !standardSlugs.has(p.slug) && !standardSlugs.has(p.id));
        setCustomEducationPrograms(dynamicOnly);
      }).catch(err => {
        console.warn('Navbar could not load live education programs:', err);
      });
    };

    const fetchAssociateCentres = () => {
      getAssociateCentres().then(centres => {
        if (Array.isArray(centres) && centres.length > 0) {
          const activeCentres = centres.filter(c => c.status !== 'Inactive');
          setAssociateCentresListState(activeCentres);
        }
      }).catch(err => {
        console.warn('Navbar could not load live associate centres:', err);
      });
    };

    const fetchHospitalSettings = () => {
      getHospitalSettings().then(res => {
        if (res && typeof res === 'object') {
          setHospitalSettings(prev => ({ ...prev, ...res }));
        }
      }).catch(err => {
        console.warn('Navbar could not load live hospital settings:', err);
      });
    };

    // Initial fetch on mount
    fetchSpecialities();
    fetchServices();
    fetchPatientCorner();
    fetchSpiritualCare();
    fetchEducationPrograms();
    fetchAssociateCentres();
    fetchHospitalSettings();

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
      if (!e || !e.key || e.key === 'bhaktivedanta_education_custom_programs' || e.key === 'bhaktivedanta_education_research_state') {
        fetchEducationPrograms();
      }
      if (!e || !e.key || e.key === 'bhaktivedanta_associate_centres_cache') {
        fetchAssociateCentres();
      }
      if (!e || !e.key || e.key === 'bhaktivedanta_hospital_settings_cache') {
        fetchHospitalSettings();
      }
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('hospital_settings_updated', handleSync);
    window.addEventListener('associate_centres_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('hospital_settings_updated', handleSync);
      window.removeEventListener('associate_centres_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handlePatientGuideClick = (linkName) => {
    const normalizedName = (linkName || '').toLowerCase().trim();
    const guides = patientCornerData.guides || defaultPatientCornerState.guides || [];

    const foundGuide = guides.find(g => {
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

    const targetGuide = foundGuide || {
      id: `guide-${normalizedName.replace(/[^a-z0-9]+/g, '-')}`,
      title: linkName,
      name: linkName,
      category: 'Patients Corner',
      categoryName: 'Patients Corner',
      tabs: [
        {
          id: 't1',
          title: 'Overview',
          type: 'rich_text',
          enabled: true,
          content: `<p>Welcome to Bhaktivedanta Hospital & Research Institute — ${linkName}. Please contact our helpdesk or admission counter for further details.</p>`
        }
      ]
    };

    const slug = foundGuide?.slug || targetGuide.slug || createSlug(linkName);
    navigate(`/patients-corner/${slug}`);
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

          <a 
            href={`tel:${String(hospitalSettings.emergencyPhone || '079 6900 2222').replace(/\s+/g, '')}`}
            className="emergency-badge"
            style={{ textDecoration: 'none' }}
            title="Call Emergency & Appointments"
          >
            <span className="emergency-label">{hospitalSettings.emergencyLabel || 'For Emergency & Appointments'}</span>
            <span className="emergency-number">{hospitalSettings.emergencyPhone || '079 6900 2222'}</span>
          </a>

          <div className="top-right-section">
            <EmblemLogo />
            <NavSearch isScrolled={isSolid} />
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

            <div className="mobile-header-actions">
              <NavSearch isScrolled={isSolid} />

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
                                        <button
                                          className="speciality-link-btn"
                                          onClick={() => {
                                            const slug = s.slug || createSlug(s.name);
                                            navigate(`/specialities/${slug}`);
                                            setActiveMegaCategory(null);
                                            setOpenNavDropdown(null);
                                          }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-btn-text">{s.name}</span>
                                        </button>
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
                                        <button
                                          className="speciality-link-btn"
                                          onClick={() => {
                                            const slug = s.slug || createSlug(s.name);
                                            navigate(`/services/${slug}`);
                                            setActiveServiceCategory(null);
                                            setOpenNavDropdown(null);
                                          }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-btn-text">{s.name}</span>
                                        </button>
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
                  const isEduMenu = menuItem.name === 'Education & Medical Research';
                  const effectiveColumns = (isEduMenu && customEducationPrograms.length > 0)
                    ? [
                        {
                          ...menuItem.columns[0],
                          links: [
                            ...menuItem.columns[0].links,
                            ...customEducationPrograms.map(p => ({
                              name: p.title,
                              to: `/education/${p.slug || p.id}`
                            }))
                          ]
                        },
                        menuItem.columns[1]
                      ]
                    : menuItem.columns;

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
                        className={`patients-mega-menu-wrapper animate-flyout-fade ${isEduMenu ? 'education-mega-menu-wrapper' : ''}`}
                        style={{
                          width: isEduMenu ? '540px' : effectiveColumns.length === 2 ? '580px' : '860px',
                          left: 0
                        }}
                      >
                        <div
                          className="patients-mega-menu-grid"
                          style={{ gridTemplateColumns: `repeat(${effectiveColumns.length}, 1fr)` }}
                        >
                          {effectiveColumns.map((col, colIdx) => (
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
                                  const isPatientReport = link.name === 'Patient Report' || link.name === 'Patients Report';
                                  const isExternalEHR = isAppointment || isPatientReport || link.isExternal;
                                  const isHashLink = link.href === '#doctors' || link.href === '#testimonials';
                                  const isPatientGuide = menuItem.name === 'Patients Corner' && !isExternalEHR && !isHashLink;

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
                                      ) : isExternalEHR ? (
                                        <a
                                          href="https://his.bhaktivedantahospital.com/EHR/"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="patients-column-link"
                                          onClick={() => setOpenNavDropdown(null)}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-text">{link.name}</span>
                                        </a>
                                      ) : isPatientGuide ? (
                                        <button
                                          type="button"
                                          className="patients-column-link"
                                          onClick={() => {
                                            handlePatientGuideClick(link.name);
                                            setOpenNavDropdown(null);
                                          }}
                                          style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', font: 'inherit', textAlign: 'left' }}
                                        >
                                          <span className="link-btn-bullet"></span>
                                          <span className="link-text">{link.name}</span>
                                        </button>
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
                  const isAssociateCentre = menuItem.name.toLowerCase().includes('associate');
                  const isSpiritualCare = menuItem.name.toLowerCase().includes('spiritual');
                  const isDropdownActive = openNavDropdown === menuItem.name;
                  const spiritualSections = (spiritualCareData.sections || defaultSpiritualSections)
                    .filter(s => s.enabled !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const effectiveLinks = isSpiritualCare
                    ? spiritualSections.map(s => ({ name: s.title, href: `#${s.id}`, section: s }))
                    : isAssociateCentre && associateCentresListState.length > 0
                      ? associateCentresListState.map(c => ({ name: c.title || c.name, href: `/our-associate-centre/${c.slug}` }))
                      : menuItem.links;

                  return (
                    <div
                      key={menuItem.name}
                      className={`nav-item-dropdown-container ${isAboutUs ? 'about-us-nav-item' : ''} ${isAssociateCentre ? 'associate-nav-item' : ''} ${isDropdownActive ? 'is-open' : ''}`}
                      onMouseEnter={() => setOpenNavDropdown(menuItem.name)}
                      onMouseLeave={() => setOpenNavDropdown(null)}
                    >
                      {menuItem.to && menuItem.to.startsWith('/') ? (
                        <Link
                          to={menuItem.to}
                          className={`nav-dropdown-trigger ${isAboutUs ? 'about-us-trigger' : ''} ${isAssociateCentre ? 'associate-trigger' : ''} ${isDropdownActive ? 'trigger-active' : ''}`}
                          onClick={(e) => {
                            setOpenNavDropdown(null);
                            if (isSpiritualCare) {
                              e.preventDefault();
                              const firstSec = spiritualSections[0];
                              handleSpiritualCareClick(firstSec || 'Spiritual care Services');
                            }
                          }}
                        >
                          <span>{menuItem.name}</span>
                          {(isAboutUs || isAssociateCentre) && (
                            <span className="material-symbols-outlined nav-dropdown-arrow">
                              expand_more
                            </span>
                          )}
                        </Link>
                      ) : (
                        <a
                          href={menuItem.to}
                          className={`nav-dropdown-trigger ${isAboutUs ? 'about-us-trigger' : ''} ${isAssociateCentre ? 'associate-trigger' : ''} ${isDropdownActive ? 'trigger-active' : ''}`}
                          onClick={(e) => {
                            if (isSpiritualCare) {
                              e.preventDefault();
                              const firstSec = spiritualSections[0];
                              handleSpiritualCareClick(firstSec || 'Spiritual care Services');
                              setOpenNavDropdown(null);
                            }
                          }}
                        >
                          <span>{menuItem.name}</span>
                          {(isAboutUs || isAssociateCentre) && (
                            <span className="material-symbols-outlined nav-dropdown-arrow">
                              expand_more
                            </span>
                          )}
                        </a>
                      )}
                      <div className={`simple-dropdown-menu ${isAboutUs ? 'about-us-dropdown-menu' : ''} ${isAssociateCentre ? 'associate-dropdown-menu' : ''}`}>
                        <ul className="dropdown-list patients-column-list">
                          {effectiveLinks.map((link, lIdx) => {
                            if (isAboutUs && link.hasSubmenu && link.subLinks) {
                              return (
                                <React.Fragment key={lIdx}>
                                  <li className="patients-column-item about-hospital-parent-item">
                                    <div className="about-hospital-row">
                                      <Link
                                        to={link.href}
                                        className="patients-column-link about-hospital-link"
                                        onClick={() => setOpenNavDropdown(null)}
                                      >
                                        <span className="link-text">{link.name}</span>
                                      </Link>
                                      <button
                                        type="button"
                                        className="about-hospital-toggle-btn"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setAboutHospitalOpen(prev => !prev);
                                        }}
                                        aria-label="Toggle About Hospital submenu"
                                      >
                                        <span
                                          className={`material-symbols-outlined about-sub-chevron ${aboutHospitalOpen ? 'open' : ''}`}
                                        >
                                          expand_more
                                        </span>
                                      </button>
                                    </div>
                                  </li>
                                  {aboutHospitalOpen && (
                                    <li className="about-nested-sublinks-container">
                                      <ul className="about-nested-sublinks-list">
                                        {link.subLinks.map((sub, sIdx) => (
                                          <li key={sIdx} className="about-nested-sub-item">
                                            {sub.href && sub.href.startsWith('/') ? (
                                              <Link
                                                to={sub.href}
                                                className="patients-column-link about-nested-sublink"
                                                onClick={() => setOpenNavDropdown(null)}
                                              >
                                                <span className="link-text">{sub.name}</span>
                                              </Link>
                                            ) : (
                                              <a
                                                href={resolveNavHref(sub.href)}
                                                className="patients-column-link about-nested-sublink"
                                                onClick={() => setOpenNavDropdown(null)}
                                              >
                                                <span className="link-text">{sub.name}</span>
                                              </a>
                                            )}
                                          </li>
                                        ))}
                                      </ul>
                                    </li>
                                  )}
                                </React.Fragment>
                              );
                            }

                            return (
                              <li key={lIdx} className="patients-column-item">
                                {isSpiritualCare ? (
                                  <button
                                    type="button"
                                    className="patients-column-link"
                                    onClick={() => {
                                      handleSpiritualCareClick(link.section || link.name);
                                      setOpenNavDropdown(null);
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', font: 'inherit', textAlign: 'left' }}
                                  >
                                    <span className="link-btn-bullet"></span>
                                    <span className="link-text">{link.name}</span>
                                  </button>
                                ) : link.href && link.href.startsWith('/') ? (
                                  <Link
                                    to={link.href}
                                    className="patients-column-link"
                                    onClick={() => setOpenNavDropdown(null)}
                                  >
                                    {!isAboutUs && !isAssociateCentre && <span className="link-btn-bullet"></span>}
                                    <span className="link-text">{link.name}</span>
                                  </Link>
                                ) : (
                                  <a
                                    href={resolveNavHref(link.href)}
                                    className="patients-column-link"
                                    onClick={() => setOpenNavDropdown(null)}
                                  >
                                    {!isAboutUs && !isAssociateCentre && <span className="link-btn-bullet"></span>}
                                    <span className="link-text">{link.name}</span>
                                  </a>
                                )}
                              </li>
                            );
                          })}
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
                  <a key={menuItem.name} href={resolveNavHref(menuItem.to)} className="nav-link-item-simple">
                    {menuItem.name}
                  </a>
                );
              })}
            </div>

            <div className="nav-appointment-action">
              <a
                href="https://his.bhaktivedantahospital.com/EHR/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-book-appointment"
              >
                Book Appointment
              </a>
              <div className="appointment-dropdown-menu">
                <a
                  href="https://his.bhaktivedantahospital.com/EHR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="appointment-dropdown-btn"
                >
                  <span className="material-symbols-outlined">assignment</span>
                  <span>Patients Report</span>
                </a>
                <Link to="/feedback" className="appointment-dropdown-btn">
                  <span className="material-symbols-outlined">support_agent</span>
                  <span>Feedback</span>
                </Link>
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
                                    <button
                                      key={spec.id}
                                      className="mobile-sub-link-btn"
                                      onClick={() => {
                                        const slug = spec.slug || createSlug(spec.name);
                                        navigate(`/specialities/${slug}`);
                                        handleMobileLinkClick();
                                      }}
                                    >
                                      {spec.name}
                                    </button>
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
                                    <button
                                      key={service.id}
                                      className="mobile-sub-link-btn"
                                      onClick={() => {
                                        const slug = service.slug || createSlug(service.name);
                                        navigate(`/services/${slug}`);
                                        handleMobileLinkClick();
                                      }}
                                    >
                                      {service.name}
                                    </button>
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
                  const isEduMenu = menuItem.name === 'Education & Medical Research';
                  const effectiveColumns = (isEduMenu && customEducationPrograms.length > 0)
                    ? [
                        {
                          ...menuItem.columns[0],
                          links: [
                            ...menuItem.columns[0].links,
                            ...customEducationPrograms.map(p => ({
                              name: p.title,
                              to: `/education/${p.slug || p.id}`
                            }))
                          ]
                        },
                        menuItem.columns[1]
                      ]
                    : menuItem.columns;

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
                        {effectiveColumns.map((col, colIdx) => (
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
                                const isPatientReport = link.name === 'Patient Report' || link.name === 'Patients Report';
                                const isExternalEHR = isAppointment || isPatientReport || link.isExternal;
                                const isHashLink = link.href === '#doctors' || link.href === '#testimonials';
                                const isPatientGuide = menuItem.name === 'Patients Corner' && !isExternalEHR && !isHashLink;

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

                                if (isExternalEHR) {
                                  return (
                                    <a
                                      key={lIdx}
                                      href="https://his.bhaktivedantahospital.com/EHR/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mobile-sub-link-a"
                                      onClick={handleMobileLinkClick}
                                    >
                                      {link.name}
                                    </a>
                                  );
                                }

                                if (isPatientGuide) {
                                  return (
                                    <button
                                      key={lIdx}
                                      className="mobile-sub-link-btn"
                                      onClick={() => {
                                        handlePatientGuideClick(link.name);
                                        handleMobileLinkClick();
                                      }}
                                    >
                                      {link.name}
                                    </button>
                                  );
                                }

                                return (
                                  <a
                                    key={lIdx}
                                    href={resolveNavHref(link.href)}
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
                  const isAssociateCentre = menuItem.name.toLowerCase().includes('associate');
                  const isSpiritualCare = menuItem.name.toLowerCase().includes('spiritual');
                  const spiritualSections = (spiritualCareData.sections || defaultSpiritualSections)
                    .filter(s => s.enabled !== false)
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                  const effectiveLinks = isSpiritualCare
                    ? spiritualSections.map(s => ({ name: s.title, href: `#${s.id}`, section: s }))
                    : isAssociateCentre && associateCentresListState.length > 0
                      ? associateCentresListState.map(c => ({ name: c.title || c.name, href: `/our-associate-centre/${c.slug}` }))
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
                          {effectiveLinks.map((link, lIdx) => {
                            if (link.hasSubmenu && link.subLinks) {
                              return (
                                <div key={lIdx} className="mobile-nested-subgroup py-1">
                                  <div className="mobile-sub-link-a font-bold text-slate-800 flex items-center justify-between">
                                    <Link
                                      to={link.href}
                                      onClick={handleMobileLinkClick}
                                      style={{ color: 'inherit', textDecoration: 'none', flex: 1 }}
                                    >
                                      {link.name}
                                    </Link>
                                    <span className="material-symbols-outlined text-slate-500 text-sm">expand_more</span>
                                  </div>
                                  <div className="pl-3 flex flex-col gap-1 border-l-2 border-orange-300 ml-2 my-1">
                                    {link.subLinks.map((sub, sIdx) => (
                                      <a
                                        key={sIdx}
                                        href={sub.href}
                                        className="mobile-sub-link-a text-slate-600 hover:text-orange-600 text-xs py-1"
                                        onClick={handleMobileLinkClick}
                                      >
                                        {sub.name}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              );
                            }

                            return isSpiritualCare ? (
                              <button
                                key={lIdx}
                                className="mobile-sub-link-btn"
                                onClick={() => {
                                  handleSpiritualCareClick(link.section || link.name);
                                  handleMobileLinkClick();
                                }}
                              >
                                {link.name}
                              </button>
                            ) : link.href && link.href.startsWith('/') ? (
                              <Link
                                key={lIdx}
                                to={link.href}
                                className="mobile-sub-link-a"
                                onClick={handleMobileLinkClick}
                              >
                                {link.name}
                              </Link>
                            ) : (
                              <a
                                key={lIdx}
                                href={resolveNavHref(link.href)}
                                className="mobile-sub-link-a"
                                onClick={handleMobileLinkClick}
                              >
                                {link.name}
                              </a>
                            );
                          })}
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
                    href={resolveNavHref(menuItem.to)}
                    className="mobile-nav-link-simple"
                    onClick={handleMobileLinkClick}
                  >
                    {menuItem.name}
                  </a>
                );
              })}

              <div className="mobile-drawer-footer">
                <Link
                  to="/contact"
                  className="mobile-nav-link-simple"
                  style={{ display: 'block', textAlign: 'center', marginBottom: '12px', fontWeight: 700 }}
                  onClick={handleMobileLinkClick}
                >
                  Contact Us
                </Link>
                <a
                  href="https://his.bhaktivedantahospital.com/EHR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-book-appointment-mobile"
                  onClick={handleMobileLinkClick}
                  style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                >
                  Book Appointment
                </a>
                <div className="mobile-drawer-emergency">
                  <span className="emergency-label">{hospitalSettings.emergencyLabel || 'For Emergency & Appointments'}</span>
                  <a
                    href={`tel:${String(hospitalSettings.emergencyPhone || '079 6900 2222').replace(/\s+/g, '')}`}
                    className="emergency-number"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    {hospitalSettings.emergencyPhone || '079 6900 2222'}
                  </a>
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
