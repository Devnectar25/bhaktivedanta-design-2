import React, { useState } from 'react';
import { ChevronRight, CheckCircle2, ZoomIn, X, Share2, Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Reusable Sub-components
import RichTextRenderer from '../RichTextRenderer/RichTextRenderer';
import AcronymBreakdown from '../AcronymBreakdown/AcronymBreakdown';
import TopicCardGrid from '../TopicCardGrid/TopicCardGrid';
import ActivityImageCard from '../ActivityImageCard/ActivityImageCard';
import ContactInfoBlock from '../ContactInfoBlock/ContactInfoBlock';
import PublicationCard from '../PublicationCard/PublicationCard';
import ProgramCard from '../ProgramCard/ProgramCard';

import './FlexibleDetailPage.css';

/**
 * FlexibleDetailPage
 * Configurable, data-driven page template that renders an ordered list of content blocks.
 * 
 * Props:
 * - title: string
 * - subtitle?: string
 * - category?: string
 * - bannerImage?: string
 * - breadcrumbs?: Array<{ label: string, to?: string, href?: string }>
 * - blocks: Array<ContentBlock>
 * - sidebarBlocks?: Array<ContentBlock>
 * - onBack?: () => void
 * - showSharePrint?: boolean
 */
export default function FlexibleDetailPage({
  title,
  subtitle,
  category,
  bannerImage,
  breadcrumbs = [],
  blocks = [],
  sidebarBlocks = [],
  onBack,
  showSharePrint = true,
  className = ''
}) {
  const navigate = useNavigate();
  const [lightboxImg, setLightboxImg] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || document.title,
          url: window.location.href
        });
      } catch (e) { }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  /**
   * Block Dispatcher
   */
  const renderBlock = (block, idx) => {
    if (!block || block.enabled === false) return null;

    const blockType = block.type || 'paragraph';

    switch (blockType) {
      // 1. Headings
      case 'heading':
      case 'h2':
      case 'h3':
        return (
          <div key={block.id || idx} className={`detail-heading-block level-${block.level || (blockType === 'h3' ? '3' : '2')}`}>
            {block.badge && <span className="detail-heading-badge">{block.badge}</span>}
            <h2 className="detail-heading-title">{block.title || block.text}</h2>
            {block.subtitle && <p className="detail-heading-sub">{block.subtitle}</p>}
          </div>
        );

      // 2. Paragraphs / Rich Text
      case 'paragraph':
      case 'text':
      case 'rich_text':
        return (
          <div key={block.id || idx} className="detail-paragraph-block">
            {block.title && <h3 className="detail-block-title">{block.title}</h3>}
            {typeof block.content === 'string' ? (
              <RichTextRenderer content={block.content} />
            ) : block.text ? (
              <p className="detail-plain-text">{block.text}</p>
            ) : null}
          </div>
        );

      // 3. Image / Media Block
      case 'image':
      case 'banner':
        const imgUrl = block.image || block.url || block.src;
        return (
          <div key={block.id || idx} className={`detail-image-block align-${block.align || 'center'}`}>
            {imgUrl && (
              <div 
                className="detail-image-container"
                onClick={() => setLightboxImg({ url: imgUrl, caption: block.caption || block.title })}
              >
                <img 
                  src={imgUrl} 
                  alt={block.alt || block.caption || block.title || 'Illustration'} 
                  className="detail-block-img" 
                  loading="lazy"
                />
                <div className="detail-image-zoom-hint">
                  <ZoomIn size={18} />
                </div>
              </div>
            )}
            {block.caption && (
              <figcaption className="detail-image-caption">{block.caption}</figcaption>
            )}
          </div>
        );

      // 4. Bullet List / Checklist
      case 'bullet-list':
      case 'bullet_list':
      case 'checklist':
        const items = block.items || block.points || [];
        return (
          <div key={block.id || idx} className="detail-bullet-list-block">
            {block.title && <h3 className="detail-block-title">{block.title}</h3>}
            {block.subtitle && <p className="detail-block-subtitle">{block.subtitle}</p>}
            <div className={`detail-bullet-grid ${block.columns ? `cols-${block.columns}` : ''}`}>
              {items.map((item, itemIdx) => {
                const text = typeof item === 'string' ? item : item.text || item.title || '';
                const note = typeof item === 'object' ? item.note || item.description : '';
                return (
                  <div key={itemIdx} className="detail-bullet-item">
                    <CheckCircle2 size={19} className="detail-bullet-check" strokeWidth={2.2} />
                    <div className="detail-bullet-content">
                      <span className="detail-bullet-text">{text}</span>
                      {note && <span className="detail-bullet-note">{note}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // 5. Topic Card Grid
      case 'topic-card-grid':
      case 'topic_cards':
      case 'topic_card_grid':
        return (
          <TopicCardGrid
            key={block.id || idx}
            title={block.title}
            subtitle={block.subtitle}
            cards={block.cards || block.items}
            columns={block.columns || 2}
          />
        );

      // 6. Acronym Breakdown
      case 'acronym':
      case 'acronym_breakdown':
        return (
          <AcronymBreakdown
            key={block.id || idx}
            title={block.title}
            subtitle={block.subtitle}
            items={block.items || block.pairs}
            variant={block.variant || 'card'}
          />
        );

      // 7. Activity Image Grid
      case 'activity-grid':
      case 'activities':
      case 'gallery':
        const activities = block.items || block.activities || block.images || [];
        return (
          <div key={block.id || idx} className="detail-activities-section">
            {block.title && <h3 className="detail-block-title">{block.title}</h3>}
            {block.subtitle && <p className="detail-block-subtitle">{block.subtitle}</p>}
            <div className={`detail-activity-grid cols-${block.columns || 3}`}>
              {activities.map((act, actIdx) => (
                <ActivityImageCard
                  key={act.id || actIdx}
                  image={act.image || act.url}
                  caption={act.caption || act.description}
                  title={act.title}
                  tag={act.tag || act.category}
                  date={act.date}
                  onClick={() => setLightboxImg({ url: act.image || act.url, caption: act.title || act.caption })}
                />
              ))}
            </div>
          </div>
        );

      // 8. Contact Info Block
      case 'contact':
      case 'contact_info':
      case 'contact-info':
        return (
          <ContactInfoBlock
            key={block.id || idx}
            title={block.title}
            phones={block.phones || block.phone}
            emergencyPhone={block.emergencyPhone}
            days={block.days}
            timings={block.timings}
            email={block.email}
            location={block.location}
            note={block.note}
            variant={block.variant || 'card'}
          />
        );

      // 9. Research Publications
      case 'publications':
      case 'research':
        const pubList = block.publications || block.items || [];
        return (
          <div key={block.id || idx} className="detail-publications-section">
            {block.title && <h3 className="detail-block-title">{block.title}</h3>}
            {block.subtitle && <p className="detail-block-subtitle">{block.subtitle}</p>}
            <div className="detail-publications-list">
              {pubList.map((pub, pubIdx) => (
                <PublicationCard
                  key={pub.id || pubIdx}
                  thumbnail={pub.thumbnail || pub.image}
                  title={pub.title}
                  url={pub.url || pub.link}
                  authors={pub.authors}
                  journal={pub.journal}
                  year={pub.year || pub.date}
                  volume={pub.volume}
                  doi={pub.doi}
                  abstract={pub.abstract}
                />
              ))}
            </div>
          </div>
        );

      // 10. Programs / Clinical Courses
      case 'programs':
      case 'courses':
        const progList = block.programs || block.items || [];
        return (
          <div key={block.id || idx} className="detail-programs-section">
            {block.title && <h3 className="detail-block-title">{block.title}</h3>}
            {block.subtitle && <p className="detail-block-subtitle">{block.subtitle}</p>}
            <div className={`detail-programs-grid cols-${block.columns || 3}`}>
              {progList.map((prog, progIdx) => (
                <ProgramCard
                  key={prog.id || progIdx}
                  image={prog.image}
                  title={prog.title}
                  description={prog.description}
                  badge={prog.badge || prog.tag}
                  duration={prog.duration}
                  route={prog.route || prog.to}
                  isExternal={prog.isExternal}
                  externalUrl={prog.externalUrl || prog.url}
                />
              ))}
            </div>
          </div>
        );

      // 11. Custom React Render
      case 'custom':
        return (
          <div key={block.id || idx} className="detail-custom-block">
            {typeof block.render === 'function' ? block.render() : block.component}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flexible-detail-page ${className}`}>
      {/* Breadcrumbs & Actions Header */}
      <div className="detail-top-bar">
        <div className="detail-breadcrumbs">
          {onBack ? (
            <button type="button" onClick={onBack} className="detail-back-btn">
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <span 
              onClick={() => navigate('/')} 
              className="detail-crumb-link"
            >
              Home
            </span>
          )}

          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={14} className="detail-crumb-sep" />
              {crumb.to ? (
                <span onClick={() => navigate(crumb.to)} className="detail-crumb-link">
                  {crumb.label}
                </span>
              ) : crumb.href ? (
                <a href={crumb.href} className="detail-crumb-link">{crumb.label}</a>
              ) : (
                <span className="detail-crumb-active">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {showSharePrint && (
          <div className="detail-action-buttons">
            <button type="button" onClick={handleShare} className="detail-action-btn" title="Share Page">
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <button type="button" onClick={handlePrint} className="detail-action-btn" title="Print Document">
              <Printer size={16} />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>

      {/* Page Hero / Banner Header */}
      <div className="detail-hero-header">
        {category && <span className="detail-hero-category">{category}</span>}
        <h1 className="detail-hero-title">{title}</h1>
        {subtitle && <p className="detail-hero-subtitle">{subtitle}</p>}
      </div>

      {/* Hero Banner Image */}
      {bannerImage && (
        <div className="detail-hero-banner">
          <img src={bannerImage} alt={title} className="detail-hero-banner-img" />
        </div>
      )}

      {/* Main Layout (Content + Optional Sidebar) */}
      <div className={`detail-layout-container ${sidebarBlocks.length > 0 ? 'has-sidebar' : ''}`}>
        {/* Main Content Flow */}
        <main className="detail-main-content">
          {blocks.map((block, idx) => renderBlock(block, idx))}
        </main>

        {/* Sidebar (Optional) */}
        {sidebarBlocks.length > 0 && (
          <aside className="detail-sidebar">
            <div className="detail-sidebar-sticky">
              {sidebarBlocks.map((block, idx) => renderBlock(block, `sb_${idx}`))}
            </div>
          </aside>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="detail-lightbox-backdrop" onClick={() => setLightboxImg(null)}>
          <div className="detail-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="detail-lightbox-close" 
              onClick={() => setLightboxImg(null)}
            >
              <X size={20} />
            </button>
            <img src={lightboxImg.url} alt={lightboxImg.caption || 'Preview'} className="detail-lightbox-img" />
            {lightboxImg.caption && (
              <p className="detail-lightbox-caption">{lightboxImg.caption}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
