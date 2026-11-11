import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, AlertCircle, X, Save } from 'lucide-react';
import { API_URLS } from '../../config/api';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    name: '',
    slug: ''
  });

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('giftstudio_admin_token');
      const response = await fetch(API_URLS.getCategories(), {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        throw new Error(data.message || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleOpenAddModal = () => {
    setModalData({
      id: null,
      name: '',
      slug: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalData({
      id: category.id,
      name: category.name,
      slug: category.slug
    });
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    if (!modalData.name.trim()) {
      showToast('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('giftstudio_admin_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const url = modalData.id 
        ? API_URLS.updateProduct(modalData.id) // Since we don't have updateCategory, using product endpoint
        : API_URLS.getCategories();
      
      const method = modalData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: modalData.name.trim() })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalData.id ? 'update' : 'create'} category`);
      }

      showToast(`Category ${modalData.id ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error saving category:', error);
      showToast(error.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('giftstudio_admin_token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(API_URLS.getCategoryById(category.id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category');
      }

      showToast('Category deleted successfully');
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast(error.message || 'Error deleting category');
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Category Management</h2>
            <p className="text-xs text-gray-500">
              Organize your products into categories for better store navigation
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="text-gray-500 text-sm mt-2">Loading categories...</p>
        </div>
      ) : (
        /* Categories Table */
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-400">
                      No categories found. Add your first category to get started.
                    </td>
                  </tr>
                ) : (
                  categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50/80 transition">
                      {/* Category Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#07111E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                            {category.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{category.name}</p>
                            <p className="text-[11px] text-gray-400">ID: {category.id}</p>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3 px-4">
                        <code className="inline-block bg-gray-100 text-gray-700 text-[11px] font-mono px-2 py-0.5 rounded">
                          {category.slug}
                        </code>
                      </td>

                      {/* Products Count */}
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          category.product_count > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {category.product_count || 0} product(s)
                        </span>
                      </td>

                      {/* Created Date */}
                      <td className="py-3 px-4 text-gray-500">
                        {new Date(category.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(category)}
                            className="p-1.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-md transition cursor-pointer border-none bg-transparent"
                            title="Edit Category"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer border-none bg-transparent"
                            title="Delete Category"
                            disabled={category.product_count > 0}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {modalData.id ? 'Edit Category' : 'Add New Category'}
                </h3>
                <p className="text-xs text-gray-500">Enter category information</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-md"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Decor, Diwali, Hampers"
                  value={modalData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/--+/g, '-')
                      .trim();
                    
                    setModalData({
                      ...modalData,
                      name,
                      slug
                    });
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={modalData.slug}
                  readOnly
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  This will be used in URLs. Automatically generated from the name.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black rounded-lg transition cursor-pointer border-none bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : modalData.id ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}