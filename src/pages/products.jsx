import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setSearch,
  setCategory,
  setSort,
} from "../redux/productSlice";
import ProductCard from "../components/ProductCard";
import { Search, Filter, X } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function Products() {
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { filtered, isLoading, search, category, sort, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());

    if (initialCategory) {
      dispatch(setCategory(initialCategory));
    } else {
      dispatch(setCategory("all"));
    }
  }, [dispatch, initialCategory]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    document.title =
      category === "all" ? "ZYRA | Products" : `ZYRA | ${category}`;
  }, [category]);

  // Disable scroll when menu open
  useEffect(() => {
    if (menuOpen || showMobileFilters) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [menuOpen, showMobileFilters]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Failed to load products: {error}
        </p>
      </div>
    );

  return (
    <div
      className={`min-h-screen bg-white pt-24 transition-all relative ${
        menuOpen ? "overflow-hidden" : ""
      }`}
    >                         
      {/* Subtle light overlay when menu is open */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-md transition-all duration-300 pointer-events-none"></div>
      )}
                          
      {/* Main Content */}
      {!menuOpen && (
        <div className="w-full px-4 sm:px-6 lg:px-12 py-8 relative z-20">
          {/* Desktop Header */}
          <div className="hidden lg:block border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {category === "all" ? "PRODUCTS" : category.toUpperCase()}
              </h1>

              {/* Right: Search + Sort */}

              <div className="flex gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => dispatch(setSearch(e.target.value))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-72 text-sm"
                  />
                </div>

                {/* Sort */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={sort}
                    onChange={(e) => dispatch(setSort(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent text-sm min-w-[160px]"
                  >
                    <option value="none">Sort by</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                className="pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent w-full text-base"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter & Sort
              </button>
              <span className="text-sm text-gray-500">
                {filtered.length} products
              </span>
            </div>
          </div>

          {/* Mobile Filter Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-white/70 backdrop-blur-md z-50 flex items-start justify-end transition-all duration-300">
              <div className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Filter & Sort</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sort}
                      onChange={(e) => dispatch(setSort(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="none">Recommended</option>
                      <option value="low-high">Price: Low to High</option>
                      <option value="high-low">Price: High to Low</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
            <div className="lg:hidden mb-4">
              <h1 className="text-xl font-bold text-gray-900">
                {category === "all" ? "PRODUCTS" : category.toUpperCase()}
              </h1>
            </div>

            <div className="hidden lg:flex items-center justify-between mb-6">
              <span className="text-sm text-gray-500">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button
                  onClick={() => {
                    dispatch(setSearch(""));
                    dispatch(setCategory("all"));
                  }}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filtered.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
