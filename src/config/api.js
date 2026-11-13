import { API_BASE_URL, API_ENDPOINTS, apiService } from '../services/api';

export const API_URLS = {
  getCategories: () => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`,
  getCategoryById: (id) => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_BY_ID(id)}`,
  updateCategory: (id) => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_BY_ID(id)}`,
  uploadCategoryImage: () => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_UPLOAD_IMAGE}`,
  getCategoryProducts: (id) => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_PRODUCTS(id)}`,
  uploadImage: () => `${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`,
  adminLogin: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_LOGIN}`,
  adminRegister: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_REGISTER}`,
  adminMe: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_ME}`,
  submitContact: () => `${API_BASE_URL}${API_ENDPOINTS.CONTACT}`,
  getGiftingBanner: () => `${API_BASE_URL}${API_ENDPOINTS.GIFTING_BANNER}`,
  updateGiftingBanner: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_GIFTING_BANNER}`,
  submitGiftingInquiry: () => `${API_BASE_URL}${API_ENDPOINTS.GIFTING_INQUIRIES}`,
  getAdminGiftingInquiries: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_GIFTING_INQUIRIES}`
};

export { API_BASE_URL, API_ENDPOINTS, apiService };
export default API_BASE_URL;
