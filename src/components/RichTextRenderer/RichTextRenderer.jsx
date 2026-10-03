import React from 'react';
import { AccordionItemRenderer } from '../SectionRenderer/SectionRenderer';
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
  const rawUrl = node.url || node.attrs?.url || node.attrs?.src || '';
  const url = normalizeImageUrl(rawUrl);
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

export const LEGACY_IMAGE_BASE_URL = 'https://www.bhaktivedantahospital.com';

/**
 * Normalize an image URL:
 * - Preserves absolute URLs (http://, https://, data:, blob:).
 * - Normalizes root-relative legacy paths (e.g. starting with `/images/` or `images/` or `/`)
 *   against the verified legacy base origin.
 */
export const normalizeImageUrl = (src) => {
  if (!src || typeof src !== 'string') return src;
  const trimmed = src.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }
  if (trimmed.startsWith('/images/')) {
    return `${LEGACY_IMAGE_BASE_URL}${trimmed}`;
  }
  if (trimmed.startsWith('images/')) {
    return `${LEGACY_IMAGE_BASE_URL}/${trimmed}`;
  }
  if (trimmed.startsWith('/')) {
    return `${LEGACY_IMAGE_BASE_URL}${trimmed}`;
  }
  return trimmed;
};

/**
 * Normalizes all <img> elements inside a DOM container
 */
export const normalizeImageElements = (containerEl) => {
  if (!containerEl) return;
  const imgElements = containerEl.querySelectorAll('img');
  imgElements.forEach((img) => {
    const src = img.getAttribute('src');
    if (src) {
      const normalized = normalizeImageUrl(src);
      if (normalized !== src) {
        img.setAttribute('src', normalized);
      }
    }
  });
};

/**
 * Helper to generically remove empty <li> elements when their effective text/content is whitespace-only.
 * Preserves <li> items containing media, widgets, inputs, or images.
 */
export const cleanEmptyListItems = (containerEl) => {
  if (!containerEl) return;
  const listItems = containerEl.querySelectorAll('li');
  listItems.forEach((li) => {
    // Retain list items that have media, inputs, or interactive elements
    const hasMedia = li.querySelector(
      'img, svg, iframe, video, audio, canvas, object, embed, input, select, textarea, button'
    );
    if (hasMedia) return;

    // Check effective text content (stripping spaces, &nbsp;, zero-width characters)
    const effectiveText = (li.textContent || '').replace(/[\s\u00A0\u200B\uFEFF]+/g, '');
    if (effectiveText.length === 0) {
      li.remove();
    }
  });
};

/**
 * Identify if a DOM element represents an accordion item across legacy patterns.
 */
export const isAccordionItem = (node) => {
  if (!node || node.nodeType !== 1 /* ELEMENT_NODE */) return false;
  const tagName = node.tagName.toLowerCase();
  if (tagName === 'details') return true;

  const classList = node.classList;
  if (
    classList.contains('toggle') ||
    classList.contains('accordion-item') ||
    classList.contains('custom-accordion-item')
  ) {
    return true;
  }

  // Generic heuristic for custom containers with header + content
  const hasHeader = Boolean(
    node.querySelector(
      '.toggle-title, .toggle-header, .accordion-header, .accordion-title, .custom-accordion-header, button.accordion-button, .accordion-button, label'
    )
  );
  const hasContent = Boolean(
    node.querySelector(
      '.toggle-content, .accordion-content, .accordion-body, .custom-accordion-content, .card-body, .accordion-collapse, .content'
    )
  );

  if (hasHeader && hasContent) {
    // Ensure this node is an individual item, not the parent container of multiple items
    const nestedItems = node.querySelectorAll('.toggle, .accordion-item, .custom-accordion-item, details');
    if (nestedItems.length === 0) {
      return true;
    }
  }

  return false;
};

/**
 * Extract title and body HTML from an accordion element.
 */
export const extractAccordionItem = (node) => {
  if (!node || node.nodeType !== 1) return null;
  const tagName = node.tagName.toLowerCase();

  // 1. HTML5 details element
  if (tagName === 'details') {
    const summaryEl = node.querySelector('summary');
    const title = summaryEl ? summaryEl.textContent.trim() : 'Details';
    const clone = node.cloneNode(true);
    const cloneSummary = clone.querySelector('summary');
    if (cloneSummary) cloneSummary.remove();
    normalizeImageElements(clone);
    cleanEmptyListItems(clone);
    const bodyHtml = clone.innerHTML.trim();
    if (!title && !bodyHtml) return null;
    return {
      title: title || 'Details',
      content: bodyHtml
    };
  }

  // 2. Title Extraction
  const titleSelectors = [
    '.toggle-title',
    'button.accordion-button',
    '.accordion-button',
    '.accordion-title',
    '.custom-accordion-header',
    '.accordion-header',
    '.toggle-header',
    'label',
    'h1, h2, h3, h4, h5, h6'
  ];

  let titleEl = null;
  for (const sel of titleSelectors) {
    const found = node.querySelector(sel);
    if (found) {
      titleEl = found;
      break;
    }
  }

  let title = '';
  if (titleEl) {
    const clone = titleEl.cloneNode(true);
    clone.querySelectorAll('.toggle-icon, .accordion-icon, .accord-icon, i, svg, input, [aria-hidden="true"]').forEach((i) => i.remove());
    title = clone.textContent.trim().replace(/^[\s+−\-–—]+\s*/, '').trim();
  }

  // 3. Content Extraction
  const contentSelectors = [
    '.toggle-content',
    '.accordion-body',
    '.custom-accordion-content',
    '.card-body',
    '.accordion-content',
    '.accordion-collapse',
    '.content'
  ];

  let contentEl = null;
  for (const sel of contentSelectors) {
    const found = node.querySelector(sel);
    if (found) {
      contentEl = found;
      break;
    }
  }

  let bodyHtml = '';
  if (contentEl) {
    // If contentEl is .accordion-collapse or has an inner body container, pick the inner target
    const innerBody = contentEl.querySelector('.card-body, .accordion-body, .accordion-content, .toggle-content');
    const target = innerBody || contentEl;
    const clone = target.cloneNode(true);
    clone.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((el) => el.remove());
    normalizeImageElements(clone);
    cleanEmptyListItems(clone);
    bodyHtml = clone.innerHTML.trim();
  } else {
    // Fallback: clone item and exclude title, headers, inputs, icons
    const clone = node.cloneNode(true);
    if (titleEl) {
      clone.querySelectorAll(titleSelectors.join(', ')).forEach((el) => el.remove());
    }
    clone.querySelectorAll('input[type="checkbox"], input[type="radio"], .toggle-icon, .accordion-icon, .accord-icon').forEach((el) => el.remove());
    normalizeImageElements(clone);
    cleanEmptyListItems(clone);
    bodyHtml = clone.innerHTML.trim();
  }

  // Prevent rendering orphaned/broken empty items
  if (!title && !bodyHtml) {
    return null;
  }

  return {
    title: title || 'Details',
    content: bodyHtml
  };
};

/**
 * Extract photo gallery categories and images from legacy nanogallery containers.
 */
export const extractNanoGallery = (containerEl) => {
  const nanoEl = containerEl.id === 'nanogallery2' ? containerEl : (containerEl.querySelector('#nanogallery2') || containerEl);
  const links = Array.from(nanoEl.querySelectorAll('a'));
  const categories = [];
  let currentCategory = null;

  links.forEach((a) => {
    const href = (a.getAttribute('href') || '').trim();
    const text = (a.textContent || '').trim();

    if (text && (!href || href === '#' || href === 'javascript:void(0)')) {
      currentCategory = {
        title: text,
        images: []
      };
      categories.push(currentCategory);
    } else if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/') || href.endsWith('.jpg') || href.endsWith('.png') || href.endsWith('.jpeg'))) {
      const fullUrl = normalizeImageUrl(href);
      if (!currentCategory) {
        currentCategory = {
          title: 'Photo Gallery',
          images: []
        };
        categories.push(currentCategory);
      }
      currentCategory.images.push(fullUrl);
    }
  });

  return categories.filter((c) => c.images.length > 0 || c.title);
};

/**
 * Convert HTML DOM tree into React elements, transforming legacy accordions
 * (.toggle, .accordion-item, .custom-accordion-item, <details>, etc.)
 * into interactive AccordionItemRenderer components while preserving all other rich text.
 */
const domNodeToReact = (node, key) => {
  if (!node) return null;

  // 1. Text node
  if (node.nodeType === 3 /* Node.TEXT_NODE */) {
    return node.textContent;
  }

  // 2. Element node
  if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
    const tagName = node.tagName.toLowerCase();
    const classList = node.classList;

    // Remove legacy mobile-only tab headers or accord-title
    if (classList.contains('phshow') || classList.contains('accord-title')) {
      return null;
    }

    // Remove empty divider lines
    if (classList.contains('line2') && !node.textContent.trim()) {
      return null;
    }

    // Check if this element is a nanogallery or pc_gal container
    if (node.id === 'nanogallery2' || classList.contains('pc_gal') || node.querySelector('#nanogallery2')) {
      const galleryCats = extractNanoGallery(node);
      if (galleryCats.length > 0) {
        return (
          <div key={key} className="nanogallery-root">
            {galleryCats.map((cat, catIdx) => (
              <div key={catIdx} className="nanogallery-category-section">
                {cat.title && <h3 className="nanogallery-category-title">{cat.title}</h3>}
                <div className="nanogallery-grid">
                  {cat.images.map((imgUrl, imgIdx) => (
                    <div key={imgIdx} className="nanogallery-item">
                      <a href={imgUrl} target="_blank" rel="noopener noreferrer" className="nanogallery-link">
                        <img src={imgUrl} alt={`${cat.title || 'Facility'} ${imgIdx + 1}`} loading="lazy" className="nanogallery-img" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }
    }

    // Check if this element is an Accordion / Toggle item
    if (isAccordionItem(node)) {
      const itemData = extractAccordionItem(node);
      if (!itemData) return null;

      return (
        <AccordionItemRenderer
          key={key}
          item={{
            id: node.id || `acc-${key}`,
            title: itemData.title,
            content: itemData.content
          }}
        />
      );
    }

    // Check if this element contains any accordion descendant
    const hasNestedAccordion = Boolean(
      node.querySelector('.toggle, details, .accordion-item, .custom-accordion-item, label, .accordion-button') ||
      classList.contains('accordion') ||
      classList.contains('neuro-section')
    );

    if (hasNestedAccordion) {
      // Render container and recursively process children
      const children = Array.from(node.childNodes)
        .map((child, idx) => domNodeToReact(child, `${key}_${idx}`))
        .filter(Boolean);

      const props = { key };
      if (node.id) props.id = node.id;
      if (node.className) props.className = node.className;

      return React.createElement(tagName, props, children);
    }

    // If NO accordion inside this element, normalize images, clean empty li's and render intact outerHTML
    normalizeImageElements(node);
    cleanEmptyListItems(node);
    return (
      <div
        key={key}
        style={{ display: 'contents' }}
        dangerouslySetInnerHTML={{ __html: node.outerHTML }}
      />
    );
  }

  return null;
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

    // If string contains accordion markup, legacy markers, lists, OR img elements
    const hasAccordionMarkup =
      /(?:class=["'][^"']*\b(?:toggle|accordion-item|custom-accordion-item|accordion|neuro-section)\b|<details\b|<summary\b)/i.test(
        content
      );
    const hasLegacyOrListOrImgMarkup =
      /class=["'][^"']*(?:phshow|accord-title|line2|pc_gal)/i.test(content) ||
      /id=["']nanogallery2["']/i.test(content) ||
      /<li\b|<img\b/i.test(content);

    if ((hasAccordionMarkup || hasLegacyOrListOrImgMarkup) && typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');

        doc.querySelectorAll('.phshow, .accord-title').forEach((el) => el.remove());
        doc.querySelectorAll('.line2').forEach((el) => {
          if (!el.textContent.trim()) el.remove();
        });
        normalizeImageElements(doc.body);
        cleanEmptyListItems(doc.body);

        const elements = Array.from(doc.body.childNodes)
          .map((child, idx) => domNodeToReact(child, `root_${idx}`))
          .filter(Boolean);

        return (
          <div className={`rich-text-renderer-root ${className}`}>
            {elements}
          </div>
        );
      } catch (e) {
        console.warn('Error parsing HTML accordions / images:', e);
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



