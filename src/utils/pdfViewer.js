import { API_BASE_URL } from './api';

/**
 * Safely opens a PDF document in a new browser tab.
 * Converts Base64 Data URLs into Blob Object URLs so Chrome/Edge/Firefox
 * render the document natively in their built-in PDF viewer instead of
 * blocking top-level data URL navigation.
 */
export function openPdfDocument(pdfUrl, title = 'Statutory Compliance Document') {
  if (!pdfUrl) return;

  let targetUrl = pdfUrl;

  if (targetUrl.startsWith('data:application/pdf')) {
    try {
      const base64Clean = targetUrl.replace(/^data:application\/pdf;base64,/, '');
      const byteCharacters = atob(base64Clean);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const win = window.open(blobUrl, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      return;
    } catch (err) {
      console.error('Error creating PDF blob URL:', err);
    }
  }

  // Resolve relative /api/ endpoints or replace hardcoded localhost in production
  if (targetUrl.startsWith('/api/')) {
    const baseUrlClean = (API_BASE_URL || '').replace(/\/api\/?$/, '');
    targetUrl = `${baseUrlClean}${targetUrl}`;
  } else if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    if (targetUrl.includes('localhost:5000') || targetUrl.includes('127.0.0.1:5000')) {
      const baseUrlClean = (API_BASE_URL || '').replace(/\/api\/?$/, '');
      targetUrl = targetUrl.replace(/^http:\/\/(localhost|127\.0\.0\.1):5000/, baseUrlClean);
    }
  }

  window.open(targetUrl, '_blank', 'noopener,noreferrer');
}
