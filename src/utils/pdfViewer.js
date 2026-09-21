/**
 * Safely opens a PDF document in a new browser tab.
 * Converts Base64 Data URLs into Blob Object URLs so Chrome/Edge/Firefox
 * render the document natively in their built-in PDF viewer instead of
 * blocking top-level data URL navigation.
 */
export function openPdfDocument(pdfUrl, title = 'Statutory Compliance Document') {
  if (!pdfUrl) return;

  if (pdfUrl.startsWith('data:application/pdf')) {
    try {
      const base64Clean = pdfUrl.replace(/^data:application\/pdf;base64,/, '');
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

  window.open(pdfUrl, '_blank', 'noopener,noreferrer');
}
