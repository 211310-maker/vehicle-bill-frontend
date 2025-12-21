// npm install axios (if not already installed)
import axios from "axios";

/**
 * Attempt to parse a filename from a Content-Disposition header.
 * Supports RFC5987 encoded filenames (filename*=UTF-8'') and standard filename= patterns.
 */
function parseFilenameFromContentDisposition(headerValue) {
  if (!headerValue) return null;

  // Handle filename*="UTF-8''encoded%20name.pdf"
  const filenameStarMatch = headerValue.match(/filename\*\s*=\s*([^;]+)/i);
  if (filenameStarMatch) {
    const value = filenameStarMatch[1].trim();
    const withoutQuotes = value.replace(/^"|"$/g, "");
    const parts = withoutQuotes.split("''");
    if (parts.length === 2) {
      try {
        return decodeURIComponent(parts[1]);
      } catch (err) {
        // If decoding fails, fall back to raw value without UTF-8 prefix
        return parts[1];
      }
    }
    // If it wasn't in the expected UTF-8'' format, strip potential UTF-8 prefix and quotes
    return withoutQuotes.replace(/^UTF-8''/, "");
  }

  // Handle filename="name.pdf" or filename=name.pdf
  const filenameMatch = headerValue.match(/filename\s*=\s*("?)([^";]+)\1/i);
  if (filenameMatch) {
    return filenameMatch[2];
  }

  return null;
}

/**
 * Download a bill PDF from the backend and trigger a browser download.
 *
 * @param {Object} options
 * @param {string} [options.id] - Bill id used to build the URL when fullUrl is not provided.
 * @param {string} [options.fullUrl] - Optional full URL that overrides baseUrl/id building.
 * @param {string} [options.token] - Optional bearer token for Authorization header.
 * @param {string} [options.baseUrl] - Base URL for backend (default https://vehicle-bill-backend-1.onrender.com).
 * @param {string} [options.fallbackFilename] - Fallback filename when header is missing.
 * @returns {Promise<{ok: true, filename: string} | {ok: false, error: string}>}
 */
export async function downloadBillPdf({
  id,
  fullUrl,
  token,
  baseUrl = "https://vehicle-bill-backend-1.onrender.com",
  fallbackFilename,
} = {}) {
  try {
    if (!fullUrl && !id) {
      throw new Error("Either fullUrl or id must be provided");
    }

    // Build the request URL from provided params.
    const trimmedBase = baseUrl.replace(/\/$/, "");
    const url = fullUrl || `${trimmedBase}/bill/${id}/pdf`;

    // Configure axios request to receive binary data and pass auth header when provided.
    const axiosConfig = {
      method: "GET",
      url,
      responseType: "blob",
      withCredentials: false, // Explicitly disable credentials; update if your backend requires cookies.
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    };

    const response = await axios(axiosConfig);

    // Attempt to read filename from Content-Disposition header (CORS-exposed on backend).
    const contentDisposition =
      response.headers["content-disposition"] || response.headers["Content-Disposition"];
    const filename =
      parseFilenameFromContentDisposition(contentDisposition) ||
      fallbackFilename ||
      (id ? `bill-${id}.pdf` : "bill.pdf");

    // Create blob URL and programmatically trigger download. Append to body for Firefox compatibility.
    const blob = new Blob([response.data], { type: "application/pdf" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);

    return { ok: true, filename };
  } catch (error) {
    console.error("downloadBillPdf error:", error);
    return { ok: false, error: error?.message || String(error) };
  }
}
