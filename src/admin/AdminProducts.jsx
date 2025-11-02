import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Search, RefreshCw, Eye, Package, Ban, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
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
  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
      await fetch(`http://localhost:4000/products/${productId}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted!');
    } catch (error) {
      toast.error('Delete failed');
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
      toast.success(`Product ${newStatus}!`);
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
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>)}
          </div>
          <div className="bg-gray-200 h-64 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
       <Link
          to="/admin/product-form"
          className="mt-4 lg:mt-0 flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
      >
     <Plus size={20} />
     Add Product
     </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: products.length, color: "text-gray-900" },
          { label: "Active", value: products.filter(p => p.status === 'active').length, color: "text-green-600" },
          { label: "Inactive", value: products.filter(p => p.status === 'inactive').length, color: "text-gray-600" },
          { label: "Low Stock", value: products.filter(p => (p.stock || 0) < 10).length, color: "text-orange-600" }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button onClick={fetchProducts} className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
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
              {currentProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200 overflow-hidden shadow-sm">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={getProductName(product)} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
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
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="text-gray-500 text-sm line-through">₹{product.originalPrice.toLocaleString()}</div>
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
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status || "active"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewProduct(product.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors hover:text-blue-600"
                        title="View Product"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button 
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`p-2 rounded-lg transition-colors ${
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
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <div className="text-gray-500 text-lg">No products found</div>
            <div className="text-gray-400 mt-2">
              {searchTerm ? "Try different search terms" : "Add your first product to get started"}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages} • {filteredProducts.length} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}