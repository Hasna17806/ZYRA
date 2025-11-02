import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Upload, X, AlertCircle, Image as ImageIcon, Percent } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProductForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    discount: "",
    category: "",
    stock: "",
    status: "active",
    image: "",
    colors: ["#000000", "#FFFFFF"],
    sizes: ["S", "M", "L", "XL"]
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
          discount: product.discount || "",
          category: product.category || "",
          stock: product.stock || "",
          status: product.status || "active",
          image: product.image || "",
          colors: product.colors || ["#000000", "#FFFFFF"],
          sizes: product.sizes || ["S", "M", "L", "XL"]
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (formData.originalPrice && Number(formData.originalPrice) < Number(formData.price)) {
      newErrors.originalPrice = "Original price must be greater than current price";
    }

    if (formData.discount && (formData.discount < 0 || formData.discount > 100)) {
      newErrors.discount = "Discount must be between 0 and 100";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isViewMode) {
      navigate("/admin/products");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = {
        title: formData.name,
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        discount: formData.discount ? Number(formData.discount) : null,
        category: formData.category,
        stock: Number(formData.stock),
        status: formData.status,
        image: formData.image,
        colors: formData.colors,
        sizes: formData.sizes
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
        toast.success(
          <div className="flex items-center gap-2">
            <Save size={16} />
            <span>Product {isEditMode ? 'updated' : 'created'} successfully!</span>
          </div>
        );
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
    if (isViewMode) return;
    
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const addColor = () => {
    if (formData.colors.length < 6) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, "#000000"]
      }));
    }
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const updateColor = (index, color) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => i === index ? color : c)
    }));
  };

  // Calculate discount if original price changes
  useEffect(() => {
    if (formData.price && formData.originalPrice) {
      const calculatedDiscount = (
        ((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100
      ).toFixed(0);
      
      if (calculatedDiscount > 0) {
        setFormData(prev => ({
          ...prev,
          discount: calculatedDiscount
        }));
      }
    }
  }, [formData.price, formData.originalPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/products")}
              className="p-2 rounded-xl border border-gray-300 hover:bg-white hover:shadow-md transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {isViewMode ? "View Product" : isEditMode ? "Edit Product" : "Add New Product"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isViewMode ? "View product details" : 
                 isEditMode ? "Update product details" : 
                 "Create a new product for your store"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Product Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon size={18} className="text-blue-600" />
                </div>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Category</option>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    disabled={isViewMode}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Percent size={18} className="text-green-600" />
                </div>
                Pricing & Inventory
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Selling Price (₹) *
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.originalPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {errors.originalPrice && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.originalPrice}
                    </p>
                  )}
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    disabled={isViewMode}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.discount ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formData.discount && (
                    <p className="mt-2 text-sm text-green-600 font-medium">
                      Saves ₹{(formData.originalPrice - formData.price).toFixed(2)}
                    </p>
                  )}
                  {errors.discount && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.discount}
                    </p>
                  )}
                </div>

                {/* Stock */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      errors.stock ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0"
                  />
                  {formData.stock && formData.stock < 10 && (
                    <p className="mt-2 text-sm text-orange-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      Low stock warning: Consider restocking soon
                    </p>
                  )}
                  {errors.stock && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.stock}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                placeholder="Enter a detailed product description..."
              />
            </div>

            {/* Colors */}
            <div className="border-t border-gray-200 pt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Available Colors
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => updateColor(index, e.target.value)}
                      disabled={isViewMode}
                      className="w-8 h-8 rounded cursor-pointer"
                    />
                    {!isViewMode && formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                {!isViewMode && formData.colors.length < 6 && (
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-all"
                  >
                    + Add Color
                  </button>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div className="border-t border-gray-200 pt-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Image URL
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={isViewMode}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="w-40 h-52 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                    <img 
                      src={formData.image} 
                      alt="Product preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full hidden items-center justify-center">
                      <ImageIcon className="text-gray-400" size={40} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/admin/products")}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                {isViewMode ? "Back" : "Cancel"}
              </button>
              
              {!isViewMode && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      {isEditMode ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}