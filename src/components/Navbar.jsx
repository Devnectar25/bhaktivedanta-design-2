import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <a href="/" className="logo-section">
          <img src="/logo.png" alt="Bhaktivedanta Hospital" className="logo" />
        </a>
        
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#doctors">Doctors</a>
          <a href="#hospital">Hospital</a>
          <a href="#contact">Contact</a>
        </div>
        
        <button className="btn-primary appointment-btn">Book Appointment</button>
        
        <div className="mobile-menu">
           {/* Mobile menu toggle would go here */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
