import React, { useState, useEffect } from 'react';
import AcronymBreakdown from '../../components/AcronymBreakdown/AcronymBreakdown';
import ContactInfoBlock from '../../components/ContactInfoBlock/ContactInfoBlock';
import RichTextRenderer from '../../components/RichTextRenderer/RichTextRenderer';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState } from '../../data/defaultSpiritualCare';
import { CheckCircle2, HeartHandshake, Sparkles, MessageCircle } from 'lucide-react';
import './SpiritualCare.css';

export default function SpiritualCareServices() {
  const [servicesData, setServicesData] = useState(defaultSpiritualCareState.services);
  const [activeTab, setActiveTab] = useState('Overview');

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.services) {
        setServicesData(res.services);
      }
    });
  };

  useEffect(() => {
    fetchState();
    window.addEventListener('storage', fetchState);
    window.addEventListener('admin_data_updated', fetchState);
    return () => {
      window.removeEventListener('storage', fetchState);
      window.removeEventListener('admin_data_updated', fetchState);
    };
  }, []);

  const hero = servicesData?.hero || defaultSpiritualCareState.services.hero;
  const overview = servicesData?.overview || defaultSpiritualCareState.services.overview;
  const matchAcronym = overview?.acronymItems || defaultSpiritualCareState.services.overview.acronymItems;
  const patientSupport = servicesData?.servicesOffered?.patientSupport || defaultSpiritualCareState.services.servicesOffered.patientSupport;
  const counselling = servicesData?.servicesOffered?.counselling || defaultSpiritualCareState.services.servicesOffered.counselling;
  const contact = servicesData?.contact || defaultSpiritualCareState.services.contact;

  return (
    <div className="spiritual-page-container">
      {/* Page Header */}
      <div className="spiritual-hero-banner">
        <div className="spiritual-hero-badge">
          <Sparkles size={16} />
          <span>{hero?.badge || 'Department of Spiritual Care'}</span>
        </div>
        <h1 className="spiritual-hero-title">{hero?.title || 'Spiritual Care Services'}</h1>
        <p className="spiritual-hero-subtitle">
          {hero?.subtitle || 'Nurturing the soul while treating the body — blending state-of-the-art medical science with timeless spiritual values and compassionate bedside solace.'}
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="spiritual-tabs-bar">
        <button
          type="button"
          className={`spiritual-tab-btn ${activeTab === 'Overview' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('Overview')}
        >
          <HeartHandshake size={18} />
          <span>Overview</span>
        </button>
        <button
          type="button"
          className={`spiritual-tab-btn ${activeTab === 'Services Offered' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('Services Offered')}
        >
          <CheckCircle2 size={18} />
          <span>Services Offered</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="spiritual-tab-content">
        {activeTab === 'Overview' && (
          <div className="spiritual-overview-panel">
            <div className="spiritual-section-header">
              <h2 className="spiritual-section-title">{overview?.title || 'Healing Through Spiritual Warmth & Compassion'}</h2>
              <div className="spiritual-body-text">
                <RichTextRenderer content={overview?.content || ''} />
              </div>
            </div>

            {/* MATCH Acronym Component */}
            <div className="spiritual-acronym-section">
              <AcronymBreakdown
                title={overview?.acronymTitle || 'Our Core Guiding Values (MATCH)'}
                subtitle={overview?.acronymSubtitle || 'The foundational pillars that steer our clinical culture, caregiver attitude, and holistic healing environment:'}
                items={matchAcronym}
                variant="card"
              />
            </div>

            <div className="spiritual-text-columns">
              <div className="spiritual-narrative-card">
                <h3 className="spiritual-card-title">A Sanctuary of Multi-Faith Compassion</h3>
                <p className="spiritual-body-text">
                  Our spiritual counselors respect and honor all faiths, spiritual traditions, and personal beliefs. Whether offering Vedic chants, silent meditation, scripture reading, or simply a listening heart during moments of distress, our team is dedicated to bringing peace and reassurance to every bedside.
                </p>
                <p className="spiritual-body-text">
                  Studies have demonstrated that patients who receive active spiritual care experience reduced pre-operative anxiety, lower pain perception, enhanced coping mechanisms, and improved recovery timelines.
                </p>
              </div>

              <div className="spiritual-narrative-card">
                <h3 className="spiritual-card-title">24x7 Support For Families & Caregivers</h3>
                <p className="spiritual-body-text">
                  Hospitalization can be emotionally exhausting for families. Our team provides continuous support to attendants, helping them remain positive, resilient, and peaceful through personalized counseling and pastoral accompaniment.
                </p>
                <ContactInfoBlock
                  title={contact?.title || 'Spiritual Care Helpline'}
                  phones={contact?.phones || ['+91 22 2845 6000']}
                  emergencyPhone={contact?.emergencyPhone || '+91 22 2845 8000'}
                  days={contact?.days || 'Monday – Sunday (24x7 Available)'}
                  timings={contact?.timings || 'Bedside rounds: 8:00 AM – 8:00 PM | Emergency Chaplaincy: 24 Hours'}
                  location={contact?.location || 'Ground Floor, Spiritual Care Central Desk'}
                  email={contact?.email || 'spiritualcare@bhaktivedantahospital.com'}
                  note={contact?.note || 'Our pastoral team is on-call 24 hours a day for ICU and emergency support.'}
                  variant="compact"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Services Offered' && (
          <div className="spiritual-services-panel">
            <div className="spiritual-section-header">
              <h2 className="spiritual-section-title">Comprehensive Spiritual & Pastoral Offerings</h2>
              <p className="spiritual-body-text">
                Explore the diverse supportive and therapeutic spiritual services available across all outpatient and inpatient departments:
              </p>
            </div>

            {/* 2-Column Bullet List Grid */}
            <div className="spiritual-two-col-grid">
              {/* Column 1: Patient Support Services */}
              <div className="spiritual-col-box">
                <div className="spiritual-col-header">
                  <div className="spiritual-col-icon-wrapper">
                    <HeartHandshake size={22} />
                  </div>
                  <div>
                    <h3 className="spiritual-col-title">Patient Support Services</h3>
                    <span className="spiritual-col-subtitle">Inpatient care, prayers, and bedside comfort</span>
                  </div>
                </div>

                <div className="spiritual-bullet-list">
                  {patientSupport.filter(s => s.enabled !== false).map((svc, idx) => (
                    <div key={svc.id || idx} className="spiritual-bullet-item">
                      <CheckCircle2 size={18} className="spiritual-bullet-check" strokeWidth={2.4} />
                      <div className="spiritual-bullet-text-wrap">
                        <span className="spiritual-bullet-title">{svc.text}</span>
                        {svc.note && <span className="spiritual-bullet-note">{svc.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Counselling Services */}
              <div className="spiritual-col-box">
                <div className="spiritual-col-header">
                  <div className="spiritual-col-icon-wrapper secondary">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h3 className="spiritual-col-title">Counselling Services</h3>
                    <span className="spiritual-col-subtitle">Individual, family, and bereavement solace</span>
                  </div>
                </div>

                <div className="spiritual-bullet-list">
                  {counselling.filter(s => s.enabled !== false).map((svc, idx) => (
                    <div key={svc.id || idx} className="spiritual-bullet-item">
                      <CheckCircle2 size={18} className="spiritual-bullet-check" strokeWidth={2.4} />
                      <div className="spiritual-bullet-text-wrap">
                        <span className="spiritual-bullet-title">{svc.text}</span>
                        {svc.note && <span className="spiritual-bullet-note">{svc.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="spiritual-services-footer-contact">
              <ContactInfoBlock
                title="Book a Spiritual Counseling Session"
                phones={contact?.phones || ['+91 22 2845 6000']}
                days={contact?.days || 'Monday – Saturday'}
                timings={contact?.timings || '9:00 AM – 6:00 PM'}
                location={contact?.location || 'Spiritual Care Center, 2nd Floor, Wing B'}
                email={contact?.email || 'counseling@bhaktivedantahospital.com'}
                note="Inpatients can request a counselor through the bedside nurse call bell anytime."
                variant="card"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
