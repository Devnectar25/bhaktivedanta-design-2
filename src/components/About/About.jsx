import React from 'react';
import './About.css';

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="section-header fade-in">
          <p className="section-label">About Us</p>
          <h2>Healing Through <span>Devotion & Science</span></h2>
        </div>

        <div className="about-container">
          <div className="about-content fade-in">
            <div className="about-text">
              <p>
                Bhaktivedanta Hospital & Research Institute is more than a medical center—it's
                a community focused on providing spiritual warmth with clinical excellence.
                Our approach treats the whole person, ensuring dignity and care for every
                individual who walks through our doors.
              </p>
              <p>
                Our specialists use state-of-the-art diagnostics and evidence-based medicine
                to provide effective treatments while maintaining a compassionate environment
                that fosters quick recovery and peace of mind.
              </p>
            </div>

            <ul className="about-features">
              <li><span className="dot"></span> Holistic Care Approach</li>
              <li><span className="dot"></span> 24/7 Emergency Support</li>
              <li><span className="dot"></span> Advanced Diagnostic Lab</li>
              <li><span className="dot"></span> Research-Driven Medical Care</li>
            </ul>

            <button className="btn-primary-ghost learn-more">Learn More <span className="arrow-right">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
