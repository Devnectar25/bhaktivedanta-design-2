import React, { useState, useEffect } from 'react';
import ProgramCard from '../../components/ProgramCard/ProgramCard';
import ContactInfoBlock from '../../components/ContactInfoBlock/ContactInfoBlock';
import { getSpiritualCareState } from '../../utils/api';
import { defaultSpiritualCareState } from '../../data/defaultSpiritualCare';
import { GraduationCap } from 'lucide-react';
import './SpiritualCare.css';

export default function EducationalProgrammes() {
  const [programmes, setProgrammes] = useState(defaultSpiritualCareState.programmes);

  const fetchState = () => {
    getSpiritualCareState(defaultSpiritualCareState).then(res => {
      if (res && res.programmes && res.programmes.length > 0) {
        setProgrammes(res.programmes);
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

  return (
    <div className="spiritual-page-container">
      {/* Hero Header */}
      <div className="spiritual-hero-banner">
        <div className="spiritual-hero-badge">
          <GraduationCap size={16} />
          <span>Value-Based Education & Holistic Health</span>
        </div>
        <h1 className="spiritual-hero-title">Educational Programmes</h1>
        <p className="spiritual-hero-subtitle">
          Empowering families, parents, and seekers with timeless wisdom, prenatal science, child psychology, and self-mastery courses conducted by experienced doctors and spiritual educators.
        </p>
      </div>

      {/* Program Cards Grid */}
      <div className="spiritual-programs-grid">
        {programmes.filter(p => p.enabled !== false).map((prog) => {
          const targetRoute = prog.destinationType === 'existing'
            ? (prog.existingRoute || '/services/garbha-samskar')
            : `/spiritual-care/educational-programmes/${prog.slug || prog.id}`;

          return (
            <ProgramCard
              key={prog.id}
              image={prog.image}
              title={prog.title}
              description={prog.description}
              badge={prog.badge}
              duration={prog.duration}
              route={targetRoute}
              ctaText={prog.destinationType === 'existing' ? 'Explore Service' : 'View Program Details'}
            />
          );
        })}
      </div>

      {/* Program Coordination Contact */}
      <div style={{ marginTop: 44 }}>
        <ContactInfoBlock
          title="Educational Programmes Desk & Registration"
          phones={['+91 22 2845 6000', '+91 98200 12345']}
          days="Monday – Saturday"
          timings="9:30 AM – 5:30 PM"
          location="Education Wing, 3rd Floor, Bhaktivedanta Hospital"
          email="programmes@bhaktivedantahospital.com"
          note="Prior registration is recommended as batch sizes are limited to ensure personalized attention."
          variant="card"
        />
      </div>
    </div>
  );
}
