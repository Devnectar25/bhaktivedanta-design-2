import React, { useRef, useEffect, useState, useCallback } from 'react';
import './RichTextEditor.css';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Write overview description here... Normal spaces and paragraphs are fully supported.',
  minHeight = '180px'
}) => {
  const editorRef = useRef(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const isUpdatingRef = useRef(false);

  // Sync external value changes to contentEditable DOM without breaking active typing
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      // Only update if value is meaningfully different and not during direct user input
      if (!isUpdatingRef.current && value !== currentHtml) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Check active formatting state under cursor
  const updateToolbarState = useCallback(() => {
    try {
      setIsBoldActive(document.queryCommandState('bold'));
      setIsItalicActive(document.queryCommandState('italic'));
      setIsUnderlineActive(document.queryCommandState('underline'));
    } catch {
      // ignore
    }
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    isUpdatingRef.current = true;
    const html = editorRef.current.innerHTML;
    onChange?.(html);
    updateToolbarState();
    // Allow React state cycle to settle
    setTimeout(() => {
      isUpdatingRef.current = false;
    }, 50);
  };

  const executeCommand = (command, valueArg = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, valueArg);
    handleInput();
    updateToolbarState();
  };

  const handleBold = (e) => {
    e?.preventDefault();
    executeCommand('bold');
  };

  const handleItalic = (e) => {
    e?.preventDefault();
    executeCommand('italic');
  };

  const handleUnderline = (e) => {
    e?.preventDefault();
    executeCommand('underline');
  };

  const handleNewParagraph = (e) => {
    e?.preventDefault();
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      
      // Use standard paragraph insertion
      const success = document.execCommand('insertParagraph', false, null);
      if (!success) {
        const p = document.createElement('p');
        p.innerHTML = '<br>';
        range.insertNode(p);
        range.setStart(p, 0);
        range.setEnd(p, 0);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } else {
      executeCommand('insertParagraph');
    }

    handleInput();
    updateToolbarState();
  };

  const handleInsertBulletList = (e) => {
    e?.preventDefault();
    executeCommand('insertUnorderedList');
  };

  const handleKeyDown = (e) => {
    // Enable Ctrl+B or Cmd+B for Bold
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      handleBold();
      return;
    }
    // Enable Ctrl+I or Cmd+I for Italic
    if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      handleItalic();
      return;
    }
    // Enable Ctrl+U or Cmd+U for Underline
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      handleUnderline();
      return;
    }
    // Handle Enter to create clean paragraphs
    if (e.key === 'Enter' && !e.shiftKey) {
      // Normal enter works with default contenteditable behavior
      setTimeout(handleInput, 0);
    }
  };

  return (
    <div className="rich-text-editor-container">
      {/* Live WYSIWYG Toolbar */}
      <div className="rich-text-toolbar">
        <div className="rich-text-toolbar-group">
          <button
            type="button"
            onMouseDown={handleBold}
            className={`rich-text-btn ${isBoldActive ? 'active' : ''}`}
            title="Bold (Ctrl+B) - Make selected text bold or start typing bold"
          >
            <span className="material-symbols-outlined text-[16px]">format_bold</span>
            <span className="font-bold text-xs">Bold</span>
          </button>

          <button
            type="button"
            onMouseDown={handleItalic}
            className={`rich-text-btn ${isItalicActive ? 'active' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <span className="material-symbols-outlined text-[16px]">format_italic</span>
            <span className="text-xs">Italic</span>
          </button>

          <button
            type="button"
            onMouseDown={handleUnderline}
            className={`rich-text-btn ${isUnderlineActive ? 'active' : ''}`}
            title="Underline (Ctrl+U)"
          >
            <span className="material-symbols-outlined text-[16px]">format_underlined</span>
            <span className="text-xs">Underline</span>
          </button>
        </div>

        <div className="rich-text-toolbar-divider" />

        <div className="rich-text-toolbar-group">
          <button
            type="button"
            onMouseDown={handleNewParagraph}
            className="rich-text-btn rich-text-btn-accent"
            title="Insert New Paragraph / Move Cursor"
          >
            <span className="material-symbols-outlined text-[16px]">segment</span>
            <span className="text-xs font-semibold">New Paragraph</span>
          </button>

          <button
            type="button"
            onMouseDown={handleInsertBulletList}
            className="rich-text-btn"
            title="Bullet List"
          >
            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
            <span className="text-xs">List</span>
          </button>
        </div>

        <div className="rich-text-toolbar-badge">
          <span className="material-symbols-outlined text-[13px] text-emerald-600">verified</span>
          <span>Live Rich Text</span>
        </div>
      </div>

      {/* Editable Live Preview Canvas */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="rich-text-canvas"
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={handleInput}
        onKeyUp={updateToolbarState}
        onMouseUp={updateToolbarState}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default RichTextEditor;
