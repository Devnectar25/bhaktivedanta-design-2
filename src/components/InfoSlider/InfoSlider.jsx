import React, { useState, useEffect, useCallback } from 'react';
import './InfoSlider.css';

const slides = [
  {
    id: 1,
    tag: 'Our Foundation',
    quote: 'HE BUILT A HOUSE IN WHICH\nTHE WHOLE WORLD CAN LIVE',
    attribution: 'A. C. Bhaktivedanta Swami Prabhupada',
    subtext: 'is dedicated to the mission of compassionate healing',
    accent: '#224388', /* Bhakti logo deep blue */
    accentLight: '#eef2ff',
    image: '/prabhupada.png',
    imageLabel: 'A. C. Bhaktivedanta Swami Prabhupada',
    stats: [
      { value: '25+', label: 'Years of Service' },
      { value: '1L+', label: 'Lives Touched' },
      { value: '100+', label: 'Expert Doctors' },
    ],
  },
  {
    id: 2,
    tag: 'Advanced Care',
    quote: 'WHERE MODERN MEDICINE MEETS\nSPIRITUAL WISDOM',
    attribution: 'A. C. Bhaktivedanta Swami Prabhupada',
    subtext: 'is committed to holistic healthcare excellence',
    accent: '#1e3a8a', /* Deep navy */
    accentLight: '#eef2ff',
    image: '/prabhupada_2.png',
    imageLabel: 'A. C. Bhaktivedanta Swami Prabhupada',
    stats: [
      { value: '24/7', label: 'Emergency Care' },
      { value: '50+', label: 'Departments' },
      { value: '500+', label: 'Beds' },
    ],
  },
  {
    id: 3,
    tag: 'Our Mission',
    quote: 'HEALING WITH COMPASSION,\nSERVING WITH DEVOTION',
    attribution: 'A. C. Bhaktivedanta Swami Prabhupada',
    subtext: 'is serving humanity through quality healthcare',
    accent: '#172554', /* Darker Navy */
    accentLight: '#eef2ff',
    image: '/prabhupada_3.png',
    imageLabel: 'A. C. Bhaktivedanta Swami Prabhupada',
    stats: [
      { value: '95%', label: 'Patient Satisfaction' },
      { value: '0', label: 'Compromise on Care' },
      { value: '∞', label: 'Compassion' },
    ],
  },
  {
    id: 4,
    tag: 'Our Promise',
    quote: 'A HOSPITAL WHERE EVERY\nPATIENT IS A GUEST OF GOD',
    attribution: 'A. C. Bhaktivedanta Swami Prabhupada',
    subtext: 'is equipped with cutting-edge medical technology',
    accent: '#1e40af', /* Vibrant Navy */
    accentLight: '#eef2ff',
    image: '/prabhupada_4.png',
    imageLabel: 'A. C. Bhaktivedanta Swami Prabhupada',
    stats: [
      { value: '10+', label: 'OT Theatres' },
      { value: 'NABH', label: 'Accredited' },
      { value: 'ISO', label: 'Certified' },
    ],
  },
];

const InfoSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');

  const goTo = useCallback((index, dir = 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, 'next');
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, 'prev');
  }, [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="info-slider-section">
      <div
        className={`info-slider-track ${isAnimating ? `slide-out-${direction}` : 'slide-in'}`}
        style={{ '--accent': slide.accent, '--accent-light': slide.accentLight }}
      >
        {/* Left: Image panel */}
        <div className="slider-left" style={{ background: slide.accentLight }}>
          <div className="slider-mandala">
            <div className="mandala-ring ring-1"></div>
            <div className="mandala-ring ring-2"></div>
            <div className="mandala-ring ring-3"></div>
            <div className="slider-img-wrap">
              <img src={slide.image} alt={slide.imageLabel} className="slider-portrait" />
            </div>
          </div>
          {/* Stats row */}
          <div className="slider-stats">
            {slide.stats.map((s, i) => (
              <div key={i} className="slider-stat">
                <span className="stat-value" style={{ color: slide.accent }}>{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content panel */}
        <div className="slider-right" style={{ background: slide.accent }}>
          <span className="slider-tag">{slide.tag}</span>
          <h2 className="slider-quote">
            {slide.quote.split('\n').map((line, i) => (
              <span key={i}>{line}<br /></span>
            ))}
          </h2>
          <div className="slider-logo-row">
            <img src="/icon.png" alt="Hospital Icon" className="slider-logo-icon" />
            <img src="/logo.png" alt="Bhaktivedanta Hospital" className="slider-logo" />
          </div>
          <p className="slider-attribution">
            <em>— {slide.attribution}</em>
          </p>
          <p className="slider-subtext">
            <strong>Bhaktivedanta Hospital &amp; Research Institute</strong><br />
            {slide.subtext}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <button className="slider-nav slider-nav-prev" onClick={prev} aria-label="Previous slide">
        ‹
      </button>
      <button className="slider-nav slider-nav-next" onClick={next} aria-label="Next slide">
        ›
      </button>

      {/* Dots */}
      <div className="slider-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`slider-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i, i > current ? 'next' : 'prev')}
            aria-label={`Go to slide ${i + 1}`}
            style={{ '--dot-color': slides[i].accent }}
          />
        ))}
      </div>
    </section>
  );
};

export default InfoSlider;
