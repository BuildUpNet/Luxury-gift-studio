import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Edit3, AlertCircle, X, Save, Upload, Image as ImageIcon, ChevronUp, ChevronDown, FolderTree } from '../../components/FaIcons';
import { API_URLS } from '../../config/api';

const NAVBAR_LIMIT = 10;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals state
  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const [modalData, setModalData] = useState({
    id: null,
    name: '',
    slug: '',
    sort_order: 1,
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

  const topLevelCategories = categories.filter((c) => c.parent_id === null);
  const navbarCount = topLevelCategories.filter((c) => c.show_in_navbar).length;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAddParentModal = () => {
    const maxOrder = topLevelCategories.reduce((max, c) => Math.max(max, c.sort_order || 0), 0);
    setModalData({
      id: null,
      name: '',
      slug: '',
      sort_order: maxOrder + 1,
      show_in_navbar: 1,
      parent_id: null,
      image_url: '',
      section_type: 'category'
    });
    setIsParentModalOpen(true);
  };

  const handleOpenAddSubModal = () => {
    if (topLevelCategories.length === 0) {
      showToast('Please create at least one parent category first.');
      return;
    }
    const defaultParent = topLevelCategories[0]?.id || null;
    setModalData({
      id: null,
      name: '',
      slug: '',
      sort_order: 1,
      show_in_navbar: 0,
      parent_id: defaultParent,
      image_url: '',
      section_type: 'category'
    });
    setIsSubModalOpen(true);
  };

  const handleOpenEditModal = (category) => {
    setModalData({
      id: category.id,
      name: category.name,
      slug: category.slug,
      sort_order: category.sort_order ?? 1,
      show_in_navbar: category.show_in_navbar,
      parent_id: category.parent_id ?? null,
      image_url: category.image_url || '',
      section_type: category.section_type || 'category'
    });
    if (category.parent_id !== null) {
      setIsSubModalOpen(true);
    } else {
      setIsParentModalOpen(true);
    }
  };

  const handleMoveOrder = async (category, direction) => {
    const siblings = category.parent_id === null
      ? categories.filter((c) => c.parent_id === null)
      : categories.filter((c) => c.parent_id === category.parent_id);

    const sorted = [...siblings].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    const currentIndex = sorted.findIndex((c) => c.id === category.id);
    if (currentIndex === -1) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= sorted.length) return;

    const currentItem = sorted[currentIndex];
    const targetItem = sorted[targetIndex];

    let currentOrder = currentItem.sort_order || (currentIndex + 1);
    let targetOrder = targetItem.sort_order || (targetIndex + 1);

    if (currentOrder === targetOrder) {
      currentOrder = currentIndex + 1;
      targetOrder = targetIndex + 1;
    }

    const newCurrentOrder = targetOrder;
    const newTargetOrder = currentOrder;

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === currentItem.id) return { ...c, sort_order: newCurrentOrder };
        if (c.id === targetItem.id) return { ...c, sort_order: newTargetOrder };
        return c;
      })
    );

    try {
      const token = localStorage.getItem('giftstudio_admin_token');
      await Promise.all([
        fetch(API_URLS.updateCategory(currentItem.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: currentItem.name,
            sort_order: newCurrentOrder,
            show_in_navbar: currentItem.show_in_navbar,
            parent_id: currentItem.parent_id ?? null,
            image_url: currentItem.image_url,
            section_type: currentItem.section_type || 'category'
          })
        }),
        fetch(API_URLS.updateCategory(targetItem.id), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            name: targetItem.name,
            sort_order: newTargetOrder,
            show_in_navbar: targetItem.show_in_navbar,
            parent_id: targetItem.parent_id ?? null,
            image_url: targetItem.image_url,
            section_type: targetItem.section_type || 'category'
          })
        })
      ]);
      showToast('Sequence updated');
    } catch (err) {
      console.error('Failed to update sort order:', err);
      showToast('Failed to update order');
      fetchCategories();
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
          sort_order: category.sort_order ?? 0,
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
        return;
      }

      showToast(
        newValue ? 'Added to navbar' : 'Removed from navbar'
      );
    } catch {
      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, show_in_navbar: category.show_in_navbar } : c))
      );
      showToast('Error updating navbar visibility');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    if (!modalData.name.trim()) {
      showToast('Category name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('giftstudio_admin_token');
      if (!token) throw new Error('Authentication required');

      const payload = {
        name: modalData.name.trim(),
        sort_order: parseInt(modalData.sort_order, 10) || 1,
        show_in_navbar: modalData.parent_id !== null ? 0 : (modalData.show_in_navbar ? 1 : 0),
        parent_id: modalData.parent_id !== null ? modalData.parent_id : null,
        image_url: modalData.image_url || null,
        section_type: 'category'
      };

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
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${modalData.id ? 'update' : 'create'} category`);
      }

      showToast(`Category ${modalData.id ? 'updated' : 'created'} successfully`);
      setIsParentModalOpen(false);
      setIsSubModalOpen(false);
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

    categories.forEach((c) => {
      if (c.parent_id !== null && !parents.find((p) => p.id === c.parent_id)) {
        list.push({ ...c, isChild: true });
      }
    });

    return list;
  };

  const displayList = buildDisplayList();

  return (
    <div className="space-y-8">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1320] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Category & Subcategory Management</h2>
            <p className="text-xs text-gray-500">
              Create Parent Categories for top-level navigation, or Subcategories linked to a specific parent.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">
              Navbar: {navbarCount}/{NAVBAR_LIMIT}
            </span>

            {/* Separate Form 1: Add Parent Category */}
            <button
              onClick={handleOpenAddParentModal}
              className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Parent Category</span>
            </button>

            {/* Separate Form 2: Add Subcategory */}
            <button
              onClick={handleOpenAddSubModal}
              className="bg-[#8B2635] hover:bg-[#721f2b] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Create Subcategory</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs p-8 text-center">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="text-gray-500 text-sm mt-2">Loading categories...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-28">Priority</th>
                  <th className="py-3.5 px-4">Category Name</th>
                  <th className="py-3.5 px-4">Type</th>
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
                    <td colSpan="8" className="text-center py-12 text-gray-400">
                      No categories found. Create a Parent Category to get started.
                    </td>
                  </tr>
                ) : (
                  displayList.map((category) => {
                    const isEnabled = Boolean(category.show_in_navbar);
                    const isSubcat = category.isChild;
                    const toggleDisabled = isSubcat || (navbarCount >= NAVBAR_LIMIT && !isEnabled);
                    const hasChildren = categories.some((c) => c.parent_id === category.id);
                    const parentName = isSubcat ? categories.find(c => c.id === category.parent_id)?.name : null;

                    return (
                      <tr
                        key={category.id}
                        className={`hover:bg-gray-50/80 transition ${isSubcat ? 'bg-amber-50/20' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-flex items-center justify-center min-w-[32px] h-6 px-1.5 rounded bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200"
                              title={`Priority order: #${category.sort_order ?? 0}`}
                            >
                              #{category.sort_order ?? 0}
                            </span>
                            <div className="flex flex-col">
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(category, -1)}
                                className="text-gray-400 hover:text-black p-0 border-none bg-transparent cursor-pointer leading-none"
                                title="Move Up"
                              >
                                <ChevronUp className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveOrder(category, 1)}
                                className="text-gray-400 hover:text-black p-0 border-none bg-transparent cursor-pointer leading-none"
                                title="Move Down"
                              >
                                <ChevronDown className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {isSubcat && (
                              <span className="text-gray-400 font-mono text-sm pl-2">↳</span>
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
                                  isSubcat ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-[#07111E] text-white'
                                }`}
                              >
                                {category.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className={`font-semibold ${isSubcat ? 'text-gray-700' : 'text-gray-900'}`}>
                                {category.name}
                              </p>
                              <p className="text-[11px] text-gray-400">
                                {isSubcat ? (
                                  <span className="text-amber-800 font-medium">Subcategory under "{parentName || 'Parent'}"</span>
                                ) : (
                                  <span>Top-level Parent Category</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isSubcat
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                            }`}
                          >
                            {isSubcat ? 'Subcategory' : 'Parent Category'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <code className="inline-block bg-gray-100 text-gray-700 text-[11px] font-mono px-2 py-0.5 rounded">
                            {category.slug}
                          </code>
                        </td>

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

                        <td className="py-3 px-4">
                          {isSubcat ? (
                            <span className="text-[11px] text-gray-400 italic">Automatic Dropdown</span>
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

                        <td className="py-3 px-4 text-gray-500">
                          {new Date(category.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>

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
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer border-none bg-transparent"
                              title={hasChildren ? 'Cannot delete: has subcategories' : 'Delete Category'}
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

      {/* FORM 1: PARENT CATEGORY MODAL */}
      {isParentModalOpen && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {modalData.id ? 'Edit Parent Category' : 'Create New Parent Category'}
                </h3>
                <p className="text-xs text-gray-500">
                  Parent categories appear directly on the main store Navbar and Shop by Category.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsParentModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
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
                      id="parent-image-input"
                    />
                    <label
                      htmlFor="parent-image-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition border border-gray-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WebP up to 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parent Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Carry Bags, Gift Sets, Table Calendar"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Display Priority / Sequence
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={modalData.sort_order ?? 1}
                    onChange={(e) =>
                      setModalData({
                        ...modalData,
                        sort_order: parseInt(e.target.value, 10) || 0
                      })
                    }
                    disabled={isSubmitting}
                    className="w-24 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black disabled:opacity-50 font-bold"
                  />
                  <span className="text-xs text-gray-500">
                    Lower number appears earlier in Navbar and homepage
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Show in Store Navbar</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Toggle display on top header navigation bar</p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalData({ ...modalData, show_in_navbar: modalData.show_in_navbar ? 0 : 1 })}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                    modalData.show_in_navbar ? 'bg-gray-900' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      modalData.show_in_navbar ? 'translate-x-[18px]' : 'translate-x-[2px]'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsParentModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-[#0B1320] hover:bg-[#1a2638] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : modalData.id ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Parent Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORM 2: SUB-CATEGORY MODAL */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-[100] !m-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {modalData.id ? 'Edit Subcategory' : 'Create New Subcategory'}
                </h3>
                <p className="text-xs text-gray-500">
                  Select which Parent Category this subcategory belongs under.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSubModalOpen(false)}
                className="text-gray-400 hover:text-black p-1 rounded-lg cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Parent Category * (Which category does this belong to?)
                </label>
                <select
                  required
                  value={modalData.parent_id ?? ''}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setModalData({ ...modalData, parent_id: val, show_in_navbar: 0 });
                  }}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black bg-white font-medium"
                >
                  <option value="" disabled>-- Select a Parent Category --</option>
                  {topLevelCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Parent)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subcategory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather, Eco-friendly, Wooden"
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Subcategory Image / Thumbnail
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
                      id="sub-image-input"
                    />
                    <label
                      htmlFor="sub-image-input"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition border border-gray-200"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                    </label>
                    <p className="text-[11px] text-gray-400 mt-1">JPG, PNG, WebP up to 2MB</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Sequence within Parent Category
                </label>
                <input
                  type="number"
                  min="1"
                  value={modalData.sort_order ?? 1}
                  onChange={(e) =>
                    setModalData({
                      ...modalData,
                      sort_order: parseInt(e.target.value, 10) || 0
                    })
                  }
                  disabled={isSubmitting}
                  className="w-24 px-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-black font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-black cursor-pointer border-none bg-transparent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-[#8B2635] hover:bg-[#721f2b] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <span>Saving...</span>
                  ) : modalData.id ? (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Subcategory</span>
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
