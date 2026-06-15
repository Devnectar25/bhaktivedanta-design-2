import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Main Site components
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import InfoSlider from './components/InfoSlider/InfoSlider';
import About from './components/About/About';
import Services from './components/Services/Services';
import Doctors from './components/Doctors/Doctors';
import Stats from './components/Stats/Stats';
import Infrastructure from './components/Infrastructure/Infrastructure';
import Testimonials from './components/Testimonials/Testimonials';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import SpecialityModal from './components/SpecialityModal/SpecialityModal';

// Admin Layout & Pages
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin/AdminLogin';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import AdminDoctors from './pages/admin/Doctors/Doctors';
import Appointments from './pages/admin/Appointments/Appointments';
import Events from './pages/admin/Events/Events';
import DoctorAvailability from './pages/admin/Doctors/DoctorAvailability';
import ContactQueries from './pages/admin/ContactQueries/ContactQueries';
import AdminUsers from './pages/admin/AdminUsers/AdminUsers';
import AdminServices from './pages/admin/Services/Services';
import Specialities from './pages/admin/Specialities/Specialities';
import HealthPackages from './pages/admin/HealthPackages/HealthPackages';
import AdminTestimonials from './pages/admin/Testimonials/Testimonials';
import News from './pages/admin/News/News';
import Gallery from './pages/admin/Gallery/Gallery';
import Settings from './pages/admin/Settings/Settings';

// Admin Forms
import AddDoctor from './pages/admin/Doctors/AddDoctor';
import AddEvent from './pages/admin/Events/AddEvent';
import AddAppointment from './pages/admin/Appointments/AddAppointment';
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

import './App.css';

function MainSite() {
  const [selectedSpeciality, setSelectedSpeciality] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const handleSelectSpeciality = (speciality, categoryName) => {
    setSelectedSpeciality(speciality);
    setSelectedCategoryName(categoryName);
  };

  return (
    <div className="app">
      <Navbar onSelectSpeciality={handleSelectSpeciality} />
      <main>
        <Hero />
        <InfoSlider />
        <About />
        <Services />
        <Doctors />
        <Stats />
        <Infrastructure />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      
      <SpecialityModal 
        speciality={selectedSpeciality}
        categoryName={selectedCategoryName}
        onClose={() => {
          setSelectedSpeciality(null);
          setSelectedCategoryName('');
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Main Public Website */}
      <Route path="/" element={<MainSite />} />

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
        <Route path="events" element={<Events />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="contact-queries" element={<ContactQueries />} />
        <Route path="admin-users" element={<AdminUsers />} />
        <Route path="settings" element={<Settings />} />

        {/* Forms */}
        <Route path="add-doctor" element={<AddDoctor />} />
        <Route path="add-event" element={<AddEvent />} />
        <Route path="add-appointment" element={<AddAppointment />} />
        <Route path="add-category" element={<AddCategory />} />
        <Route path="add-service" element={<AddService />} />
        <Route path="add-speciality" element={<AddSpeciality />} />
        <Route path="add-testimonial" element={<AddTestimonial />} />
        <Route path="add-gallery-media" element={<AddGalleryMedia />} />
        <Route path="add-news" element={<AddNews />} />
        <Route path="add-health-package" element={<AddHealthPackage />} />
        <Route path="add-query" element={<AddQuery />} />
        <Route path="add-sub-admin" element={<AddSubAdmin />} />
        <Route path="add-admin-user" element={<AddAdminUser />} />
      </Route>

      {/* Fallback Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
