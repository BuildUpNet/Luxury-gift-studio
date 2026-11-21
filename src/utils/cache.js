/**
 * LocalStorage cache helper with Stale-While-Revalidate pattern.
 * Saves cached data along with a timestamp, returns stale data instantly,
 * and allows background refreshing.
 */

export const getCachedData = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && 'data' in parsed) {
      return parsed.data;
    }
    return parsed;
  } catch (err) {
    console.warn(`[cache] Failed to read ${key} from localStorage:`, err);
    return fallback;
  }
};

export const setCachedData = (key, data) => {
  try {
    const payload = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (err) {
    console.warn(`[cache] Failed to write ${key} to localStorage:`, err);
  }
};

export const clearCache = (key) => {
  try {
    if (key) {
      localStorage.removeItem(key);
    } else {
      Object.values(CACHE_KEYS).forEach((k) => localStorage.removeItem(k));
    }
  } catch (err) {
    console.warn('[cache] Failed to clear cache:', err);
  }
};

export const CACHE_KEYS = {
  CATEGORIES: 'tgs_cached_categories',
  OCCASIONS: 'tgs_cached_occasions',
  STORE_SETTINGS: 'tgs_cached_store_settings',
  HERO_SLIDES: 'tgs_cached_hero_slides',
  GIFTING_BANNER: 'tgs_cached_gifting_banner',
  TESTIMONIALS: 'tgs_cached_testimonials'
};
