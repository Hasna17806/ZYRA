import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Get mode from navigation state
  const { productId, editMode, viewMode } = location.state || {};
  const isEditMode = !!productId && editMode;
  const isViewMode = !!productId && viewMode;
  const isAddMode = !productId;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    status: "active",
    image: ""
  });

  // Fetch product data if in edit/view mode
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        setFormData({
          name: product.name || product.title || "",
          description: product.description || "",
          price: product.price || "",
          originalPrice: product.originalPrice || "",
          category: product.category || "",
          stock: product.stock || "",
          status: product.status || "active",
          image: product.image || ""
        });
      } else {
        toast.error("Failed to load product");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isViewMode) {
      navigate("/admin/products");
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        stock: Number(formData.stock),
      };

      let response;
      
      if (isEditMode) {
        // UPDATE existing product
        response = await fetch(`http://localhost:4000/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productData,
            id: productId,
            updatedAt: new Date().toISOString()
          }),
        });
      } else {
        // CREATE new product
        response = await fetch("http://localhost:4000/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...productData,
            createdAt: new Date().toISOString()
          }),
        });
      }

      if (response.ok) {
        toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate("/admin/products");
      } else {
        toast.error(`Failed to ${isEditMode ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    if (isViewMode) return; // Don't allow changes in view mode
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isViewMode ? "View Product" : isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isViewMode ? "View product details" : 
               isEditMode ? "Update product details" : 
               "Create a new product for your store"}
            </p>
          </div>
        </div>
      </div>

      {/* Product Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Category</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0.00"
              />
            </div>

            {/* Original Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0.00"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="0"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={isViewMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="Enter product description"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              disabled={isViewMode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isViewMode ? "Back" : "Cancel"}
            </button>
            
            {!isViewMode && (
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={20} />
                {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Product" : "Create Product")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}