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
      const data = (res && res.data && typeof res.data === 'object') ? res.data : res;
      if (data && data.services) {
        setServicesData(data.services);
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

            {contact && (
              <div className="spiritual-contact-wrapper">
                <ContactInfoBlock
                  title={contact.title}
                  phones={contact.phones}
                  emergencyPhone={contact.emergencyPhone}
                  days={contact.days}
                  timings={contact.timings}
                  location={contact.location}
                  email={contact.email}
                  note={contact.note}
                  variant="compact"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'Services Offered' && (
          <div className="spiritual-services-panel">
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

            {/* Dynamic Contact Information */}
            {contact && (
              <div className="spiritual-services-footer-contact">
                <ContactInfoBlock
                  title={contact.title}
                  phones={contact.phones}
                  emergencyPhone={contact.emergencyPhone}
                  days={contact.days}
                  timings={contact.timings}
                  location={contact.location}
                  email={contact.email}
                  note={contact.note}
                  variant="card"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
