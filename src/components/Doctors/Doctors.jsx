import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { initialDoctors } from '../../data/adminState';
import AppointmentModal from '../AppointmentModal/AppointmentModal';
import './Doctors.css';

const Doctors = () => {
  const baseDoctors = [
    { name: 'Dr. Kshama Shah', specialty: 'MBBS, MD (Anesthesia)', department: 'Anesthesiology', subSpeciality: 'Head of Department & Consultant Anesthesiologist', qualifications: 'MBBS, MD (Anesthesia), BLS & ACLS Instructor', exp: '25 Years Experience', availability: 'Available', featured: 'Yes', image: '/doctor1.png' },
    { name: 'Dr. Shilpa Mangesh Tiwaskar', specialty: 'MBBS, MD (Anesthesia)', department: 'Anesthesiology', subSpeciality: 'Consultant Anesthesiologist', qualifications: 'MBBS, MD (Anesthesia), BLS & ACLS Instructor', exp: '23 Years Experience', availability: 'Available', featured: 'Yes', image: '/doctor2.png' },
    { name: 'Dr. Jyotsna Karande', specialty: 'MBBS, DA, BLS', department: 'Anesthesiology', subSpeciality: 'Consultant Anesthesiologist', qualifications: 'MBBS, DA, BLS, ACLS Provider', exp: '16 Years Experience', availability: 'Busy', featured: 'Yes', image: '/doctor3.png' },
    { name: 'Dr. Vivek Kulkarni', specialty: 'Consultant Anesthesiologist', department: 'Anesthesiology', subSpeciality: 'Consultant Anesthesiologist', qualifications: 'MBBS, MD (Anesthesia)', exp: '15 Years Experience', availability: 'Available', featured: 'Yes', image: '/doctor4.png' }
  ];

  const [doctorsList, setDoctorsList] = useState(baseDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  useEffect(() => {
    initialDoctors().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        // Pick featured doctors or top 16 doctors for public track
        const featured = data.filter(d => d.featured === 'Yes');
        const displayList = featured.length >= 8 ? featured : data.slice(0, 16);
        
        const mapped = displayList.map((doc, i) => ({
          id: doc.id || `doc-${i + 1}`,
          name: doc.name,
          specialty: doc.qualifications || doc.department || 'Specialist Consultant',
          qualifications: doc.qualifications || doc.department || 'MBBS, Specialist Consultant',
          department: doc.department || 'General & Internal Medicine',
          subSpeciality: doc.subSpeciality || doc.department || 'Consultant Specialist',
          exp: doc.experience ? (doc.experience.toLowerCase().includes('year') ? doc.experience : `${doc.experience} Experience`) : '10+ Years Experience',
          availability: doc.availability || 'Available',
          featured: doc.featured || 'No',
          status: doc.status || 'Active',
          image: doc.image || `/doctor${(i % 4) + 1}.png`
        }));
        setDoctorsList(mapped);
      }
    }).catch(err => console.error("Error loading doctors for showcase:", err));
  }, []);

  // Lock background body scroll when profile modal popup is active
  useEffect(() => {
    if (selectedDoctor) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedDoctor]);

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
            <div 
              key={index} 
              className="doctor-card" 
              style={{ '--i': index }}
              onClick={() => setSelectedDoctor(doctor)}
              title={`Click to view profile of ${doctor.name}`}
            >
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
                <button 
                  className="btn-profile"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDoctor(doctor);
                  }}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor Profile Modal Popup Portal */}
      {selectedDoctor && createPortal(
        <div 
          className="public-doc-modal-overlay"
          onClick={() => setSelectedDoctor(null)}
        >
          <div 
            className="public-doc-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button 
              className="public-doc-modal-close"
              onClick={() => setSelectedDoctor(null)}
              title="Close Profile"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Top Banner / Hero Header */}
            <div className="public-doc-header">
              <div className="public-doc-avatar-wrap">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="public-doc-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/doctor1.png';
                  }}
                />
              </div>
              <div className="public-doc-header-info">
                {selectedDoctor.featured === 'Yes' && (
                  <div className="public-doc-badges">
                    <span className="featured-tag">
                      <span className="material-symbols-outlined">verified</span> Featured Specialist
                    </span>
                  </div>
                )}
                <h2>{selectedDoctor.name}</h2>
                <p className="public-doc-subspec">{selectedDoctor.subSpeciality || selectedDoctor.department}</p>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="public-doc-body">
              {/* Qualifications Block */}
              <div className="doc-detail-block full-width">
                <label className="block-label">
                  <span className="material-symbols-outlined">workspace_premium</span> Qualifications & Credentials
                </label>
                <p className="block-value highlight-qual">{selectedDoctor.qualifications || selectedDoctor.specialty}</p>
              </div>

              <div className="doc-detail-grid">
                <div className="doc-detail-block">
                  <label className="block-label">
                    <span className="material-symbols-outlined">medical_services</span> Department
                  </label>
                  <p className="block-value">{selectedDoctor.department}</p>
                </div>

                <div className="doc-detail-block">
                  <label className="block-label">
                    <span className="material-symbols-outlined">history_edu</span> Experience
                  </label>
                  <p className="block-value">{selectedDoctor.exp}</p>
                </div>

                <div className="doc-detail-block">
                  <label className="block-label">
                    <span className="material-symbols-outlined">schedule</span> Consultation Hours
                  </label>
                  <p className="block-value">Mon – Sat (OPD & On-Call)</p>
                </div>

                <div className="doc-detail-block">
                  <label className="block-label">
                    <span className="material-symbols-outlined">local_hospital</span> Facility Campus
                  </label>
                  <p className="block-value">Main Hospital & Research Unit</p>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="public-doc-footer">
              <button 
                className="btn-doc-modal-close"
                onClick={() => setSelectedDoctor(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Appointment Modal */}
      {isAppointmentOpen && (
        <AppointmentModal 
          isOpen={isAppointmentOpen}
          onClose={() => setIsAppointmentOpen(false)}
        />
      )}
    </section>
  );
};

export default Doctors;
