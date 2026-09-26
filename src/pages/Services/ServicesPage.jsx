import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Services from '../../components/Services/Services';
import './ServicesPage.css';

const ServicesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="services-page-root">
      {/* Top Banner / Breadcrumb Row */}
      <div className="services-page-banner">
        <div className="container">
          <nav className="services-page-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Services</span>
          </nav>
        </div>
      </div>

      {/* Services Component Content */}
      <div className="services-page-body">
        <Services />
      </div>
    </div>
  );
};

export default ServicesPage;
