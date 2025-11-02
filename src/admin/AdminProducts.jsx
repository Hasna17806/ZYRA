import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit, Trash2, Search, RefreshCw, Eye, Package, Ban, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const name = (product.name || product.title || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || product.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Actions
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await fetch(`http://localhost:4000/products/${productToDelete.id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
      toast.success('Product deleted successfully!');
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleToggleStatus = async (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await fetch(`http://localhost:4000/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}!`);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`); 
  };

  const handleEditProduct = (productId) => {
    navigate(`/admin/product-form`, { 
      state: { 
        productId: productId,
        editMode: true 
      } 
    });
  };

  // Helper functions
  const getProductName = (product) => product.name || product.title || 'Unnamed Product';
  const getStatusColor = (status) => {
    const colors = {
      "active": "bg-green-100 text-green-800 border border-green-200",
      "inactive": "bg-gray-100 text-gray-800 border border-gray-200",
      "draft": "bg-yellow-100 text-yellow-800 border border-yellow-200"
    };
    return colors[status] || "bg-blue-100 text-blue-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="animate-pulse space-y-4 max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white h-28 rounded-xl shadow-sm"></div>)}
          </div>
          <div className="bg-white h-96 rounded-xl shadow-sm"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Products Management
            </h1>
            <p className="text-gray-600">Manage your product catalog ({filteredProducts.length} products)</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to="/admin/product-form"
              className="mt-4 lg:mt-0 inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus size={20} />
              Add Product
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total", value: products.length, color: "text-gray-900", bg: "bg-gray-50", icon: Package },
            { label: "Active", value: products.filter(p => p.status === 'active').length, color: "text-green-600", bg: "bg-green-50", icon: CheckCircle },
            { label: "Inactive", value: products.filter(p => p.status === 'inactive').length, color: "text-gray-600", bg: "bg-gray-50", icon: Ban },
            { label: "Low Stock", value: products.filter(p => (p.stock || 0) < 10).length, color: "text-orange-600", bg: "bg-orange-50", icon: AlertCircle }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <Icon className={stat.color} size={20} />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              />
            </div>
            
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button 
              onClick={fetchProducts} 
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <RefreshCw size={20} className="text-gray-600 group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-900 font-semibold">Product</th>
                  <th className="px-6 py-4 text-left text-gray-900 font-semibold">Category</th>
                  <th className="px-6 py-4 text-left text-gray-900 font-semibold">Price</th>
                  <th className="px-6 py-4 text-left text-gray-900 font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                  <th className="px-6 py-4 text-right text-gray-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {currentProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm group">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={getProductName(product)} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <Package className="text-gray-400" size={24} />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{getProductName(product)}</div>
                            <div className="text-gray-500 text-sm">ID: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700 font-medium bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">
                          {product.category || "Uncategorized"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">₹{(product.price || 0).toLocaleString()}</div>
                        {product.discount && (
                          <div className="text-green-600 text-xs font-medium mt-1">
                            {product.discount}% OFF
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          (product.stock || 0) === 0 ? "bg-red-100 text-red-800" :
                          (product.stock || 0) < 10 ? "bg-orange-100 text-orange-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {product.stock || 0} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(product.status)}`}>
                          {product.status || "active"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewProduct(product.id)}
                            className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all"
                            title="View Product"
                          >
                            <Eye size={18} />
                          </button>
                          
                          <button 
                            onClick={() => handleToggleStatus(product.id, product.status)}
                            className={`p-2 rounded-lg transition-all ${
                              product.status === 'active' 
                                ? 'text-orange-600 hover:bg-orange-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={product.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {product.status === 'active' ? <Ban size={18} /> : <CheckCircle size={18} />}
                          </button>
                          
                          <button 
                            onClick={() => handleEditProduct(product.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                          
                          <button 
                            onClick={() => confirmDelete(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete Product"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gray-300" size={40} />
              </div>
              <div className="text-gray-500 text-lg font-medium mb-2">No products found</div>
              <div className="text-gray-400">
                {searchTerm ? "Try different search terms" : "Add your first product to get started"}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-600 font-medium">
                Page {currentPage} of {totalPages} • {filteredProducts.length} products
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors font-medium"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeleteModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Product</h3>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Are you sure you want to delete "<strong>{productToDelete?.title || productToDelete?.name}</strong>"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}