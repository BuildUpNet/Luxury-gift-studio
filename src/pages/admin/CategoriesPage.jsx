import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit3, AlertCircle, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { API_URLS } from '../../config/api';

const NAVBAR_LIMIT = 10;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [modalData, setModalData] = useState({
    id: null,
    name: '',
    slug: '',
    show_in_navbar: 1,
    parent_id: null,
    image_url: '',
    section_type: 'category'
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

  // Only top-level categories count toward the navbar limit
  const topLevelCategories = categories.filter((c) => c.parent_id === null);
  const navbarCount = topLevelCategories.filter((c) => c.show_in_navbar).length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAddModal = () => {
    setModalData({
      id: null,
      name: '',
      slug: '',
      show_in_navbar: 1,
      parent_id: null,
      image_url: '',
      section_type: 'category'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      show_in_navbar: category.show_in_navbar,
      parent_id: category.parent_id ?? null,
      image_url: category.image_url || '',
      section_type: category.section_type || 'category'
    });
    setIsModalOpen(true);
  };

  // Upload category image file
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size on frontend (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      showToast('Image size exceeds 2MB limit');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Only JPG, JPEG, PNG, and WebP images are allowed');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setIsUploadingImage(true);
      const token = localStorage.getItem('giftstudio_admin_token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(API_URLS.uploadCategoryImage(), {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Image upload failed');
      }

      setModalData((prev) => ({ ...prev, image_url: data.imageUrl }));
      showToast('Category image uploaded');
    } catch (err) {
      console.error('Image upload error:', err);
      showToast(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Inline navbar toggle from the table row
  const handleNavbarToggle = async (category) => {
    const newValue = category.show_in_navbar ? 0 : 1;

    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, show_in_navbar: newValue } : c))
    );

    try {
      const token = localStorage.getItem('giftstudio_admin_token');
      const response = await fetch(API_URLS.updateCategory(category.id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: category.name,
          show_in_navbar: newValue,
          parent_id: category.parent_id ?? null,
          image_url: category.image_url,
          section_type: category.section_type || 'category'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setCategories((prev) =>
          prev.map((c) => (c.id === category.id ? { ...c, show_in_navbar: category.show_in_navbar } : c))
        );
        showToast(data.message || 'Failed to update navbar visibility');
      } else {
        showToast(`"${category.name}" ${newValue ? 'added to' : 'removed from'} navbar`);
      }
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, show_in_navbar: category.show_in_navbar } : c))
      );
      showToast('Network error. Please try again.');
    }
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
      if (!token) throw new Error('Authentication required');

      const url = modalData.id
        ? API_URLS.updateCategory(modalData.id)
        : API_URLS.getCategories();

      const method = modalData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: modalData.name.trim(),
          show_in_navbar: modalData.show_in_navbar,
          parent_id: modalData.parent_id || null,
          image_url: modalData.image_url || null,
          section_type: modalData.section_type || 'category'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalData.id ? 'update' : 'create'} category`);
      }

      showToast(`Category ${modalData.id ? 'updated' : 'created'} successfully`);
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showToast(error.message || 'Error saving category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    const hasChildren = categories.some((c) => c.parent_id === category.id);
    if (hasChildren) {
      showToast(`Cannot delete "${category.name}": it has subcategories. Delete or reassign them first.`);
      return;
    }
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    try {
      const token = localStorage.getItem('giftstudio_admin_token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(API_URLS.getCategoryById(category.id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete category');
      }

      showToast('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast(error.message || 'Error deleting category');
    }
  };

  // Build a flat display list: each parent followed immediately by its children
  const buildDisplayList = () => {
    const parents = categories.filter((c) => c.parent_id === null);
    const childrenByParent = {};
    categories.forEach((c) => {
      if (c.parent_id !== null) {
        if (!childrenByParent[c.parent_id]) childrenByParent[c.parent_id] = [];
        childrenByParent[c.parent_id].push(c);
      }
    });

    const list = [];
    parents.forEach((parent) => {
      list.push({ ...parent, isChild: false });
      (childrenByParent[parent.id] || []).forEach((child) => {
        list.push({ ...child, isChild: true });
      });
    });

    // Orphaned subcategories appended at the end
    categories.forEach((c) => {
      if (c.parent_id !== null && !parents.find((p) => p.id === c.parent_id)) {
        list.push({ ...c, isChild: true });
      }
    });

    return list;
  };

  const displayList = buildDisplayList();
  const isSubcategory = Boolean(modalData.parent_id);

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
              Organize your products into categories, occasions, and subcategories
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Navbar counter */}
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              Navbar: {navbarCount}/{NAVBAR_LIMIT}
            </span>

            <button
              onClick={handleOpenAddModal}
              className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>
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
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Products</th>
                  <th className="py-3.5 px-4">Show in Navbar</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-xs text-gray-700">
                {displayList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-400">
                      No categories found. Add your first category to get started.
                    </td>
                  </tr>
                ) : (
                  displayList.map((category) => {
                    const isEnabled = Boolean(category.show_in_navbar);
                    const isSubcat = category.isChild;
                    const toggleDisabled = isSubcat || (navbarCount >= NAVBAR_LIMIT && !isEnabled);
                    const hasChildren = categories.some((c) => c.parent_id === category.id);
                    const canDelete = category.product_count === 0 && !hasChildren;

                    return (
                      <tr
                        key={category.id}
                        className={`hover:bg-gray-50/80 transition ${isSubcat ? 'bg-gray-50/40' : ''}`}
                      >
                        {/* Category Name & Thumbnail */}
                        <td className="py-3 px-4">
                          <div className={`flex items-center gap-3 ${isSubcat ? 'pl-6' : ''}`}>
                            {isSubcat && (
                              <span className="text-gray-300 text-base leading-none select-none" aria-hidden="true">
                                L
                              </span>
                            )}
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                                  isSubcat ? 'bg-gray-200 text-gray-600' : 'bg-[#07111E] text-white'
                                }`}
                              >
                                {category.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className={`font-semibold ${isSubcat ? 'text-gray-600' : 'text-gray-900'}`}>
                                {category.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                ID: {category.id}
                                {isSubcat && <span className="ml-1.5 text-gray-300">· subcategory</span>}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Section Type */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                              category.section_type === 'occasion'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {category.section_type === 'occasion' ? 'Occasion' : 'Category'}
                          </span>
                        </td>

                        {/* Slug */}
                        <td className="py-3 px-4">
                          <code className="inline-block bg-gray-100 text-gray-700 text-[11px] font-mono px-2 py-0.5 rounded">
                            {category.slug}
                          </code>
                        </td>

                        {/* Products Count */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              category.product_count > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {category.product_count || 0} product(s)
                          </span>
                        </td>

                        {/* Navbar Toggle */}
                        <td className="py-3 px-4">
                          {isSubcat ? (
                            <span className="text-[11px] text-gray-400">N/A</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleNavbarToggle(category)}
                              disabled={toggleDisabled}
                              title={
                                toggleDisabled
                                  ? `${NAVBAR_LIMIT} categories already in navbar`
                                  : isEnabled
                                  ? 'Remove from navbar'
                                  : 'Add to navbar'
                              }
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                isEnabled ? 'bg-gray-900' : 'bg-gray-300'
                              } ${toggleDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              <span
                                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                                  isEnabled ? 'translate-x-[18px]' : 'translate-x-[2px]'
                                }`}
                              />
                            </button>
                          )}
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
                              className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition cursor-pointer border-none bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"
                              title={
                                !canDelete
                                  ? category.product_count > 0
                                    ? 'Cannot delete: has products'
                                    : 'Cannot delete: has subcategories'
                                  : 'Delete Category'
                              }
                              disabled={!canDelete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                className="text-gray-400 hover:text-black p-1 rounded-md cursor-pointer border-none bg-transparent"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              {/* Category Image Upload with Preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Category Image / Thumbnail
                </label>
                <div className="flex items-center gap-3">
                  {modalData.image_url ? (
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
                      <img
                        src={modalData.image_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setModalData((prev) => ({ ...prev, image_url: '' }))}
                        className="absolute top-0.5 right-0.5 bg-black/70 hover:bg-black text-white p-0.5 rounded-full cursor-pointer border-none"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400 shrink-0 bg-gray-50">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageFileChange}
                      disabled={isUploadingImage || isSubmitting}
                      className="hidden"
                      id="category-image-input"
                    />
                    <label
                      htmlFor="category-image-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition border border-gray-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WebP up to 2MB</p>
                  </div>
                </div>
              </div>

              {/* Section Type */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Section Type
                </label>
                <select
                  value={modalData.section_type || 'category'}
                  onChange={(e) => setModalData({ ...modalData, section_type: e.target.value })}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:opacity-50 bg-white"
                >
                  <option value="category">Shop by Category</option>
                  <option value="occasion">Shop by Occasion</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Controls whether this item belongs to category browsing or occasion browsing.
                </p>
              </div>

              {/* Parent Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  value={modalData.parent_id ?? ''}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    setModalData({
                      ...modalData,
                      parent_id: val,
                      show_in_navbar: val ? 0 : modalData.show_in_navbar
                    });
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:opacity-50 bg-white"
                >
                  <option value="">None (top-level category)</option>
                  {topLevelCategories
                    .filter((c) => c.id !== modalData.id)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Select a parent to create a subcategory, or leave as None.
                </p>
              </div>

              {/* Name */}
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
                    const slug = name
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/\s+/g, '-')
                      .replace(/--+/g, '-')
                      .trim();
                    setModalData({ ...modalData, name, slug });
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:opacity-50"
                />
              </div>

              {/* Slug (read-only) */}
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
                  Automatically generated from the name. Used in URLs.
                </p>
              </div>

              {/* Show in Navbar toggle — hidden for subcategories */}
              {!isSubcategory && (
                <div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-xs font-semibold text-gray-700">Show in Navbar</p>
                      {navbarCount >= NAVBAR_LIMIT && !modalData.show_in_navbar && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {NAVBAR_LIMIT} categories already in navbar
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (navbarCount >= NAVBAR_LIMIT && !modalData.show_in_navbar) return;
                        setModalData({ ...modalData, show_in_navbar: modalData.show_in_navbar ? 0 : 1 });
                      }}
                      disabled={navbarCount >= NAVBAR_LIMIT && !modalData.show_in_navbar}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        modalData.show_in_navbar ? 'bg-gray-900' : 'bg-gray-300'
                      } ${navbarCount >= NAVBAR_LIMIT && !modalData.show_in_navbar ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          modalData.show_in_navbar ? 'translate-x-[18px]' : 'translate-x-[2px]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {isSubcategory && (
                <p className="text-[11px] text-gray-400 -mt-1">
                  Subcategories are not shown in the navbar.
                </p>
              )}

              {/* Footer buttons */}
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
                  disabled={isSubmitting || isUploadingImage}
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
