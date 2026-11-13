import React, { useState, useEffect, useRef } from 'react';
import { Package, ChevronDown } from 'lucide-react';

export default function CategoryTabs({ activeCategory, onSelectCategory, categories = [] }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Top-level categories (parent_id IS NULL)
  const topLevelCategories = (categories || []).filter(
    (c) => c.parent_id === null || c.parent_id === undefined
  );

  // Group subcategories by parent_id
  const subcategoriesByParent = {};
  (categories || []).forEach((c) => {
    if (c.parent_id !== null && c.parent_id !== undefined) {
      if (!subcategoriesByParent[c.parent_id]) {
        subcategoriesByParent[c.parent_id] = [];
      }
      subcategoriesByParent[c.parent_id].push(c);
    }
  });

  const handleSelect = (slugOrId) => {
    setActiveDropdown(null);
    onSelectCategory(slugOrId);
  };

  const handleToggleDropdown = (e, categoryId, hasSubcats) => {
    if (hasSubcats) {
      // Toggle dropdown on click
      setActiveDropdown((prev) => (prev === categoryId ? null : categoryId));
    } else {
      setActiveDropdown(null);
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label="All Hampers Category Filter"
      className="w-full bg-[#fdfcfb] border-b border-gray-100 py-4 relative z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Clean wrapping flexbox on all screen sizes so dropdown is never clipped by overflow-x */}
        <div className="flex items-center justify-center flex-wrap gap-2.5 py-1">
          {/* 1. All Hampers button */}
          <button
            type="button"
            onClick={() => handleSelect('all')}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 shrink-0 border ${
              activeCategory === 'all'
                ? 'bg-[#0B1320] text-white border-[#0B1320] shadow-xs'
                : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50 border-gray-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>All Hampers</span>
          </button>

          {/* 2. Top-level categories with subcategory dropdowns */}
          {topLevelCategories.map((category) => {
            const subcats = subcategoriesByParent[category.id] || [];
            const hasSubcats = subcats.length > 0;

            // Highlight parent if it is directly selected OR if any of its children are selected
            const isDirectlyActive =
              activeCategory === category.slug || String(activeCategory) === String(category.id);
            const isChildActive = subcats.some(
              (sub) => activeCategory === sub.slug || String(activeCategory) === String(sub.id)
            );
            const isParentActive = isDirectlyActive || isChildActive;

            const isOpen = activeDropdown === category.id;

            return (
              <div
                key={category.id}
                className="relative inline-block"
                onMouseEnter={() => hasSubcats && setActiveDropdown(category.id)}
                onMouseLeave={() => hasSubcats && setActiveDropdown(null)}
              >
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (hasSubcats) {
                        // If already active or toggled, open/toggle dropdown; also select category
                        handleSelect(category.slug || category.id);
                      } else {
                        handleSelect(category.slug || category.id);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 border ${
                      isParentActive
                        ? 'bg-[#0B1320] text-white border-[#0B1320] shadow-xs'
                        : 'bg-white text-gray-700 hover:text-black hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <span>{category.name}</span>
                    {category.product_count !== undefined && category.product_count > 0 && (
                      <span
                        className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                          isParentActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {category.product_count}
                      </span>
                    )}
                    {hasSubcats && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleDropdown(e, category.id, hasSubcats);
                        }}
                        className="p-0.5 -mr-1 rounded-full hover:bg-black/10 transition inline-flex items-center justify-center cursor-pointer"
                        title="View subcategories"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          } ${isParentActive ? 'text-white' : 'text-gray-400'}`}
                        />
                      </span>
                    )}
                  </button>
                </div>

                {/* Subcategory Dropdown Panel (elevation z-50 above everything) */}
                {hasSubcats && isOpen && (
                  <div className="absolute top-full left-0 mt-1.5 min-w-48 bg-white border border-gray-200 shadow-2xl rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* View all in this category */}
                    <button
                      type="button"
                      onClick={() => handleSelect(category.slug || category.id)}
                      className={`block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-gray-50 transition border-none bg-transparent cursor-pointer border-b border-gray-100 ${
                        isDirectlyActive ? 'text-black bg-gray-50 font-bold' : 'text-gray-900'
                      }`}
                    >
                      All in {category.name}
                    </button>

                    {/* Subcategories list */}
                    {subcats.map((subcat) => {
                      const isSubActive =
                        activeCategory === subcat.slug || String(activeCategory) === String(subcat.id);

                      return (
                        <button
                          key={subcat.id}
                          type="button"
                          onClick={() => handleSelect(subcat.slug || subcat.id)}
                          className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition border-none bg-transparent cursor-pointer ${
                            isSubActive
                              ? 'text-black font-bold bg-gray-50'
                              : 'text-gray-700 hover:text-black'
                          }`}
                        >
                          {subcat.name}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
