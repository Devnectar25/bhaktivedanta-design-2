import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getHeroBanners, defaultHeroBanners } from '../../utils/api';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(defaultHeroBanners);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch live banners from database
  useEffect(() => {
    let isMounted = true;

    const loadBanners = () => {
      getHeroBanners().then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const active = data.filter(b => b.isActive !== false);
          setBanners(active.length > 0 ? active : defaultHeroBanners);
        }
      }).catch((err) => {
        console.warn('Hero could not load banners:', err);
      });
    };

    loadBanners();

    const handleSync = () => loadBanners();
    window.addEventListener('hero_banners_updated', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      isMounted = false;
      window.removeEventListener('hero_banners_updated', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Ensure currentIndex stays within bounds when banners list updates
  useEffect(() => {
    if (currentIndex >= banners.length) {
      setCurrentIndex(0);
    }
  }, [banners.length, currentIndex]);

  // Auto-play slideshow if multiple banners exist
  useEffect(() => {
    if (banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-bg">
        {/* Render background slides */}
        {banners.map((banner, idx) => (
          <div
            key={banner.id || idx}
            className={`hero-slide ${idx === currentIndex ? 'active' : ''}`}
          >
            <img
              src={banner.imageUrl}
              alt={banner.title || 'Bhaktivedanta Hospital Architecture'}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
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
            <button className="btn-primary" onClick={() => navigate('/services')}>Explore Services</button>
            <button className="btn-outline" onClick={() => navigate('/contact')}>Contact Us</button>
          </div>
        </div>
      </div>

      {/* Interactive controls when multiple background images exist */}
      {banners.length > 1 && (
        <div className="hero-slider-dots">
          <button
            type="button"
            className="hero-slider-nav-btn"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={16} />
          </button>

          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`hero-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}

          <button
            type="button"
            className="hero-slider-nav-btn"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;
