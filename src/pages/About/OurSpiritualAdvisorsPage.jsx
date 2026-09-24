import React, { useState, useEffect } from 'react';
import { Share2, X, ChevronRight, User, HeartHandshake, Sparkles } from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './OurSpiritualAdvisorsPage.css';

const OurSpiritualAdvisorsPage = () => {
  const [advisors, setAdvisors] = useState(defaultAboutUsData.spiritualAdvisors || []);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

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
      const list = state?.spiritualAdvisors || defaultAboutUsData.spiritualAdvisors;
      if (Array.isArray(list) && list.length > 0) {
        setAdvisors(list);
      }
    } catch (err) {
      console.warn('Could not load spiritual advisors data:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Our Spiritual Advisors | Bhaktivedanta Hospital & Research Institute',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2500);
    }
  };

  const handleImageError = (id) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="spiritual-advisors-wrapper">
      {shareFeedback && <div className="spiritual-share-toast">Page link copied to clipboard!</div>}

      <div className="spiritual-advisors-container">
        {/* Breadcrumb Navigation */}
        <div className="spiritual-breadcrumb">
          <a href="/">Home</a>
          <ChevronRight size={14} className="spiritual-breadcrumb-separator" />
          <span>About Us</span>
          <ChevronRight size={14} className="spiritual-breadcrumb-separator" />
          <span className="spiritual-breadcrumb-active">Our Spiritual Advisors</span>
        </div>

        {/* Header with Title and Share Button */}
        <div className="spiritual-header-row">
          <div className="spiritual-header-spacer" />
          <h1 className="spiritual-page-title">Our Spiritual Advisors</h1>
          <button 
            onClick={handleShare} 
            className="spiritual-share-btn" 
            title="Share this page"
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Intro Subtitle */}
        <p className="spiritual-page-subtitle">
          Guiding our mission of compassionate, value-based healthcare with profound spiritual wisdom, ethical leadership, and dedicated devotional service.
        </p>

        {/* 3-Column Grid of Advisors (matching screenshot) */}
        <div className="spiritual-advisors-grid">
          {advisors.map((advisor) => {
            const hasError = imageErrors[advisor.id];
            return (
              <div 
                key={advisor.id} 
                className="spiritual-card"
                onClick={() => setSelectedAdvisor(advisor)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') setSelectedAdvisor(advisor); }}
              >
                {/* Photo Area */}
                <div className="spiritual-card-image-wrap">
                  {advisor.photoUrl && !hasError ? (
                    <img 
                      src={advisor.photoUrl} 
                      alt={advisor.name} 
                      className="spiritual-card-image"
                      onError={() => handleImageError(advisor.id)}
                    />
                  ) : (
                    <div className="spiritual-card-placeholder">
                      <div className="spiritual-placeholder-icon-wrap">
                        <Sparkles size={38} className="spiritual-placeholder-icon" />
                      </div>
                      <span className="spiritual-placeholder-name">{advisor.name}</span>
                    </div>
                  )}
                </div>

                {/* Info Area */}
                <div className="spiritual-card-content">
                  <h3 className="spiritual-card-name">{advisor.name}</h3>
                  <span className="spiritual-card-designation">{advisor.designation || 'Spiritual Advisor'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Bio Modal */}
      {selectedAdvisor && (
        <div className="spiritual-modal-overlay" onClick={() => setSelectedAdvisor(null)}>
          <div className="spiritual-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="spiritual-modal-close" 
              onClick={() => setSelectedAdvisor(null)}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <div className="spiritual-modal-grid">
              {/* Left Photo Column */}
              <div className="spiritual-modal-photo-col">
                <div className="spiritual-modal-photo-box">
                  {selectedAdvisor.photoUrl && !imageErrors[selectedAdvisor.id] ? (
                    <img 
                      src={selectedAdvisor.photoUrl} 
                      alt={selectedAdvisor.name} 
                      className="spiritual-modal-photo" 
                      onError={() => handleImageError(selectedAdvisor.id)}
                    />
                  ) : (
                    <div className="spiritual-modal-placeholder">
                      <Sparkles size={64} className="text-orange-500" />
                      <span className="text-sm font-bold text-slate-700 mt-2">{selectedAdvisor.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Bio Column */}
              <div className="spiritual-modal-info-col">
                <h2 className="spiritual-modal-name">{selectedAdvisor.name}</h2>
                <div className="spiritual-modal-subtitle">
                  — {selectedAdvisor.designation || 'Spiritual Advisor'}
                </div>
                <div className="spiritual-sline" />

                <div className="spiritual-modal-bio">
                  {selectedAdvisor.bio ? (
                    selectedAdvisor.bio.split('\n\n').map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))
                  ) : (
                    <p>Guidance and counsel rooted in timeless Vedic wisdom and selfless devotional care.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurSpiritualAdvisorsPage;
