import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useEditor, EditorContent, ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Node, mergeAttributes } from '@tiptap/core';
import { resolveIconName, getEmbedVideoUrl } from '../../RichTextRenderer/RichTextRenderer';
import './RichTextEditor.css';

export const BADGE_ICONS_LIST = [
  { key: 'shield-check', icon: 'verified_user', label: 'Shield / Accredited' },
  { key: 'tent', icon: 'campaign', label: 'Medical Camp / Outreach' },
  { key: 'users', icon: 'groups', label: 'Community / Panel' },
  { key: 'heart', icon: 'favorite', label: 'Compassionate Care' },
  { key: 'award', icon: 'award_star', label: 'Excellence Award' },
  { key: 'medical_services', icon: 'medical_services', label: 'Clinical Services' },
  { key: 'emergency', icon: 'emergency', label: '24/7 Emergency' },
  { key: 'calendar', icon: 'calendar_month', label: 'Schedule / Camps' },
  { key: 'check_circle', icon: 'check_circle', label: 'Quality Verified' },
];

/**
 * 1. TipTap Image Block Node View
 */
const ImageNodeView = ({ node, deleteNode }) => {
  const { url, caption, layout = 'full', width = 100 } = node.attrs;
  const isFloated = layout === 'left' || layout === 'right';

  const nodeStyle = isFloated
    ? {
        width: `${width}%`,
        maxWidth: `${width}%`,
        float: layout,
        marginRight: layout === 'left' ? '16px' : '0',
        marginLeft: layout === 'right' ? '16px' : '0',
        marginBottom: '10px'
      }
    : {
        width: '100%',
        clear: 'both'
      };

  return (
    <NodeViewWrapper
      className={`rich-editor-custom-node rich-editor-image-node rich-editor-image-${layout}`}
      style={nodeStyle}
    >
      <div className="rich-editor-node-card group">
        <div className="rich-editor-image-preview-wrap">
          <img src={url} alt={caption || 'Preview'} className="rich-editor-image-img" />
          <div className="rich-editor-image-badge-tag">
            <span>{layout === 'full' ? 'Full Width' : `Float ${layout.toUpperCase()} (${width}%)`}</span>
          </div>
          <button
            type="button"
            onClick={deleteNode}
            className="rich-editor-node-delete-btn"
            title="Remove image block"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
        {caption && (
          <div className="rich-editor-node-caption">
            <span className="material-symbols-outlined text-xs mr-1 text-slate-400">subtitles</span>
            <span className="truncate">{caption}</span>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

const ImageBlockNode = Node.create({
  name: 'imageBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      url: { default: '' },
      caption: { default: '' },
      layout: { default: 'full' },
      width: { default: 100 }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-block"]',
        getAttrs: dom => ({
          url: dom.getAttribute('data-url'),
          caption: dom.getAttribute('data-caption') || '',
          layout: dom.getAttribute('data-layout') || 'full',
          width: Number(dom.getAttribute('data-width')) || 100
        })
      },
      {
        tag: 'img',
        getAttrs: dom => ({
          url: dom.getAttribute('src'),
          caption: dom.getAttribute('alt') || '',
          layout: dom.getAttribute('data-layout') || 'full',
          width: Number(dom.getAttribute('data-width')) || 100
        })
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'image-block',
        'data-url': HTMLAttributes.url,
        'data-caption': HTMLAttributes.caption,
        'data-layout': HTMLAttributes.layout || 'full',
        'data-width': HTMLAttributes.width || 100
      })
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  }
});

/**
 * 2. TipTap Video Block Node View
 */
const VideoNodeView = ({ node, deleteNode }) => {
  const { url, embedType, badge, layout = 'full', width = 100 } = node.attrs;
  const isIframe = embedType === 'youtube' || url?.includes('youtu') || url?.includes('vimeo');
  const embedUrl = isIframe ? getEmbedVideoUrl(url) : url;
  const isFloated = layout === 'left' || layout === 'right';

  const nodeStyle = isFloated
    ? {
        width: `${width}%`,
        maxWidth: `${width}%`,
        float: layout,
        marginRight: layout === 'left' ? '16px' : '0',
        marginLeft: layout === 'right' ? '16px' : '0',
        marginBottom: '10px'
      }
    : {
        width: '100%',
        clear: 'both'
      };

  return (
    <NodeViewWrapper
      className={`rich-editor-custom-node rich-editor-video-node rich-editor-video-${layout}`}
      style={nodeStyle}
    >
      <div className="rich-editor-node-card group">
        <div className="rich-editor-video-preview-wrap">
          <div className="rich-editor-image-badge-tag">
            <span>{layout === 'full' ? 'Full Width' : `Float ${layout.toUpperCase()} (${width}%)`}</span>
          </div>

          {badge && (badge.text || badge.icon) && (
            <div className="rich-editor-video-badge-overlay">
              <span className="material-symbols-outlined text-xs text-amber-400">
                {resolveIconName(badge.icon)}
              </span>
              <span>{badge.text}</span>
            </div>
          )}

          <button
            type="button"
            onClick={deleteNode}
            className="rich-editor-node-delete-btn"
            title="Remove video block"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
          </button>

          {isIframe ? (
            <div className="rich-editor-video-iframe-aspect">
              <iframe
                src={embedUrl}
                title="Video Preview"
                className="rich-editor-video-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          ) : (
            <video src={embedUrl} controls className="rich-editor-video-native-el" />
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

const VideoBlockNode = Node.create({
  name: 'videoBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      url: { default: '' },
      embedType: { default: 'youtube' },
      badge: { default: null },
      layout: { default: 'full' },
      width: { default: 100 }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="video-block"]',
        getAttrs: dom => {
          let badge = null;
          try {
            const rawBadge = dom.getAttribute('data-badge');
            if (rawBadge) badge = JSON.parse(rawBadge);
          } catch { }
          return {
            url: dom.getAttribute('data-url'),
            embedType: dom.getAttribute('data-embed-type') || 'youtube',
            badge,
            layout: dom.getAttribute('data-layout') || 'full',
            width: Number(dom.getAttribute('data-width')) || 100
          };
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'video-block',
        'data-url': HTMLAttributes.url,
        'data-embed-type': HTMLAttributes.embedType,
        'data-badge': HTMLAttributes.badge ? JSON.stringify(HTMLAttributes.badge) : '',
        'data-layout': HTMLAttributes.layout || 'full',
        'data-width': HTMLAttributes.width || 100
      })
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(VideoNodeView);
  }
});

/**
 * 3. TipTap Icon Badge Block Node View
 */
const IconBadgeNodeView = ({ node, deleteNode }) => {
  const { icon, text } = node.attrs;

  return (
    <NodeViewWrapper className="rich-editor-custom-node rich-editor-icon-badge-node">
      <div className="rich-editor-icon-badge-card group">
        <div className="rich-editor-icon-badge-avatar">
          <span className="material-symbols-outlined text-lg text-amber-600">
            {resolveIconName(icon)}
          </span>
        </div>
        <div className="rich-editor-icon-badge-text">
          {text || 'Badge Callout Text'}
        </div>
        <button
          type="button"
          onClick={deleteNode}
          className="rich-editor-node-delete-btn-inline ml-auto"
          title="Remove icon badge block"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
        </button>
      </div>
    </NodeViewWrapper>
  );
};

const IconBadgeBlockNode = Node.create({
  name: 'iconBadgeBlock',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      icon: { default: 'verified_user' },
      text: { default: '' }
    };
  },
  parseHTML() {
    return [
      {
        tag: 'div[data-type="icon-badge-block"]',
        getAttrs: dom => ({
          icon: dom.getAttribute('data-icon') || 'verified_user',
          text: dom.getAttribute('data-text') || ''
        })
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'icon-badge-block',
        'data-icon': HTMLAttributes.icon,
        'data-text': HTMLAttributes.text
      })
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(IconBadgeNodeView);
  }
});

/**
 * Helper to normalize incoming value to standard TipTap Doc JSON
 */
const normalizeValueToDoc = (val) => {
  if (!val) {
    return { type: 'doc', content: [{ type: 'paragraph', content: [] }] };
  }

  // 1. If already TipTap Doc
  if (typeof val === 'object' && val.type === 'doc' && Array.isArray(val.content)) {
    const normalizedContent = val.content.map(node => {
      if (node.type === 'image' || node.type === 'imageBlock') {
        const layout = node.attrs?.layout || node.layout || 'full';
        const width = Number(node.attrs?.width || node.width) || (layout === 'full' ? 100 : 40);
        return {
          ...node,
          type: 'imageBlock',
          attrs: {
            ...node.attrs,
            layout,
            width
          }
        };
      }
      if (node.type === 'video' || node.type === 'videoBlock') {
        const layout = node.attrs?.layout || node.layout || 'full';
        const width = Number(node.attrs?.width || node.width) || (layout === 'full' ? 100 : 40);
        return {
          ...node,
          type: 'videoBlock',
          attrs: {
            ...node.attrs,
            layout,
            width
          }
        };
      }
      if (node.type === 'iconBadge') return { ...node, type: 'iconBadgeBlock' };
      return node;
    });
    return { ...val, content: normalizedContent };
  }

  // 2. If Array of block objects
  if (Array.isArray(val)) {
    const nodes = [];
    val.forEach(item => {
      if (!item) return;
      if (item.type === 'heading') {
        nodes.push({
          type: 'heading',
          attrs: { level: item.level || 2 },
          content: [{ type: 'text', text: item.text || '' }]
        });
      } else if (item.type === 'paragraph') {
        nodes.push({
          type: 'paragraph',
          content: item.text ? [{ type: 'text', text: item.text }] : []
        });
      } else if (item.type === 'bulletList') {
        const items = (item.items || []).map(li => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: typeof li === 'string' ? li : (li.text || '') }]
            }
          ]
        }));
        nodes.push({ type: 'bulletList', content: items });
      } else if (item.type === 'image' || item.type === 'imageBlock') {
        const layout = item.layout || item.attrs?.layout || 'full';
        const width = Number(item.width || item.attrs?.width) || (layout === 'full' ? 100 : 40);
        nodes.push({
          type: 'imageBlock',
          attrs: {
            url: item.url || item.attrs?.url || '',
            caption: item.caption || item.attrs?.caption || '',
            layout,
            width
          }
        });
      } else if (item.type === 'video' || item.type === 'videoBlock') {
        const layout = item.layout || item.attrs?.layout || 'full';
        const width = Number(item.width || item.attrs?.width) || (layout === 'full' ? 100 : 40);
        nodes.push({
          type: 'videoBlock',
          attrs: {
            url: item.url || item.attrs?.url || '',
            embedType: item.embedType || item.attrs?.embedType || 'youtube',
            badge: item.badge || item.attrs?.badge || null,
            layout,
            width
          }
        });
      } else if (item.type === 'iconBadge' || item.type === 'iconBadgeBlock') {
        nodes.push({
          type: 'iconBadgeBlock',
          attrs: { icon: item.icon || 'shield-check', text: item.text || '' }
        });
      }
    });

    return {
      type: 'doc',
      content: nodes.length > 0 ? nodes : [{ type: 'paragraph', content: [] }]
    };
  }

  // 3. If string (JSON or HTML)
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        const parsed = JSON.parse(trimmed);
        return normalizeValueToDoc(parsed);
      } catch { }
    }
  }

  return val;
};

/**
 * Reusable TipTap Rich Text Editor
 * Supports: Heading 2, Heading 3, Paragraph, Bullet List, Bold, Image, Video, and IconBadge.
 * Outputs TipTap JSON object via onChange(editor.getJSON())
 */
const RichTextEditor = ({
  value = null,
  onChange,
  placeholder = 'Write formatted content here...',
  minHeight = '150px',
  className = ''
}) => {
  // Modal states
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showIconBadgeModal, setShowIconBadgeModal] = useState(false);

  // Image Modal Form State
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageLayout, setImageLayout] = useState('full'); // 'full' | 'left' | 'right'
  const [imageWidth, setImageWidth] = useState(100);       // 25, 33, 40, 50, 60, 100
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Video Modal Form State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoEmbedType, setVideoEmbedType] = useState('youtube');
  const [videoLayout, setVideoLayout] = useState('full'); // 'full' | 'left' | 'right'
  const [videoWidth, setVideoWidth] = useState(100);       // 25, 33, 40, 50, 60, 100
  const [videoHasBadge, setVideoHasBadge] = useState(false);
  const [videoBadgeIcon, setVideoBadgeIcon] = useState('shield-check');
  const [videoBadgeText, setVideoBadgeText] = useState('');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Icon Badge Modal Form State
  const [badgeIcon, setBadgeIcon] = useState('tent');
  const [badgeText, setBadgeText] = useState('');

  // File input refs
  const imageFileInputRef = useRef(null);
  const videoFileInputRef = useRef(null);

  const initialContent = normalizeValueToDoc(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      ImageBlockNode,
      VideoBlockNode,
      IconBadgeBlockNode
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-prose-editor outline-none',
        style: `min-height: ${minHeight};`
      }
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onChange?.(json);
    }
  });

  // Sync external value updates
  useEffect(() => {
    if (!editor) return;

    if (!value) {
      const currentJson = editor.getJSON();
      if (currentJson.content && currentJson.content.length > 0 && currentJson.content[0].content) {
        editor.commands.setContent({ type: 'doc', content: [{ type: 'paragraph', content: [] }] }, { emitUpdate: false });
      }
      return;
    }

    const currentJsonStr = JSON.stringify(editor.getJSON());
    const normalized = normalizeValueToDoc(value);
    const incomingJsonStr = typeof normalized === 'object' ? JSON.stringify(normalized) : '';

    if (incomingJsonStr && incomingJsonStr !== currentJsonStr) {
      editor.commands.setContent(normalized, { emitUpdate: false });
    } else if (typeof value === 'string' && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const isAnyModalOpen = showImageModal || showVideoModal || showIconBadgeModal;

  // Lock background scroll when modal is open and handle escape key
  useEffect(() => {
    if (!isAnyModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
        setShowVideoModal(false);
        setShowIconBadgeModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isAnyModalOpen]);

  // Handle generic media file upload to Supabase / Backend endpoint
  const uploadMediaFile = async (file, isVideo = false) => {
    if (!file) return null;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result;
        try {
          // Try services upload endpoint, fallback to specialities upload
          let res = await fetch('http://localhost:5000/api/services/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              serviceName: 'rich-media',
              fileName: file.name,
              base64Data
            })
          });

          if (!res.ok) {
            res = await fetch('http://localhost:5000/api/specialities/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                specialityName: 'rich-media',
                fileName: file.name,
                base64Data
              })
            });
          }

          const data = await res.json();
          if (data && data.url) {
            resolve(data.url);
          } else {
            resolve(base64Data);
          }
        } catch (err) {
          console.warn('Upload fallback to local base64:', err);
          resolve(base64Data);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Image Upload Trigger
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadedUrl = await uploadMediaFile(file, false);
      if (uploadedUrl) {
        setImageUrl(uploadedUrl);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Video File Upload Trigger
  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingVideo(true);
    try {
      const uploadedUrl = await uploadMediaFile(file, true);
      if (uploadedUrl) {
        setVideoUrl(uploadedUrl);
        setVideoEmbedType('upload');
      }
    } catch (err) {
      console.error('Video upload failed:', err);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  // Insert Image into TipTap
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const finalLayout = imageLayout || 'full';
    const finalWidth = finalLayout === 'full' ? 100 : (Number(imageWidth) || 40);

    editor?.chain().focus().insertContent({
      type: 'imageBlock',
      attrs: {
        url: imageUrl.trim(),
        caption: imageCaption.trim(),
        layout: finalLayout,
        width: finalWidth
      }
    }).run();

    setImageUrl('');
    setImageCaption('');
    setImageLayout('full');
    setImageWidth(100);
    setShowImageModal(false);
  };

  // Insert Video into TipTap
  const handleInsertVideo = () => {
    if (!videoUrl.trim()) return;

    const isYoutube = videoEmbedType === 'youtube' || videoUrl.includes('youtu') || videoUrl.includes('vimeo');
    const badge = videoHasBadge && (videoBadgeText.trim() || videoBadgeIcon)
      ? { icon: videoBadgeIcon, text: videoBadgeText.trim() }
      : null;
    const finalLayout = videoLayout || 'full';
    const finalWidth = finalLayout === 'full' ? 100 : (Number(videoWidth) || 40);

    editor?.chain().focus().insertContent({
      type: 'videoBlock',
      attrs: {
        url: videoUrl.trim(),
        embedType: isYoutube ? 'youtube' : 'upload',
        badge,
        layout: finalLayout,
        width: finalWidth
      }
    }).run();

    setVideoUrl('');
    setVideoBadgeText('');
    setVideoHasBadge(false);
    setVideoLayout('full');
    setVideoWidth(100);
    setShowVideoModal(false);
  };

  // Insert Icon Badge into TipTap
  const handleInsertIconBadge = () => {
    if (!badgeText.trim() && !badgeIcon) return;

    editor?.chain().focus().insertContent({
      type: 'iconBadgeBlock',
      attrs: {
        icon: badgeIcon,
        text: badgeText.trim()
      }
    }).run();

    setBadgeText('');
    setShowIconBadgeModal(false);
  };

  if (!editor) {
    return (
      <div className="rich-text-editor-container" style={{ minHeight }}>
        <div className="p-4 text-xs text-slate-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className={`rich-text-editor-container ${className}`}>
      {/* TipTap Toolbar - Includes H2, H3, Paragraph, Bold, Bullet List, Image, Video, Icon Badge */}
      <div className="rich-text-toolbar" role="toolbar" aria-label="Text & Media Formatting">

        {/* Headings & Paragraph Group */}
        <div className="rich-text-toolbar-group">
          {/* Heading 2 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`rich-text-btn ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Heading 2 (H2)"
          >
            <span className="font-bold text-xs">H2</span>
          </button>

          {/* Heading 3 */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`rich-text-btn ${editor.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Heading 3 (H3)"
          >
            <span className="font-bold text-xs">H3</span>
          </button>

          {/* Paragraph */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`rich-text-btn ${editor.isActive('paragraph') ? 'active' : ''}`}
            title="Normal Paragraph"
          >
            <span className="material-symbols-outlined text-sm">segment</span>
            <span>Paragraph</span>
          </button>
        </div>

        <div className="rich-text-toolbar-divider" />

        {/* Formatting & Lists Group */}
        <div className="rich-text-toolbar-group">
          {/* Bold */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rich-text-btn ${editor.isActive('bold') ? 'active' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <span className="font-black text-xs">B</span>
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rich-text-btn ${editor.isActive('bulletList') ? 'active' : ''}`}
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-sm">format_list_bulleted</span>
            <span>Bullet List</span>
          </button>
        </div>

        <div className="rich-text-toolbar-divider" />

        {/* Media & Callout Blocks Group */}
        <div className="rich-text-toolbar-group">
          {/* 1. Image Button */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="rich-text-btn rich-text-btn-media"
            title="Insert Image (Upload or URL)"
          >
            <span className="material-symbols-outlined text-sm text-blue-600">image</span>
            <span>Image</span>
          </button>

          {/* 2. Video Button */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="rich-text-btn rich-text-btn-media"
            title="Insert Video (Upload or YouTube with optional badge)"
          >
            <span className="material-symbols-outlined text-sm text-rose-600">smart_display</span>
            <span>Video</span>
          </button>

          {/* 3. Icon Badge Button */}
          <button
            type="button"
            onClick={() => setShowIconBadgeModal(true)}
            className="rich-text-btn rich-text-btn-media"
            title="Insert Icon Badge Callout Box"
          >
            <span className="material-symbols-outlined text-sm text-amber-600">verified_user</span>
            <span>Icon Badge</span>
          </button>
        </div>

        {/* TipTap Badge */}
        <div className="rich-text-toolbar-badge ml-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Rich Media TipTap</span>
        </div>
      </div>

      {/* Editor Surface Canvas */}
      <div className="rich-text-content-area" onClick={() => editor.commands.focus()}>
        <EditorContent editor={editor} />
      </div>

      {/* =========================================================================
          MODAL 1: INSERT IMAGE
         ========================================================================= */}
      {showImageModal && typeof document !== 'undefined' && createPortal(
        <div
          className="rich-editor-modal-backdrop"
          onClick={() => setShowImageModal(false)}
          onWheel={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="rich-editor-modal max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="rich-editor-modal-header">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined text-base">image</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-none">Insert Image Block</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">Configure placement, width & caption</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="rich-editor-modal-body space-y-3.5">
              {/* Upload to Supabase Bucket */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Upload Image File (Supabase Storage)
                </label>
                <div
                  onClick={() => imageFileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/50 hover:bg-blue-50 p-3.5 rounded-xl text-center cursor-pointer transition-all"
                >
                  <input
                    ref={imageFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                  <span className="material-symbols-outlined text-2xl text-blue-600 mb-0.5">
                    {isUploadingImage ? 'sync' : 'cloud_upload'}
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {isUploadingImage ? 'Uploading to Supabase Storage...' : 'Click to Upload Speciality / Service Image'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP or GIF</p>
                </div>
              </div>

              {/* Or Direct URL */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Or Image URL (Auto-filled on upload)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>

              {/* Layout Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Image Layout & Placement
                </label>
                <div className="rich-editor-layout-grid">
                  <button
                    type="button"
                    onClick={() => {
                      setImageLayout('full');
                      setImageWidth(100);
                    }}
                    className={`rich-editor-layout-card ${imageLayout === 'full' ? 'active-blue' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">view_stream</span>
                    <span className="rich-editor-layout-card-title">Full Width</span>
                    <span className="rich-editor-layout-card-desc">Stacked (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageLayout('left');
                      if (imageWidth === 100) setImageWidth(40);
                    }}
                    className={`rich-editor-layout-card ${imageLayout === 'left' ? 'active-blue' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">align_horizontal_left</span>
                    <span className="rich-editor-layout-card-title">Float Left</span>
                    <span className="rich-editor-layout-card-desc">Text on Right</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageLayout('right');
                      if (imageWidth === 100) setImageWidth(40);
                    }}
                    className={`rich-editor-layout-card ${imageLayout === 'right' ? 'active-blue' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">align_horizontal_right</span>
                    <span className="rich-editor-layout-card-title">Float Right</span>
                    <span className="rich-editor-layout-card-desc">Text on Left</span>
                  </button>
                </div>
              </div>

              {/* Image Size (Percentage) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Image Size (Width)
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                    {imageLayout === 'full' ? '100% (Full Width)' : `${imageWidth}%`}
                  </span>
                </div>

                {imageLayout === 'full' ? (
                  <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Full Width spans 100% width automatically. Select Float Left or Float Right to customize size.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      {[25, 33, 40, 50, 60].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setImageWidth(pct)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${imageWidth === pct
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">20%</span>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={imageWidth}
                        onChange={e => setImageWidth(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">80%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={e => setImageCaption(e.target.value)}
                  placeholder="e.g., Advanced Diagnostic Unit"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              {/* Live Layout Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Layout Preview
                  </label>
                  <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full font-medium">
                    {imageLayout === 'full' ? 'Full Width (100%)' : `Float ${imageLayout} (${imageWidth}%)`}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[100px]">
                  {imageUrl ? (
                    <div>
                      {imageLayout === 'full' ? (
                        <div>
                          <img
                            src={imageUrl}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-xs"
                          />
                          {imageCaption && (
                            <p className="text-[11px] text-slate-500 text-center mt-1 italic">
                              {imageCaption}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Following text blocks and paragraphs will start cleanly below this full-width image.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              width: `${imageWidth}%`,
                              float: imageLayout,
                              marginRight: imageLayout === 'left' ? '12px' : '0',
                              marginLeft: imageLayout === 'right' ? '12px' : '0',
                              marginBottom: '6px'
                            }}
                          >
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="w-full h-24 object-cover rounded-lg border border-slate-200 shadow-xs"
                            />
                            {imageCaption && (
                              <p className="text-[10px] text-slate-500 text-center mt-0.5 italic truncate">
                                {imageCaption}
                              </p>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            This simulated text demonstrates how subsequent paragraphs wrap smoothly around the {imageLayout}-floated image. The text flows on the {imageLayout === 'left' ? 'right' : 'left'} side dynamically.
                          </p>
                          <div style={{ clear: 'both' }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-slate-400 text-xs italic">
                      Upload or enter an image URL above to see live layout preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rich-editor-modal-footer">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim() || isUploadingImage}
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
                <span>Insert Image</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 2: INSERT VIDEO
         ========================================================================= */}
      {showVideoModal && typeof document !== 'undefined' && createPortal(
        <div
          className="rich-editor-modal-backdrop"
          onClick={() => setShowVideoModal(false)}
          onWheel={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="rich-editor-modal" onClick={e => e.stopPropagation()}>
            <div className="rich-editor-modal-header">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600">smart_display</span>
                <h3 className="font-bold text-slate-800 text-sm">Insert Video Block</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="rich-editor-modal-body space-y-3.5">
              {/* Embed Type Selector */}
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setVideoEmbedType('youtube')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${videoEmbedType === 'youtube'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  YouTube / Vimeo Link
                </button>
                <button
                  type="button"
                  onClick={() => setVideoEmbedType('upload')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${videoEmbedType === 'upload'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                    }`}
                >
                  Upload Video File
                </button>
              </div>

              {videoEmbedType === 'youtube' ? (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    YouTube or Vimeo URL
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-rose-500 focus:bg-white transition-all font-medium text-slate-800"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports standard watch URLs, short youtu.be links, and Vimeo links.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Upload Video File (Supabase Storage)
                  </label>
                  <div
                    onClick={() => videoFileInputRef.current?.click()}
                    className="border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/50 hover:bg-rose-50 p-4 rounded-xl text-center cursor-pointer transition-all"
                  >
                    <input
                      ref={videoFileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                    />
                    <span className="material-symbols-outlined text-2xl text-rose-600 mb-1">
                      {isUploadingVideo ? 'sync' : 'video_file'}
                    </span>
                    <p className="text-xs font-bold text-slate-700">
                      {isUploadingVideo ? 'Uploading Video...' : 'Click to Upload MP4 / WebM Video'}
                    </p>
                  </div>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="Video URL auto-filled on upload..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 mt-2 outline-none font-medium text-slate-800"
                  />
                </div>
              )}

              {/* Layout Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Video Layout & Placement
                </label>
                <div className="rich-editor-layout-grid">
                  <button
                    type="button"
                    onClick={() => {
                      setVideoLayout('full');
                      setVideoWidth(100);
                    }}
                    className={`rich-editor-layout-card ${videoLayout === 'full' ? 'active-rose' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">view_stream</span>
                    <span className="rich-editor-layout-card-title">Full Width</span>
                    <span className="rich-editor-layout-card-desc">Stacked (100%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoLayout('left');
                      if (videoWidth === 100) setVideoWidth(40);
                    }}
                    className={`rich-editor-layout-card ${videoLayout === 'left' ? 'active-rose' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">align_horizontal_left</span>
                    <span className="rich-editor-layout-card-title">Float Left</span>
                    <span className="rich-editor-layout-card-desc">Text on Right</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setVideoLayout('right');
                      if (videoWidth === 100) setVideoWidth(40);
                    }}
                    className={`rich-editor-layout-card ${videoLayout === 'right' ? 'active-rose' : ''}`}
                  >
                    <span className="material-symbols-outlined rich-editor-layout-card-icon">align_horizontal_right</span>
                    <span className="rich-editor-layout-card-title">Float Right</span>
                    <span className="rich-editor-layout-card-desc">Text on Left</span>
                  </button>
                </div>
              </div>

              {/* Video Size (Percentage) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Video Size (Width)
                  </label>
                  <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                    {videoLayout === 'full' ? '100% (Full Width)' : `${videoWidth}%`}
                  </span>
                </div>

                {videoLayout === 'full' ? (
                  <p className="text-[11px] text-slate-400 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    Full Width spans 100% width automatically. Select Float Left or Float Right to customize size.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      {[25, 33, 40, 50, 60].map(pct => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setVideoWidth(pct)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${videoWidth === pct
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">20%</span>
                      <input
                        type="range"
                        min="20"
                        max="80"
                        step="5"
                        value={videoWidth}
                        onChange={e => setVideoWidth(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                      />
                      <span className="text-[10px] text-slate-400 font-bold">80%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Overlay Badge Section */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={videoHasBadge}
                    onChange={e => setVideoHasBadge(e.target.checked)}
                    className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-700">
                    Add Overlay Badge on Video (Top-Left Pill)
                  </span>
                </label>

                {videoHasBadge && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <div className="col-span-1">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Icon</label>
                      <select
                        value={videoBadgeIcon}
                        onChange={e => setVideoBadgeIcon(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-1.5 outline-none font-medium text-slate-800"
                      >
                        {BADGE_ICONS_LIST.map(bi => (
                          <option key={bi.key} value={bi.key}>
                            {bi.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Badge Text</label>
                      <input
                        type="text"
                        value={videoBadgeText}
                        onChange={e => setVideoBadgeText(e.target.value)}
                        placeholder="e.g. From an accredited hospital"
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none font-medium text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Live Video Layout Preview
                  </label>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-full font-medium">
                    {videoLayout === 'full' ? 'Full Width (100%)' : `Float ${videoLayout} (${videoWidth}%)`}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[100px]">
                  {videoUrl ? (
                    <div>
                      {videoLayout === 'full' ? (
                        <div>
                          <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center">
                            <span className="material-symbols-outlined text-3xl text-rose-500">play_circle</span>
                            {videoHasBadge && (videoBadgeText || videoBadgeIcon) && (
                              <div className="absolute top-2 left-2 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                                <span className="material-symbols-outlined text-xs text-amber-400">
                                  {resolveIconName(videoBadgeIcon)}
                                </span>
                                <span>{videoBadgeText || 'Accredited'}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                            Following text blocks and paragraphs will start cleanly below this full-width video.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              width: `${videoWidth}%`,
                              float: videoLayout,
                              marginRight: videoLayout === 'left' ? '12px' : '0',
                              marginLeft: videoLayout === 'right' ? '12px' : '0',
                              marginBottom: '6px'
                            }}
                          >
                            <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video flex items-center justify-center">
                              <span className="material-symbols-outlined text-2xl text-rose-500">play_circle</span>
                              {videoHasBadge && (videoBadgeText || videoBadgeIcon) && (
                                <div className="absolute top-1.5 left-1.5 bg-slate-900/90 text-white text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                                  <span className="material-symbols-outlined text-[10px] text-amber-400">
                                    {resolveIconName(videoBadgeIcon)}
                                  </span>
                                  <span className="truncate max-w-[120px]">{videoBadgeText || 'Accredited'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            This simulated text demonstrates how subsequent paragraphs wrap smoothly around the {videoLayout}-floated video. The text flows on the {videoLayout === 'left' ? 'right' : 'left'} side dynamically.
                          </p>
                          <div style={{ clear: 'both' }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-24 flex items-center justify-center text-slate-400 text-xs italic">
                      Upload or enter a video link above to see live preview
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rich-editor-modal-footer">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertVideo}
                disabled={!videoUrl.trim() || isUploadingVideo}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">video_camera_front</span>
                <span>Insert Video</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* =========================================================================
          MODAL 3: INSERT ICON BADGE CALLOUT
         ========================================================================= */}
      {showIconBadgeModal && typeof document !== 'undefined' && createPortal(
        <div
          className="rich-editor-modal-backdrop"
          onClick={() => setShowIconBadgeModal(false)}
          onWheel={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
        >
          <div className="rich-editor-modal" onClick={e => e.stopPropagation()}>
            <div className="rich-editor-modal-header">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600">verified_user</span>
                <h3 className="font-bold text-slate-800 text-sm">Insert Icon Badge Callout</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIconBadgeModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="rich-editor-modal-body space-y-3.5">
              {/* Icon Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Choose Badge Icon
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BADGE_ICONS_LIST.map(bi => (
                    <button
                      key={bi.key}
                      type="button"
                      onClick={() => setBadgeIcon(bi.key)}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${badgeIcon === bi.key
                        ? 'border-amber-500 bg-amber-50/80 text-amber-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                    >
                      <span className="material-symbols-outlined text-base text-amber-600">
                        {resolveIconName(bi.key)}
                      </span>
                      <span className="text-[11px] truncate">{bi.label.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Callout Box Text
                </label>
                <textarea
                  rows={2}
                  value={badgeText}
                  onChange={e => setBadgeText(e.target.value)}
                  placeholder="e.g. Regularly Conducts Senior Citizens Health Check Up Camps"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-amber-500 focus:bg-white transition-all font-medium text-slate-800"
                />
              </div>

              {/* Live Preview */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Live Preview
                </label>
                <div className="p-3 bg-slate-50 border border-slate-200 border-l-4 border-l-amber-500 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white shadow-xs border border-amber-200 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base text-amber-600">
                      {resolveIconName(badgeIcon)}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {badgeText || 'Regularly Conducts Senior Citizens Health Check Up Camps'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rich-editor-modal-footer">
              <button
                type="button"
                onClick={() => setShowIconBadgeModal(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertIconBadge}
                disabled={!badgeText.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50 flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">add_box</span>
                <span>Insert Icon Badge</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default RichTextEditor;
