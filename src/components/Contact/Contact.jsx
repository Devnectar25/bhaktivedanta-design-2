import React, { useState } from 'react';
import './Contact.css';
import {
  Phone,
  User,
  Mail,
  Stethoscope,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { addAppointment } from '../../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    department: '',
    preferredDate: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'fullName':
        if (!value || !value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 3) {
          error = 'Name must be at least 3 characters';
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
          error = 'Please enter letters and spaces only';
        }
        break;

      case 'phone':
        if (!value || !value.trim()) {
          error = 'Phone number is required';
        } else {
          const cleaned = value.replace(/[\s\-()+]/g, '');
          if (!/^\d{10,12}$/.test(cleaned)) {
            error = 'Please enter a valid 10-digit mobile number';
          }
        }
        break;

      case 'email':
        if (value && value.trim()) {
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
            error = 'Please enter a valid email address';
          }
        }
        break;

      case 'department':
        if (!value) {
          error = 'Please select a medical department';
        }
        break;

      case 'preferredDate':
        if (!value) {
          error = 'Please select your preferred date';
        } else {
          const selected = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selected < today) {
            error = 'Preferred date cannot be in the past';
          }
        }
        break;

      default:
        break;
    }
    return error;
  };

  const validateAll = () => {
    const newErrors = {};
    ['fullName', 'phone', 'email', 'department', 'preferredDate'].forEach(field => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allTouched = {
      fullName: true,
      phone: true,
      email: true,
      department: true,
      preferredDate: true
    };
    setTouched(allTouched);

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) el.focus();
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        patientName: formData.fullName.trim(),
        patientPhone: formData.phone.trim(),
        patientEmail: formData.email.trim(),
        department: formData.department,
        dateTime: formData.preferredDate,
        message: formData.message.trim(),
        status: 'Pending',
        payment: 'Unpaid'
      };

      await addAppointment(payload);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        department: '',
        preferredDate: '',
        message: ''
      });
      setTouched({});
      setErrors({});
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setSubmitError('Failed to submit your appointment. Please try again or call our helpline.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container contact-container">
        {/* Left Card: Get in touch */}
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
              <a href="https://wa.me/8400146262">8400146262</a>
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
          <div className="contact-map-container" style={{ marginTop: '2rem' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.196962078696!2d72.86877967520935!3d19.262963081977793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b065e1eb2bef%3A0xe54fb7a21390f0b4!2sBhaktivedanta%20Hospital%20%26%20Research%20Institute!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="200" 
              style={{ border: 0, borderRadius: '15px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)' }}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Bhaktivedanta Hospital Google Map Location"
            ></iframe>
          </div>
        </div>

        {/* Right Card: Book an Appointment Form */}
        <div className="appointment-form fade-in">
          <div className="appointment-form-header">
            <h3>Book an Appointment</h3>
            <p>Fill out the form below to schedule a consultation.</p>
          </div>

          {submitSuccess && (
            <div className="form-alert-success">
              <CheckCircle2 size={20} className="alert-icon" />
              <div>
                <strong>Appointment Request Submitted!</strong>
                <p>Our team will contact you shortly to confirm your appointment.</p>
              </div>
            </div>
          )}

          {submitError && (
            <div className="form-alert-error">
              <AlertCircle size={20} className="alert-icon" />
              <div>
                <strong>Submission Failed</strong>
                <p>{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="appointment-form-grid">
            {/* Row 1: Full Name & Phone Number */}
            <div className="form-row-2">
              <div className={`form-field-group ${touched.fullName && errors.fullName ? 'has-error' : ''}`}>
                <label htmlFor="fullName">
                  Full Name <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <User size={18} className="field-icon" />
                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    // placeholder="Your Name" 
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-input"
                  />
                </div>
                {touched.fullName && errors.fullName && (
                  <span className="field-error-msg">{errors.fullName}</span>
                )}
              </div>

              <div className={`form-field-group ${touched.phone && errors.phone ? 'has-error' : ''}`}>
                <label htmlFor="phone">
                  Phone Number <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Phone size={18} className="field-icon" />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+91"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-input"
                  />
                </div>
                {touched.phone && errors.phone && (
                  <span className="field-error-msg">{errors.phone}</span>
                )}
              </div>
            </div>

            {/* Row 2: Email Address (Full Width) */}
            <div className={`form-field-group full-width ${touched.email && errors.email ? 'has-error' : ''}`}>
              <label htmlFor="email">
                Email Address
              </label>
              <div className="input-with-icon">
                <Mail size={18} className="field-icon" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  // placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                />
              </div>
              {touched.email && errors.email && (
                <span className="field-error-msg">{errors.email}</span>
              )}
            </div>

            {/* Row 3: Department & Preferred Date */}
            <div className="form-row-2">
              <div className={`form-field-group ${touched.department && errors.department ? 'has-error' : ''}`}>
                <label htmlFor="department">
                  Department <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Stethoscope size={18} className="field-icon" />
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-input form-select"
                  >
                    <option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Dermatology">Dermatology</option>
                  </select>
                </div>
                {touched.department && errors.department && (
                  <span className="field-error-msg">{errors.department}</span>
                )}
              </div>

              <div className={`form-field-group ${touched.preferredDate && errors.preferredDate ? 'has-error' : ''}`}>
                <label htmlFor="preferredDate">
                  Preferred Date <span className="req-star">*</span>
                </label>
                <div className="input-with-icon">
                  <Calendar size={18} className="field-icon" />
                  <input
                    id="preferredDate"
                    type="date"
                    name="preferredDate"
                    min={todayStr}
                    value={formData.preferredDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="form-input"
                  />
                </div>
                {touched.preferredDate && errors.preferredDate && (
                  <span className="field-error-msg">{errors.preferredDate}</span>
                )}
              </div>
            </div>

            {/* Row 4: Your Message (Full Width) */}
            <div className="form-field-group full-width">
              <label htmlFor="message">
                Your Message
              </label>
              <div className="textarea-with-icon">
                <MessageSquare size={18} className="field-icon textarea-icon" />
                <textarea
                  id="message"
                  name="message"
                  // placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-book-appointment-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Book Appointment</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

