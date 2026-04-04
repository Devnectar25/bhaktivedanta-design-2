import React from 'react';
import './Testimonials.css';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Testimonials</p>
          <h2>What Our <span>Patients Say</span></h2>
        </div>
        
        <div className="testimonial-wrapper fade-in">
          <div className="testimonial-card glass">
            <div className="stars">
              <Star fill="#d97706" color="#d97706" size={20} />
              <Star fill="#d97706" color="#d97706" size={20} />
              <Star fill="#d97706" color="#d97706" size={20} />
              <Star fill="#d97706" color="#d97706" size={20} />
              <Star fill="#d97706" color="#d97706" size={20} />
            </div>
            <p className="quote">
              "Bhaktivedanta Hospital saved my life with the fastest care I could find. 
              The doctors and nurses were exceptionally kind throughout my treatment."
            </p>
            <div className="patient-info">
              <span className="patient-name">Pradeep Jena</span>
              <span className="patient-tag">Heart Surgery Patient</span>
            </div>
          </div>
          
          <div className="testimonial-controls">
            <button className="control-btn"><ChevronLeft /></button>
            <div className="dots">
               <span className="dot active"></span>
               <span className="dot"></span>
               <span className="dot"></span>
            </div>
            <button className="control-btn"><ChevronRight /></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
