import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { getSpecialitiesState } from '../../utils/api';

const menuStructure = [
  {
    name: 'Specialities',
    type: 'mega-menu',
    to: '#specialities'
  },
  {
    name: 'Services',
    type: 'dropdown',
    to: '#services',
    links: [
      { name: '24/7 Emergency & Trauma', href: '#services' },
      { name: 'Ambulance Services', href: '#services' },
      { name: 'Diagnostics & Lab Services', href: '#services' },
      { name: '24/7 Pharmacy', href: '#services' },
      { name: 'ICU & Critical Care', href: '#services' },
      { name: 'Health Packages', href: '#packages' }
    ]
  },
  {
    name: 'Patients Corner',
    type: 'dropdown',
    to: '#patients',
    links: [
      { name: 'Find a Doctor', href: '#doctors' },
      { name: 'Book Appointment', href: '#contact' },
      { name: 'Guide for Patients', href: '#' },
      { name: 'Health Library & Education', href: '#' },
      { name: 'Feedback & Testimonials', href: '#testimonials' }
    ]
  },
  {
    name: 'Spiritual care',
    type: 'dropdown',
    to: '#spiritual',
    links: [
      { name: 'Spiritual Counselling', href: '#' },
      { name: 'Temple & Prayer Hall', href: '#' },
      { name: 'Holistic Healing', href: '#' },
      { name: 'Value Education', href: '#' }
    ]
  },
  {
    name: 'Education & Medical Research',
    type: 'dropdown',
    to: '#education',
    links: [
      { name: 'Nursing College', href: '#' },
      { name: 'DNB Fellowship Programs', href: '#' },
      { name: 'Research Center', href: '#' },
      { name: 'Publications & Studies', href: '#' }
    ]
  },
  {
    name: 'Our Associate Centre',
    type: 'dropdown',
    to: '#associate',
    links: [
      { name: 'Bhaktivedanta Hospice', href: '#' },
      { name: 'Rural Health Centers', href: '#' },
      { name: 'Mobile Clinics', href: '#' }
    ]
  },
  {
    name: 'Careers',
    type: 'link',
    to: '#'
  },
  {
    name: 'About us',
    type: 'dropdown',
    to: '#about',
    links: [
      { name: 'Overview & Mission', href: '#about' },
      { name: 'Leadership & Advisory', href: '#' },
      { name: 'Awards & Recognitions', href: '#' },
      { name: 'Contact Us', href: '#contact' }
    ]
  }
];

const Navbar = ({ onSelectSpeciality }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [specialitiesData, setSpecialitiesData] = useState(defaultSpecialitiesState);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'bhaktivedanta_specialities_state' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.specialities) {
            parsed.specialities.forEach(ensureStandardTabs);
          }
          setSpecialitiesData(parsed);
        } catch (err) {
          console.error("Storage change parsing error:", err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Sync with API on mount
    getSpecialitiesState(defaultSpecialitiesState).then(res => {
      if (res && res.specialities) {
        res.specialities.forEach(ensureStandardTabs);
      }
      setSpecialitiesData(res);
    });

    return () => window.removeEventListener('storage', handleStorageChange);
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
      {/* Top tier - Hidden on scroll for premium collapsed sticky view */}
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
            <img src="/emblem.png" alt="NABH Accredited" className="nabh-logo" />
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
                  return (
                    <div key={menuItem.name} className="nav-item-dropdown-container">
                      <a href={menuItem.to} className="nav-dropdown-trigger">
                        {menuItem.name}
                      </a>
                      <div className="mega-menu-dropdown">
                        <div className="mega-menu-grid">
                          {specialitiesData.categories
                            ?.filter(c => c.status)
                            .sort((a, b) => a.order - b.order)
                            .map(cat => {
                              const catSpecs = specialitiesData.specialities?.filter(s => s.categoryId === cat.id && s.status);
                              if (!catSpecs || catSpecs.length === 0) return null;
                              return (
                                <div key={cat.id} className="mega-menu-column">
                                  <h3 className="mega-menu-category-title">{cat.name}</h3>
                                  <ul className="mega-menu-list">
                                    {catSpecs.map(spec => (
                                      <li key={spec.id}>
                                        <button 
                                          className="mega-menu-link-btn"
                                          onClick={() => {
                                            onSelectSpeciality(spec, cat.name);
                                          }}
                                        >
                                          {spec.name}
                                        </button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
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
                                {link.name}
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
