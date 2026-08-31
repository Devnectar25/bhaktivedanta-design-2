import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { getSpecialitiesState } from '../../utils/api';
import { defaultServicesState } from '../../data/defaultServices';

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
    to: '#spiritual',
    links: [
      { name: 'Spiritual care Services', href: '#spiritual' },
      { name: 'Educational Programmes', href: '#spiritual' },
      { name: 'Spiritual care Retreats', href: '#spiritual' },
      { name: 'Publications & Paper Presentations', href: '#spiritual' }
    ]
  },
  {
    name: 'Education & Medical Research',
    type: 'patients-mega-menu',
    to: '#education',
    columns: [
      {
        title: 'Education',
        links: [
          { name: 'DNB Program', href: '#education' },
          { name: 'Nursing Program', href: '#education' },
          { name: 'CME', href: '#education' },
          { name: 'CNE', href: '#education' },
          { name: 'Spiritual care Certificate Course', href: '#education' }
        ]
      },
      {
        title: 'Medical Research',
        links: [
          { name: 'Clinical Research Course', href: '#education' },
          { name: 'Clinical Trials', href: '#education' },
          { name: 'Institutional Ethics Committee', href: '#education' },
          { name: 'Publications', href: '#education' },
          { name: 'Government Accreditation', href: '#education' }
        ]
      }
    ]
  },
  {
    name: 'Our Associate Centre',
    type: 'dropdown',
    to: '#associate',
    links: [
      { name: 'Swami Shraddhanand Hospital', href: '#associate' },
      { name: 'Sheth P. V. Doshi Hospital', href: '#associate' },
      { name: 'Primary Health Care Centre - Pophran', href: '#associate' },
      { name: 'Hamrapur Healthcare Centre', href: '#associate' },
      { name: 'Ambiste Healthcare Centre', href: '#associate' },
      { name: 'Bhaktivedanta Polyclinic', href: '#associate' },
      { name: 'Bhaktivedanta Hospital - Vrindavan', href: '#associate' },
      { name: 'Bhaktivedanta Eye Hospital - Barsana', href: '#associate' },
      { name: 'Saksham Community Health Centre - Dhuktan', href: '#associate' }
    ]
  },
  {
    name: 'Careers',
    type: 'link',
    to: '#careers'
  },
  {
    name: 'About us',
    type: 'dropdown',
    to: '#about',
    links: [
      { name: 'About Hospital', href: '#about' },
      { name: 'Vision, Mission, Quality Policy, Values', href: '#about' },
      { name: 'Awards & Accreditation', href: '#about' },
      { name: 'Events & Hospital In News', href: '#about' },
      { name: 'Shri Chaitanya Health and Care Trust', href: '#about' },
      { name: 'New Developments & Updates', href: '#about' },
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

const Navbar = ({ onSelectSpeciality }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [specialitiesData, setSpecialitiesData] = useState(defaultSpecialitiesState);
  const [activeMegaCategory, setActiveMegaCategory] = useState(null);

  const [servicesData, setServicesData] = useState(defaultServicesState);
  const [activeServiceCategory, setActiveServiceCategory] = useState(null);

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

    const handleStorageChange = (e) => {
      if (e.key === 'bhaktivedanta_specialities_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.categories) {
            if (parsed.specialities) parsed.specialities.forEach(ensureStandardTabs);
            setSpecialitiesData(parsed);
          }
        } catch (err) {
          console.error("Storage change parsing error:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Sync with API on mount
    getSpecialitiesState(defaultSpecialitiesState).then(res => {
      if (res && res.categories) {
        if (res.specialities) res.specialities.forEach(ensureStandardTabs);
        setSpecialitiesData(res);
      } else {
        setSpecialitiesData(defaultSpecialitiesState);
      }
    });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      {/* Top tier - Logo, Emergency and Actions bar */}
      <div className="navbar-top-tier">
        <div className="container top-tier-container">
          <a href="/" className="logo-section">
            <img src="/icon.png" alt="Emblem" className="logo-icon" />
            <img src="/logo.png" alt="Bhaktivedanta Hospital" className="logo-text" />
          </a>

          <div className="emergency-badge">
            <span className="emergency-label">For Emergency & Appointments</span>
            <span className="emergency-number">079 6900 2222</span>
          </div>

          <div className="top-right-section">
            <EmblemLogo />
            <button className="search-icon-btn" aria-label="Search">
              <span className="material-symbols-outlined">search</span>
            </button>
            <a href="#contact" className="contact-us-link">Contact Us</a>
          </div>
        </div>
      </div>

      {/* Bottom tier - Sticky navigation */}
      <div className="navbar-bottom-tier">
        <div className="container bottom-tier-container">
          {/* Mobile Header Bar */}
          <div className="mobile-header-bar">
            <a href="/" className="mobile-logo-section">
              <img src="/icon.png" alt="Emblem" className="logo-icon" />
              <img src="/logo.png" alt="Bhaktivedanta" className="logo-text" />
            </a>

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
              {/* Home Text Link (replaces the icon as requested) */}
              <a href="#home" className="nav-link-item-simple">
                Home
              </a>

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
                      onMouseLeave={() => setActiveMegaCategory(null)}
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
                                            onSelectSpeciality(s, currentCat.name);
                                            setActiveMegaCategory(null);
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
                      onMouseLeave={() => setActiveServiceCategory(null)}
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
                                            onSelectSpeciality(s, currentCat.name);
                                            setActiveServiceCategory(null);
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
                  return (
                    <div key={menuItem.name} className="nav-item-dropdown-container patients-nav-item">
                      <a href={menuItem.to} className="nav-dropdown-trigger">
                        {menuItem.name}
                      </a>
                      
                      <div 
                        className="patients-mega-menu-wrapper animate-flyout-fade"
                        style={{ 
                          width: menuItem.columns.length === 2 ? '580px' : '860px',
                          left: menuItem.columns.length === 2 ? '-40px' : '-180px' 
                        }}
                      >
                        <div 
                          className="patients-mega-menu-grid"
                          style={{ gridTemplateColumns: `repeat(${menuItem.columns.length}, 1fr)` }}
                        >
                          {menuItem.columns.map((col, colIdx) => (
                            <div key={colIdx} className="patients-mega-menu-column">
                              <h4 className="patients-column-title">{col.title}</h4>
                              <ul className="patients-column-list">
                                {col.links.map((link, lIdx) => (
                                  <li key={lIdx} className="patients-column-item">
                                    <a href={link.href} className="patients-column-link">
                                      <span className="link-btn-bullet"></span>
                                      <span className="link-text">{link.name}</span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'dropdown') {
                  return (
                    <div key={menuItem.name} className="nav-item-dropdown-container">
                      <a href={menuItem.to} className="nav-dropdown-trigger">
                        {menuItem.name}
                      </a>
                      <div className="simple-dropdown-menu">
                        <ul className="dropdown-list">
                          {menuItem.links.map((link, lIdx) => (
                            <li key={lIdx}>
                              <a href={link.href} className="dropdown-link-item">
                                <span className="dropdown-item-bullet"></span>
                                <span className="dropdown-item-text">{link.name}</span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
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
              <a href="#contact" className="btn-book-appointment">
                Book Appointment
              </a>
            </div>
          </div>

          {/* Mobile Drawer (Responsive Overlay) */}
          <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-drawer-content">
              {/* Home Link */}
              <a href="#home" className="mobile-nav-link-simple first-link" onClick={handleMobileLinkClick}>
                <span className="material-symbols-outlined inline-icon">home</span> Home
              </a>

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
                                        onSelectSpeciality(spec, cat.name);
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
                                  {catServices.map(srv => (
                                    <button
                                      key={srv.id}
                                      className="mobile-sub-link-btn"
                                      onClick={() => {
                                        onSelectSpeciality(srv, cat.name);
                                        handleMobileLinkClick();
                                      }}
                                    >
                                      {srv.name}
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
                        {menuItem.columns.map((col, colIdx) => (
                          <div key={colIdx} className="mobile-sub-category">
                            <span className="mobile-sub-category-title">{col.title}</span>
                            <div className="mobile-sub-links">
                              {col.links.map((link, lIdx) => (
                                <a
                                  key={lIdx}
                                  href={link.href}
                                  className="mobile-sub-link-a"
                                  onClick={handleMobileLinkClick}
                                >
                                  {link.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (menuItem.type === 'dropdown') {
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
                        <div className="mobile-sub-links">
                          {menuItem.links.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link.href}
                              className="mobile-sub-link-a"
                              onClick={handleMobileLinkClick}
                            >
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
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
                <a href="#contact" className="btn-book-appointment-mobile" onClick={handleMobileLinkClick}>
                  Book Appointment
                </a>
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
