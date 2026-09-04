import React, { useState, useEffect } from 'react';
import './SpecialityModal.css';

const SpecialityModal = ({ speciality, onClose, categoryName }) => {
  const [activeTabId, setActiveTabId] = useState('t1');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (speciality) {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
      // Reset active tab to first tab on change
      if (speciality.tabs && speciality.tabs.length > 0) {
        setActiveTabId(speciality.tabs[0].id);
      } else {
        setActiveTabId('t1');
      }
    } else {
      setIsOpen(false);
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [speciality]);

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
    setTimeout(onClose, 300); // Allow animation to complete
  };

  if (!speciality) return null;

  const activeTab = speciality.tabs?.find((t) => t.id === activeTabId) || speciality.tabs?.[0];

  // Fallback banner image if not specified
  const bannerUrl = speciality.bannerImage || 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop';

  return (
    <div
      className={`speciality-modal-overlay ${isOpen ? 'open' : ''}`}
      onClick={handleClose}
    >
      <div
        className="speciality-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="speciality-modal-close" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>

        <div className="speciality-modal-banner">
          {/* Ambient blurred backdrop for complementary filling of banner */}
          <div className="speciality-modal-banner-bg-container" aria-hidden="true">
            <img
              src={bannerUrl}
              alt=""
              className="speciality-modal-banner-bg-img"
            />
          </div>

          {/* Crisp foreground image preserving full aspect ratio */}
          <div className="speciality-modal-banner-img-container">
            <img
              src={bannerUrl}
              alt={speciality.name}
              className="speciality-modal-banner-main-img"
            />
          </div>

          {/* Readability overlay */}
          <div className="speciality-modal-banner-overlay" />

          {/* Banner text content */}
          <div className="speciality-modal-banner-content">
            <div className="speciality-modal-category">
              {categoryName || 'Bhaktivedanta Speciality'}
            </div>
            <h2 className="speciality-modal-title">
              {speciality.name}
            </h2>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="speciality-modal-tabs">
          {speciality.tabs?.map((tab) => (
            <button
              key={tab.id}
              className={`speciality-modal-tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTabId(tab.id)}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="speciality-modal-body">
          {activeTab ? (
            <div className="fade-in">
              <div
                className="speciality-modal-html-content"
                dangerouslySetInnerHTML={{ __html: activeTab.content || '<p class="italic text-slate-400">No content available for this section.</p>' }}
              />

              {/* Render Tab Images if any */}
              {activeTab.images && activeTab.images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {activeTab.images.map((imgUrl, index) => (
                    <img
                      key={index}
                      src={imgUrl}
                      alt={`${speciality.name} ${activeTab.title} ${index + 1}`}
                      className="w-full h-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-8">Select a tab to view content.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpecialityModal;
