import React, { useState, useEffect } from 'react';
import './Testimonials.css';
import { Star, Quote } from 'lucide-react';
import { initialTestimonials } from '../../data/adminState';

const fallbackTestimonials = [
  {
    id: 'TST-201',
    patientName: "Pradeep Jena",
    disease: "Heart Surgery Patient",
    rating: 5,
    content: "Bhaktivedanta Hospital saved my life with the fastest care I could find. The doctors and nurses were exceptionally kind throughout my treatment.",
    status: "Approved"
  },
  {
    id: 'TST-202',
    patientName: "Anjali Sharma",
    disease: "Spine Surgery Recovery",
    rating: 5,
    content: "The nursing staff treated me like family during my recovery. The blend of spiritual warmth and clinical excellence is what makes this hospital truly unique.",
    status: "Approved"
  },
  {
    id: 'TST-203',
    patientName: "Vikram Malhotra",
    disease: "Critical Care Patient",
    rating: 5,
    content: "State-of-the-art diagnostic facilities and highly professional doctors. I highly recommend Bhaktivedanta for anyone seeking high-end critical care.",
    status: "Approved"
  }
];

const Testimonials = () => {
  const [items, setItems] = useState(fallbackTestimonials);

  useEffect(() => {
    initialTestimonials().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const approvedOnly = data.filter(t => t.status === 'Approved' || !t.status);
        if (approvedOnly.length > 0) {
          setItems(approvedOnly);
        } else {
          setItems(data);
        }
      }
    });
  }, []);

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Testimonials</p>
          <h2>Stories of <span>Hope & Healing</span></h2>
        </div>
        
        <div className="testimonials-grid">
          {items.map((item, index) => {
            const name = item.patientName || item.name || 'Anonymous';
            const tag = item.disease || item.tag || 'Patient Review';
            const starCount = item.rating || item.stars || 5;
            const quoteText = item.content || item.quote || '';
            const initial = name.charAt(0).toUpperCase();

            return (
              <div key={item.id || index} className="testimonial-card compact-glass fade-in" style={{ '--i': index }}>
                <div className="card-top">
                  <Quote className="quote-icon" size={40} />
                  <div className="stars">
                    {[...Array(starCount)].map((_, i) => (
                      <Star key={i} fill="#f59e0b" color="#f59e0b" size={18} />
                    ))}
                  </div>
                </div>
                
                <p className="quote">"{quoteText}"</p>
                
                <div className="patient-info">
                   <div className="patient-avatar">
                     {initial}
                   </div>
                   <div className="patient-meta">
                      <span className="patient-name">{name}</span>
                      <span className="patient-tag">{tag}</span>
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
