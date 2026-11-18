import { API_BASE_URL } from '../services/api.js';

/**
 * Resolves image paths dynamically.
 * - Handles relative paths (/images/..., /uploads/...)
 * - Normalizes legacy hardcoded localhost URLs stored in database
 * - Fallbacks gracefully to a reliable image
 */
export function resolveImageUrl(imagePath, fallback = '/images/gift_logo.jpeg') {
  if (!imagePath || typeof imagePath !== 'string') {
    return fallback;
  }

  let trimmed = imagePath.trim();
  if (!trimmed) {
    return fallback;
  }

  // Normalize legacy localhost:5002 or 127.0.0.1:5002 URLs stored in database
  if (trimmed.includes('localhost:5002/') || trimmed.includes('127.0.0.1:5002/')) {
    trimmed = trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1):5002/, '');
  }

  // If path is an external CDN or data URI, return as-is
  if (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('data:')
  ) {
    return trimmed;
  }

  // If path starts with /images/ or images/ (served directly from public/images/)
  if (trimmed.startsWith('/images/')) {
    return trimmed;
  }
  if (trimmed.startsWith('images/')) {
    return `/${trimmed}`;
  }

  // For /uploads/ or other server-relative assets, prepend API_BASE_URL if configured
  const normalizedPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  if (API_BASE_URL && normalizedPath.startsWith('/uploads/')) {
    return `${API_BASE_URL}${normalizedPath}`;
  }

  return normalizedPath;
}

/**
 * Safely parses and normalizes product gallery images.
 * Handles:
 * - Array of URL strings: ['url1', 'url2']
 * - JSON string of URLs: '["url1", "url2"]'
 * - Single image URL string: 'url1'
 * - Comma-separated strings: 'url1, url2'
 * - Missing images field (falls back to product.image)
 * - Returns a clean array of up to 7 trimmed image URLs with cover image first
 */
export function parseGalleryImages(productOrImages, fallbackCover = '') {
  let raw = productOrImages;
  let cover = typeof fallbackCover === 'string' ? fallbackCover.trim() : '';

  if (productOrImages && typeof productOrImages === 'object' && !Array.isArray(productOrImages)) {
    raw = productOrImages.images;
    if (typeof productOrImages.image === 'string' && productOrImages.image.trim()) {
      cover = productOrImages.image.trim();
    }
  }

  let list = [];

  if (raw) {
    if (Array.isArray(raw)) {
      list = raw;
    } else if (typeof raw === 'string') {
      const trimmed = raw.trim();
      if (trimmed) {
        try {
          let parsed = JSON.parse(trimmed);
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {
              parsed = [parsed];
            }
          }
          if (Array.isArray(parsed)) {
            list = parsed;
          } else if (typeof parsed === 'string' && parsed.trim()) {
            list = [parsed.trim()];
          }
        } catch {
          if (trimmed.includes(',')) {
            list = trimmed.split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean);
          } else {
            list = [trimmed.replace(/^["']|["']$/g, '')];
          }
        }
      }
    }
  }

  // Filter valid string URLs
  list = list
    .filter((img) => img && typeof img === 'string')
    .map((img) => img.trim())
    .filter((img) => img.length > 0);

  // If cover image exists and is not at index 0, place it at index 0
  if (cover) {
    const existingIndex = list.indexOf(cover);
    if (existingIndex > 0) {
      list.splice(existingIndex, 1);
      list.unshift(cover);
    } else if (existingIndex === -1) {
      list.unshift(cover);
    }
  }

  // Deduplicate while preserving order and limit to 7 images (1 cover + 6 gallery)
  return Array.from(new Set(list)).slice(0, 7);
}

export default resolveImageUrl;

