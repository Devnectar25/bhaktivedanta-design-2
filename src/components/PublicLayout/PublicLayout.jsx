import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import ServiceDetailModal from '../ServiceDetailModal';
import AppointmentModal from '../AppointmentModal/AppointmentModal';
import FloatingActions from '../FloatingActions/FloatingActions';
import { getServicesState } from '../../utils/api';
import { defaultServicesState, ensureStandardServiceTabs } from '../../data/defaultServices';
import './PublicLayout.css';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-btn ${isVisible ? 'visible' : ''}`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={24} />
    </button>
  );
}

export default function PublicLayout({ children }) {
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [selectedPatientGuide, setSelectedPatientGuide] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleSelectSpeciality = (speciality, categoryName) => {
    setSelectedSpeciality(speciality);
    setSelectedCategoryName(categoryName);
    setSelectedPatientGuide(null);
  };

  const handleSelectPatientGuide = (guide, categoryName) => {
    setSelectedPatientGuide(guide);
    setSelectedSpeciality(guide);
    setSelectedCategoryName(categoryName || guide.category || 'Patients Corner');
  };

  const handleOpenAppointmentModal = () => {
    window.open('https://his.bhaktivedantahospital.com/EHR/', '_blank', 'noopener,noreferrer');
  };

  const handleCloseDetailModal = () => {
    setSelectedSpeciality(null);
    setSelectedPatientGuide(null);
    setSelectedCategoryName('');
    if (location.pathname.startsWith('/services/')) {
      navigate(-1);
    }
  };

  return (
    <div className="public-app-wrapper">
      <Navbar
        onSelectSpeciality={handleSelectSpeciality}
        onSelectPatientGuide={handleSelectPatientGuide}
        onOpenAppointment={handleOpenAppointmentModal}
      />
      <ScrollToTop />
      <FloatingActions />

      <main className={`public-main-content ${isHomePage ? 'home-main-content' : ''}`}>
        {children || <Outlet />}
      </main>

      <Footer />

      <ServiceDetailModal
        service={selectedPatientGuide || selectedSpeciality}
        categoryName={selectedCategoryName}
        onClose={handleCloseDetailModal}
      />

      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
}
