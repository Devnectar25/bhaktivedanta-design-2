import React from 'react';
import { ZoomIn } from 'lucide-react';
import './ActivityImageCard.css';

/**
 * ActivityImageCard
 * Reusable image card with clean caption, hover animation, and optional tag/lightbox trigger.
 * 
 * Props:
 * - image: string (image URL)
 * - caption: string | ReactNode (short caption below image)
 * - title?: string (optional image title / headline)
 * - tag?: string (badge tag on top of image, e.g. "Community Outreach", "Workshop")
 * - date?: string (optional date string)
 * - onClick?: () => void (click callback, e.g. open lightbox)
 * - aspectRatio?: string (default '4/3')
 */
export default function ActivityImageCard({
  image,
  caption,
  title,
  tag,
  date,
  onClick,
  aspectRatio = '4/3',
  className = ''
}) {
  return (
    <div 
      className={`activity-image-card ${onClick ? 'is-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="activity-image-wrapper" style={{ aspectRatio }}>
        {image ? (
          <img 
            src={image} 
            alt={title || (typeof caption === 'string' ? caption : 'Activity photo')} 
            className="activity-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.parentElement?.querySelector('.activity-image-fallback');
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}

        <div className="activity-image-fallback" style={{ display: image ? 'none' : 'flex' }}>
          <span className="material-symbols-outlined">image</span>
        </div>

        {tag && <span className="activity-image-tag">{tag}</span>}

        {onClick && (
          <div className="activity-image-hover-overlay">
            <ZoomIn size={22} className="activity-zoom-icon" />
          </div>
        )}
      </div>

      {(title || caption || date) && (
        <div className="activity-card-body">
          {title && <h4 className="activity-card-title">{title}</h4>}
          {caption && <p className="activity-card-caption">{caption}</p>}
          {date && <span className="activity-card-date">{date}</span>}
        </div>
      )}
    </div>
  );
}
