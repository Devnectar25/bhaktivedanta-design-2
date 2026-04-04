import React from 'react';
import './Infrastructure.css';

const Infrastructure = () => {
  const infraItems = [
    {
      title: 'ICU & Critical Care',
      image: '/icu.png',
      description: 'Fully equipped ICU units for 24/7 critical monitoring and support.'
    },
    {
      title: 'Diagnostic Lab',
      image: '/lab.png',
      description: 'Advanced automated laboratory with high precision testing equipment.'
    },
    {
      title: '24/7 Pharmacy',
      image: '/pharmacy.png',
      description: 'Round-the-clock availability of essential medicines and vaccines.'
    },
    {
      title: 'Ambulance Service',
      image: '/ambulance.png',
      description: 'Quick response emergency medical transportation for critical care.'
    }
  ];

  return (
    <section id="hospital" className="infra-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Our Facility</p>
          <h2>State-of-the-Art <span>Infrastructure</span></h2>
        </div>
        
        <div className="infra-grid">
          {infraItems.map((item, index) => (
            <div key={index} className="infra-card hover-lift">
              <div className="infra-bg">
                <img src={item.image} alt={item.title} />
                <div className="overlay"></div>
              </div>
              <div className="infra-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="btn-icon">Learn More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Infrastructure;
