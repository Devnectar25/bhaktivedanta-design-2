import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';
import { 
  HeartPulse, 
  Bone, 
  BedDouble, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Award, 
  FileSpreadsheet 
} from 'lucide-react';
import { getStatutoryCompliancesState, getHospitalSettings, defaultHospitalSettings } from '../../utils/api';
import { openPdfDocument } from '../../utils/pdfViewer';

const iconMap = {
  HeartPulse,
  Bone,
  BedDouble,
  FileText,
  ShieldCheck,
  Award,
  FileSpreadsheet
};

const defaultInitialCompliances = [
  { id: 'comp-1', title: 'Coronary Stent Prices', icon: 'HeartPulse', pdfUrl: '' },
  { id: 'comp-2', title: 'Knee Implant Prices', icon: 'Bone', pdfUrl: '' },
  { id: 'comp-3', title: 'Indigent and Weaker Section Category', icon: 'BedDouble', pdfUrl: '' }
];

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [compliances, setCompliances] = useState(defaultInitialCompliances);
  const [siteMapPdfUrl, setSiteMapPdfUrl] = useState('');
  const [settings, setSettings] = useState(defaultHospitalSettings);

  useEffect(() => {
    const fetchCompliances = () => {
      getStatutoryCompliancesState({ compliances: defaultInitialCompliances }).then(res => {
        if (res) {
          if (Array.isArray(res.compliances)) {
            setCompliances(res.compliances);
          }
          if (res.siteMapPdfUrl) {
            setSiteMapPdfUrl(res.siteMapPdfUrl);
          }
        }
      }).catch(err => {
        console.warn('Footer could not fetch statutory compliances:', err);
      });
    };

    const fetchSettings = () => {
      getHospitalSettings().then(res => {
        if (res && typeof res === 'object') {
          setSettings(prev => ({ ...prev, ...res }));
        }
      }).catch(err => {
        console.warn('Footer could not fetch hospital settings:', err);
      });
    };

    fetchCompliances();
    fetchSettings();

    const handleSync = () => {
      fetchCompliances();
      fetchSettings();
    };

    window.addEventListener('admin_data_updated', handleSync);
    window.addEventListener('hospital_settings_updated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);
    return () => {
      window.removeEventListener('admin_data_updated', handleSync);
      window.removeEventListener('hospital_settings_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/contact' || location.pathname === '/contact-us') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleComplianceClick = (e, item) => {
    e.preventDefault();
    const targetUrl = item.pdfUrl || item.fileUrl;
    if (targetUrl) {
      openPdfDocument(targetUrl, item.title);
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col about-col">
          <div className="footer-logo">
             <a href="/" onClick={handleLogoClick} className="footer-logo-wrap" title="Go to top of Home Page">
               <img src="/icon.png" alt="Icon" className="footer-icon" />
               <img src="/logo.png" alt="Logo" className="logo" />
             </a>
          </div>
          <p className="footer-desc">
            Providing compassionate, quality healthcare with spiritual warmth. 
            A haven for healing and wellness since 1998.
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/bhaktivedantahospital.official" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.facebook.com/bhaktivedantahospitalandresearchinstitute" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/bhaktivedanta-hospital-&-research-institute/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="linkedin">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://x.com/Bhaktivedanta_H" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="twitter">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/channel/UCSf9YnPIwZQ6zb1QqQc4tNQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="youtube">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul className="footer-links">
             <li><a href="/" onClick={handleLogoClick}>Home</a></li>
             <li><Link to="/about-us/about-hospital">About Us</Link></li>
             <li><Link to="/faqs">FAQs</Link></li>
             <li><a href="#blogs">Blogs</a></li>
             <li><a href="/contact" onClick={handleContactClick}>Contact Us</a></li>
             <li>
               <a 
                 href={siteMapPdfUrl || '#sitemap'}
                 onClick={(e) => {
                   if (siteMapPdfUrl) {
                     e.preventDefault();
                     openPdfDocument(siteMapPdfUrl, 'Hospital Site Map');
                   }
                 }}
               >
                 Site Map
               </a>
             </li>
          </ul>
        </div>

        <div className="footer-col compliance-col">
          <h3>Statutory Compliances</h3>
          <ul className="footer-compliance-links">
            {compliances.map((item) => {
              const IconComp = iconMap[item.icon] || FileText;
              return (
                <li key={item.id}>
                  <a 
                    href={item.pdfUrl || item.fileUrl || '#'} 
                    onClick={(e) => handleComplianceClick(e, item)}
                    title={(item.pdfUrl || item.fileUrl) ? `Open ${item.title} PDF` : `${item.title}`}
                  >
                    <span className="compliance-icon-wrap"><IconComp size={16} /></span>
                    <span>{item.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="footer-col">
          <h3>
            <a 
              href="/contact" 
              onClick={handleContactClick} 
              style={{ color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}
              title="Contact Us"
            >
              {settings.contactTitle || 'Contact Us'}
            </a>
          </h3>
          <ul className="footer-info">
             <li>
               Phone: {settings.contactPhone ? (
                 <a href={`tel:${String(settings.contactPhone).replace(/\s+/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                   {settings.contactPhone}
                 </a>
               ) : '079-69002222'}
             </li>
             <li>
               WhatsApp: {settings.contactWhatsapp ? (
                 <a 
                   href={`https://wa.me/${String(settings.contactWhatsapp).replace(/[^0-9]/g, '')}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   style={{ color: 'inherit', textDecoration: 'none' }}
                 >
                   {settings.contactWhatsapp}
                 </a>
               ) : '8400146262'}
             </li>
             <li>
               <a href={`mailto:${settings.contactEmail || 'info@bhaktivedantahospital.com'}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                 {settings.contactEmail || 'info@bhaktivedantahospital.com'}
               </a>
             </li>
             <li className="footer-address" style={{ whiteSpace: 'pre-line' }}>
               {settings.contactAddress || 'Mira Road East, Thane, \nMaharashtra 401107'}
             </li>
          </ul>
          <div className="view-map-wrap">
            <a 
              href={settings.mapUrl || 'https://maps.app.goo.gl/yX3uLp8jXz2U4u1D6'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-view-map"
            >
              <MapPin size={18} className="map-pin-icon" />
              <span>View on Map</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; 2026 Bhaktivedanta Hospital. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
