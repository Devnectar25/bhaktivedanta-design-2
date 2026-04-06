import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { number: '5M+', label: 'Lives Impacted' },
    { number: '150K+', label: 'Surgeries' },
    { number: '25+', label: 'Years Excellence' },
    { number: '300+', label: 'Expert Doctors' },
    { number: '98%', label: 'Patient Comfort' },
    { number: '15+', label: 'DNB Depts' }
  ];

  return (
    <section className="stats-section fade-in">
      <div className="container stats-container">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <span className="stat-number">{stat.number}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
