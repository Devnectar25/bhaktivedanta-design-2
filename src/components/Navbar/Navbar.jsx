import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { getSpecialitiesState } from '../../utils/api';

const Navbar = ({ onSelectSpeciality }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSpecialitiesOpen, setMobileSpecialitiesOpen] = useState(false);

  const [specialitiesData, setSpecialitiesData] = useState(defaultSpecialitiesState);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
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

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
      <div className="container nav-content">
        <a href="/" className="logo-section">
          <img src="/icon.png" alt="Icon" className="logo-icon" />
          <img src="/logo.png" alt="Bhaktivedanta Hospital" className="logo" />
        </a>
        
        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
          
          <div className="nav-item-dropdown-container">
            <a 
              href="#specialities" 
              className="nav-dropdown-trigger"
              onClick={(e) => {
                if (window.innerWidth <= 900) {
                  e.preventDefault();
                  setMobileSpecialitiesOpen(!mobileSpecialitiesOpen);
                } else {
                  setMobileMenuOpen(false);
                }
              }}
            >
              Specialities <span className="dropdown-arrow">▼</span>
            </a>
            
            <div className={`mega-menu-dropdown ${mobileSpecialitiesOpen ? 'mobile-show' : ''}`}>
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
                                  setMobileMenuOpen(false);
                                  setMobileSpecialitiesOpen(false);
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

          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Doctors</a>
          <a href="#hospital" onClick={() => setMobileMenuOpen(false)}>Hospital</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <button className="btn-primary appointment-btn mobile-only">Book Appointment</button>
        </div>
        
        <div className="nav-buttons desktop-only">
          <button className="btn-primary appointment-btn">Book Appointment</button>
        </div>
        
        <button 
          className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
