import React from 'react';
import './Services.css';
import { HeartPulse, Brain, Stethoscope, Siren } from 'lucide-react';

const Services = () => {
  const services = [
    {
      title: 'Cardiology',
      icon: <HeartPulse />,
      description: 'Comprehensive heart care including diagnostics, surgery, and rehabilitation with expert cardiologists.',
      color: '#fee2e2'
    },
    {
      title: 'Neurology',
      icon: <Brain />,
      description: 'Specialized care for neurological disorders, brain health, and advanced treatment for stroke and epilepsy.',
      color: '#fef3c7'
    },
    {
      title: 'Orthopedics',
      icon: <Stethoscope />,
      description: 'Expert care for bone and joint health, sports medicine, and minimally invasive surgeries for better mobility.',
      color: '#dcfce7'
    },
    {
      title: 'Emergency',
      icon: <Siren />,
      description: '24/7 rapid response for critical care, trauma, and medical emergencies with a dedicated trauma team.',
      color: '#eff6ff'
    }
  ];

  return (
    <section id="services" className="services-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Medical Specialists</p>
          <h2>World-Class <span>Medical Services</span></h2>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card fade-in hover-lift">
              <div className="icon-wrapper" style={{ backgroundColor: service.color }}>
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#" className="read-more">Learn More <span>→</span></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
