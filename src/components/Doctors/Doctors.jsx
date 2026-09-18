import React, { useState, useEffect } from 'react';
import { initialDoctors } from '../../data/adminState';
import './Doctors.css';

const Doctors = () => {
  const baseDoctors = [
    { name: 'Dr. Kshama Shah', specialty: 'MBBS, MD (Anesthesia)', exp: '25 Years Experience', image: '/doctor1.png' },
    { name: 'Dr. Shilpa Mangesh Tiwaskar', specialty: 'MBBS, MD (Anesthesia)', exp: '23 Years Experience', image: '/doctor2.png' },
    { name: 'Dr. Jyotsna Karande', specialty: 'MBBS, DA, BLS', exp: '16 Years Experience', image: '/doctor3.png' },
    { name: 'Dr. Vivek Kulkarni', specialty: 'Consultant Anesthesiologist', exp: '15 Years Experience', image: '/doctor4.png' }
  ];

  const [doctorsList, setDoctorsList] = useState(baseDoctors);

  useEffect(() => {
    initialDoctors().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        // Pick featured doctors or top 16 doctors for public track
        const featured = data.filter(d => d.featured === 'Yes');
        const displayList = featured.length >= 8 ? featured : data.slice(0, 16);
        
        const mapped = displayList.map((doc, i) => ({
          name: doc.name,
          specialty: doc.qualifications || doc.department || 'Specialist Consultant',
          exp: doc.experience ? (doc.experience.toLowerCase().includes('year') ? doc.experience : `${doc.experience} Experience`) : '10+ Years Experience',
          image: doc.image || `/doctor${(i % 4) + 1}.png`
        }));
        setDoctorsList(mapped);
      }
    }).catch(err => console.error("Error loading doctors for showcase:", err));
  }, []);

  return (
    <section id="doctors" className="doctors-section">
      <div className="container-fluid doctors-container">
        <div className="section-header container">
          <p className="section-label">Our Team</p>
          <h2>Meet Our <span>Specialist Doctors</span></h2>
        </div>
        
        <div className="doctors-track">
          {/* Duplicate for seamless infinite scroll */}
          {[...doctorsList, ...doctorsList].map((doctor, index) => (
            <div key={index} className="doctor-card" style={{ '--i': index }}>
              <div className="doctor-image">
                <img 
                  src={doctor.image} 
                  alt={doctor.name} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `/doctor${(index % 4) + 1}.png`;
                  }}
                />
              </div>
              <div className="doctor-info">
                <h3>{doctor.name}</h3>
                <p className="specialty">{doctor.specialty}</p>
                <p className="exp">{doctor.exp}</p>
                <button className="btn-profile">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
