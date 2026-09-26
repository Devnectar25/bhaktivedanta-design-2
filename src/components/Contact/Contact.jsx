import React, { useState, useEffect } from 'react';
import './Contact.css';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { addQuery, getHospitalSettings, defaultHospitalSettings } from '../../utils/api';
import { showSuccessAlert, showErrorAlert } from '../../utils/swal';

const Contact = () => {
  const [settings, setSettings] = useState(defaultHospitalSettings);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getHospitalSettings().then(res => {
      if (res) setSettings(prev => ({ ...prev, ...res }));
    }).catch(() => {});

    const handleSync = () => {
      getHospitalSettings().then(res => {
        if (res) setSettings(prev => ({ ...prev, ...res }));
      }).catch(() => {});
    };

    window.addEventListener('hospital_settings_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hospital_settings_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showErrorAlert('Missing Information', 'Please fill in your Name, Email Address, and Message.');
      return;
    }

    setSubmitting(true);
    const newQuery = {
      id: `QRY-${Math.floor(5000 + Math.random() * 5000)}`,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      subject: formData.subject,
      message: formData.message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };

    try {
      await addQuery(newQuery);
      showSuccessAlert(
        'Thank You!',
        'Your message has been sent successfully. Our support desk will review your query and get back to you shortly.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    } catch (err) {
      console.error('Failed to submit contact query:', err);
      showErrorAlert('Submission Error', 'Failed to send query. Please check your internet connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        {/* Section Header */}
        <div className="contact-header">
          <span className="contact-badge">Get In Touch</span>
          <h1 className="contact-main-title">Contact Bhaktivedanta Hospital</h1>
          <p className="contact-subtitle">
            Have a question or require medical assistance? Reach out to us directly or send a message below.
          </p>
        </div>

        {/* 2-Column Responsive Grid */}
        <div className="contact-grid">
          {/* Left Column: Hospital Contact Details & Map */}
          <div className="contact-info-card">
            <h3 className="contact-info-title">Hospital Help Desk</h3>
            <p className="contact-info-desc">
              Available 24/7 for emergency inquiries, patient admissions, and appointment guidance.
            </p>

            <div className="contact-items-wrapper">
              <div className="contact-item-row">
                <div className="contact-icon-box">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="contact-item-label">Emergency / Helpline</div>
                  <a href={`tel:${String(settings.contactPhone || '07969002222').replace(/\s+/g, '')}`} className="contact-item-value">
                    {settings.contactPhone || '079-69002222'}
                  </a>
                </div>
              </div>

              <div className="contact-item-row">
                <div className="contact-icon-box whatsapp">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <div className="contact-item-label">WhatsApp Support</div>
                  <a 
                    href={`https://wa.me/${String(settings.contactWhatsapp || '8400146262').replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="contact-item-value"
                  >
                    {settings.contactWhatsapp ? `+91 ${settings.contactWhatsapp}` : '+91 84001 46262'}
                  </a>
                </div>
              </div>

              <div className="contact-item-row">
                <div className="contact-icon-box email">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="contact-item-label">Official Email</div>
                  <a href={`mailto:${settings.contactEmail || 'info@bhaktivedantahospital.com'}`} className="contact-item-value" style={{ fontSize: '0.9rem' }}>
                    {settings.contactEmail || 'info@bhaktivedantahospital.com'}
                  </a>
                </div>
              </div>

              <div className="contact-item-row">
                <div className="contact-icon-box location">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="contact-item-label">Hospital Location</div>
                  <div className="contact-item-value" style={{ fontSize: '0.85rem', fontWeight: '500', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
                    {settings.contactAddress || 'Mira Road East, Thane, \nMaharashtra 401107'}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Connect */}
            <div className="contact-social-section">
              <div className="contact-social-title">Connect With Us</div>
              <div className="contact-social-icons">
                <a href="https://www.instagram.com/bhaktivedantahospital.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-circle-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/bhaktivedantahospitalandresearchinstitute" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-circle-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/bhaktivedanta-hospital-&-research-institute/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-circle-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://x.com/Bhaktivedanta_H" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-circle-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UCSf9YnPIwZQ6zb1QqQc4tNQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-circle-btn">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Google Map View */}
            <div className="contact-map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.196962078696!2d72.86877967520935!3d19.262963081977793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b065e1eb2bef%3A0xe54fb7a21390f0b4!2sBhaktivedanta%20Hospital%20%26%20Research%20Institute!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hospital Map Location"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Interactive Form Card */}
          <div className="contact-form-card">
            <h3 className="form-header-title">Send Us a Message</h3>
            <p className="form-header-desc">Fill in your information and query details. Our support desk will review your message and respond.</p>

            <form onSubmit={handleSubmit} className="contact-form-grid">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input 
                    type="text"
                    required
                    className="form-input-field"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input 
                    type="email"
                    required
                    className="form-input-field"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel"
                    className="form-input-field"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="form-group">
                  <label>Query Subject / Department</label>
                  <select 
                    className="form-input-field form-select-field"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Doctor Appointment Request">Doctor Appointment Request</option>
                    <option value="Billing & Health Insurance (TPA)">Billing & Health Insurance (TPA)</option>
                    <option value="Health Checkup Packages">Health Checkup Packages</option>
                    <option value="Spiritual Care Services">Spiritual Care Services</option>
                    <option value="Feedback & Patient Care">Feedback & Patient Care</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Message Details *</label>
                <textarea 
                  rows={5}
                  required
                  className="form-input-field"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  placeholder="Please describe your query or request in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-contact-submit"
              >
                {submitting ? (
                  <>
                    <div className="contact-loader-spinner"></div>
                    <span>Sending Query...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit Query</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
