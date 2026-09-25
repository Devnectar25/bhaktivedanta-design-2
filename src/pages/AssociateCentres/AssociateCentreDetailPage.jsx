import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Share2, Check } from 'lucide-react';
import associateCentresData, { associateCentresList } from '../../data/associateCentresData';
import { getAssociateCentres, getAssociateCentreByIdOrSlug } from '../../utils/api';
import './AssociateCentreDetailPage.css';

function normalizeCentre(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title || raw.name || '',
    centreType: raw.centreType || raw.centre_type || '',
    bannerImg: raw.bannerImg || raw.banner_img || 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690445752450.png',
    address: raw.address || '',
    phone: raw.phone || '',
    highlights: Array.isArray(raw.highlights)
      ? raw.highlights.map((h, i) => (typeof h === 'string' ? { text: h, icon: `/images/oac-${(i % 3) + 1}.png` } : h))
      : [],
    overview: Array.isArray(raw.overview)
      ? raw.overview
      : (typeof raw.overview === 'string' ? raw.overview.split('\n\n').filter(Boolean) : []),
    services: Array.isArray(raw.services)
      ? raw.services
      : (typeof raw.services === 'string' ? raw.services.split('\n').filter(Boolean) : []),
    communityServices: Array.isArray(raw.communityServices || raw.community_services)
      ? (raw.communityServices || raw.community_services).map((cs, i) => (typeof cs === 'string' ? { name: cs, icon: `/images/oacs-${(i % 3) + 1}.png` } : cs))
      : [],
    mapSrc: raw.mapSrc || raw.map_src || ''
  };
}

export default function AssociateCentreDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [centresList, setCentresList] = useState(associateCentresList);
  const [dynamicCentre, setDynamicCentre] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch centres and specific centre by slug
  const loadCentreData = async () => {
    try {
      const all = await getAssociateCentres(associateCentresList);
      if (Array.isArray(all) && all.length > 0) {
        setCentresList(all);
        const match = all.find(c => c.slug === slug || c.id === slug);
        if (match) {
          setDynamicCentre(normalizeCentre(match));
          return;
        }
      }

      // Try specific fetch
      const single = await getAssociateCentreByIdOrSlug(slug);
      if (single) {
        setDynamicCentre(normalizeCentre(single));
      }
    } catch (e) {
      console.warn('Failed to load dynamic centre:', e);
    }
  };

  // Scroll to top and reload when slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveTab('overview');
    setShareOpen(false);
    loadCentreData();

    const handleUpdate = () => loadCentreData();
    window.addEventListener('associate_centres_updated', handleUpdate);
    return () => window.removeEventListener('associate_centres_updated', handleUpdate);
  }, [slug]);

  // Centre lookup: dynamic DB first, static fallback second
  const staticCentre = associateCentresData[slug];
  const centre = dynamicCentre || normalizeCentre(staticCentre) || normalizeCentre(associateCentresData['swami-shraddhanand-hospital']);

  if (!centre) {
    return (
      <div className="ac-page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ color: '#2664A8', marginBottom: 16 }}>Centre Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>
          The requested associate centre could not be found.
        </p>
        <Link to="/" style={{ color: '#f58634', fontWeight: 600 }}>← Back to Home</Link>
      </div>
    );
  }

  // Filter other centres for contact tab list
  const activeCentres = centresList && centresList.length > 0
    ? centresList.filter(c => c.status !== 'Inactive')
    : associateCentresList;
  const otherCentres = activeCentres.filter(c => (c.slug || c.id) !== centre.slug);

  // Share handlers
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${centre.title} - Bhaktivedanta Associate Centre`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ac-page-container">
      {/* Title & Share Header Row (Matches live website) */}
      <div className="ac-title-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '10px 0 24px' }}>
        <h1
          className="ac-page-title"
          style={{
            fontFamily: "'Libre Baskerville', Georgia, serif",
            fontSize: '28px',
            fontWeight: 700,
            color: '#2664A8',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.3
          }}
        >
          {centre.title}
        </h1>

        <div className="ac-share-container" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
          <button
            type="button"
            className="ac-share-btn"
            onClick={() => setShareOpen(!shareOpen)}
            aria-label="Share this page"
            title="Share"
          >
            <Share2 size={18} />
          </button>

          {shareOpen && (
            <div className="ac-share-menu">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-share-item"
              >
                Share via WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-share-item"
              >
                Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ac-share-item"
              >
                Share on X (Twitter)
              </a>
              <button
                type="button"
                className="ac-share-item"
                onClick={copyToClipboard}
              >
                {copied ? <Check size={14} color="#16a34a" /> : null}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner Section (Matches .row.abban) */}
      <div
        className="ac-hero-banner"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '100%',
          height: '383px',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '36px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
          background: '#fff7ea'
        }}
      >
        {/* Left Side: Banner Image */}
        <div
          className="ac-hero-image-wrap"
          style={{
            flex: '1 1 auto',
            height: '383px',
            minWidth: 0,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img
            src={centre.bannerImg}
            alt={centre.title}
            className="ac-hero-image"
            style={{
              width: '100%',
              height: '383px',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              e.currentTarget.src = 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/16690445752450.png';
            }}
          />
        </div>

        {/* Right Peach Floating Card (.contact-bhakthi.vvcon) */}
        <div
          className="ac-hero-contact-card"
          style={{
            width: '440px',
            minWidth: '440px',
            maxWidth: '440px',
            height: '383px',
            background: '#fff7ea',
            padding: '45px 32px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            flexShrink: 0,
            borderLeft: '2px solid rgba(245, 134, 52, 0.2)'
          }}
        >
          <h2
            className="ac-card-hospital-name"
            style={{
              fontFamily: "'Libre Baskerville', Georgia, serif",
              fontSize: '24px',
              fontWeight: 700,
              color: '#f58634',
              margin: '0 0 22px 0',
              lineHeight: 1.35
            }}
          >
            {centre.title}
          </h2>

          {centre.address && (
            <div
              className="ac-card-contact-row"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '18px',
                fontSize: '15px',
                lineHeight: 1.55,
                color: '#333333'
              }}
            >
              <MapPin size={20} className="ac-card-icon" style={{ color: '#f58634', flexShrink: 0, marginTop: 3 }} />
              <span>{centre.address}</span>
            </div>
          )}

          {centre.phone && (
            <div
              className="ac-card-contact-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '15px',
                lineHeight: 1.55,
                color: '#333333'
              }}
            >
              <Phone size={20} className="ac-card-icon" style={{ color: '#f58634', flexShrink: 0 }} />
              <span>
                <a
                  href={`tel:${centre.phone.split('/')[0].trim().replace(/\s/g, '')}`}
                  style={{ color: '#333333', textDecoration: 'none' }}
                >
                  {centre.phone}
                </a>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs Bar (.tabs .tab-nav) */}
      <div className="ac-tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`ac-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        {centre.services && centre.services.length > 0 && (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'services'}
            className={`ac-tab-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
        )}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'contact'}
          className={`ac-tab-item ${activeTab === 'contact' ? 'active' : ''}`}
          onClick={() => setActiveTab('contact')}
        >
          Contact Us
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="ac-tab-pane">
          {/* 3 Highlight Cards */}
          {centre.highlights && centre.highlights.length > 0 && (
            <div className="ac-features-row">
              {centre.highlights.map((h, i) => (
                <div key={i} className="ac-feature-box">
                  <div className="ac-feature-icon-wrap">
                    <img
                      src={h.icon || `/images/oac-${i + 1}.png`}
                      alt="feature icon"
                      className="ac-feature-icon-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="ac-feature-text">{h.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Descriptive Paragraphs */}
          <div className="ac-overview-paragraphs">
            {centre.overview && centre.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Services */}
      {activeTab === 'services' && (
        <div className="ac-tab-pane">
          {/* Services Box with Ice-Blue background */}
          <div className="ac-services-box">
            <h3 className="ac-services-title">
              &nbsp;The wide range of services offered includes:
            </h3>
            <div className="ac-services-columns">
              <ul className="ac-services-list">
                {centre.services
                  .slice(0, Math.ceil(centre.services.length / 2))
                  .map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
              </ul>
              <ul className="ac-services-list">
                {centre.services
                  .slice(Math.ceil(centre.services.length / 2))
                  .map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
              </ul>
            </div>
          </div>

          {/* Community Services */}
          {centre.communityServices && centre.communityServices.length > 0 && (
            <div className="ac-community-section">
              <h3 className="ac-community-heading">Community Services</h3>
              <div className="ac-community-grid">
                {centre.communityServices.map((cs, i) => (
                  <div key={i} className="ac-community-card">
                    <div className="ac-community-icon-container">
                      <img
                        src={cs.icon || `/images/oacs-${i + 1}.png`}
                        alt={cs.name}
                        className="ac-community-icon-img"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <h4 className="ac-community-title">{cs.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Contact Us (Exact 2-column layout from reference site) */}
      {activeTab === 'contact' && (
        <div className="ac-tab-pane">
          <div className="ac-contact-layout">
            {/* Left Column: Google Map */}
            <div className="ac-contact-map-col">
              <div className="ac-map-frame">
                <iframe
                  src={centre.mapSrc || `https://maps.google.com/maps?q=${encodeURIComponent(centre.title + ' ' + (centre.address || ''))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                  title={`${centre.title} Location Map`}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="ac-map-address-banner">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <MapPin size={18} style={{ color: '#f58634', marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#1e293b' }}>{centre.title}</strong>
                    <div>{centre.address}</div>
                  </div>
                </div>
                {centre.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
                    <Phone size={18} style={{ color: '#f58634', flexShrink: 0 }} />
                    <a href={`tel:${centre.phone.split('/')[0].trim().replace(/\s/g, '')}`} style={{ color: '#2664A8', textDecoration: 'none', fontWeight: 500 }}>
                      {centre.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Scrollable List of Our Associate Centres */}
            <div className="ac-other-centres-col">
              <h3 className="ac-other-centres-heading">Our Associate Centres</h3>
              <div className="ac-scroll-list">
                {otherCentres.map(c => {
                  const cSlug = c.slug || c.id;
                  const cData = associateCentresData[cSlug];
                  const cTitle = c.title || c.name || cData?.title;
                  const cAddress = c.address || cData?.address;
                  const cPhone = c.phone || cData?.phone;
                  return (
                    <div key={cSlug} className="ac-scroll-card">
                      <h4 className="ac-scroll-card-title">{cTitle}</h4>
                      {cAddress && (
                        <p className="ac-scroll-card-address">{cAddress}</p>
                      )}
                      {cPhone && (
                        <div className="ac-scroll-card-phone">
                          <Phone size={14} style={{ color: '#f58634' }} />
                          <span>{cPhone}</span>
                        </div>
                      )}
                      <Link
                        to={`/our-associate-centre/${cSlug}`}
                        className="ac-scroll-card-link"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                        More info →
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Explore section removed as requested */}
    </div>
  );
}
