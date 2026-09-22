import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Share2, Calendar, ArrowLeft } from 'lucide-react';
import {
  TabContentRenderer,
  normalizeServiceData,
  tokens
} from '../../components/ServiceDetailModal';
import {
  getSpecialitiesState,
  getServicesState,
  getPatientCornerState,
  getSpiritualCareState
} from '../../utils/api';
import { defaultSpecialitiesState, ensureStandardTabs } from '../../data/defaultSpecialities';
import { defaultServicesState, ensureStandardServiceTabs } from '../../data/defaultServices';
import { defaultPatientCornerState, ensureStandardPatientCornerTabs } from '../../data/defaultPatientCorner';
import { defaultSpiritualCareState, defaultSpiritualSections, ensureStandardSpiritualSections } from '../../data/defaultSpiritualCare';
import './DetailPage.css';

// Slug helper to match URLs and titles consistently
export const createSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric chars
    .replace(/[\s_-]+/g, '-') // collapse whitespace and underscores into single hyphens
    .replace(/^-+|-+$/g, ''); // trim hyphens
};

export default function DetailPage({ module = 'specialities' }) {
  const { slug, id } = useParams();
  const activeSlug = (slug || id || '').toLowerCase().trim();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [itemData, setItemData] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [shareFeedback, setShareFeedback] = useState(false);

  // Detect module from prop or location pathname if needed
  const effectiveModule = useMemo(() => {
    if (module) return module;
    const path = location.pathname.toLowerCase();
    if (path.startsWith('/specialities')) return 'specialities';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/patients-corner') || path.startsWith('/patient-corner')) return 'patients-corner';
    if (path.startsWith('/spiritual-care')) return 'spiritual-care';
    return 'specialities';
  }, [module, location.pathname]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (effectiveModule === 'specialities') {
        const res = await getSpecialitiesState(defaultSpecialitiesState);
        const specialities = res?.specialities || defaultSpecialitiesState.specialities || [];
        const categories = res?.categories || defaultSpecialitiesState.categories || [];

        const match = specialities.find((s) => {
          const sSlug = s.slug || createSlug(s.name);
          const sNameNorm = (s.name || '').toLowerCase().trim();
          const targetNorm = activeSlug.replace(/-/g, ' ');
          return (
            sSlug === activeSlug ||
            s.id === activeSlug ||
            sNameNorm === targetNorm ||
            sNameNorm === activeSlug
          );
        });

        if (match) {
          ensureStandardTabs(match);
          const cat = categories.find((c) => c.id === match.categoryId);
          const catTitle = cat?.name || 'General Specialities';
          setItemData(match);
          setCategoryName(catTitle);
        } else {
          const fallbackTitle = activeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          const fallbackItem = {
            id: `spec-${activeSlug}`,
            name: fallbackTitle,
            categoryName: 'General Specialities',
            tabs: [
              {
                id: 't1',
                title: 'Overview',
                type: 'rich_text',
                content: `<p>Welcome to the ${fallbackTitle} department. Comprehensive patient care and treatments tailored to clinical requirements.</p>`
              }
            ]
          };
          ensureStandardTabs(fallbackItem);
          setItemData(fallbackItem);
          setCategoryName('General Specialities');
        }
      } else if (effectiveModule === 'services') {
        const res = await getServicesState(defaultServicesState);
        const services = res?.services || defaultServicesState.services || [];
        const categories = res?.categories || defaultServicesState.categories || [];

        const match = services.find((s) => {
          const sSlug = s.slug || createSlug(s.name);
          const sNameNorm = (s.name || '').toLowerCase().trim();
          const targetNorm = activeSlug.replace(/-/g, ' ');
          return (
            sSlug === activeSlug ||
            s.id === activeSlug ||
            sNameNorm === targetNorm ||
            sNameNorm === activeSlug
          );
        });

        if (match) {
          ensureStandardServiceTabs(match);
          const cat = categories.find((c) => c.id === match.categoryId);
          const catTitle = cat?.name || 'Healthcare Services';
          setItemData(match);
          setCategoryName(catTitle);
        } else {
          const fallbackTitle = activeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          const fallbackItem = {
            id: `srv-${activeSlug}`,
            name: fallbackTitle,
            categoryName: 'Healthcare Services',
            tabs: [
              {
                id: 't1',
                title: 'Overview',
                type: 'rich_text',
                content: `<p>Welcome to our ${fallbackTitle} service. Dedicated clinical team and modern patient support facilities.</p>`
              }
            ]
          };
          ensureStandardServiceTabs(fallbackItem);
          setItemData(fallbackItem);
          setCategoryName('Healthcare Services');
        }
      } else if (effectiveModule === 'patients-corner') {
        const res = await getPatientCornerState(defaultPatientCornerState);
        const guides = res?.guides || defaultPatientCornerState.guides || [];

        const match = guides.find((g) => {
          const gSlug = g.slug || createSlug(g.title || g.name);
          const gTitleNorm = (g.title || g.name || '').toLowerCase().trim();
          const targetNorm = activeSlug.replace(/-/g, ' ');
          return (
            gSlug === activeSlug ||
            g.id === activeSlug ||
            gTitleNorm === targetNorm ||
            gTitleNorm === activeSlug ||
            (activeSlug === 'admission' && (gSlug === 'admission' || gTitleNorm.includes('admission'))) ||
            (activeSlug.includes('insurance') && (gSlug.includes('insurance') || gTitleNorm.includes('insurance') || gTitleNorm.includes('tpa'))) ||
            (activeSlug.includes('visitor') && (gSlug.includes('visitor') || gTitleNorm.includes('visitor'))) ||
            (activeSlug.includes('right') && (gSlug.includes('right') || gTitleNorm.includes('right'))) ||
            (activeSlug.includes('international') && (gSlug.includes('international') || gTitleNorm.includes('international')))
          );
        });

        if (match) {
          ensureStandardPatientCornerTabs(match);
          setItemData(match);
          setCategoryName(match.category || match.categoryName || 'Patient Guide');
        } else {
          const fallbackTitle = activeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          const fallbackGuide = {
            id: `guide-${activeSlug}`,
            title: fallbackTitle,
            name: fallbackTitle,
            category: 'Patient Guide',
            categoryName: 'Patient Guide',
            tabs: [
              {
                id: 't1',
                title: 'Overview',
                type: 'rich_text',
                content: `<p>Welcome to Bhaktivedanta Hospital & Research Institute — ${fallbackTitle}. Please reach out to our desk for assistance.</p>`
              }
            ]
          };
          ensureStandardPatientCornerTabs(fallbackGuide);
          setItemData(fallbackGuide);
          setCategoryName('Patient Guide');
        }
      } else if (effectiveModule === 'spiritual-care') {
        const res = await getSpiritualCareState(defaultSpiritualCareState);
        const validated = ensureStandardSpiritualSections(res || defaultSpiritualCareState);
        const sections = validated.sections || defaultSpiritualSections;

        const match = sections.find((s) => {
          const sSlug = s.slug || s.id || createSlug(s.title || s.name);
          const sTitleNorm = (s.title || s.name || '').toLowerCase().trim();
          const targetNorm = activeSlug.replace(/-/g, ' ');
          return (
            sSlug === activeSlug ||
            s.id === activeSlug ||
            sTitleNorm === targetNorm ||
            sTitleNorm === activeSlug
          );
        });

        if (match) {
          const payload = {
            ...match,
            name: match.title || match.name || 'Spiritual Care',
            title: match.title || match.name || 'Spiritual Care',
            category: 'Spiritual Care',
            categoryName: 'Spiritual Care',
            isSpiritualCare: true
          };
          setItemData(payload);
          setCategoryName('Spiritual Care');
        } else {
          const fallbackTitle = activeSlug.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
          const fallbackSection = {
            id: `spiritual-${activeSlug}`,
            title: fallbackTitle,
            name: fallbackTitle,
            category: 'Spiritual Care',
            categoryName: 'Spiritual Care',
            isSpiritualCare: true,
            layout: 'flexible',
            blocks: []
          };
          setItemData(fallbackSection);
          setCategoryName('Spiritual Care');
        }
      }
    } catch (err) {
      console.error('Error loading detail page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleSync = () => {
      loadData();
    };

    window.addEventListener('storage', handleSync);
    window.addEventListener('admin_data_updated', handleSync);

    return () => {
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('admin_data_updated', handleSync);
    };
  }, [activeSlug, effectiveModule]);

  // Normalize data using the modal's standard normalizer
  const normalized = useMemo(() => {
    if (!itemData) return null;
    return normalizeServiceData(itemData, categoryName);
  }, [itemData, categoryName]);

  // Sync active tab whenever data changes
  useEffect(() => {
    if (normalized?.tabs?.[0]) {
      setActiveTab(normalized.tabs[0].label);
    }
  }, [normalized?.name, activeSlug]);

  const activeTabObj = useMemo(() => {
    if (!normalized?.tabs || normalized.tabs.length === 0) return null;
    return normalized.tabs.find((t) => t.label === activeTab) || normalized.tabs[0];
  }, [normalized, activeTab]);

  const moduleDisplayName = useMemo(() => {
    switch (effectiveModule) {
      case 'specialities':
        return 'Specialities';
      case 'services':
        return 'Services';
      case 'patients-corner':
        return 'Patients Corner';
      case 'spiritual-care':
        return 'Spiritual Care';
      default:
        return 'Specialities';
    }
  }, [effectiveModule]);

  const moduleRootPath = useMemo(() => {
    switch (effectiveModule) {
      case 'specialities':
        return '/#specialities';
      case 'services':
        return '/#services';
      case 'patients-corner':
        return '/#patients';
      case 'spiritual-care':
        return '/spiritual-care';
      default:
        return '/';
    }
  }, [effectiveModule]);

  // Data-driven banner image
  const bannerImage = useMemo(() => {
    if (!itemData) return '';
    return (
      itemData.bannerImage ||
      itemData.banner_image ||
      itemData.heroImage ||
      itemData.image ||
      itemData.thumbnailImage ||
      itemData.thumbnail_image ||
      itemData.coverImage ||
      ''
    );
  }, [itemData]);

  // Data-driven short description
  const shortDescription = useMemo(() => {
    if (!itemData) return '';
    return (
      itemData.shortDescription ||
      itemData.short_description ||
      itemData.briefIntro ||
      itemData.brief_intro ||
      itemData.heroSubtitle ||
      itemData.description ||
      itemData.subtitle ||
      ''
    );
  }, [itemData]);

  // Data-driven title & category
  const itemTitle = useMemo(() => {
    if (!itemData) return normalized?.name || 'Department Details';
    return (
      itemData.name ||
      itemData.title ||
      itemData.speciality_name ||
      itemData.service_name ||
      normalized?.name ||
      'Department Details'
    );
  }, [itemData, normalized]);

  const displayCategory = useMemo(() => {
    if (categoryName) return categoryName;
    if (itemData?.categoryName) return itemData.categoryName;
    if (itemData?.category) return itemData.category;
    return moduleDisplayName;
  }, [categoryName, itemData, moduleDisplayName]);

  // CTA Label
  const ctaLabel = useMemo(() => {
    if (effectiveModule === 'specialities' || effectiveModule === 'services') {
      return 'Book Appointment';
    }
    if (effectiveModule === 'spiritual-care') {
      return 'Inquire / Connect';
    }
    return 'Contact Desk';
  }, [effectiveModule]);

  // Native share or clipboard copy
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${itemTitle} | Bhaktivedanta Hospital`,
        text: shortDescription || `Explore ${itemTitle} at Bhaktivedanta Hospital & Research Institute.`,
        url: window.location.href
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="detail-page-loading">
        <div className="detail-page-spinner"></div>
        <p>Loading {moduleDisplayName} details...</p>
      </div>
    );
  }

  if (!normalized) {
    return (
      <div className="detail-page-not-found">
        <div className="detail-not-found-card">
          <h2>Page Not Found</h2>
          <p>We couldn't find the requested {moduleDisplayName.toLowerCase()} page.</p>
          <button type="button" onClick={() => navigate(-1)} className="btn-detail-back">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-full-page-wrapper">
      {/* 1. Hero Section (Banner on Top + Text Section Below — Careers Style) */}
      <section className="detail-hero-section">
        <div className="detail-container">
          {/* Top Banner Image Frame */}
          <div className="detail-banner-frame">
            {bannerImage ? (
              <img
                src={bannerImage}
                alt={itemTitle}
                className="detail-banner-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fb = e.target.parentElement.querySelector('.detail-banner-fallback');
                  if (fb) fb.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="detail-banner-fallback"
              style={{ display: bannerImage ? 'none' : 'flex' }}
            >
              <div className="detail-fallback-watermark" aria-hidden="true">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="100" cy="100" r="80" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
                  <path d="M100 40 V160 M40 100 H160" stroke="rgba(255,255,255,0.08)" strokeWidth="16" strokeLinecap="round" />
                </svg>
              </div>
              <span className="detail-fallback-badge">{displayCategory}</span>
              <h2 className="detail-fallback-title">{itemTitle}</h2>
            </div>
          </div>

          {/* Text Section (Below image — separate, Careers page style) */}
          <div className="detail-header-card">
            {/* Top Bar: Breadcrumb + Share Button */}
            <div className="detail-header-top-row">
              <div className="detail-crumbs-row">
                <Link to="/" className="dtl-crumb-link">Home</Link>
                <span className="dtl-crumb-sep">&gt;</span>
                <Link to={moduleRootPath} className="dtl-crumb-link">{moduleDisplayName}</Link>
                {categoryName && (
                  <>
                    <span className="dtl-crumb-sep">&gt;</span>
                    <span className="dtl-crumb-text">{categoryName}</span>
                  </>
                )}
                <span className="dtl-crumb-sep">&gt;</span>
                <span className="dtl-crumb-current">{itemTitle}</span>
              </div>

              <button
                type="button"
                className="detail-share-btn"
                onClick={handleShare}
                title="Share this page"
                aria-label="Share"
              >
                <Share2 size={18} />
              </button>
            </div>

            {shareFeedback && (
              <div className="detail-share-toast">
                Page link copied to clipboard!
              </div>
            )}

            {/* Category Eyebrow */}
            <div className="detail-category-eyebrow">
              {displayCategory.toUpperCase()}
            </div>

            {/* Title + CTA Row */}
            <div className="detail-title-cta-row">
              <h1 className="detail-main-title">{itemTitle}</h1>
              <Link to="/contact" className="detail-cta-btn">
                <Calendar size={16} />
                <span>{ctaLabel}</span>
              </Link>
            </div>

            {/* Short Description */}
            {shortDescription && (
              <p className="detail-short-description">
                {shortDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Upgraded Tabs Navigation Bar */}
      {normalized.tabs && normalized.tabs.length > 1 && (
        <div className="detail-tabs-strip-container">
          <div className="detail-container">
            <div className="detail-tabs-strip" role="tablist">
              {normalized.tabs.map((t) => {
                const isActive = t.label === activeTab;
                return (
                  <button
                    key={t.label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`detail-tab-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveTab(t.label)}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Main Content Card */}
      <main className="detail-main-content-section">
        <div className="detail-container">
          <div className="detail-content-card">
            {activeTabObj && <TabContentRenderer tab={activeTabObj} />}
          </div>
        </div>
      </main>
    </div>
  );
}
