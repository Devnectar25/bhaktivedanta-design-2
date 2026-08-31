import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
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
            <a href="#about" className="btn-why-readmore">Read More</a>
          </div>
        </div>

        {/* RIGHT COLUMN: Testimonials */}
        <div className="testimonials-panel">
          <div className="testimonials-header">
            <h2>Testimonials</h2>
          </div>
          
          <div className="testimonials-stack-layout">
            <div className="testimonials-stack">
              {/* Card 1 */}
              <div className="stack-card">
                <div className="stack-card-avatar">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Mr. Alfred B. Ford" />
                </div>
                <div className="stack-card-content">
                  <p className="stack-card-quote">
                    "It has been a privilege for so many years to have known the 
                    doctors and staff of the Bhaktivedanta Hospital & Research 
                    Institute, Mumbai...I urge you from the bottom of my heart to 
                    please support this worthy project."
                  </p>
                  <h4 className="stack-card-name">Mr. Alfred B. Ford</h4>
                  <p className="stack-card-title">Director - Ford Motor Foundation, Detroit USA</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="stack-card">
                <div className="stack-card-avatar">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Dr. Subramanian Swamy" />
                </div>
                <div className="stack-card-content">
                  <p className="stack-card-quote">
                    Very impressed by the organised way this hospital is run. Congrats.
                  </p>
                  <h4 className="stack-card-name">Dr. Subramanian Swamy</h4>
                  <p className="stack-card-title">Ex-Rajya Sabha MP And Former Union Cabinet Minister</p>
                </div>
              </div>
            </div>
            
            {/* Slider Dots */}
            <div className="testimonials-slider-dots">
              <span className="dot active"></span>
              <span className="dot"></span>
            </div>
          </div>
          
          <div className="testimonials-action-wrap">
            <a href="#testimonials" className="btn-testimonials-more">View More Testimonials</a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
