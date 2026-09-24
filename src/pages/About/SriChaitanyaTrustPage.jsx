import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  ShieldCheck, 
  ExternalLink, 
  FileText, 
  Download, 
  Users, 
  Award, 
  Activity, 
  Briefcase, 
  Droplets, 
  Scale, 
  Home, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight,
  Phone,
  Mail,
  Share2
} from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './SriChaitanyaTrustPage.css';

const TABS = [
  { id: 'overview', label: 'About Trust' },
  { id: 'csr-sdgs', label: 'CSR & SDGs' },
  { id: 'projects', label: 'Community Projects' },
  { id: 'partners', label: 'Empaneled Partners' },
  { id: 'governance', label: 'Governance & Reports' }
];

const SDG_ICONS = {
  1: Activity,
  2: Users,
  3: Droplets,
  4: Briefcase,
  5: Scale,
  6: Home,
  7: RefreshCw,
  8: Award
};

const SriChaitanyaTrustPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [trustData, setTrustData] = useState(defaultAboutUsData.sriChaitanyaTrust);
  const [shareFeedback, setShareFeedback] = useState(false);

  useEffect(() => {
    loadData();
    const handleSync = () => loadData();
    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, []);

  const loadData = async () => {
    try {
      const state = await getAboutUsState(defaultAboutUsData);
      const data = state?.sriChaitanyaTrust || defaultAboutUsData.sriChaitanyaTrust;
      if (data) {
        setTrustData(data);
      }
    } catch (err) {
      console.warn('Could not load CST data:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Shri Chaitanya Health and Care Trust | Bhaktivedanta Hospital',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const { title, subtitle, bannerUrl, about, csrSdgs, projects, governance } = trustData || defaultAboutUsData.sriChaitanyaTrust;

  return (
    <div className="cst-page-wrapper">
      {shareFeedback && <div className="cst-share-toast">Page link copied to clipboard!</div>}

      {/* Hero Banner Section */}
      <section className="cst-hero-banner">
        <div className="cst-hero-container">
          <div className="cst-hero-badge">
            <ShieldCheck size={16} /> Public Charitable Trust
          </div>
          <h1 className="cst-hero-title">{title}</h1>
          <p className="cst-hero-subtitle">{subtitle}</p>
          <div className="cst-hero-actions">
            <a 
              href={about?.contact?.link || "https://www.shareyourcare.com/"} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cst-btn-primary"
            >
              Learn More at Share Your Care <ExternalLink size={16} />
            </a>
            <button onClick={handleShare} className="cst-btn-secondary">
              <Share2 size={16} /> Share Page
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Sub-Tabs Bar */}
      <nav className="cst-nav-tabs-bar">
        <div className="cst-tabs-container">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cst-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Tab Content */}
      <main className="cst-main-content">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="cst-tab-pane animate-fade-in">
            <div className="cst-section-card">
              <h2 className="cst-card-heading">{about?.heading}</h2>
              <p className="cst-card-lead">{about?.description}</p>

              {/* Registration Badges */}
              <div className="cst-reg-grid">
                {about?.regDetails?.map((reg, idx) => (
                  <div key={idx} className="cst-reg-item">
                    <CheckCircle2 className="cst-check-icon" size={20} />
                    <span>{reg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* We Focus On HELP */}
            <div className="cst-help-section">
              <h3 className="cst-subheading">{about?.helpFocus?.title || 'We Focus On HELP'}</h3>
              <div className="cst-help-grid">
                {about?.helpFocus?.items?.map((item, idx) => (
                  <div key={idx} className="cst-help-card">
                    <div className="cst-help-letter">{item.code}</div>
                    <div className="cst-help-content">
                      <h4>{item.label}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact / Inquiries Box */}
            <div className="cst-contact-box">
              <div className="cst-contact-info">
                <h3>For more information, kindly connect with</h3>
                <p className="cst-contact-name">{about?.contact?.name || 'Mr. Maruti Rao'}</p>
                <p className="cst-contact-role">{about?.contact?.designation || 'Deputy Manager ( SYC- Admin & Projects )'}</p>
                <div className="cst-contact-reach">
                  <a href={`tel:${about?.contact?.phone || '+91 9987058607'}`} className="cst-contact-reach-item">
                    <Phone size={14} /> {about?.contact?.phone || '+91 9987058607'}
                  </a>
                  <a href={`mailto:${about?.contact?.email || 'maruti@shareyourcare.com'}`} className="cst-contact-reach-item">
                    <Mail size={14} /> {about?.contact?.email || 'maruti@shareyourcare.com'}
                  </a>
                </div>
              </div>
              <a 
                href={about?.contact?.link || "https://www.shareyourcare.com/"} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="cst-contact-btn"
              >
                {about?.contact?.linkText || 'Visit this link to learn more - www.shareyourcare.com'} <ExternalLink size={16} />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: CSR & SDGs */}
        {activeTab === 'csr-sdgs' && (
          <div className="cst-tab-pane animate-fade-in">
            <div className="cst-section-card">
              <h2 className="cst-card-heading">Section 135 Companies Act Compliance</h2>
              <p className="cst-card-lead">{csrSdgs?.intro}</p>
              
              <ul className="cst-csr-categories-list">
                {csrSdgs?.categories?.map((cat, idx) => (
                  <li key={idx} className="cst-csr-category-item">
                    <CheckCircle2 size={18} className="cst-check-icon" />
                    <span>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="cst-section-card mt-6">
              <h3 className="cst-subheading">UN Sustainable Development Goals (SDGs)</h3>
              <div className="cst-sdg-grid">
                {csrSdgs?.sdgs?.map((sdg) => {
                  const IconComp = SDG_ICONS[sdg.id] || Award;
                  return (
                    <div key={sdg.id} className="cst-sdg-card">
                      <div className="cst-sdg-number">{sdg.id}</div>
                      <div className="cst-sdg-icon-wrap">
                        <IconComp size={24} />
                      </div>
                      <div className="cst-sdg-title">{sdg.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMMUNITY PROJECTS & IMPACT */}
        {activeTab === 'projects' && (
          <div className="cst-tab-pane animate-fade-in">
            <div className="cst-section-card">
              <h2 className="cst-card-heading">Our Community Welfare Projects</h2>
              <p className="cst-card-lead">
                Dedicated healthcare and empowerment initiatives reaching thousands of underprivileged beneficiaries across rural Maharashtra and Uttar Pradesh.
              </p>

              <div className="cst-projects-grid">
                {projects?.map((proj, idx) => (
                  <div key={idx} className="cst-project-card">
                    <div className="cst-project-badge">{idx + 1}</div>
                    <h3 className="cst-project-title">{proj.title}</h3>
                    <p className="cst-project-desc">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EMPANELED PARTNERS */}
        {activeTab === 'partners' && (
          <div className="cst-tab-pane animate-fade-in">
            <div className="cst-section-card text-center">
              <h2 className="cst-card-heading">Empaneled CSR & Corporate Partners</h2>
              <p className="cst-card-lead">
                We work in close synergy with esteemed corporate institutions, philanthropic foundations, and government agencies to maximize our grassroots healthcare impact.
              </p>
              
              <div className="cst-partners-banner">
                <div className="cst-partner-badge-grid">
                  <div className="cst-partner-pill">Corporate CSR Donors</div>
                  <div className="cst-partner-pill">Institutional Trusts</div>
                  <div className="cst-partner-pill">Healthcare Alliances</div>
                  <div className="cst-partner-pill">Philanthropic Endowments</div>
                </div>
                <p className="cst-partner-note">
                  For corporate CSR partnership proposals and empaneled collaboration inquiries, please email our trust office.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: GOVERNANCE & REPORTS */}
        {activeTab === 'governance' && (
          <div className="cst-tab-pane animate-fade-in">
            <div className="cst-section-card">
              <h2 className="cst-card-heading">Governance, Transparency & Awards</h2>
              <p className="cst-card-lead">
                We maintain utmost transparency, statutory adherence, and accountability in our financial reporting and public welfare projects.
              </p>

              <div className="cst-governance-grid">
                <div className="cst-gov-card">
                  <FileText className="cst-gov-icon" size={32} />
                  <h3>Board of Trustees</h3>
                  <p>View the list of eminent trustees guiding the governance and strategic vision of the Trust.</p>
                  <a 
                    href={governance?.boardOfTrusteesPdf || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cst-gov-link"
                  >
                    View Document <ArrowRight size={16} />
                  </a>
                </div>

                <div className="cst-gov-card">
                  <Award className="cst-gov-icon" size={32} />
                  <h3>Awards & Recognition</h3>
                  <p>Honours bestowed upon the Trust for outstanding grassroots healthcare seva and humanitarian relief.</p>
                  <a 
                    href={governance?.awardsPdf || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cst-gov-link"
                  >
                    View Awards <ArrowRight size={16} />
                  </a>
                </div>

                <div className="cst-gov-card">
                  <Heart className="cst-gov-icon" size={32} />
                  <h3>Our Journey</h3>
                  <p>Chronological journey of selfless medical seva and compassionate expansion from 1991 to present.</p>
                  <a 
                    href={governance?.journeyPdf || "#"} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="cst-gov-link"
                  >
                    Read Journey <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SriChaitanyaTrustPage;
