// API Base URL dynamically resolved from environment variable with fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5002' : '');

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

  // Upload
  UPLOAD: '/api/upload',

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
  ADMIN_GIFTING_INQUIRY_BY_ID: (id) => `/api/admin/gifting-inquiries/${id}`
};

// Convenient API service wrappers
export const apiService = {
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
  createCategory: (catData) => apiClient(API_ENDPOINTS.CATEGORIES, { method: 'POST', body: JSON.stringify(catData) }),
  updateCategory: (id, catData) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(id), { method: 'PUT', body: JSON.stringify(catData) }),
  deleteCategory: (id) => apiClient(API_ENDPOINTS.CATEGORIES_BY_ID(id), { method: 'DELETE' }),
  uploadCategoryImage: (formData) => apiClient(API_ENDPOINTS.CATEGORIES_UPLOAD_IMAGE, { method: 'POST', body: formData }),

  // Contact
  submitContact: (data) => apiClient(API_ENDPOINTS.CONTACT, { method: 'POST', body: JSON.stringify(data) }),

  // Auth
  adminLogin: (credentials) => apiClient(API_ENDPOINTS.ADMIN_LOGIN, { method: 'POST', body: JSON.stringify(credentials) }),
  adminMe: () => apiClient(API_ENDPOINTS.ADMIN_ME),

  // Upload
  uploadImage: (formData) => apiClient(API_ENDPOINTS.UPLOAD, { method: 'POST', body: formData })
};

export default apiService;
