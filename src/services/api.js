// API Base URL dynamically resolved from environment variable with fallback
export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || (typeof process !== 'undefined' && process.env?.VITE_API_URL) || (typeof import.meta !== 'undefined' && import.meta.env?.DEV ? 'http://localhost:5002' : '');

// Standardized API client with centralized error and status handling
export async function apiClient(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  // If token is stored, automatically attach Bearer auth header unless overridden
  const token = localStorage.getItem('giftstudio_admin_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData, delete Content-Type so browser sets correct multipart boundaries
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // Handle Unauthorized (401)
  if (response.status === 401) {
    if (url.includes('/api/admin') && !url.includes('/login')) {
      localStorage.removeItem('giftstudio_admin_token');
      localStorage.removeItem('giftstudio_admin_user');
    }
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { success: response.ok, message: response.statusText };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

// Full API endpoints map
export const API_ENDPOINTS = {
  // Categories
  CATEGORIES: '/api/categories',
  CATEGORIES_BY_ID: (id) => `/api/categories/${id}`,
  CATEGORIES_PRODUCTS: (id) => `/api/categories/${id}/products`,
  CATEGORIES_UPLOAD_IMAGE: '/api/categories/upload-image',

  // Products
  PRODUCTS: '/api/products',
  PRODUCTS_BY_ID: (id) => `/api/products/${id}`,

  // Upload
  UPLOAD: '/api/upload',
  UPLOAD_MULTIPLE: '/api/upload-multiple',

  // Admin Auth
  ADMIN_LOGIN: '/api/admin/login',
  ADMIN_REGISTER: '/api/admin/register',
  ADMIN_ME: '/api/admin/me',

  // Contact Us
  CONTACT: '/api/contact',

  // Gifting Banner & Inquiries
  GIFTING_BANNER: '/api/gifting-banner',
  ADMIN_GIFTING_BANNER: '/api/admin/gifting-banner',
  GIFTING_INQUIRIES: '/api/gifting-inquiries',
  ADMIN_GIFTING_INQUIRIES: '/api/admin/gifting-inquiries',
  ADMIN_GIFTING_INQUIRY_STATUS: (id) => `/api/admin/gifting-inquiries/${id}/status`,
  ADMIN_GIFTING_INQUIRY_BY_ID: (id) => `/api/admin/gifting-inquiries/${id}`,

  // Testimonials
  TESTIMONIALS: '/api/testimonials',
  TESTIMONIALS_BY_ID: (id) => `/api/testimonials/${id}`,

  // Store Settings (Social links, contact info)
  SETTINGS: '/api/settings',

  // Hero Slides
  HERO_SLIDES: '/api/hero-slides',
  HERO_SLIDE_BY_ID: (id) => `/api/hero-slides/${id}`,
  HERO_SLIDES_REORDER: '/api/hero-slides/reorder',

  // Newsletter Subscription
  SUBSCRIBE: '/api/subscribe',

  // Occasions
  OCCASIONS: '/api/occasions',
  OCCASIONS_BY_ID: (id) => `/api/occasions/${id}`,
  OCCASIONS_ASSIGN_PRODUCTS: (id) => `/api/occasions/${id}/assign-products`
};

// Convenient API service wrappers
export const apiService = {
  // Hero Slides
  getHeroSlides: () => apiClient(API_ENDPOINTS.HERO_SLIDES),
  getHeroSlideById: (id) => apiClient(API_ENDPOINTS.HERO_SLIDE_BY_ID(id)),
  createHeroSlide: (data) => apiClient(API_ENDPOINTS.HERO_SLIDES, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateHeroSlide: (id, data) => apiClient(API_ENDPOINTS.HERO_SLIDE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteHeroSlide: (id) => apiClient(API_ENDPOINTS.HERO_SLIDE_BY_ID(id), {
    method: 'DELETE'
  }),
  reorderHeroSlides: (order) => apiClient(API_ENDPOINTS.HERO_SLIDES_REORDER, {
    method: 'POST',
    body: JSON.stringify({ order })
  }),

  // Store Settings
  getSettings: () => apiClient(API_ENDPOINTS.SETTINGS),
  updateSettings: (data) => apiClient(API_ENDPOINTS.SETTINGS, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Testimonials
  getTestimonials: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.minRating) searchParams.append('minRating', params.minRating);
    const queryString = searchParams.toString();
    return apiClient(`${API_ENDPOINTS.TESTIMONIALS}${queryString ? `?${queryString}` : ''}`);
  },
  getTestimonialById: (id) => apiClient(API_ENDPOINTS.TESTIMONIALS_BY_ID(id)),
  createTestimonial: (data) => apiClient(API_ENDPOINTS.TESTIMONIALS, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateTestimonial: (id, data) => apiClient(API_ENDPOINTS.TESTIMONIALS_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteTestimonial: (id) => apiClient(API_ENDPOINTS.TESTIMONIALS_BY_ID(id), {
    method: 'DELETE'
  }),

  // Gifting Banner
  getGiftingBanner: () => apiClient(API_ENDPOINTS.GIFTING_BANNER),
  updateGiftingBanner: (body) => apiClient(API_ENDPOINTS.ADMIN_GIFTING_BANNER, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),

  // Gifting Inquiries
  submitGiftingInquiry: (data) => apiClient(API_ENDPOINTS.GIFTING_INQUIRIES, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getAdminGiftingInquiries: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.append('search', params.search);
    if (params.status) searchParams.append('status', params.status);
    if (params.gifting_type) searchParams.append('gifting_type', params.gifting_type);
    const queryString = searchParams.toString();
    return apiClient(`${API_ENDPOINTS.ADMIN_GIFTING_INQUIRIES}${queryString ? `?${queryString}` : ''}`);
  },
  updateGiftingInquiryStatus: (id, status, notes) => apiClient(API_ENDPOINTS.ADMIN_GIFTING_INQUIRY_STATUS(id), {
    method: 'PATCH',
    body: JSON.stringify({ status, notes })
  }),
  deleteGiftingInquiry: (id) => apiClient(API_ENDPOINTS.ADMIN_GIFTING_INQUIRY_BY_ID(id), {
    method: 'DELETE'
  }),

  // Categories
  getCategories: () => apiClient(API_ENDPOINTS.CATEGORIES),
  getCategoryById: (id) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(id)),
  getCategoryBySlug: (slug) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(slug)),
  getCategoryProducts: (idOrSlug) => apiClient(API_ENDPOINTS.CATEGORIES_PRODUCTS(idOrSlug)),
  createCategory: (catData) => apiClient(API_ENDPOINTS.CATEGORIES, { method: 'POST', body: JSON.stringify(catData) }),
  updateCategory: (id, catData) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(id), { method: 'PUT', body: JSON.stringify(catData) }),
  deleteCategory: (id) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(id), { method: 'DELETE' }),
  uploadCategoryImage: (formData) => apiClient(API_ENDPOINTS.CATEGORIES_UPLOAD_IMAGE, { method: 'POST', body: formData }),

  // Products
  getProducts: (category) => apiClient(category ? `${API_ENDPOINTS.PRODUCTS}?category=${encodeURIComponent(category)}` : API_ENDPOINTS.PRODUCTS),
  getProductById: (id) => apiClient(API_ENDPOINTS.PRODUCTS_BY_ID(id)),
  createProduct: (productData) => apiClient(API_ENDPOINTS.PRODUCTS, { method: 'POST', body: JSON.stringify(productData) }),
  updateProduct: (id, productData) => apiClient(API_ENDPOINTS.PRODUCTS_BY_ID(id), { method: 'PUT', body: JSON.stringify(productData) }),
  deleteProduct: (id) => apiClient(API_ENDPOINTS.PRODUCTS_BY_ID(id), { method: 'DELETE' }),

  // Contact
  submitContact: (data) => apiClient(API_ENDPOINTS.CONTACT, { method: 'POST', body: JSON.stringify(data) }),

  // Newsletter Subscription
  subscribeNewsletter: (email) => apiClient(API_ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  // Occasions
  getOccasions: () => apiClient(API_ENDPOINTS.OCCASIONS),
  getOccasionByIdOrSlug: (idOrSlug) => apiClient(API_ENDPOINTS.OCCASIONS_BY_ID(idOrSlug)),
  createOccasion: (data) => apiClient(API_ENDPOINTS.OCCASIONS, {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateOccasion: (id, data) => apiClient(API_ENDPOINTS.OCCASIONS_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteOccasion: (id) => apiClient(API_ENDPOINTS.OCCASIONS_BY_ID(id), {
    method: 'DELETE'
  }),
  assignProductsToOccasion: (id, product_ids) => apiClient(API_ENDPOINTS.OCCASIONS_ASSIGN_PRODUCTS(id), {
    method: 'POST',
    body: JSON.stringify({ product_ids })
  }),

  // Auth
  adminLogin: (credentials) => apiClient(API_ENDPOINTS.ADMIN_LOGIN, { method: 'POST', body: JSON.stringify(credentials) }),
  adminMe: () => apiClient(API_ENDPOINTS.ADMIN_ME),

  // Upload
  uploadImage: (formData) => apiClient(API_ENDPOINTS.UPLOAD, { method: 'POST', body: formData }),
  uploadMultipleImages: (formData) => apiClient(API_ENDPOINTS.UPLOAD_MULTIPLE, { method: 'POST', body: formData })
};

export default apiService;
