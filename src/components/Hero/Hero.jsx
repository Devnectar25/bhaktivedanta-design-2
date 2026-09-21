import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg">
        <img src="/hero_new.jpg" alt="Bhaktivedanta Hospital Architecture" />
        <div className="overlay"></div>
      </div>
      
      <div className="container hero-content">
        <div className="hero-text fade-in">
          <h1>Compassionate Care with <span>Advanced Technology</span></h1>
          <p className="hero-subheading">
            Where expert healing wisdom meets modern medical excellence. 
            We are dedicated to your wellness and the highest standards of care.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}>Explore Services</button>
            <button className="btn-outline" onClick={() => navigate('/contact')}>Contact Us</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
