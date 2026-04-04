import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero-section">
      <div className="hero-bg">
        <img src="/hero_institute_v2.png" alt="Bhaktivedanta Institute Building" />
        <div className="overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text fade-in">
          <p className="hero-label">Trusted Healthcare Solution</p>
          <h1>Compassionate Care <br />with <span>Advanced Technology</span></h1>
          <p className="hero-subheading">
            Where expert healing wisdom meets modern medical excellence. 
            We are dedicated to your wellness and the highest standards of care.
          </p>
          <div className="hero-actions">
            <button className="btn-primary">Explore Services</button>
            <button className="btn-outline">Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
