import React from 'react';
import { ExternalLink, BookOpen, Users, Calendar, FileText } from 'lucide-react';
import './PublicationCard.css';

/**
 * PublicationCard
 * Displays a research paper / academic publication card with thumbnail, linked title (opens in new tab),
 * author names, journal, publication date/year, and DOI.
 * 
 * Props:
 * - thumbnail?: string (thumbnail image URL)
 * - title: string (title of the research paper)
 * - url?: string | link (external URL opened in new tab)
 * - authors?: Array<string> | string (author names)
 * - journal?: string (journal name)
 * - year?: string | number (publication year / date)
 * - volume?: string (volume/issue/pages)
 * - doi?: string (DOI identifier)
 * - abstract?: string (short summary)
 */
export default function PublicationCard({
  thumbnail,
  image,
  title,
  url,
  link,
  authors = [],
  journal,
  year,
  volume,
  doi,
  abstract,
  className = ''
}) {
  const targetUrl = url || link;
  const thumbImg = thumbnail || image;
  const authorList = Array.isArray(authors) ? authors.join(', ') : authors;

  return (
    <div className={`publication-card ${className}`}>
      {/* Thumbnail */}
      <div className="publication-thumbnail-wrapper">
        {thumbImg ? (
          <img 
            src={thumbImg} 
            alt={title || 'Publication'} 
            className="publication-thumbnail" 
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fb = e.currentTarget.parentElement?.querySelector('.publication-fallback-thumb');
              if (fb) fb.style.display = 'flex';
            }}
          />
        ) : null}

        <div className="publication-fallback-thumb" style={{ display: thumbImg ? 'none' : 'flex' }}>
          <FileText size={28} />
        </div>
      </div>

      {/* Main Details */}
      <div className="publication-body">
        {/* Title */}
        <h4 className="publication-title">
          {targetUrl ? (
            <a 
              href={targetUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="publication-link"
            >
              <span>{title}</span>
              <ExternalLink size={15} className="publication-ext-icon" />
            </a>
          ) : (
            <span>{title}</span>
          )}
        </h4>

        {/* Authors */}
        {authorList && (
          <div className="publication-meta-row publication-authors">
            <Users size={15} className="publication-meta-icon" />
            <span>{authorList}</span>
          </div>
        )}

        {/* Journal & Year */}
        <div className="publication-meta-row publication-journal-info">
          {journal && (
            <div className="publication-journal-badge">
              <BookOpen size={14} className="publication-meta-icon" />
              <span className="publication-journal-name">{journal}</span>
            </div>
          )}

          {volume && <span className="publication-volume">{volume}</span>}

          {year && (
            <div className="publication-year-badge">
              <Calendar size={13} className="publication-meta-icon" />
              <span>{year}</span>
            </div>
          )}
        </div>

        {/* Abstract */}
        {abstract && (
          <p className="publication-abstract">{abstract}</p>
        )}

        {/* DOI */}
        {doi && (
          <div className="publication-doi">
            <span className="publication-doi-label">DOI:</span>
            <a 
              href={`https://doi.org/${doi.replace(/^doi:/i, '')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="publication-doi-link"
            >
              {doi}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
