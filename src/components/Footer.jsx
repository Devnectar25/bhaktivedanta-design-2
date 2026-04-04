import React from 'react';
import './Footer.css';
import { MessageCircle, Send, Camera, Share2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col about-col">
          <div className="footer-logo">
             <img src="/logo.png" alt="Logo" className="logo" />
             <div className="logo-text">
               <span className="name">BHAKTIVEDANTA HOSPITAL</span>
               <span className="tagline">& Research Institute</span>
             </div>
          </div>
          <p className="footer-desc">
            Providing compassionate, quality healthcare with spiritual warmth. 
            A haven for healing and wellness since 1998.
          </p>
          <div className="social-links">
            <a href="#"><MessageCircle size={20} /></a>
            <a href="#"><Send size={20} /></a>
            <a href="#"><Camera size={20} /></a>
            <a href="#"><Share2 size={20} /></a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#services">Our Services</a></li>
            <li><a href="#doctors">Meet Doctors</a></li>
            <li><a href="#hospital">Hospital Info</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Our Services</h3>
          <ul className="footer-links">
            <li><a href="#">Cardiology</a></li>
            <li><a href="#">Neurology</a></li>
            <li><a href="#">Orthopedics</a></li>
            <li><a href="#">Emergency</a></li>
            <li><a href="#">Critical Care</a></li>
            <li><a href="#">Laboratory</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact Info</h3>
          <ul className="footer-info">
             <li>+91 22 2845 1234</li>
             <li>info@bhaktivedantahospital.com</li>
             <li>Mira Road East, Thane, <br />Maharashtra 401107</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; 2026 Bhaktivedanta Hospital. All Rights Reserved.</p>
          <p>Made with <Heart size={14} fill="red" color="red" /> for healthy communities.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
