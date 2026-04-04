import React from 'react';
import './Stats.css';

const Stats = () => {
  const stats = [
    { number: '30+', label: 'Years of Excellence' },
    { number: '500+', label: 'Expert Doctors' },
    { number: '1M+', label: 'Happy Patients' },
    { number: '50+', label: 'Medical Services' }
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
