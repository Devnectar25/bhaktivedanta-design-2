import React, { useState, useEffect, useCallback } from 'react';
import { defaultServicesState, ensureStandardServiceTabs } from '../../data/defaultServices';
import { getServicesState } from '../../utils/api';
import './Services.css';

// Default line icons for known services if custom image is not present
const getServiceIcon = (iconName) => {
  const iconMap = {
    self_improvement: 'self_improvement',
    diversity_1: 'diversity_1',
    volunteer_activism: 'volunteer_activism',
    groups: 'groups',
    pregnant_woman: 'pregnant_woman',
    store: 'store',
    visibility: 'visibility',
    hearing: 'hearing',
    water_drop: 'water_drop',
    medical_services: 'medical_services',
    siren: 'emergency',
    airport_shuttle: 'ambulance',
    biotech: 'biotech',
    settings_overscan: 'radiology',
    local_pharmacy: 'local_pharmacy',
    bloodtype: 'bloodtype'
  };

  return iconMap[iconName] || iconName || 'medical_services';
};

const Services = ({ onSelectService }) => {
  const [servicesData, setServicesData] = useState(defaultServicesState);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch live services from backend API with fallback
  const fetchServices = useCallback(() => {
    setLoading(true);
    getServicesState(defaultServicesState)
      .then((res) => {
        if (res && res.services) {
          res.services.forEach(ensureStandardServiceTabs);
          setServicesData(res);
        } else {
          setServicesData(defaultServicesState);
        }
      })
      .catch((err) => {
        console.warn('Could not load live services, using default state:', err);
        setServicesData(defaultServicesState);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchServices();

    // Listen to real-time admin sync events and browser storage updates
    const handleSync = () => {
      fetchServices();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [fetchServices]);

  const categories = (servicesData.categories || []).filter(c => c.status !== false);
  const categoriesMap = {};
  categories.forEach(c => { categoriesMap[c.id] = c.name; });

  const activeServices = (servicesData.services || []).filter(s => s.status !== false && s.status !== 'Draft');

  const filteredServices = activeCategory === 'all'
    ? activeServices
    : activeServices.filter(s => s.categoryId === activeCategory);

  const handleCardClick = (srv) => {
    if (onSelectService) {
      const catName = categoriesMap[srv.categoryId] || 'Healthcare Services';
      onSelectService(srv, catName);
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <p className="section-label">COMPREHENSIVE CLINICAL CARE</p>
          <h2>Hospital <span>Services</span> &amp; Facilities</h2>
          <p className="section-subtext">
            Explore our state-of-the-art diagnostic, clinical, round-the-clock emergency, and specialized support services.
          </p>
        </div>

        {/* Category Filter Tabs */}
        {categories.length > 1 && (
          <div className="services-filter-tabs">
            <button
              type="button"
              className={`services-tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              <span>All Services</span>
              <span className="tab-count">{activeServices.length}</span>
            </button>
            {categories.map((cat) => {
              const catCount = activeServices.filter(s => s.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`services-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="tab-count">{catCount}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Live Services Grid */}
        <div className="services-live-grid">
          {filteredServices.map((srv, idx) => {
            const catName = categoriesMap[srv.categoryId] || 'Healthcare Service';
            const iconIdentifier = getServiceIcon(srv.icon);
            const isEmergency247 = srv.categoryId === 'c2' || catName.includes('24');

            return (
              <div
                key={srv.id || idx}
                className={`service-live-card ${isEmergency247 ? 'theme-emergency' : ''}`}
                onClick={() => handleCardClick(srv)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(srv);
                  }
                }}
              >
                {/* Category Badge & Status */}
                <div className="service-card-top">
                  <span className="service-cat-badge">
                    {catName}
                  </span>
                  <span className="service-tabs-pill">
                    {(srv.tabs || []).length > 0 ? `${(srv.tabs || []).length} Sections` : '5 Details'}
                  </span>
                </div>

                {/* Service Icon Box */}
                <div className="service-icon-box">
                  <span className="material-symbols-outlined service-material-icon">
                    {iconIdentifier}
                  </span>
                </div>

                {/* Title and Description */}
                <div className="service-card-content">
                  <h3 className="service-card-title">{srv.name}</h3>
                  <p className="service-card-desc">
                    {srv.shortDescription || srv.description || 'Specialized clinical care tailored for patients.'}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="service-card-footer">
                  <span className="service-action-link">
                    <span>View Details</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if no services match */}
        {filteredServices.length === 0 && !loading && (
          <div className="services-empty-state">
            <span className="material-symbols-outlined text-4xl text-slate-300">medical_services</span>
            <p>No services found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
