import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, ChevronRight, Sparkles } from 'lucide-react';
import './ProgramCard.css';

/**
 * ProgramCard
 * Image + title card for educational programs, clinical courses, or spiritual retreats.
 * On click, navigates to an internal route (via react-router) or an external URL based on props.
 * 
 * Props:
 * - image: string (banner image URL)
 * - title: string (program title)
 * - description?: string (brief description)
 * - badge?: string (category or duration badge e.g. "3 Years Residency", "Certificate")
 * - duration?: string
 * - route?: string | to: string (internal React route e.g. "/education/dnb")
 * - isExternal?: boolean (if true or if url is provided, navigates externally)
 * - externalUrl?: string | url: string
 * - onClick?: () => void (custom callback)
 * - ctaText?: string (default "Learn More" / "Explore Program")
 */
export default function ProgramCard({
  image,
  title,
  description,
  badge,
  duration,
  route,
  to,
  isExternal = false,
  externalUrl,
  url,
  onClick,
  ctaText = 'Explore Program',
  className = ''
}) {
  const navigate = useNavigate();
  const internalTarget = route || to;
  const externalTarget = externalUrl || url;
  const shouldOpenExternal = isExternal || Boolean(externalTarget);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }

    if (shouldOpenExternal && externalTarget) {
      window.open(externalTarget, '_blank', 'noopener,noreferrer');
    } else if (internalTarget) {
      if (internalTarget.startsWith('#')) {
        const el = document.querySelector(internalTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(internalTarget);
      }
    }
  };

  return (
    <div 
      className={`program-card ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Banner / Image */}
      <div className="program-card-image-wrapper">
        {image ? (
          <img 
            src={image} 
            alt={title || 'Program banner'} 
            className="program-card-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.parentElement?.querySelector('.program-card-fallback');
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}

        <div className="program-card-fallback" style={{ display: image ? 'none' : 'flex' }}>
          <Sparkles size={32} />
        </div>

        {badge && (
          <span className="program-card-badge">{badge}</span>
        )}

        {duration && (
          <span className="program-card-duration">{duration}</span>
        )}
      </div>

      {/* Body Content */}
      <div className="program-card-body">
        <h4 className="program-card-title">{title}</h4>
        {description && (
          <p className="program-card-desc">{description}</p>
        )}

        <div className="program-card-footer">
          <span className="program-card-cta">
            <span>{ctaText}</span>
            {shouldOpenExternal ? (
              <ExternalLink size={15} className="program-cta-icon" />
            ) : (
              <ArrowUpRight size={16} className="program-cta-icon" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
