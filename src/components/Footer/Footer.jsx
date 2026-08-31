import React from 'react';
import './Footer.css';
import { HeartPulse, Bone, BedDouble } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col about-col">
          <div className="footer-logo">
             <div className="footer-logo-wrap">
               <img src="/icon.png" alt="Icon" className="footer-icon" />
               <img src="/logo.png" alt="Logo" className="logo" />
             </div>
          </div>
          <p className="footer-desc">
            Providing compassionate, quality healthcare with spiritual warmth. 
            A haven for healing and wellness since 1998.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Instagram" className="instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" aria-label="LinkedIn" className="linkedin">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter" className="twitter">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="youtube">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
             <li><a href="#home">Home</a></li>
             <li><a href="#about">About Us</a></li>
             <li><a href="#faqs">FAQs</a></li>
             <li><a href="#blogs">Blogs</a></li>
             <li><a href="#contact">Contact Us</a></li>
             <li><a href="#sitemap">Site Map</a></li>
          </ul>
        </div>

        <div className="footer-col compliance-col">
          <h3>Statutory Compliances</h3>
          <ul className="footer-compliance-links">
             <li>
               <a href="#">
                 <span className="compliance-icon-wrap"><HeartPulse size={16} /></span>
                 <span>Coronary Stent Prices</span>
               </a>
             </li>
             <li>
               <a href="#">
                 <span className="compliance-icon-wrap"><Bone size={16} /></span>
                 <span>Knee Implant Prices</span>
               </a>
             </li>
             <li>
               <a href="#">
                 <span className="compliance-icon-wrap"><BedDouble size={16} /></span>
                 <span>Indigent and Weaker Section Category</span>
               </a>
             </li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact Us</h3>
          <ul className="footer-info">
             <li>Phone: 079-69002222</li>
             <li>WhatsApp: 8400146262</li>
             <li>info@bhaktivedantahospital.com</li>
             <li>
               <a 
                 href="https://maps.app.goo.gl/yX3uLp8jXz2U4u1D6" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 style={{ textDecoration: 'underline', color: 'inherit' }}
               >
                 Mira Road East, Thane, <br />Maharashtra 401107
               </a>
             </li>
          </ul>
          {/* Small compact Google Map */}
          <div className="footer-map-container" style={{ marginTop: '0.85rem' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.196962078696!2d72.86877967520935!3d19.262963081977793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b065e1eb2bef%3A0xe54fb7a21390f0b4!2sBhaktivedanta%20Hospital%20%26%20Research%20Institute!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100" 
              style={{ border: 0, borderRadius: '8px' }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Footer Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; 2026 Bhaktivedanta Hospital. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
