import React, { useState, useEffect } from 'react';
import { 
  Quote, 
  Share2, 
  Sparkles, 
  Check, 
  ShieldCheck 
} from 'lucide-react';
import { initialTestimonials, defaultVipTestimonials } from '../../data/adminState';
import './TestimonialsPage.css';

const TestimonialsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    initialTestimonials()
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0
          ? (data.filter((t) => t.status === 'Approved' || !t.status).length > 0
              ? data.filter((t) => t.status === 'Approved' || !t.status)
              : data)
          : defaultVipTestimonials;
        setItems(list);
      })
      .catch(() => {
        setItems(defaultVipTestimonials);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: 'Bhaktivedanta Hospital - Dignitary Testimonials',
      text: 'Read endorsements and testimonials from eminent dignitaries and well-wishers.',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {}
    }
  };

  return (
    <div className="vip-testimonials-page">
      {/* Toast Notification */}
      {copied && (
        <div className="vip-toast">
          <Check size={16} /> Link copied to clipboard!
        </div>
      )}

      {/* Compact Header Section */}
      <section className="vip-hero-section">
        <div className="vip-container">
          <div className="vip-header-wrapper">
            <div className="vip-header-content">
              <div className="vip-badge-pill">
                <Sparkles size={13} className="text-amber-500" />
                <span>DISTINGUISHED VOICES OF TRUST</span>
              </div>
              <h1 className="vip-title">
                Dignitary <span>Testimonials</span>
              </h1>
              <p className="vip-subtitle">
                Reflections, endorsements, and blessings from eminent public leaders, spiritual luminaries,
                and healthcare patrons who have witnessed the values-driven healing mission of Bhaktivedanta Hospital.
              </p>
            </div>

            <button 
              type="button" 
              onClick={handleShare}
              className="vip-share-button"
              title="Share Page"
              aria-label="Share Page"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Testimonials Grid */}
      <main className="vip-container vip-cards-container">
        {loading ? (
          <div className="vip-loading-state">
            <div className="vip-spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="vip-empty-state">
            <p>No testimonials available at this moment.</p>
          </div>
        ) : (
          <div className="vip-cards-grid">
            {items.map((item, index) => (
              <article 
                key={item.id || index} 
                className="vip-testimonial-card"
              >
                {/* Decorative Background Quote Watermark */}
                <div className="vip-card-watermark" aria-hidden="true">
                  <Quote size={80} />
                </div>

                <div className="vip-card-inner">
                  {/* Header: Avatar + Dignitary Name & Title */}
                  <div className="vip-profile-row">
                    <div className="vip-avatar-wrap">
                      <img 
                        src={item.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                        alt={item.name} 
                        className="vip-avatar-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80';
                        }}
                      />
                      <div className="vip-avatar-badge" title="Verified Dignitary Patron">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="vip-profile-info">
                      <h3 className="vip-dignitary-name">{item.name}</h3>
                      <p className="vip-dignitary-title">{item.designation}</p>
                    </div>
                  </div>

                  {/* Quotation Icon & Content */}
                  <div className="vip-quote-section">
                    <div className="vip-quote-icon-bar">
                      <Quote size={22} className="vip-quote-symbol" />
                    </div>
                    <blockquote className="vip-quote-body">
                      "{item.content}"
                    </blockquote>
                  </div>

                  {/* Card Footer Badge */}
                  <div className="vip-card-footer">
                    <div className="vip-endorsement-tag">
                      <ShieldCheck size={14} className="vip-shield-icon" />
                      <span>Official Patron Endorsement</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TestimonialsPage;
