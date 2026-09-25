import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initialTestimonials } from '../../data/adminState';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    initialTestimonials().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const approved = data.filter(t => t.status === 'Approved' || !t.status);
        setTestimonials(approved.length > 0 ? approved : data);
      }
    });
  }, []);

  const pageSize = 2;
  const totalPages = Math.max(1, Math.ceil(testimonials.length / pageSize));
  const displayedTestimonials = testimonials.length > 0 
    ? testimonials.slice(activeIndex * pageSize, activeIndex * pageSize + pageSize)
    : [
        {
          id: 'VIP-01',
          name: 'Mr. Alfred B. Ford',
          designation: 'Director - Ford Motor Foundation, Detroit USA',
          content: 'It has been a privilege for so many years to have known the doctors and staff of the Bhaktivedanta Hospital & Research Institute, Mumbai...I urge you from the bottom of my heart to please support this worthy project.',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        {
          id: 'VIP-02',
          name: 'Dr. Subramanian Swamy',
          designation: 'Ex-Rajya Sabha MP And Former Union Cabinet Minister',
          content: 'Very impressed by the organised way this hospital is run. Congrats.',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        }
      ];

  return (
    <section className="why-testimonials-section">
      <div className="container why-testimonials-container">
        
        {/* LEFT COLUMN: Why Choose Us */}
        <div className="why-choose-us-panel">
          <div className="why-header">
            <h2>Why Choose Us?</h2>
          </div>
          
          <p className="why-desc">
            Bhaktivedanta Hospital & Research Institute is a multi-specialty tertiary 
            care NABH accredited hospital committed to provide holistic and 
            affordable medical services to society.
          </p>
          
          <div className="why-features-grid">
            <div className="why-feature-card">
              <div className="why-feature-icon-wrap">
                <span className="material-symbols-outlined why-icon">stethoscope</span>
              </div>
              <p className="why-feature-text">
                Integrated Approach for promoting health and preventing diseases
              </p>
            </div>
            
            <div className="why-feature-card">
              <div className="why-feature-icon-wrap">
                <span className="material-symbols-outlined why-icon">group</span>
              </div>
              <p className="why-feature-text">
                150+ Doctors from all Specialties and Super Specialties
              </p>
            </div>
            
            <div className="why-feature-card">
              <div className="why-feature-icon-wrap">
                <span className="material-symbols-outlined why-icon">groups_3</span>
              </div>
              <p className="why-feature-text">
                1000+ Staff
              </p>
            </div>
            
            <div className="why-feature-card">
              <div className="why-feature-icon-wrap">
                <span className="material-symbols-outlined why-icon">health_and_safety</span>
              </div>
              <p className="why-feature-text">
                Millions of Lives touched
              </p>
            </div>
          </div>
          
          <div className="why-action-wrap">
            <Link to="/about-us/about-hospital" className="btn-why-readmore">
              <span>Read More</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: Testimonials */}
        <div className="testimonials-panel">
          <div className="testimonials-header">
            <h2>Testimonials</h2>
          </div>
          
          <div className="testimonials-stack-layout">
            <div className="testimonials-stack">
              {displayedTestimonials.map((item, idx) => (
                <div key={item.id || idx} className="stack-card">
                  <div className="stack-card-avatar">
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                      }}
                    />
                  </div>
                  <div className="stack-card-content">
                    <p className="stack-card-quote">
                      "{item.content}"
                    </p>
                    <h4 className="stack-card-name">{item.name}</h4>
                    <p className="stack-card-title">{item.designation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Slider Dots */}
            {totalPages > 1 && (
              <div className="testimonials-slider-dots">
                {[...Array(totalPages)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`dot ${i === activeIndex ? 'active' : ''}`}
                    onClick={() => setActiveIndex(i)}
                    style={{ cursor: 'pointer' }}
                    title={`Page ${i + 1}`}
                  ></span>
                ))}
              </div>
            )}
          </div>
          
          <div className="testimonials-action-wrap">
            <Link to="/testimonials" className="btn-testimonials-more">View More Testimonials</Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
