import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NewDevelopments.css';
import { X, Calendar, ArrowRight, Tag, ExternalLink } from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';

const cleanText = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
};

const defaultFallbackImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80';

const NewDevelopments = () => {
  const [developmentsList, setDevelopmentsList] = useState(defaultAboutUsData.newDevelopments || []);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Fetch live state from backend/localStorage
  const loadData = async () => {
    try {
      const state = await getAboutUsState(defaultAboutUsData);
      const list = state?.newDevelopments || defaultAboutUsData.newDevelopments;
      if (Array.isArray(list) && list.length > 0) {
        setDevelopmentsList(list);
      }
    } catch (err) {
      console.warn('Could not load new developments:', err);
    }
  };

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

  // Lock background body scroll when modal popup is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArticle]);

  // First 2 items are featured on left, next up to 4 items in sidebar
  const featured = developmentsList.slice(0, 2);
  const sidebar = developmentsList.slice(2, 6);

  return (
    <section id="developments" className="developments-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header fade-in">
          <p className="section-label">NEW DEVELOPMENTS & UPDATES</p>
          <h2>New Development & <span>Updates</span></h2>
        </div>

        {/* Layout Grid */}
        <div className="developments-grid">
          {/* Left Column: 2 Featured Cards */}
          <div className="featured-cards-wrap">
            {featured.map((item) => {
              const imageSrc = item.imageUrl || item.image || defaultFallbackImage;
              const title = cleanText(item.title);
              const excerpt = cleanText(item.description || item.excerpt || '');

              return (
                <div 
                  key={item.id} 
                  className="featured-card fade-in"
                  onClick={() => setSelectedArticle(item)}
                >
                  <div className="featured-card-image">
                    <img 
                      src={imageSrc} 
                      alt={title}
                      onError={(e) => {
                        e.target.src = defaultFallbackImage;
                      }}
                    />
                  </div>
                  <div className="featured-card-body">
                    <h3 className="featured-card-title">{title}</h3>
                    <p className="featured-card-excerpt">{excerpt}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sidebar list */}
          <div className="sidebar-cards-wrap fade-in">
            <div className="sidebar-list">
              {sidebar.map((item) => {
                const imageSrc = item.imageUrl || item.image || defaultFallbackImage;
                const title = cleanText(item.title);

                return (
                  <div 
                    key={item.id} 
                    className="sidebar-item"
                    onClick={() => setSelectedArticle(item)}
                  >
                    <div className="sidebar-item-thumb">
                      <img 
                        src={imageSrc} 
                        alt={title}
                        onError={(e) => {
                          e.target.src = defaultFallbackImage;
                        }}
                      />
                    </div>
                    <div className="sidebar-item-content">
                      <h4 className="sidebar-item-title">{title}</h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Read More Link -> redirects to /about-us/new-developments-updates */}
            <div className="read-more-wrap">
              <Link 
                to="/about-us/new-developments-updates" 
                className="btn-read-more"
              >
                <span>Read More</span>
                <ArrowRight size={18} className="read-more-arrow" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="article-modal-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="article-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="article-modal-close" onClick={() => setSelectedArticle(null)} aria-label="Close dialog">
              <X size={20} />
            </button>
            <div className="article-modal-image">
              <img 
                src={selectedArticle.imageUrl || selectedArticle.image || defaultFallbackImage} 
                alt={cleanText(selectedArticle.title)}
                onError={(e) => {
                  e.target.src = defaultFallbackImage;
                }}
              />
            </div>
            <div className="article-modal-body">
              <div className="article-modal-meta">
                <span className="meta-badge"><Tag size={14} /> {selectedArticle.category || 'Hospital Update'}</span>
                <span className="meta-date"><Calendar size={14} /> {selectedArticle.date || 'Recent Update'}</span>
              </div>
              <h2 className="article-modal-title">{cleanText(selectedArticle.title)}</h2>
              <div className="article-modal-text">
                {(cleanText(selectedArticle.fullContent || selectedArticle.description || selectedArticle.excerpt || ''))
                  .split('\n\n')
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>

              {selectedArticle.readMoreLink && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <a
                    href={selectedArticle.readMoreLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#ea580c',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    View Official Press Release / Article <ExternalLink size={15} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default NewDevelopments;
