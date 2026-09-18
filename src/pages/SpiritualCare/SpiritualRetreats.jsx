import React, { useState, useEffect } from 'react';
import ActivityImageCard from '../../components/ActivityImageCard/ActivityImageCard';
import ContactInfoBlock from '../../components/ContactInfoBlock/ContactInfoBlock';
import RichTextRenderer from '../../components/RichTextRenderer/RichTextRenderer';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState } from '../../data/defaultSpiritualCare';
import { Calendar, Compass, Sun } from 'lucide-react';
import './SpiritualCare.css';

export default function SpiritualRetreats() {
  const [retreatsData, setRetreatsData] = useState(defaultSpiritualCareState.retreats);
  const [activeTab, setActiveTab] = useState('Bi-Monthly');

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.retreats) {
        setRetreatsData(res.retreats);
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

  const hero = retreatsData?.hero || defaultSpiritualCareState.retreats.hero;
  const bimonthly = retreatsData?.bimonthly || defaultSpiritualCareState.retreats.bimonthly;
  const annual = retreatsData?.annual || defaultSpiritualCareState.retreats.annual;
  const contact = retreatsData?.contact || defaultSpiritualCareState.retreats.contact;
  const activities = (bimonthly?.activities || defaultSpiritualCareState.retreats.bimonthly.activities).filter(a => a.enabled !== false);

  return (
    <div className="spiritual-page-container">
      {/* Hero Banner */}
      <div className="spiritual-hero-banner">
        <div className="spiritual-hero-badge">
          <Compass size={16} />
          <span>{hero?.badge || 'Holistic Rejuvenation & Pilgrimage'}</span>
        </div>
        <h1 className="spiritual-hero-title">{hero?.title || 'Spiritual Care Retreats'}</h1>
        <p className="spiritual-hero-subtitle">
          {hero?.subtitle || 'Escape the hectic demands of modern living. Experience restorative residential retreats that unite evidence-based health guidance, sacred nature immersion, and blissful spiritual camaraderie.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="spiritual-tabs-bar">
        <button
          type="button"
          className={`spiritual-tab-btn ${activeTab === 'Bi-Monthly' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('Bi-Monthly')}
        >
          <Calendar size={18} />
          <span>BI-Monthly Spiritual Retreat</span>
        </button>
        <button
          type="button"
          className={`spiritual-tab-btn ${activeTab === 'Annual' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('Annual')}
        >
          <Sun size={18} />
          <span>Annual Spiritual Retreat</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="spiritual-tab-content">
        {activeTab === 'Bi-Monthly' && (
          <div className="retreats-bimonthly-panel">
            <div className="spiritual-section-header">
              <h2 className="spiritual-section-title">{bimonthly?.title || 'Weekend Eco-Wellness & Spiritual Immersion'}</h2>
              <p className="spiritual-body-text">
                {bimonthly?.intro || 'Held every two months at tranquil retreat sanctuaries near Mumbai and Thane, our 2-day residential retreats are designed for patients, recovering individuals, families, and healthcare professionals seeking comprehensive physical and spiritual recharge.'}
              </p>
            </div>

            {/* Activity Image Cards Grid */}
            <div className="spiritual-retreats-grid">
              {activities.map((act) => (
                <ActivityImageCard
                  key={act.id}
                  image={act.image}
                  title={act.title}
                  tag={act.tag}
                  caption={act.caption}
                  aspectRatio="16/10"
                />
              ))}
            </div>

            {/* Contact & Registration Block */}
            <div style={{ marginTop: 36 }}>
              <ContactInfoBlock
                title={contact?.title || 'Bi-Monthly Retreat Registration Desk'}
                phones={contact?.phones || ['+91 22 2845 6000']}
                days={contact?.days || 'Monday – Saturday'}
                timings={contact?.timings || '9:00 AM – 6:00 PM'}
                location={contact?.location || 'Spiritual Care Events Office, Ground Floor'}
                email={contact?.email || 'retreats@bhaktivedantahospital.com'}
                note={contact?.note || 'Package includes comfortable air-conditioned accommodation, all sattvic meals, medical doctor consultations, and AC coach transport from hospital.'}
                variant="card"
              />
            </div>
          </div>
        )}

        {activeTab === 'Annual' && (
          <div className="retreats-annual-panel">
            <div className="spiritual-section-header">
              <h2 className="spiritual-section-title">{annual?.title || 'The Grand Annual Pilgrimage & Wellness Yatra'}</h2>
              <div className="spiritual-body-text">
                <RichTextRenderer content={annual?.intro || ''} />
              </div>
            </div>

            {annual?.highlights && annual.highlights.length > 0 && (
              <div className="spiritual-narrative-card" style={{ marginBottom: 28 }}>
                <h3 className="spiritual-card-title">Retreat Highlights & Safety Provisions</h3>
                <ul style={{ paddingLeft: 20, color: '#334155', lineHeight: 1.8, fontFamily: "'Work Sans', sans-serif" }}>
                  {annual.highlights.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Info Block */}
            <ContactInfoBlock
              title={contact?.title || 'Annual Retreat Secretariat & Bookings'}
              phones={contact?.phones || ['+91 22 2845 6000']}
              days={contact?.days || 'Monday – Saturday'}
              timings={contact?.timings || '10:00 AM – 6:00 PM'}
              location={contact?.location || 'Spiritual Care Central Administration'}
              email={contact?.email || 'annualyatra@bhaktivedantahospital.com'}
              note={contact?.note || 'Registrations for the Annual Retreat open 3 months in advance. Early bird slots are allocated on a first-come, first-served basis.'}
              variant="card"
            />
          </div>
        )}
      </div>
    </div>
  );
}
