import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setSearch, setCategory, setSort } from "../redux/productSlice";

export default function Products() {
  const dispatch = useDispatch();
  const { filtered, isLoading, search, category, sort } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (isLoading) return <p className="text-center mt-10">Loading products...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">🛍 Products</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="border p-2 rounded w-60"
        />

        <select
          value={category}
          onChange={(e) => dispatch(setCategory(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="all">All Categories</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="shoes">Shoes</option>
        </select>

        <select
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="none">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow p-4 hover:shadow-lg transition bg-white"
          >
          {p.image ? (
            
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-40 object-cover mb-3 rounded"
            />
          ) : (
           <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm">
            No Image Available 
            </div>
          )}
          <h2 className="font-semibold">{p.title}</h2>
          <p className="text-gray-600 text-sm">{p.category}</p>
          <p className="font-bold text-blue-600 mt-1">₹{p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}



