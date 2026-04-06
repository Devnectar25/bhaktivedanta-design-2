import React from 'react';
import './Testimonials.css';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Pradeep Jena",
    tag: "Heart Surgery Patient",
    stars: 5,
    quote: "Bhaktivedanta Hospital saved my life with the fastest care I could find. The doctors and nurses were exceptionally kind throughout my treatment."
  },
  {
    name: "Anjali Sharma",
    tag: "Spine Surgery Recovery",
    stars: 5,
    quote: "The nursing staff treated me like family during my recovery. The blend of spiritual warmth and clinical excellence is what makes this hospital truly unique."
  },
  {
    name: "Vikram Malhotra",
    tag: "Critical Care Patient",
    stars: 5,
    quote: "State-of-the-art diagnostic facilities and highly professional doctors. I highly recommend Bhaktivedanta for anyone seeking high-end critical care."
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Testimonials</p>
          <h2>Stories of <span>Hope & Healing</span></h2>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="testimonial-card compact-glass fade-in" style={{ '--i': index }}>
              <div className="card-top">
                <Quote className="quote-icon" size={40} />
                <div className="stars">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} fill="#f59e0b" color="#f59e0b" size={18} />
                  ))}
                </div>
              </div>
              
              <p className="quote">"{item.quote}"</p>
              
              <div className="patient-info">
                 <div className="patient-avatar">
                   {item.name.charAt(0)}
                 </div>
                 <div className="patient-meta">
                    <span className="patient-name">{item.name}</span>
                    <span className="patient-tag">{item.tag}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
