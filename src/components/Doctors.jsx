import React from 'react';
import './Doctors.css';

const Doctors = () => {
  const baseDoctors = [
    { name: 'Dr. Pratikshya Das', specialty: 'MBBS, MD (Cardiology)', exp: '15 Years Experience', image: '/doctor1.png' },
    { name: 'Dr. Rekha Saxena', specialty: 'MBBS, MD (Neurology)', exp: '12 Years Experience', image: '/doctor2.png' },
    { name: 'Dr. Anand Sharma', specialty: 'MBBS, MD (Orthopedics)', exp: '14 Years Experience', image: '/doctor3.png' },
    { name: 'Dr. Sunil Mishra', specialty: 'MBBS, MD (Emergency)', exp: '10 Years Experience', image: '/doctor4.png' }
  ];

  const dummyDoctors = [
    { name: 'Dr. Rajesh Khanna', specialty: 'MBBS, MD (General Medicine)', exp: '20 Years Experience' },
    { name: 'Dr. Sunita Williams', specialty: 'MBBS, MD (Oncology)', exp: '18 Years Experience' },
    { name: 'Dr. Arjun Kapoor', specialty: 'MBBS, MS (ENT)', exp: '11 Years Experience' },
    { name: 'Dr. Meera Nair', specialty: 'MBBS, MD (Pediatrics)', exp: '14 Years Experience' },
    { name: 'Dr. Kabir Singh', specialty: 'MBBS, MS (Surgery)', exp: '16 Years Experience' },
    { name: 'Dr. Aditi Rao', specialty: 'MBBS, MD (Psychiatry)', exp: '12 Years Experience' },
    { name: 'Dr. Vikram Seth', specialty: 'MBBS, MD (Dermatology)', exp: '19 Years Experience' },
    { name: 'Dr. Priya Sharma', specialty: 'MBBS, MD (Gynecology)', exp: '15 Years Experience' },
    { name: 'Dr. Rahul Verma', specialty: 'MBBS, MD (Urology)', exp: '17 Years Experience' },
    { name: 'Dr. Deepa Mehta', specialty: 'MBBS, MD (Ophthalmology)', exp: '13 Years Experience' }
  ].map((doc, i) => ({
    ...doc,
    image: `/doctor${(i % 4) + 1}.png` // Cycle through available images
  }));

  const allDoctors = [...baseDoctors, ...dummyDoctors];

  return (
    <section id="doctors" className="doctors-section">
      <div className="container-fluid doctors-container">
        <div className="section-header container">
          <p className="section-label">Our Team</p>
          <h2>Meet Our <span>Specialist Doctors</span></h2>
        </div>
        
        <div className="doctors-track">
          {/* Duplicate for seamless infinite scroll */}
          {[...allDoctors, ...allDoctors].map((doctor, index) => (
            <div key={index} className="doctor-card" style={{ '--i': index }}>
              <div className="doctor-image">
                <img src={doctor.image} alt={doctor.name} />
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
