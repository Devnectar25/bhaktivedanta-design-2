import React, { useEffect } from 'react';
import Contact from '../../components/Contact/Contact';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="pt-8 pb-16 min-h-screen bg-slate-50">
      <Contact />
    </div>
  );
};

export default ContactPage;
