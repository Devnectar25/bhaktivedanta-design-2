import React, { useState, useEffect } from 'react';
import { Share2, ExternalLink, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAboutUsState } from '../../utils/api';
import { defaultAboutUsData } from '../../data/aboutUsData';
import './NewDevelopmentsPage.css';

const NewDevelopmentsPage = () => {
  const [developments, setDevelopments] = useState(defaultAboutUsData.newDevelopments || []);
  const [shareFeedback, setShareFeedback] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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

  const totalPages = Math.max(1, Math.ceil(developments.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDevelopments = developments.slice(startIndex, endIndex);

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
          {paginatedDevelopments.map((dev, idx) => (
            <article key={dev.id || idx} className="dev-card group">
              {/* Thumbnail Image */}
              <div className="dev-thumbnail-wrap">
                <img 
                  src={dev.imageUrl || dev.image || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'} 
                  alt={dev.title} 
                  className="dev-thumbnail"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80';
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="dev-pagination-container">
            <span className="dev-pagination-info">
              Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, developments.length)}</strong> of <strong>{developments.length}</strong> updates
            </span>
            <div className="dev-pagination-controls">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => {
                  setCurrentPage(p => Math.max(1, p - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="dev-page-btn prev-next"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`dev-page-btn number ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => {
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="dev-page-btn prev-next"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewDevelopmentsPage;
