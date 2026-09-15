import React from 'react';
import './RichTextRenderer.css';

/**
 * Helper to resolve icon key to Material Symbols icon identifier
 */
export const resolveIconName = (key) => {
  if (!key) return 'check_circle';
  const clean = String(key).toLowerCase().trim().replace(/_/g, '-');
  const iconMap = {
    'shield-check': 'verified_user',
    'shield': 'verified_user',
    'verified': 'verified_user',
    'tent': 'campaign',
    'camp': 'campaign',
    'campaign': 'campaign',
    'users': 'groups',
    'groups': 'groups',
    'team': 'groups',
    'people': 'groups',
    'heart': 'favorite',
    'favorite': 'favorite',
    'care': 'favorite',
    'award': 'award_star',
    'award-star': 'award_star',
    'star': 'star',
    'medical-services': 'medical_services',
    'stethoscope': 'medical_services',
    'emergency': 'emergency',
    'hospital': 'local_hospital',
    'calendar': 'calendar_month',
    'schedule': 'schedule',
    'check-circle': 'check_circle',
    'check': 'check_circle'
  };
  return iconMap[clean] || clean.replace(/-/g, '_');
};

/**
 * Helper to parse and convert YouTube/Vimeo URLs to embeddable URLs
 */
export const getEmbedVideoUrl = (url) => {
  if (!url) return '';
  const trimmed = String(url).trim();

  // YouTube match: regular watch, short youtu.be, embed, or shorts
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
  }

  // Vimeo match
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return trimmed;
};

/**
 * Render TipTap text marks (e.g. bold, italic, underline, strike, link)
 */
const renderTextWithMarks = (textNode, key) => {
  let content = textNode.text || '';
  if (!textNode.marks || textNode.marks.length === 0) {
    return <React.Fragment key={key}>{content}</React.Fragment>;
  }

  let element = <React.Fragment key={key}>{content}</React.Fragment>;

  textNode.marks.forEach((mark, mIdx) => {
    if (mark.type === 'bold') {
      element = <strong key={`bold_${key}_${mIdx}`}>{element}</strong>;
    } else if (mark.type === 'italic') {
      element = <em key={`italic_${key}_${mIdx}`}>{element}</em>;
    } else if (mark.type === 'underline') {
      element = <u key={`u_${key}_${mIdx}`}>{element}</u>;
    } else if (mark.type === 'strike') {
      element = <s key={`strike_${key}_${mIdx}`}>{element}</s>;
    } else if (mark.type === 'link') {
      element = (
        <a
          key={`link_${key}_${mIdx}`}
          href={mark.attrs?.href || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#E8792B', textDecoration: 'underline' }}
        >
          {element}
        </a>
      );
    }
  });

  return element;
};

/**
 * Render an Image block
 */
const renderImageBlock = (node, index) => {
  const url = node.url || node.attrs?.url || node.attrs?.src || '';
  const caption = node.caption || node.attrs?.caption || '';
  const rawLayout = node.layout || node.attrs?.layout;
  const rawWidth = node.width || node.attrs?.width;
  const layout = rawLayout || (rawWidth && Number(rawWidth) >= 100 ? 'full' : 'right');
  const width = Number(rawWidth) || (layout === 'full' ? 100 : 40);

  if (!url) return null;

  const isFloated = layout === 'left' || layout === 'right';
  const figureStyle = isFloated
    ? {
        width: `${width}%`,
        maxWidth: `${width}%`,
        float: layout,
        marginRight: layout === 'left' ? '20px' : '0',
        marginLeft: layout === 'right' ? '20px' : '0',
        marginBottom: '0.85rem',
        marginTop: '0.25rem',
        display: 'block',
        clear: 'none',
      }
    : {
        width: '100%',
        maxWidth: '100%',
        clear: 'both',
        display: 'block',
        marginBottom: '1.25rem',
        marginTop: '0.75rem',
      };

  return (
    <figure
      key={`img_${index}`}
      className={`rich-renderer-image-wrap rich-renderer-image-${layout}`}
      style={figureStyle}
    >
      <img
        src={url}
        alt={caption || 'Department overview'}
        className="rich-renderer-image"
        loading="lazy"
        style={{
          width: '100%',
          height: 'auto',
          maxHeight: '420px',
          objectFit: 'cover',
          borderRadius: '14px',
          display: 'block',
        }}
      />
      {caption && (
        <figcaption className="rich-renderer-image-caption">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * Render a Video block
 */
const renderVideoBlock = (node, index) => {
  const url = node.url || node.attrs?.url || node.attrs?.src || '';
  const embedType = node.embedType || node.attrs?.embedType || (url.includes('youtu') || url.includes('vimeo') ? 'youtube' : 'upload');
  const badge = node.badge || node.attrs?.badge || null;
  const rawLayout = node.layout || node.attrs?.layout;
  const rawWidth = node.width || node.attrs?.width;
  const layout = rawLayout || (rawWidth && Number(rawWidth) >= 100 ? 'full' : 'right');
  const width = Number(rawWidth) || (layout === 'full' ? 100 : 40);

  if (!url) return null;

  const isIframe = embedType === 'youtube' || url.includes('youtu') || url.includes('vimeo');
  const embedUrl = isIframe ? getEmbedVideoUrl(url) : url;

  const isFloated = layout === 'left' || layout === 'right';
  const containerStyle = isFloated
    ? {
        width: `${width}%`,
        maxWidth: `${width}%`,
        float: layout,
        marginRight: layout === 'left' ? '20px' : '0',
        marginLeft: layout === 'right' ? '20px' : '0',
        marginBottom: '0.85rem',
        marginTop: '0.25rem',
        display: 'block',
        clear: 'none',
      }
    : {
        width: '100%',
        maxWidth: '100%',
        clear: 'both',
        display: 'block',
        marginBottom: '1.5rem',
        marginTop: '0.75rem',
      };

  return (
    <div
      key={`vid_${index}`}
      className={`rich-renderer-video-container rich-renderer-video-${layout}`}
      style={containerStyle}
    >
      {badge && (badge.text || badge.icon) && (
        <div className="rich-renderer-video-badge" title={badge.text}>
          <span className="material-symbols-outlined rich-renderer-video-badge-icon">
            {resolveIconName(badge.icon)}
          </span>
          {badge.text && <span className="rich-renderer-video-badge-text">{badge.text}</span>}
        </div>
      )}

      {isIframe ? (
        <div className="rich-renderer-video-iframe-wrap">
          <iframe
            src={embedUrl}
            title="Department Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rich-renderer-video-iframe"
          />
        </div>
      ) : (
        <video
          src={embedUrl}
          controls
          className="rich-renderer-video-native"
          playsInline
        >
          Your browser does not support HTML video.
        </video>
      )}
    </div>
  );
};

/**
 * Render an IconBadge block
 */
const renderIconBadgeBlock = (node, index) => {
  const icon = node.icon || node.attrs?.icon || 'check_circle';
  const text = node.text || node.attrs?.text || '';

  if (!text && !icon) return null;

  return (
    <div key={`badge_${index}`} className="rich-renderer-icon-badge">
      <div className="rich-renderer-icon-badge-avatar">
        <span className="material-symbols-outlined rich-renderer-icon-badge-icon">
          {resolveIconName(icon)}
        </span>
      </div>
      <div className="rich-renderer-icon-badge-text">
        {text}
      </div>
    </div>
  );
};

/**
 * Render a single TipTap AST node or Block Object recursively
 */
const renderNode = (node, index) => {
  if (!node) return null;

  // Handle new custom blocks
  if (node.type === 'image' || node.type === 'imageBlock') {
    return renderImageBlock(node, index);
  }

  if (node.type === 'video' || node.type === 'videoBlock') {
    return renderVideoBlock(node, index);
  }

  if (node.type === 'iconBadge' || node.type === 'iconBadgeBlock') {
    return renderIconBadgeBlock(node, index);
  }

  // Handle standard block array format or TipTap AST
  switch (node.type) {
    case 'text':
      return renderTextWithMarks(node, index);

    case 'paragraph': {
      // If block array format with direct node.text
      if (typeof node.text === 'string') {
        return (
          <p key={index} className="rich-renderer-p">
            {node.text}
          </p>
        );
      }
      const hasContent = Array.isArray(node.content) && node.content.length > 0;
      return (
        <p key={index} className="rich-renderer-p">
          {hasContent ? node.content.map(renderNode) : <br />}
        </p>
      );
    }

    case 'heading': {
      const level = node.level || node.attrs?.level || 2;
      // If block array format with direct node.text
      if (typeof node.text === 'string') {
        if (level === 2) return <h2 key={index} className="rich-renderer-h2">{node.text}</h2>;
        if (level === 3) return <h3 key={index} className="rich-renderer-h3">{node.text}</h3>;
        return <h4 key={index} className="rich-renderer-h4">{node.text}</h4>;
      }
      const content = Array.isArray(node.content) ? node.content.map(renderNode) : null;
      if (level === 2) {
        return <h2 key={index} className="rich-renderer-h2">{content}</h2>;
      }
      if (level === 3) {
        return <h3 key={index} className="rich-renderer-h3">{content}</h3>;
      }
      return <h4 key={index} className="rich-renderer-h4">{content}</h4>;
    }

    case 'bulletList': {
      // If block array format with items array
      if (Array.isArray(node.items)) {
        return (
          <ul key={index} className="rich-renderer-ul">
            {node.items.map((item, itmIdx) => (
              <li key={itmIdx} className="rich-renderer-li">
                {typeof item === 'string' ? item : (item.text || item.title || '')}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <ul key={index} className="rich-renderer-ul">
          {Array.isArray(node.content) && node.content.map(renderNode)}
        </ul>
      );
    }

    case 'orderedList': {
      return (
        <ol key={index} className="rich-renderer-ol" style={{ paddingLeft: '22px', margin: '0.85rem 0 1.25rem' }}>
          {Array.isArray(node.content) && node.content.map(renderNode)}
        </ol>
      );
    }

    case 'listItem': {
      return (
        <li key={index} className="rich-renderer-li">
          {Array.isArray(node.content) && node.content.map(renderNode)}
        </li>
      );
    }

    case 'blockquote': {
      return (
        <blockquote key={index} className="rich-renderer-blockquote" style={{ borderLeft: '3px solid #E8792B', paddingLeft: '16px', margin: '1rem 0', color: '#64748b', fontStyle: 'italic' }}>
          {Array.isArray(node.content) && node.content.map(renderNode)}
        </blockquote>
      );
    }

    case 'horizontalRule': {
      return <hr key={index} style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0', clear: 'both' }} />;
    }

    case 'hardBreak': {
      return <br key={index} />;
    }

    case 'doc':
      return (
        <React.Fragment key={index}>
          {Array.isArray(node.content) && node.content.map(renderNode)}
        </React.Fragment>
      );

    default:
      if (Array.isArray(node.content)) {
        return (
          <div key={index} className="rich-renderer-block">
            {node.content.map(renderNode)}
          </div>
        );
      }
      return null;
  }
};

/**
 * Reusable TipTap Rich Text Renderer
 * Accepts TipTap JSON doc object, Block Array, or fallback HTML string.
 * Adheres strictly to project typography and color design tokens (#132A4C navy, #E8792B orange).
 */
const RichTextRenderer = ({ content, className = '' }) => {
  if (!content) return null;

  // 1. If content is an Array of blocks
  if (Array.isArray(content) && content.length > 0) {
    return (
      <div className={`rich-text-renderer-root ${className}`}>
        {content.map(renderNode)}
      </div>
    );
  }

  // 2. If content is a TipTap JSON Doc object
  if (typeof content === 'object' && content !== null) {
    if (content.type === 'doc' && Array.isArray(content.content)) {
      return (
        <div className={`rich-text-renderer-root ${className}`}>
          {content.content.map(renderNode)}
        </div>
      );
    }
  }

  // 3. If content is a string / HTML / JSON-encoded string
  if (typeof content === 'string') {
    const trimmed = content.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed) {
          return <RichTextRenderer content={parsed} className={className} />;
        }
      } catch {
        // Fall back to HTML
      }
    }

    return (
      <div
        className={`rich-text-renderer-root ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return null;
};

export default RichTextRenderer;
