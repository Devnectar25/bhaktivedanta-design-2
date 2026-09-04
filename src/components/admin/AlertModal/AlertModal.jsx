import React, { useEffect, useState } from 'react';

/**
 * AlertModal
 * A clean, modern error / alert dialog matching the admin design system.
 * 
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 * - title: string (e.g., "Category Limit Reached")
 * - message: string or ReactNode
 * - itemName?: string (optional highlighted badge text)
 * - buttonText?: string (defaults to "Understood")
 * - type?: 'error' | 'warning' | 'info' | 'success' (defaults to 'error')
 */
const AlertModal = ({
  isOpen,
  onClose,
  title = 'Notification',
  message = '',
  itemName,
  buttonText = 'Understood',
  type = 'error'
}) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout;
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
      timeout = setTimeout(() => setActive(true), 10);
    } else {
      setActive(false);
      timeout = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 200);
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClose = () => {
    setActive(false);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  if (!mounted && !isOpen) return null;

  const getTheme = () => {
    switch (type) {
      case 'warning':
        return {
          stripe: 'bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500',
          iconBg: 'bg-amber-50 border-amber-200 text-amber-600',
          icon: 'warning',
          btnBg: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
        };
      case 'info':
        return {
          stripe: 'bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500',
          iconBg: 'bg-blue-50 border-blue-200 text-blue-600',
          icon: 'info',
          btnBg: 'bg-[#1e3a8a] hover:bg-blue-900 text-white shadow-blue-500/20'
        };
      case 'success':
        return {
          stripe: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500',
          iconBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
          icon: 'check_circle',
          btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
        };
      case 'error':
      default:
        return {
          stripe: 'bg-gradient-to-r from-rose-500 via-red-500 to-orange-500',
          iconBg: 'bg-rose-50 border-rose-200 text-rose-600',
          icon: 'error',
          btnBg: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
        };
    }
  };

  const theme = getTheme();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 select-none ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: 99999,
        transition: 'opacity 200ms ease-out'
      }}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
    >
      {/* Blurred Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all duration-200 ease-out ${
          active ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent stripe */}
        <div className={`h-1.5 w-full ${theme.stripe}`} />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
          aria-label="Close dialog"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="p-6 pt-7 text-center">
          {/* Icon Badge */}
          <div className={`mx-auto mb-4 w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner ${theme.iconBg}`}>
            <span className="material-symbols-outlined text-3xl animate-bounce">
              {theme.icon}
            </span>
          </div>

          {/* Title */}
          <h3
            id="alert-modal-title"
            className="text-lg font-bold text-slate-900 mb-2 leading-tight"
          >
            {title}
          </h3>

          {/* Optional item badge */}
          {itemName && (
            <div className="inline-block max-w-full px-3 py-1 mb-2.5 bg-slate-100 border border-slate-200/70 rounded-lg text-xs font-semibold text-slate-800 truncate">
              {itemName}
            </div>
          )}

          {/* Message */}
          <p className="text-xs text-slate-600 font-medium leading-relaxed px-2">
            {message}
          </p>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleClose}
              className={`w-full py-2.5 px-6 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 ${theme.btnBg}`}
            >
              <span>{buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
