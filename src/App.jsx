import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';
import { initGlobalErrorHandler } from './utils/errorLogger';

// Main Site components
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import InfoSlider from './components/InfoSlider/InfoSlider';
import WhyChooseUs from './components/WhyChooseUs/WhyChooseUs';
import CentresOfExcellence from './components/CentresOfExcellence/CentresOfExcellence';
import Doctors from './components/Doctors/Doctors';
import Stats from './components/Stats/Stats';
import NewDevelopments from './components/NewDevelopments/NewDevelopments';
import Infrastructure from './components/Infrastructure/Infrastructure';
import Testimonials from './components/Testimonials/Testimonials';
import Footer from './components/Footer/Footer';
import ServiceDetailModal from './components/ServiceDetailModal';
import AppointmentModal from './components/AppointmentModal/AppointmentModal';
import CareersPage from './pages/Careers/CareersPage';
import DnbProgramPage from './pages/Education/DnbProgramPage';
import EducationSectionPage from './pages/Education/EducationSectionPage';
import ContactPage from './pages/Contact/ContactPage';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin/AdminLogin';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import AdminDoctors from './pages/admin/Doctors/Doctors';
import Events from './pages/admin/Events/Events';
import DoctorAvailability from './pages/admin/Doctors/DoctorAvailability';
import ContactQueries from './pages/admin/ContactQueries/ContactQueries';
import AdminUsers from './pages/admin/AdminUsers/AdminUsers';
import AdminServices from './pages/admin/Services/Services';
import Specialities from './pages/admin/Specialities/Specialities';
import HealthPackages from './pages/admin/HealthPackages/HealthPackages';
import AdminTestimonials from './pages/admin/Testimonials/Testimonials';
import News from './pages/admin/News/News';
import Blogs from './pages/admin/Blogs/Blogs';
import Gallery from './pages/admin/Gallery/Gallery';
import Settings from './pages/admin/Settings/Settings';
import HelpDesk from './pages/admin/HelpDesk/HelpDesk';
import SubAdmin from './pages/admin/SubAdmin/SubAdmin';
import ApplicationErrors from './pages/admin/ApplicationErrors/ApplicationErrors';
import PatientsCorner from './pages/admin/PatientsCorner/PatientsCorner';
import SpiritualCare from './pages/admin/SpiritualCare/SpiritualCare';
import EducationResearch from './pages/admin/EducationResearch/EducationResearch';
import AssociateCentres from './pages/admin/AssociateCentres/AssociateCentres';
import Careers from './pages/admin/Careers/Careers';
import StatutoryCompliances from './pages/admin/StatutoryCompliances/StatutoryCompliances';
import PatientFeedback from './pages/admin/Feedback/PatientFeedback';
import FeedbackPage from './pages/Feedback/FeedbackPage';

// Admin Forms
import AddDoctor from './pages/admin/Doctors/AddDoctor';
import AddEvent from './pages/admin/Events/AddEvent';
import AddCategory from './pages/admin/Specialities/AddCategory';
import AddService from './pages/admin/Services/AddService';
import AddSpeciality from './pages/admin/Specialities/AddSpeciality';
import AddTestimonial from './pages/admin/Testimonials/AddTestimonial';
import AddGalleryMedia from './pages/admin/Gallery/AddGalleryMedia';
import AddNews from './pages/admin/News/AddNews';
import AddHealthPackage from './pages/admin/HealthPackages/AddHealthPackage';
import AddQuery from './pages/admin/ContactQueries/AddQuery';
import AddSubAdmin from './pages/admin/AdminUsers/AddSubAdmin';
import AddAdminUser from './pages/admin/AdminUsers/AddAdminUser';
import AddPatientGuide from './pages/admin/PatientsCorner/AddPatientGuide';
import AddBlog from './pages/admin/Blogs/AddBlog';

// Public Layout & Spiritual Care Pages
import PublicLayout from './components/PublicLayout/PublicLayout';
import SpiritualCareServices from './pages/SpiritualCare/SpiritualCareServices';
import EducationalProgrammes from './pages/SpiritualCare/EducationalProgrammes';
import ProgramDetailPage from './pages/SpiritualCare/ProgramDetailPage';
import SpiritualRetreats from './pages/SpiritualCare/SpiritualRetreats';
import PublicationsPapers from './pages/SpiritualCare/PublicationsPapers';

import './App.css';

function HomeContent() {
  return (
    <>
      <Hero />
      <InfoSlider />
      <WhyChooseUs />
      <Doctors />
      <Stats />
      <NewDevelopments />
      <Infrastructure />
      <Testimonials />
    </>
  );
}

function App() {
  useEffect(() => {
    initGlobalErrorHandler();
  }, []);

  return (
    <ErrorBoundary>
      <Routes>
        {/* Main Public Website Home & Pages wrapped in PublicLayout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomeContent />} />
          <Route path="/services/:id" element={<HomeContent />} />
          <Route path="/spiritual-care" element={<SpiritualCareServices />} />
          <Route path="/spiritual-care/educational-programmes" element={<EducationalProgrammes />} />
          <Route path="/spiritual-care/educational-programmes/:id" element={<ProgramDetailPage />} />
          <Route path="/spiritual-care/spiritual-retreats" element={<SpiritualRetreats />} />
          <Route path="/spiritual-care/publications-papers" element={<PublicationsPapers />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Route>

        {/* Education & Medical Research Dedicated Routes */}
        <Route path="/education/dnb-program" element={<DnbProgramPage />} />
        <Route path="/education-careers/dnb-program" element={<DnbProgramPage />} />
        <Route path="/education/nursing-program" element={<EducationSectionPage />} />
        <Route path="/education/cme" element={<EducationSectionPage />} />
        <Route path="/education/cne" element={<EducationSectionPage />} />
        <Route path="/education/spiritual-care-course" element={<EducationSectionPage />} />
        <Route path="/education/clinical-research-course" element={<EducationSectionPage />} />
        <Route path="/education/clinical-trials" element={<EducationSectionPage />} />
        <Route path="/education/ethics-committee" element={<EducationSectionPage />} />
        <Route path="/education/publications" element={<EducationSectionPage />} />
        <Route path="/education/government-accreditation" element={<EducationSectionPage />} />
        <Route path="/education/:sectionSlug" element={<EducationSectionPage />} />
        <Route path="/education" element={<Navigate to="/education/dnb-program" replace />} />


        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Panel Layout & Nested Views */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect from /admin directly to /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="specialities" element={<Specialities />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="doctor-availability" element={<DoctorAvailability />} />
          <Route path="health-packages" element={<HealthPackages />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="news" element={<News />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          
          {/* Appointments and Add Appointment internal admin functionality removed; redirected to dashboard */}
          <Route path="appointments" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="add-appointment" element={<Navigate to="/admin/dashboard" replace />} />

          <Route path="contact-queries" element={<ContactQueries />} />
          <Route path="patient-feedback" element={<PatientFeedback />} />
          <Route path="admin-users" element={<AdminUsers />} />
          <Route path="sub-admins" element={<SubAdmin />} />
          <Route path="help-desk" element={<HelpDesk />} />
          <Route path="application-errors" element={<ApplicationErrors />} />

          {/* Patient Corner Admin Routes */}
          <Route path="patients-corner" element={<PatientsCorner />} />

          <Route path="spiritual-care" element={<SpiritualCare />} />
          <Route path="spiritual-care/:section" element={<SpiritualCare />} />
          <Route path="education-research" element={<EducationResearch />} />
          <Route path="associate-centres" element={<AssociateCentres />} />
          <Route path="careers" element={<Careers />} />
          <Route path="statutory-compliances" element={<StatutoryCompliances />} />
          <Route path="settings" element={<Settings />} />

          {/* Forms */}
          <Route path="add-doctor" element={<AddDoctor />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-service" element={<AddService mode="add" />} />
          <Route path="edit-service/:id" element={<AddService mode="edit" />} />
          <Route path="services/edit/:id" element={<AddService mode="edit" />} />
          <Route path="add-speciality" element={<AddSpeciality />} />
          <Route path="edit-speciality/:id" element={<AddSpeciality />} />
          <Route path="specialities/edit/:id" element={<AddSpeciality />} />
          <Route path="add-testimonial" element={<AddTestimonial />} />
          <Route path="add-gallery-media" element={<AddGalleryMedia />} />
          <Route path="add-news" element={<AddNews />} />
          <Route path="add-health-package" element={<AddHealthPackage />} />
          <Route path="add-query" element={<AddQuery />} />
          <Route path="add-sub-admin" element={<AddSubAdmin />} />
          <Route path="add-admin-user" element={<AddAdminUser />} />
          <Route path="add-patient-guide" element={<AddPatientGuide mode="add" />} />
          <Route path="edit-patient-guide/:id" element={<AddPatientGuide mode="edit" />} />
          <Route path="patients-corner/add" element={<AddPatientGuide mode="add" />} />
          <Route path="patients-corner/edit/:id" element={<AddPatientGuide mode="edit" />} />
          <Route path="add-blog" element={<AddBlog mode="add" />} />
          <Route path="edit-blog/:id" element={<AddBlog mode="edit" />} />
          <Route path="blogs/add" element={<AddBlog mode="add" />} />
          <Route path="blogs/edit/:id" element={<AddBlog mode="edit" />} />
        </Route>

        {/* Fallback Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
