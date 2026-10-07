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
  getSpiritualCareState,
  getBlogs,
  getNews
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
  const { slug, id, section, sectionSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const pathSlug = pathSegments[pathSegments.length - 1] || '';
  const effectiveSection = (section || sectionSlug || (pathSegments.length > 2 ? pathSegments[1] : '')).toLowerCase().trim();
  const rawSlug = slug || id || (pathSlug && !['patients-corner', 'patient-corner', 'specialities', 'services', 'spiritual-care'].includes(pathSlug.toLowerCase()) ? pathSlug : '');
  const activeSlug = rawSlug.toLowerCase().trim();

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
          const sSlugClean = (s.slug || '').replace(/^\/+|\/+$/g, '').toLowerCase().trim();
          const nameSlug = createSlug(s.name);
          const sNameNorm = (s.name || '').toLowerCase().trim();
          const targetNorm = activeSlug.replace(/-/g, ' ');
          return (
            sSlugClean === activeSlug ||
            nameSlug === activeSlug ||
            s.id === activeSlug ||
            sNameNorm === targetNorm ||
            sNameNorm === activeSlug ||
            nameSlug.replace(/-/g, ' ') === targetNorm
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
        // 1. Patient Corner Blogs Listing: /patients-corner/blogs
        const isBlogsList = (!effectiveSection && (activeSlug === 'blogs' || activeSlug === 'blog'));
        if (isBlogsList) {
          const blogs = await getBlogs([]);
          const publishedBlogs = (Array.isArray(blogs) ? blogs : []).filter(b =>
            String(b.status || 'Published').toLowerCase() === 'published'
          );

          const blogCards = publishedBlogs.map((b) => ({
            id: b.id || (b.slug ? b.slug : createSlug(b.title)),
            title: b.title || 'Untitled Blog',
            description: b.summary || (typeof b.content === 'string' ? b.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : ''),
            image: b.image || 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800',
            badge: b.category || 'Health Blog',
            duration: `${b.readTime || '5 min read'}${b.date ? ` • ${b.date}` : ''}`,
            route: `/patients-corner/blogs/${b.slug || b.id || createSlug(b.title)}`,
            to: `/patients-corner/blogs/${b.slug || b.id || createSlug(b.title)}`,
            ctaText: 'Read Article',
            detailPage: {
              title: b.title,
              subtitle: `By ${b.author || 'Editorial Team'}${b.authorRole ? ` (${b.authorRole})` : ''} • ${b.date || ''} • ${b.readTime || '5 min read'}`,
              category: b.category || 'Health Blog',
              bannerImage: '',
              blocks: [
                {
                  id: 'blog-content',
                  type: 'rich_text',
                  content: b.content || `<p>${b.summary || ''}</p>`
                }
              ]
            }
          }));

          const blogsPageData = {
            id: 'patient-corner-blogs',
            name: 'Health Blogs & Articles',
            title: 'Health Blogs & Articles',
            category: 'Patient Corner',
            categoryName: 'Patient Corner',
            shortDescription: 'Stay informed with healthcare insights, medical advice, wellness tips, and patient stories from our expert clinicians.',
            bannerImage: '',
            hideBanner: true,
            layout: 'card-grid',
            isSpiritualCare: true,
            cards: blogCards
          };
          setItemData(blogsPageData);
          setCategoryName('Patient Corner');
          return;
        }

        // 2. Patient Corner Announcements Listing: /patients-corner/announcements
        const isAnnouncementsList = (!effectiveSection && (activeSlug === 'announcements' || activeSlug === 'announcement' || activeSlug === 'hospital-announcements'));
        if (isAnnouncementsList) {
          const news = await getNews([]);
          const publishedAnnouncements = (Array.isArray(news) ? news : []).filter(n => {
            const cat = String(n.category || '').toLowerCase();
            const status = String(n.status || 'Published').toLowerCase();
            return (cat === 'announcements' || cat === 'announcement' || cat === 'hospital announcements') &&
                   (status === 'published' || status === 'active');
          });

          const announcementCards = publishedAnnouncements.map((n) => ({
            id: n.id || (n.slug ? n.slug : createSlug(n.title)),
            title: n.title || 'Untitled Announcement',
            description: n.summary || (typeof n.content === 'string' ? n.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...' : ''),
            image: n.image || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
            badge: n.category || 'Announcement',
            duration: `${n.date || ''}${n.readTime ? ` • ${n.readTime}` : ''}`,
            route: `/patients-corner/announcements/${n.slug || n.id || createSlug(n.title)}`,
            to: `/patients-corner/announcements/${n.slug || n.id || createSlug(n.title)}`,
            ctaText: 'View Announcement',
            detailPage: {
              title: n.title,
              subtitle: `By ${n.author || 'Hospital Management'}${n.authorRole ? ` (${n.authorRole})` : ''} • ${n.date || ''}`,
              category: n.category || 'Announcements',
              bannerImage: '',
              blocks: [
                {
                  id: 'announcement-content',
                  type: 'rich_text',
                  content: n.content || `<p>${n.summary || ''}</p>`
                }
              ]
            }
          }));

          const announcementsPageData = {
            id: 'patient-corner-announcements',
            name: 'Hospital Announcements',
            title: 'Hospital Announcements',
            category: 'Patient Corner',
            categoryName: 'Patient Corner',
            shortDescription: 'Important announcements, public notices, patient alerts, and administrative updates from Bhaktivedanta Hospital & Research Institute.',
            bannerImage: '',
            hideBanner: true,
            layout: 'card-grid',
            isSpiritualCare: true,
            cards: announcementCards
          };
          setItemData(announcementsPageData);
          setCategoryName('Patient Corner');
          return;
        }

        // 3. Individual Blog Detail: /patients-corner/blogs/:slug
        const isBlogDetail = (effectiveSection === 'blogs' || effectiveSection === 'blog');
        if (isBlogDetail) {
          const blogs = await getBlogs([]);
          const targetNorm = activeSlug.replace(/-/g, ' ');
          const matchedBlog = (Array.isArray(blogs) ? blogs : []).find(b => {
            const bSlug = (b.slug || createSlug(b.title)).toLowerCase().trim();
            const bTitleNorm = (b.title || '').toLowerCase().trim();
            return bSlug === activeSlug || b.id === activeSlug || bTitleNorm === targetNorm || bTitleNorm === activeSlug;
          });

          if (matchedBlog) {
            const blogDetailPayload = {
              id: matchedBlog.id || `blog-${activeSlug}`,
              title: matchedBlog.title || 'Blog Article',
              name: matchedBlog.title || 'Blog Article',
              category: matchedBlog.category || 'Health Blog',
              categoryName: 'Patient Corner',
              bannerImage: '',
              hideBanner: true,
              shortDescription: matchedBlog.summary || (matchedBlog.author ? `By ${matchedBlog.author}${matchedBlog.authorRole ? ` (${matchedBlog.authorRole})` : ''} • ${matchedBlog.date || ''} • ${matchedBlog.readTime || '5 min read'}` : ''),
              tabs: [
                {
                  id: 'tab-blog-body',
                  title: 'Article Details',
                  label: 'Article Details',
                  type: 'rich_text',
                  content: matchedBlog.content || `<p>${matchedBlog.summary || ''}</p>`
                }
              ]
            };
            ensureStandardPatientCornerTabs(blogDetailPayload);
            setItemData(blogDetailPayload);
            setCategoryName('Patient Corner');
            return;
          }
        }

        // 4. Individual Announcement Detail: /patients-corner/announcements/:slug
        const isAnnouncementDetail = (effectiveSection === 'announcements' || effectiveSection === 'announcement');
        if (isAnnouncementDetail) {
          const news = await getNews([]);
          const targetNorm = activeSlug.replace(/-/g, ' ');
          const matchedNews = (Array.isArray(news) ? news : []).find(n => {
            const nSlug = (n.slug || createSlug(n.title)).toLowerCase().trim();
            const nTitleNorm = (n.title || '').toLowerCase().trim();
            return nSlug === activeSlug || n.id === activeSlug || nTitleNorm === targetNorm || nTitleNorm === activeSlug;
          });

          if (matchedNews) {
            const announcementDetailPayload = {
              id: matchedNews.id || `announcement-${activeSlug}`,
              title: matchedNews.title || 'Hospital Announcement',
              name: matchedNews.title || 'Hospital Announcement',
              category: matchedNews.category || 'Announcements',
              categoryName: 'Patient Corner',
              bannerImage: '',
              hideBanner: true,
              shortDescription: matchedNews.summary || (matchedNews.author ? `By ${matchedNews.author}${matchedNews.authorRole ? ` (${matchedNews.authorRole})` : ''} • ${matchedNews.date || ''}` : ''),
              tabs: [
                {
                  id: 'tab-announcement-body',
                  title: 'Announcement Details',
                  label: 'Announcement Details',
                  type: 'rich_text',
                  content: matchedNews.content || `<p>${matchedNews.summary || ''}</p>`
                }
              ]
            };
            ensureStandardPatientCornerTabs(announcementDetailPayload);
            setItemData(announcementDetailPayload);
            setCategoryName('Patient Corner');
            return;
          }
        }

        // 5. Patient Corner Guides (Admission, Empanelled, Rights, Visiting Hours, International, Discharge)
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
  }, [activeSlug, effectiveSection, effectiveModule, location.pathname]);

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
    if (!itemData || itemData.hideBanner) return '';
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
          {/* Centered Page Title + Right-aligned Share Button */}
          <div className="detail-header-section">
            <h1 className="detail-page-title">{itemTitle}</h1>
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

          {/* Top Banner Image Frame */}
          {!itemData?.hideBanner && (
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
          )}
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

            {/* Back button at the bottom for blog and announcement detail pages */}
            {(effectiveSection === 'blogs' || effectiveSection === 'blog' || effectiveSection === 'announcements' || effectiveSection === 'announcement') && (
              <div style={{ marginTop: 36, paddingTop: 20, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-start' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (effectiveSection === 'blogs' || effectiveSection === 'blog') {
                      navigate('/patients-corner/blogs');
                    } else {
                      navigate('/patients-corner/announcements');
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 10,
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
