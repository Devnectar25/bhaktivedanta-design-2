import { addAppError } from './api';

let isLogging = false;

/**
 * Report an exception to the Application Errors system (Backend API + LocalStorage fallback)
 */
export async function logException(error, source = 'Client Runtime Exception', level = 'Error', endpoint = '') {
  // Prevent recursive error logging loop if addAppError fails
  if (isLogging) return;
  isLogging = true;

  try {
    const message = error?.message || (typeof error === 'string' ? error : 'Unhandled application exception');
    const stack = error?.stack || (error?.details ? String(error.details) : '');

    const errorItem = {
      id: `ERR-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString(),
      level: level,
      source: source,
      message: message,
      endpoint: endpoint || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      status: 'Investigating',
      details: stack ? `Stacktrace: ${stack.substring(0, 500)}` : `URL: ${typeof window !== 'undefined' ? window.location.href : ''}`
    };

    // Send exception to database table first via API POST request
    await addAppError(errorItem).catch(() => {});
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('admin_data_updated'));
    }
  } catch (err) {
    console.error('Failed to report application error to database:', err);
  } finally {
    isLogging = false;
  }
}

/**
 * Global window event listeners for uncaught runtime errors and promise rejections
 */
export function initGlobalErrorHandler() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    if (event?.message) {
      logException(event.error || event.message, 'Global Runtime Exception', 'Error');
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    logException(reason || 'Unhandled Promise Rejection', 'Unhandled Promise Rejection', 'Error');
  });
}
