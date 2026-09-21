import React from 'react';
import './AcronymBreakdown.css';

/**
 * AcronymBreakdown
 * Renders a row/grid of Letter + Word pairs (e.g. M - Mercy, A - Austerity, etc.)
 * 
 * Props:
 * - title: string (optional section title)
 * - subtitle: string (optional description)
 * - items: Array<{ letter: string, word: string, description?: string, color?: string }> | Array<string> (e.g. ["M: Mercy", "A: Austerity"])
 * - variant: 'card' | 'badge' | 'row' (default 'card')
 */
export default function AcronymBreakdown({
  title,
  subtitle,
  items = [],
  variant = 'card',
  className = ''
}) {
  // Normalize items to { letter, word, description }
  const normalizedItems = (items || []).map((item, idx) => {
    if (typeof item === 'string') {
      if (item.includes(':')) {
        const [l, ...rest] = item.split(':');
        return { letter: l.trim(), word: rest.join(':').trim(), description: '' };
      }
      if (item.includes('-')) {
        const [l, ...rest] = item.split('-');
        return { letter: l.trim(), word: rest.join('-').trim(), description: '' };
      }
      return { letter: item.charAt(0), word: item, description: '' };
    }
    return {
      letter: item.letter || (item.word ? item.word.charAt(0) : `${idx + 1}`),
      word: item.word || item.title || item.name || '',
      description: item.description || item.meaning || item.desc || '',
      color: item.color
    };
  });

  if (normalizedItems.length === 0) return null;

  return (
    <div className={`acronym-breakdown-wrapper ${className}`}>
      {title && <h3 className="acronym-title">{title}</h3>}
      {subtitle && <p className="acronym-subtitle">{subtitle}</p>}

      <div className={`acronym-items-container variant-${variant}`}>
        {normalizedItems.map((item, index) => (
          <div key={index} className="acronym-item-card">
            <div className="acronym-letter-badge" style={item.color ? { backgroundColor: item.color } : undefined}>
              {item.letter}
            </div>
            <div className="acronym-content">
              <span className="acronym-word">{item.word}</span>
              {item.description && (
                <span className="acronym-desc">{item.description}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
