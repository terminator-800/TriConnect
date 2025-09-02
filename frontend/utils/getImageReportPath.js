const BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Returns the full URL for a file path stored in DB (e.g., "reports/23/file.png")
 * Assumes the backend serves files from `/uploads`.
 * @param {string} filePath - Relative path from DB (e.g., "reports/23/file.png").
 * @returns {string}
 */
export const getImageReportPath = (filePath) => {
  if (!filePath) return '';
  
  const normalized = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${BASE_URL}/uploads${normalized}`;
};
