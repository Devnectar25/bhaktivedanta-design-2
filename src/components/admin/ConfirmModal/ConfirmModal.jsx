import React, { useEffect, useState } from 'react';

/**
 * ConfirmModal
 * A clean, modern confirmation dialog matching the admin design system.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - onConfirm: () => void
 * - title: string (e.g., "Delete Speciality?", "Delete Category?")
 * - message: string or ReactNode
 * - itemName?: string (optional highlighted name of item being deleted)
 * - confirmText?: string (defaults to "Delete")
 * - cancelText?: string (defaults to "Cancel")
 * - isDestructive?: boolean (defaults to true)
 * - icon?: string (material symbol icon name or custom element)
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  itemName,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  icon = 'delete_forever'
}) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
      // Trigger animation on next tick
      timeout = setTimeout(() => setActive(true), 10);
    } else {
      setActive(false);
      timeout = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 200); // match transition duration
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCancel = () => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleConfirm = () => {
    setActive(false);
    setTimeout(() => {
      onConfirm();
    }, 150);
  };

  if (!mounted && !isOpen) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 select-none ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: 99999,
        transition: 'opacity 200ms ease-out'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Blurred Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={handleCancel}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 ease-out ${
          active ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top accent highlight */}
        <div className={`h-1.5 w-full ${isDestructive ? 'bg-gradient-to-r from-red-500 via-rose-500 to-amber-500' : 'bg-gradient-to-r from-[#1e3a8a] to-blue-500'}`} />

        {/* Close Button */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 pt-7 text-center">
          {/* Top Warning/Delete Icon Badge */}
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-red-50 border border-red-100/80 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-3xl text-red-500 animate-pulse">
              {icon}
            </span>
          </div>

          {/* Title */}
          <h3
            id="confirm-modal-title"
            className="text-lg font-bold text-slate-900 mb-2 leading-tight"
          >
            {title}
          </h3>

          {/* Optional item highlighted name */}
          {itemName && (
            <div className="inline-block max-w-full px-3 py-1 mb-2.5 bg-slate-100 border border-slate-200/70 rounded-lg text-xs font-semibold text-slate-800 truncate">
              {itemName}
            </div>
          )}

          {/* Message */}
          <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${
                isDestructive
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                  : 'bg-[#1e3a8a] hover:bg-blue-900 shadow-blue-500/20'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isDestructive ? 'delete' : 'check'}
              </span>
              <span>{confirmText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
