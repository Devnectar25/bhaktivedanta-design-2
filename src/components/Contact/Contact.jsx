import React, { useState } from 'react';
import './Contact.css';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { addQuery } from '../../utils/api';
import { showSuccessAlert, showErrorAlert } from '../../utils/swal';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showErrorAlert('Missing Information', 'Please fill in your Name, Email, and Message.');
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
        'Your message has been sent successfully. Our hospital support team will review your query and get back to you shortly.'
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mt-3">
            Contact Bhaktivedanta Hospital
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Have a question or require medical assistance? Reach out to us directly or send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hospital Contact Details & Map */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-2xl font-bold text-white mb-2">Hospital Help Desk</h3>
            <p className="text-blue-100/80 text-xs leading-relaxed">
              Available 24/7 for emergency inquiries, patient admissions, and appointments.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Emergency / Helpline</p>
                  <a href="tel:07969002222" className="text-base font-bold text-white hover:text-amber-400 transition-colors">
                    079-69002222
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 flex-shrink-0">
                  <span className="material-symbols-outlined text-xl">chat</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">WhatsApp Support</p>
                  <a href="https://wa.me/8400146262" target="_blank" rel="noopener noreferrer" className="text-base font-bold text-white hover:text-emerald-400 transition-colors">
                    +91 84001 46262
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300 flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Official Email</p>
                  <a href="mailto:info@bhaktivedantahospital.com" className="text-sm font-semibold text-white hover:text-blue-300 transition-colors">
                    info@bhaktivedantahospital.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-rose-400 flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider">Location</p>
                  <p className="text-xs text-blue-100 font-medium leading-relaxed">
                    Srishti Complex, Bhaktivedanta Swami Marg, Mira Road (East), Thane - 401107
                  </p>
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-3">Connect With Us</p>
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/bhaktivedantahospital.official" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-pink-600 text-white flex items-center justify-center transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/bhaktivedantahospitalandresearchinstitute" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/bhaktivedanta-hospital-&-research-institute/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-sky-600 text-white flex items-center justify-center transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
                <a href="https://x.com/Bhaktivedanta_H" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-slate-700 text-white flex items-center justify-center transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </a>
                <a href="https://www.youtube.com/channel/UCSf9YnPIwZQ6zb1QqQc4tNQ" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-all">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="pt-2 rounded-2xl overflow-hidden shadow-inner border border-white/10">
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

          {/* Right Column: Contact Us Interactive Query Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Send Us a Message</h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">Fill in your information and query details. Our desk will record your query and reach out.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input 
                    type="text"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-xs rounded-xl outline-none font-medium text-slate-800 transition-all"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input 
                    type="email"
                    required
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-xs rounded-xl outline-none font-medium text-slate-800 transition-all"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3.5 py-2.5 text-xs rounded-xl outline-none font-medium text-slate-800 transition-all"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Query Subject / Department</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white px-3 py-2.5 text-xs rounded-xl outline-none font-medium text-slate-700 cursor-pointer"
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Details *</label>
                <textarea 
                  rows={5}
                  required
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-600 focus:bg-white p-3.5 text-xs rounded-xl outline-none font-medium text-slate-800 transition-all"
                  placeholder="Please describe your query or request in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-[#fea619] hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
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
