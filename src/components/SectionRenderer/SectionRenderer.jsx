import React, { useState } from 'react';
import {
  CheckCircle2,
  ClipboardList,
  Stethoscope,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ZoomIn,
  X,
  User,
  HelpCircle,
  Table as TableIcon
} from 'lucide-react';
import RichTextRenderer from '../RichTextRenderer/RichTextRenderer';
import './SectionRenderer.css';

const stepIcons = [ClipboardList, Stethoscope, ShieldCheck];

/**
 * Parses label and value from feature items
 * Supports:
 * - { label: "Bed for Attendant", value: "Not available" }
 * - { title: "Air-Conditioned", description: "Yes" }
 * - "Air-Conditioned: Yes"
 */
function parseFeatureItem(item) {
  if (!item) return { label: '', value: '' };

  if (typeof item === 'object') {
    const label = item.label || item.title || item.name || item.key || '';
    const value = item.value || item.description || item.val || item.text || '';
    if (label && value && label !== value) {
      return { label, value };
    }
    const combined = item.text || item.title || item.name || '';
    if (combined.includes(':')) {
      const parts = combined.split(':');
      return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
    }
    return { label: combined, value: '' };
  }

  if (typeof item === 'string') {
    if (item.includes(':')) {
      const parts = item.split(':');
      return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
    }
    return { label: item, value: '' };
  }

  return { label: String(item), value: '' };
}

/* ------------------------------------------------------------------ */
/* 1. Feature List Section Renderer                                   */
/* ------------------------------------------------------------------ */
export function FeatureListSection({ section }) {
  const items = Array.isArray(section.items) ? section.items : [];

  return (
    <div className="section-feature-grid">
      {items.map((item, idx) => {
        const { label, value } = parseFeatureItem(item);
        return (
          <div key={idx} className="section-feature-card">
            <CheckCircle2 size={19} className="section-feature-icon" strokeWidth={2.2} />
            <div className="section-feature-body">
              {value ? (
                <>
                  <span className="section-feature-label">{label}:</span>
                  <span className="section-feature-value">{value}</span>
                </>
              ) : (
                <span className="section-feature-value">{label}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Accordion Section Renderer                                      */
/* ------------------------------------------------------------------ */
export function AccordionSection({ section, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen || section.settings?.defaultOpen === true);

  return (
    <div className="section-accordion-item">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`section-accordion-header ${isOpen ? 'is-open' : ''}`}
        aria-expanded={isOpen}
      >
        <span>{section.title || 'Section Details'}</span>
        <span className="section-accordion-toggle">
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {isOpen && (
        <div className="section-accordion-body">
          {section.content && <RichTextRenderer content={section.content} />}

          {Array.isArray(section.items) && section.items.length > 0 && (
            <FeatureListSection section={section} />
          )}

          {Array.isArray(section.steps) && section.steps.length > 0 && (
            <StepsSection section={section} />
          )}

          {Array.isArray(section.cards) && section.cards.length > 0 && (
            <CardsSection section={section} />
          )}

          {Array.isArray(section.faqs) && section.faqs.length > 0 && (
            <FaqSection section={section} />
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Steps Section Renderer                                          */
/* ------------------------------------------------------------------ */
export function StepsSection({ section }) {
  const steps = Array.isArray(section.steps) && section.steps.length > 0
    ? section.steps
    : (Array.isArray(section.items) ? section.items : []);

  if (steps.length === 0) return null;

  return (
    <div className="section-steps-container">
      {steps.map((s, i) => {
        const Icon = stepIcons[i % stepIcons.length];
        const isLast = i === steps.length - 1;
        const stepNum = s.step || (i + 1);

        return (
          <div key={i} className="section-step-row">
            {!isLast && <div className="section-step-line" />}
            <div className="section-step-badge">
              <Icon size={19} strokeWidth={2} />
            </div>
            <div className="section-step-content">
              <span className="section-step-num">STEP {stepNum}</span>
              <h4 className="section-step-title">{s.title || `Phase ${stepNum}`}</h4>
              <div
                className="section-step-desc"
                dangerouslySetInnerHTML={{
                  __html: typeof s.description === 'string' ? s.description : ''
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Cards Section Renderer                                          */
/* ------------------------------------------------------------------ */
export function CardsSection({ section }) {
  const cards = Array.isArray(section.cards) && section.cards.length > 0
    ? section.cards
    : (Array.isArray(section.items) ? section.items : []);

  if (cards.length === 0) return null;

  return (
    <div className="section-cards-grid">
      {cards.map((c, i) => {
        const title = c.title || c.name || 'Feature';
        const subtitle = c.role || c.tag || c.subtitle || '';
        const description = c.description || c.qualification || '';
        const icon = c.icon || '';
        const image = c.photo || c.image || c.imageUrl || '';

        return (
          <div key={i} className="section-card-item">
            <div className="section-card-avatar">
              {image ? (
                <img src={image} alt={title} />
              ) : icon ? (
                <span className="material-symbols-outlined" style={{ fontSize: 26, color: '#E8792B' }}>
                  {icon}
                </span>
              ) : (
                <User size={26} color="#132A4C" />
              )}
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <h4 className="section-card-title">{title}</h4>
              {subtitle && <p className="section-card-subtitle">{subtitle}</p>}
              {description && <p className="section-card-desc">{description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Checklist Section Renderer                                      */
/* ------------------------------------------------------------------ */
export function ChecklistSection({ section }) {
  const items = Array.isArray(section.items) ? section.items : [];
  if (items.length === 0) return null;

  return (
    <div className="section-checklist-grid">
      {items.map((item, idx) => {
        const text = typeof item === 'string' ? item : (item.text || item.title || item.description || '');
        const note = typeof item === 'object' ? item.note : '';

        return (
          <div key={idx} className="section-checklist-item">
            <CheckCircle2 size={19} color="#E8792B" strokeWidth={2.2} style={{ flexShrink: 0, marginTop: 2 }} />
            <div className="section-checklist-text">
              <span>{text}</span>
              {note && <div className="section-checklist-note">{note}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. FAQ Section Renderer                                            */
/* ------------------------------------------------------------------ */
export function FaqSection({ section }) {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = Array.isArray(section.faqs) && section.faqs.length > 0
    ? section.faqs
    : (Array.isArray(section.items) ? section.items : []);

  if (faqs.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {faqs.map((faq, i) => {
        const isOpen = openIdx === i;
        const question = faq.question || faq.title || faq.q || '';
        const answer = faq.answer || faq.description || faq.content || faq.a || '';

        return (
          <div key={i} className="section-accordion-item">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
              className={`section-accordion-header ${isOpen ? 'is-open' : ''}`}
            >
              <span>{question}</span>
              <span className="section-accordion-toggle">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div className="section-accordion-body">
                {typeof answer === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: answer }} />
                ) : (
                  <RichTextRenderer content={answer} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Gallery Section Renderer                                        */
/* ------------------------------------------------------------------ */
export function GallerySection({ section }) {
  const [selectedImg, setSelectedImg] = useState(null);
  const images = Array.isArray(section.galleryImages) && section.galleryImages.length > 0
    ? section.galleryImages
    : (Array.isArray(section.items) ? section.items : []);

  if (images.length === 0) return null;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {images.map((g, i) => {
          const imgUrl = typeof g === 'string' ? g : (g.image || g.url || g.imageUrl || '');
          const caption = typeof g === 'object' ? (g.caption || g.title || '') : '';
          if (!imgUrl) return null;

          return (
            <div
              key={i}
              onClick={() => setSelectedImg({ url: imgUrl, caption })}
              style={{
                position: 'relative',
                borderRadius: 12,
                overflow: 'hidden',
                aspectRatio: '4/3',
                background: '#F7F9FC',
                cursor: 'pointer',
                border: '1px solid #E7EAF0'
              }}
            >
              <img
                src={imgUrl}
                alt={caption || 'Facility photo'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  padding: '16px 14px 10px',
                  background: 'linear-gradient(to top, rgba(19, 42, 76, 0.85), transparent)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  color: '#FFFFFF'
                }}
              >
                <span style={{ fontFamily: "'Work Sans', sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                  {caption || 'View Image'}
                </span>
                <ZoomIn size={16} style={{ opacity: 0.9 }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24
          }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 900, maxHeight: '90vh', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSelectedImg(null)}
              style={{
                position: 'absolute',
                top: -44,
                right: 0,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
            <img
              src={selectedImg.url}
              alt={selectedImg.caption}
              style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }}
            />
            {selectedImg.caption && (
              <p style={{ color: '#fff', fontFamily: "'Work Sans', sans-serif", marginTop: 12, textAlign: 'center' }}>
                {selectedImg.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Table Section Renderer                                          */
/* ------------------------------------------------------------------ */
export function TableSection({ section }) {
  const tableData = section.table || section.settings?.table || {};
  const headers = tableData.headers || section.headers || [];
  const rows = tableData.rows || section.rows || [];

  // If items array contains table row objects
  if (headers.length === 0 && Array.isArray(section.items) && section.items.length > 0) {
    const first = section.items[0];
    if (typeof first === 'object' && first !== null) {
      const detectedHeaders = Object.keys(first);
      const detectedRows = section.items.map(row => detectedHeaders.map(h => row[h]));
      return (
        <div className="section-table-container">
          <table className="section-table">
            <thead>
              <tr>
                {detectedHeaders.map((h, i) => (
                  <th key={i}>{h.replace(/_/g, ' ')}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detectedRows.map((r, rIdx) => (
                <tr key={rIdx}>
                  {r.map((cell, cIdx) => (
                    <td key={cIdx}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  if (headers.length === 0 && rows.length === 0) return null;

  return (
    <div className="section-table-container">
      <table className="section-table">
        {headers.length > 0 && (
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx}>
              {Array.isArray(row)
                ? row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)
                : <td colSpan={headers.length || 1}>{String(row)}</td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Master Section Dispatcher                                          */
/* ------------------------------------------------------------------ */
export function SectionRenderer({ section, showTitle = true }) {
  if (!section || section.enabled === false) return null;

  const type = section.type || 'rich_text';

  // Section heading (for non-accordion types where title is distinct)
  const renderHeader = () => {
    if (!showTitle || !section.title || type === 'accordion') return null;
    return (
      <h3 className="section-heading-title">
        {section.title}
      </h3>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'feature_list':
        return <FeatureListSection section={section} />;
      case 'accordion':
        return <AccordionSection section={section} />;
      case 'steps':
        return <StepsSection section={section} />;
      case 'cards':
        return <CardsSection section={section} />;
      case 'checklist':
        return <ChecklistSection section={section} />;
      case 'gallery':
        return <GallerySection section={section} />;
      case 'faq':
      case 'faqs':
        return <FaqSection section={section} />;
      case 'table':
        return <TableSection section={section} />;
      case 'rich_text':
      default:
        return (
          <>
            {section.content ? (
              <RichTextRenderer content={section.content} />
            ) : Array.isArray(section.items) && section.items.length > 0 ? (
              <ChecklistSection section={section} />
            ) : null}
          </>
        );
    }
  };

  return (
    <div className="section-block" id={section.id || undefined}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab Sections Container (Iterates through tab.sections)             */
/* ------------------------------------------------------------------ */
export function TabSectionsRenderer({ tab }) {
  const sections = Array.isArray(tab?.sections)
    ? tab.sections.filter(s => s && s.enabled !== false)
    : [];

  const hasIntro = tab?.content && typeof tab.content === 'string' && tab.content.trim().length > 0;

  return (
    <div className="section-renderer-container">
      {/* Optional tab level introductory content */}
      {hasIntro && (
        <div className="section-tab-intro">
          <RichTextRenderer content={tab.content} />
        </div>
      )}

      {/* Render each nested section in order */}
      {sections.map((section, index) => (
        <React.Fragment key={section.id || index}>
          <SectionRenderer
            section={section}
            showTitle={section.title !== tab.title && section.title !== tab.label}
          />
          {index < sections.length - 1 && section.type !== 'accordion' && (
            <div className="section-divider" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default SectionRenderer;
