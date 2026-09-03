import React from 'react';
import './Contact.css';
import { Phone } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        {/* Contact Us Info Card */}
        <div className="get-in-touch fade-in">
          <h2 className="contact-heading">Contact Us</h2>

          <div className="contact-info-list">
            <div className="contact-info-line">
              <span className="contact-info-icon"><Phone size={26} strokeWidth={1.75} /></span>
              <a href="tel:07969002222">079-69002222</a>
            </div>

            <div className="contact-info-line">
              <span className="contact-info-icon">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  <path d="M14.5 10.5c-.15-.1-.4-.2-.5-.25s-.2-.05-.3.1c-.1.15-.3.4-.4.5-.1.1-.15.1-.3 0a4 4 0 0 1-1.8-1.8c-.1-.15 0-.2.1-.3.1-.1.25-.3.35-.4.1-.1.1-.2.05-.3l-.4-1c-.1-.2-.2-.2-.3-.2s-.2 0-.3.1c-.2.2-.4.4-.4.8 0 .5.2.9.3 1 .1.2 1.2 1.7 2.8 2.4.3.1.6.2.9.3.3.1.6.1.9.05.3-.05.7-.3.8-.6.1-.2.1-.5.05-.6s-.2-.15-.4-.25z" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <a href="https://wa.me/8400146262" target="_blank" rel="noopener noreferrer">8400146262</a>
            </div>
          </div>

          <div className="contact-social-row">
            <a href="#" className="contact-social-circle instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#" className="contact-social-circle facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="#" className="contact-social-circle linkedin" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="#" className="contact-social-circle twitter" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="#" className="contact-social-circle youtube" aria-label="YouTube">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>

          {/* Embedded Google Map */}
          <div className="contact-map-container" style={{ marginTop: '2.5rem' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.196962078696!2d72.86877967520935!3d19.262963081977793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b065e1eb2bef%3A0xe54fb7a21390f0b4!2sBhaktivedanta%20Hospital%20%26%20Research%20Institute!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="260"
              style={{ border: 0, borderRadius: '18px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bhaktivedanta Hospital Google Map Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
