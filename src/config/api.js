import { API_BASE_URL, API_ENDPOINTS, apiService } from '../services/api';

export const API_URLS = {
  getCategories: () => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES}`,
  getCategoryById: (id) => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_BY_ID(id)}`,
  getCategoryProducts: (id) => `${API_BASE_URL}${API_ENDPOINTS.CATEGORIES_PRODUCTS(id)}`,
  getProducts: () => `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
  getProductById: (id) => `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS_BY_ID(id)}`,
  createProduct: () => `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS}`,
  updateProduct: (id) => `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS_BY_ID(id)}`,
  deleteProduct: (id) => `${API_BASE_URL}${API_ENDPOINTS.PRODUCTS_BY_ID(id)}`,
  uploadImage: () => `${API_BASE_URL}${API_ENDPOINTS.UPLOAD}`,
  adminLogin: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_LOGIN}`,
  adminRegister: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_REGISTER}`,
  adminMe: () => `${API_BASE_URL}${API_ENDPOINTS.ADMIN_ME}`,
  submitContact: () => `${API_BASE_URL}${API_ENDPOINTS.CONTACT}`
};

export { API_BASE_URL, API_ENDPOINTS, apiService };
export default API_BASE_URL;
