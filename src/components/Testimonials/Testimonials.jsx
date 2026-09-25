import React, { useState, useEffect } from 'react';
import './Testimonials.css';
import { Star, Quote } from 'lucide-react';
import { initialReviews } from '../../data/adminState';

const fallbackReviews = [
  {
    id: 'TST-202',
    patientName: "Nalini Iyer",
    disease: "Maternity Care",
    rating: 5,
    content: "Very clean facilities and caring nursing staff. Standard protocols were strictly followed during my delivery. Highly recommended.",
    status: "Approved"
  },
  {
    id: 'TST-201',
    patientName: "Harish Mehta",
    disease: "Angioplasty Patient",
    rating: 5,
    content: "The care and attention I received at Bhaktivedanta Hospital was exceptional. Dr. Anand Sharma is highly professional and compassionate.",
    status: "Approved"
  },
  {
    id: 'TST-203',
    patientName: "Pradeep Jena",
    disease: "Heart Surgery Patient",
    rating: 5,
    content: "Bhaktivedanta Hospital saved my life with the fastest care I could find. The doctors and nurses were exceptionally kind throughout my treatment.",
    status: "Approved"
  }
];

const Testimonials = () => {
  const [items, setItems] = useState(fallbackReviews);

  useEffect(() => {
    initialReviews().then(data => {
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
          <p className="section-label">Patient Reviews</p>
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
