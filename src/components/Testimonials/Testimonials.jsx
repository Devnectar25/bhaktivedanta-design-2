import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Testimonials.css';
import { Star, Quote, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { initialReviews } from '../../data/adminState';

const fallbackReviews = [
  {
    id: 'TST-202',
    patientName: "Nalini Iyer",
    disease: "Maternity Care",
    rating: 5,
    content: "Very clean facilities and caring nursing staff. Standard protocols were strictly followed during my delivery. Highly recommended.",
    status: "Approved"
  },
  {
    id: 'TST-201',
    patientName: "Harish Mehta",
    disease: "Angioplasty Patient",
    rating: 5,
    content: "The care and attention I received at Bhaktivedanta Hospital was exceptional. Dr. Anand Sharma is highly professional and compassionate.",
    status: "Approved"
  },
  {
    id: 'TST-203',
    patientName: "Pradeep Jena",
    disease: "Heart Surgery Patient",
    rating: 5,
    content: "Bhaktivedanta Hospital saved my life with the fastest care I could find. The doctors and nurses were exceptionally kind throughout my treatment.",
    status: "Approved"
  }
];

const GAP_PX = 24;

const Testimonials = () => {
  const [items, setItems] = useState(fallbackReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [withTransition, setWithTransition] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const isJumpingRef = useRef(false);

  // Responsive visible count: 3 on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    initialReviews().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const approvedOnly = data.filter(t => t.status === 'Approved' || !t.status);
        if (approvedOnly.length > 0) {
          setItems(approvedOnly);
        } else {
          setItems(data);
        }
      }
    });
  }, []);

  const totalItems = items.length;
  const canRotate = totalItems > visibleCount;

  // Handle Next rotation
  const handleNext = () => {
    if (!canRotate || isJumpingRef.current) return;
    setWithTransition(true);
    setCurrentIndex(prev => prev + 1);
  };

  // Handle Previous rotation
  const handlePrev = () => {
    if (!canRotate || isJumpingRef.current) return;
    if (currentIndex === 0) {
      isJumpingRef.current = true;
      setWithTransition(false);
      setCurrentIndex(totalItems);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
          setCurrentIndex(totalItems - 1);
          isJumpingRef.current = false;
        });
      });
    } else {
      setWithTransition(true);
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Infinite seamless reset on transition end
  const handleTransitionEnd = () => {
    if (currentIndex >= totalItems) {
      setWithTransition(false);
      setCurrentIndex(0);
    }
  };

  // Direct dot click
  const handleDotClick = (dotIdx) => {
    if (!canRotate) return;
    setWithTransition(true);
    setCurrentIndex(dotIdx);
  };

  // Auto-rotation timer (4.5s), pauses on hover
  useEffect(() => {
    if (!canRotate || isPaused) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [canRotate, isPaused, currentIndex, totalItems, visibleCount]);

  // Display list contains cloned buffer at the end for seamless continuous looping
  const displayList = canRotate
    ? [...items, ...items.slice(0, visibleCount)]
    : items;

  // Transform calculation
  const transform = canRotate
    ? `translateX(calc(-1 * ${currentIndex} * (100% + ${GAP_PX}px) / ${visibleCount}))`
    : 'none';

  const transition = withTransition
    ? 'transform 0.55s cubic-bezier(0.25, 1, 0.5, 1)'
    : 'none';

  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        {/* Header with Title and Rotation Arrow Buttons */}
        <div className="section-header-row">
          <div className="section-header-text">
            <p className="section-label">Patient Reviews</p>
            <h2>Stories of <span>Hope &amp; Healing</span></h2>
          </div>

          {canRotate && (
            <div className="carousel-nav-controls">
              <button
                type="button"
                onClick={handlePrev}
                className="carousel-nav-btn prev"
                aria-label="Previous reviews"
                title="Previous reviews"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="carousel-nav-btn next"
                aria-label="Next reviews"
                title="Next reviews"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport (Overflow hidden, only 3 cards at a time, never below) */}
        <div
          className="testimonials-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div
            className="testimonials-track"
            style={{
              transform,
              transition,
              gap: `${GAP_PX}px`
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {displayList.map((item, index) => {
              const name = item.patientName || item.name || 'Anonymous';
              const tag = item.disease || item.tag || 'Patient Review';
              const starCount = item.rating || item.stars || 5;
              const quoteText = item.content || item.quote || '';
              const initial = name.charAt(0).toUpperCase();

              return (
                <div
                  key={`${item.id || index}-${index}`}
                  className="testimonial-slide"
                  style={{
                    flex: `0 0 calc((100% - ${(visibleCount - 1) * GAP_PX}px) / ${visibleCount})`
                  }}
                >
                  <div className="testimonial-card compact-glass">
                    <div className="card-top">
                      <Quote className="quote-icon" size={40} />
                      <div className="stars">
                        {[...Array(starCount)].map((_, i) => (
                          <Star key={i} fill="#f59e0b" color="#f59e0b" size={18} />
                        ))}
                      </div>
                    </div>

                    <p className="quote">"{quoteText}"</p>

                    <div className="patient-info">
                      <div className="patient-avatar">
                        {initial}
                      </div>
                      <div className="patient-meta">
                        <span className="patient-name">{name}</span>
                        <span className="patient-tag">{tag}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with Carousel Dots & View All Reviews Button */}
        <div className="testimonials-footer">
          {canRotate && (
            <div className="carousel-dots">
              {items.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  className={`carousel-dot ${dotIdx === (currentIndex % totalItems) ? 'active' : ''}`}
                  onClick={() => handleDotClick(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

          <Link to="/testimonials" className="btn-view-all-reviews">
            <span>View All Reviews</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
