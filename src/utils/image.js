import { API_BASE_URL } from '../services/api';

/**
 * Resolves image paths dynamically.
 * - If image starts with 'http://' or 'https://' or 'data:', returns as-is.
 * - If image starts with '/images/' or relative, prepends the backend server origin.
 */
export function resolveImageUrl(imagePath, fallback = '/the-gift-studio-logo.svg') {
  if (!imagePath || typeof imagePath !== 'string') {
    return fallback;
  }

  const trimmed = imagePath.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // Prepend API_BASE_URL if relative server path
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export default resolveImageUrl;

