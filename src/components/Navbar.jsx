import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
          <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
          <a href="#doctors" onClick={() => setMobileMenuOpen(false)}>Doctors</a>
          <a href="#hospital" onClick={() => setMobileMenuOpen(false)}>Hospital</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a>
          <a href="/admin/login.html" className="admin-link mobile-only" onClick={() => setMobileMenuOpen(false)}>Admin</a>
          <button className="btn-primary appointment-btn mobile-only">Book Appointment</button>
        </div>
        
        <div className="nav-buttons desktop-only">
          <a href="/admin/login.html" className="admin-btn">Admin</a>
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
