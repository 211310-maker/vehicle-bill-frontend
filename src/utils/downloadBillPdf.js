// If axios is missing, run: npm install axios
import axios from 'axios';

const DEFAULT_BASE_URL = 'https://vehicle-bill-backend-1.onrender.com';

const decodeRfc5987Value = (value) => {
  try {
    return decodeURIComponent(value.replace(/^UTF-8''/i, ''));
  } catch (err) {
    console.error('Error decoding RFC5987 filename', err);
    return value;
  }
};

const getFilenameFromContentDisposition = (header, fallback) => {
  if (!header) return fallback;

  const parts = header.split(';').map((part) => part.trim());

  // Prefer RFC5987 filename* value when present
  const filenameStar = parts.find((part) => part.toLowerCase().startsWith('filename*='));
  if (filenameStar) {
    const value = filenameStar.split('=')[1];
    if (value) {
      return decodeRfc5987Value(value.replace(/\"/g, '').replace(/'/g, '%27')) || fallback;
    }
  }

  const filenamePart = parts.find((part) => part.toLowerCase().startsWith('filename='));
  if (filenamePart) {
    const value = filenamePart.substring('filename='.length).trim();
    return value.replace(/(^\"|\"$)/g, '') || fallback;
  }

  return fallback;
};

export async function downloadBillPdf(id, opts = {}) {
  const {
    baseUrl = DEFAULT_BASE_URL,
    token,
    withCredentials = false,
    fallbackFilename = `bill-${id}.pdf`,
  } = opts;

  const sanitizedBase = baseUrl.replace(/\/$/, '');
  const url = `${sanitizedBase}/bill/${id}/pdf`;

  try {
    const response = await axios.get(url, {
      responseType: 'blob',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      withCredentials,
    });

    const filename = getFilenameFromContentDisposition(
      response.headers?.['content-disposition'],
      fallbackFilename
    );

    // Create a Blob from the PDF data
    const blob = new Blob([response.data], {
      type: response.headers?.['content-type'] || 'application/pdf',
    });

    // Generate a temporary object URL for the Blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create an anchor element to trigger the download (works across browsers)
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link); // Append to body for Firefox support
    link.click(); // Programmatically trigger the download
    document.body.removeChild(link);

    // Release the object URL to avoid memory leaks
    window.URL.revokeObjectURL(blobUrl);

    return { ok: true, filename };
  } catch (error) {
    console.error('Failed to download bill PDF', error);
    return { ok: false, error };
  }
}

export default downloadBillPdf;
