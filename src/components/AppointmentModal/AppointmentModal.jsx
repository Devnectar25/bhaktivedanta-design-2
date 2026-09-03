import React, { useState, useEffect } from 'react';
import './AppointmentModal.css';
import {
  Phone,
  User,
  Mail,
  Stethoscope,
  Calendar,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  X
} from 'lucide-react';
import { addAppointment } from '../../utils/api';

const AppointmentModal = ({ isOpen, onClose }) => {
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
  const [animatingOpen, setAnimatingOpen] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (isOpen) {
      setAnimatingOpen(true);
      document.body.style.overflow = 'hidden';
    } else {
      setAnimatingOpen(false);
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCloseModal = () => {
    setAnimatingOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => {
      onClose();
      // Reset form state on close after animation
      setSubmitSuccess(false);
      setSubmitError('');
    }, 200);
  };

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
      const el = document.querySelector(`.appointment-modal-container [name="${firstErrorKey}"]`);
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
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error booking appointment:', err);
      setSubmitError('Failed to submit your appointment. Please try again or call our helpline.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen && !animatingOpen) return null;

  return (
    <div
      className={`appointment-modal-overlay ${animatingOpen ? 'open' : ''}`}
      onClick={handleCloseModal}
    >
      <div
        className="appointment-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="appointment-modal-close"
          onClick={handleCloseModal}
          aria-label="Close appointment modal"
        >
          <X size={22} />
        </button>

        <div className="appointment-form-header">
          <h3>Book an Appointment</h3>
          <p>Fill out the form below to schedule a consultation with our medical specialists.</p>
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
              <label htmlFor="modal-fullName">
                Full Name <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <User size={18} className="field-icon" />
                <input
                  id="modal-fullName"
                  type="text"
                  name="fullName"
                  placeholder="Your Name"
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
              <label htmlFor="modal-phone">
                Phone Number <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <Phone size={18} className="field-icon" />
                <input
                  id="modal-phone"
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
            <label htmlFor="modal-email">
              Email Address
            </label>
            <div className="input-with-icon">
              <Mail size={18} className="field-icon" />
              <input
                id="modal-email"
                type="email"
                name="email"
                placeholder="example@gmail.com"
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
              <label htmlFor="modal-department">
                Department <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <Stethoscope size={18} className="field-icon" />
                <select
                  id="modal-department"
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
              <label htmlFor="modal-preferredDate">
                Preferred Date <span className="req-star">*</span>
              </label>
              <div className="input-with-icon">
                <Calendar size={18} className="field-icon" />
                <input
                  id="modal-preferredDate"
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
            <label htmlFor="modal-message">
              Your Message
            </label>
            <div className="textarea-with-icon">
              <MessageSquare size={18} className="field-icon textarea-icon" />
              <textarea
                id="modal-message"
                name="message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleChange}
                className="form-input form-textarea"
                rows={3}
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
  );
};

export default AppointmentModal;
