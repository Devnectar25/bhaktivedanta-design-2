import React from 'react';
import { Phone, Calendar, Clock, MapPin, Mail, PhoneCall, AlertCircle } from 'lucide-react';
import './ContactInfoBlock.css';

/**
 * ContactInfoBlock
 * Small reusable block displaying phone numbers, working days, timings, and location.
 * 
 * Props:
 * - title?: string (e.g. "Department Contact & Timings")
 * - phones?: Array<string> | string (phone numbers)
 * - emergencyPhone?: string
 * - days?: string (e.g. "Monday – Saturday")
 * - timings?: string (e.g. "9:00 AM – 6:00 PM")
 * - email?: string
 * - location?: string (e.g. "1st Floor, OPD Wing A")
 * - note?: string (optional advisory note)
 * - variant?: 'compact' | 'card' | 'sidebar' (default 'card')
 */
export default function ContactInfoBlock({
  title = 'Contact & OPD Schedule',
  phones = [],
  emergencyPhone,
  days,
  timings,
  email,
  location,
  note,
  variant = 'card',
  className = ''
}) {
  const phoneList = Array.isArray(phones) ? phones : (phones ? [phones] : []);

  return (
    <div className={`contact-info-block variant-${variant} ${className}`}>
      {title && (
        <div className="contact-info-header">
          <PhoneCall size={18} className="contact-info-header-icon" />
          <h4 className="contact-info-title">{title}</h4>
        </div>
      )}

      <div className="contact-info-content">
        {/* Working Days */}
        {days && (
          <div className="contact-info-row">
            <div className="contact-icon-wrapper">
              <Calendar size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label">Days:</span>
              <span className="contact-row-val">{days}</span>
            </div>
          </div>
        )}

        {/* Timings */}
        {timings && (
          <div className="contact-info-row">
            <div className="contact-icon-wrapper">
              <Clock size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label">Timing:</span>
              <span className="contact-row-val">{timings}</span>
            </div>
          </div>
        )}

        {/* Phone Numbers */}
        {phoneList.length > 0 && (
          <div className="contact-info-row">
            <div className="contact-icon-wrapper">
              <Phone size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label">Phone:</span>
              <div className="contact-phones-list">
                {phoneList.map((ph, idx) => (
                  <a 
                    key={idx} 
                    href={`tel:${ph.replace(/\s+/g, '')}`} 
                    className="contact-phone-link"
                  >
                    {ph}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Emergency / Helpline */}
        {emergencyPhone && (
          <div className="contact-info-row emergency-row">
            <div className="contact-icon-wrapper emergency-icon">
              <PhoneCall size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label emergency-label">Emergency / 24x7:</span>
              <a 
                href={`tel:${emergencyPhone.replace(/\s+/g, '')}`} 
                className="contact-phone-link emergency-link"
              >
                {emergencyPhone}
              </a>
            </div>
          </div>
        )}

        {/* Email */}
        {email && (
          <div className="contact-info-row">
            <div className="contact-icon-wrapper">
              <Mail size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label">Email:</span>
              <a href={`mailto:${email}`} className="contact-email-link">
                {email}
              </a>
            </div>
          </div>
        )}

        {/* Location / OPD Room */}
        {location && (
          <div className="contact-info-row">
            <div className="contact-icon-wrapper">
              <MapPin size={16} />
            </div>
            <div className="contact-row-text">
              <span className="contact-row-label">Location:</span>
              <span className="contact-row-val">{location}</span>
            </div>
          </div>
        )}

        {/* Advisory Note */}
        {note && (
          <div className="contact-note-row">
            <AlertCircle size={15} className="contact-note-icon" />
            <span className="contact-note-text">{note}</span>
          </div>
        )}
      </div>
    </div>
  );
}
