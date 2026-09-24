import React, { useState, useEffect } from 'react';
import { Share2, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './NewDevelopmentsPage.css';

const NewDevelopmentsPage = () => {
  const [developments, setDevelopments] = useState(defaultAboutUsData.newDevelopments || []);
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
      const list = state?.newDevelopments || defaultAboutUsData.newDevelopments;
      if (Array.isArray(list) && list.length > 0) {
        setDevelopments(list);
      }
    } catch (err) {
      console.warn('Could not load new developments data:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'New Developments & Updates | Bhaktivedanta Hospital & Research Institute',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  return (
    <div className="dev-page-wrapper">
      {shareFeedback && <div className="dev-share-toast">Page link copied to clipboard!</div>}

      <div className="dev-container">
        {/* Header Bar */}
        <div className="dev-header-row">
          <h1 className="dev-page-title">New Developments &amp; Updates</h1>
          <button 
            onClick={handleShare} 
            className="dev-share-btn" 
            title="Share this page"
            aria-label="Share page"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* 3-Column Developments Grid */}
        <div className="dev-grid">
          {developments.map((dev, idx) => (
            <article key={dev.id || idx} className="dev-card group">
              {/* Thumbnail Image */}
              <div className="dev-thumbnail-wrap">
                <img 
                  src={dev.imageUrl} 
                  alt={dev.title} 
                  className="dev-thumbnail"
                  onError={(e) => {
                    e.target.src = 'https://pub-a3f5d293f21c42ebb873059f3d9e05a3.r2.dev/upload/banner/17037550688385.png';
                  }}
                />
              </div>

              {/* Card Body */}
              <div className="dev-card-body">
                <h3 className="dev-card-title">{dev.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"')}</h3>
                <p className="dev-card-desc">{dev.description.replace(/&amp;/g, '&').replace(/&#039;/g, "'")}</p>
                
                <div className="dev-card-footer">
                  <a 
                    href={dev.readMoreLink || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="dev-readmore-link"
                  >
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewDevelopmentsPage;
