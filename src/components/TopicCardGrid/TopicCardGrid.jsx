import React from 'react';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import './TopicCardGrid.css';

/**
 * TopicCardGrid
 * Boxed cards with a colored header bar + bullet content below (blue header, light-blue bullet box).
 * 
 * Props:
 * - title: string (optional section title)
 * - subtitle: string (optional subtitle)
 * - cards: Array<{
 *     id?: string | number,
 *     title: string,
 *     subtitle?: string,
 *     icon?: string,
 *     headerColor?: string,
 *     bulletPoints?: Array<string | { text: string, note?: string }>,
 *     items?: Array<string | { text: string, note?: string }>
 *   }>
 * - columns: number (default 2 or 3 responsive)
 * - bulletIcon: 'check' | 'chevron' | 'dot' (default 'check')
 */
export default function TopicCardGrid({
  title,
  subtitle,
  cards = [],
  columns = 2,
  bulletIcon = 'check',
  className = ''
}) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className={`topic-card-grid-section ${className}`}>
      {title && <h3 className="topic-grid-main-title">{title}</h3>}
      {subtitle && <p className="topic-grid-main-subtitle">{subtitle}</p>}

      <div className={`topic-card-grid columns-${columns}`}>
        {cards.map((card, idx) => {
          const items = card.bulletPoints || card.items || [];
          const cardTitle = card.title || `Topic ${idx + 1}`;

          return (
            <div key={card.id || idx} className="topic-card">
              {/* Colored Header Bar */}
              <div 
                className="topic-card-header"
                style={card.headerColor ? { background: card.headerColor } : undefined}
              >
                <div className="topic-card-header-content">
                  {card.icon && (
                    <span className="material-symbols-outlined topic-card-icon">
                      {card.icon}
                    </span>
                  )}
                  <div>
                    <h4 className="topic-card-title">{cardTitle}</h4>
                    {card.subtitle && (
                      <span className="topic-card-subtitle">{card.subtitle}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Light-blue Bullet Box */}
              <div className="topic-card-bullet-box">
                {items.length > 0 ? (
                  <ul className="topic-card-list">
                    {items.map((item, itemIdx) => {
                      const text = typeof item === 'string' ? item : item.text || item.title || '';
                      const note = typeof item === 'object' ? item.note || item.description : '';

                      return (
                        <li key={itemIdx} className="topic-card-list-item">
                          <span className="topic-bullet-icon">
                            {bulletIcon === 'check' && (
                              <CheckCircle2 size={16} className="bullet-icon-check" strokeWidth={2.4} />
                            )}
                            {bulletIcon === 'chevron' && (
                              <ChevronRight size={16} className="bullet-icon-chevron" strokeWidth={2.4} />
                            )}
                            {bulletIcon === 'dot' && (
                              <span className="bullet-icon-dot" />
                            )}
                          </span>
                          <div className="topic-bullet-text-wrapper">
                            <span className="topic-bullet-text">{text}</span>
                            {note && <span className="topic-bullet-note">{note}</span>}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="topic-card-empty">No items specified.</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
