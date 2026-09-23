import React, { useEffect } from 'react';
import Contact from '../../components/Contact/Contact';
import './ContactPage.css';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="contact-page-wrapper">
      <Contact />
    </div>
  );
};

export default ContactPage;
