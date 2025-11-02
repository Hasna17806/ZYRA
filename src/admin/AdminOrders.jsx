import { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  ShoppingBag,
  Edit,
  Save,
  X,
  Mail,
  MapPin,
  CreditCard,
  Package
} from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Helper functions
  const getSafeString = (value) => String(value || '');
  const getSafeNumber = (value) => Number(value) || 0;
  const getPlaceholderText = (value, placeholder = "Not provided") => {
    return value ? value : <span className="text-gray-400 italic">{placeholder}</span>;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/orders");
      let data = await response.json();
      
      data = data.map(order => ({
        ...order,
        customerEmail: order.customerEmail || order.userEmail || `user${order.userId || order.id}@example.com`,
        customerPhone: order.customerPhone || '+91 XXXXX XXXXX',
        paymentMethod: order.paymentMethod || 'Credit Card',
        paymentStatus: order.paymentStatus || 'Paid',
        shippingCost: order.shippingCost || 0,
        tax: order.tax || 0,
        shippingAddress: order.shippingAddress || {
          street: 'Address not provided',
          city: 'City not specified', 
          state: 'State not specified',
          zipCode: 'XXXXXX',
          country: 'India'
        }
      }));
      
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find(order => order.id === orderId);
      const updatedOrder = { ...orderToUpdate, status: newStatus };
      
      const response = await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        setEditingOrderId(null);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const bulkUpdateStatus = async (newStatus) => {
    try {
      const updatePromises = selectedOrders.map(orderId => {
        const orderToUpdate = orders.find(order => order.id === orderId);
        const updatedOrder = { ...orderToUpdate, status: newStatus };
        
        return fetch(`http://localhost:4000/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedOrder),
        });
      });

      await Promise.all(updatePromises);
      
      setOrders(orders.map(order => 
        selectedOrders.includes(order.id) ? { ...order, status: newStatus } : order
      ));
      
      setSelectedOrders([]);
      setBulkAction("");
    } catch (error) {
      console.error('Error bulk updating order statuses:', error);
    }
  };

  // Handle bulk actions
  const handleBulkAction = () => {
    if (bulkAction && selectedOrders.length > 0) {
      bulkUpdateStatus(bulkAction);
    }
  };

  // Selection handlers
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    setSelectedOrders(
      selectedOrders.length === filteredOrders.length
        ? []
        : filteredOrders.map(order => order.id)
    );
  };

  const startEditing = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setTempStatus(currentStatus);
  };

  const cancelEditing = () => {
    setEditingOrderId(null);
    setTempStatus("");
  };

  const saveStatus = (orderId) => {
    if (tempStatus) {
      updateOrderStatus(orderId, tempStatus);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const orderId = getSafeString(order.id).toLowerCase();
    const userId = getSafeString(order.userId).toLowerCase();
    const customerName = getSafeString(order.customerName).toLowerCase();
    const customerEmail = getSafeString(order.customerEmail).toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    const matchesSearch = 
      orderId.includes(searchLower) ||
      userId.includes(searchLower) ||
      customerName.includes(searchLower) ||
      customerEmail.includes(searchLower);

    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate revenue and statistics
  const totalRevenue = orders.reduce((sum, order) => sum + getSafeNumber(order.totalAmount), 0);
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;

  const getStatusColor = (status) => {
    const safeStatus = String(status || 'pending');
    switch (safeStatus) {
      case "delivered": return "bg-green-100 text-green-800 border border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "processing": return "bg-blue-100 text-blue-800 border border-blue-200";
      case "shipped": return "bg-purple-100 text-purple-800 border border-purple-200";
      case "cancelled": return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const safeStatus = String(status || 'pending');
    switch (safeStatus) {
      case "delivered": return <CheckCircle size={16} />;
      case "pending": return <Clock size={16} />;
      case "processing": return <RefreshCw size={16} />;
      case "shipped": return <Truck size={16} />;
      case "cancelled": return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="mt-4 lg:mt-0 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">
            {processingOrders}
          </div>
          <div className="text-gray-600">Processing</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button 
              type="button"
              onClick={fetchOrders}
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={20} className="text-gray-600" />
            </button>
          </div>
        </form>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
            <div className="text-blue-800 font-medium">
              {selectedOrders.length} order(s) selected
            </div>
            <div className="flex items-center gap-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-4 py-2 border border-blue-300 rounded-md bg-white text-blue-800"
              >
                <option value="">Bulk Actions</option>
                <option value="pending">Mark as Pending</option>
                <option value="processing">Mark as Processing</option>
                <option value="shipped">Mark as Shipped</option>
                <option value="delivered">Mark as Delivered</option>
                <option value="cancelled">Mark as Cancelled</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
              <button
                onClick={() => setSelectedOrders([])}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Order ID</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Items</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Total</th>
                <th className="px-6 py-4 text-left text-gray-900 font-semibold">Status</th>
                <th className="px-6 py-4 text-right text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="rounded border-gray-300 text-black focus:ring-black"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{getSafeString(order.id)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {getSafeString(order.customerName) || `User ${getSafeString(order.userId)}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {getSafeString(order.customerEmail)}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {formatDate(order.createdAt || order.orderDate || new Date())}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {order.items ? order.items.length : 1} item(s)
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      ₹{getSafeNumber(order.totalAmount || order.total).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingOrderId === order.id ? (
                      <div className="flex items-center gap-2">
                        <select
                          value={tempStatus}
                          onChange={(e) => setTempStatus(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-black"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => saveStatus(order.id)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Save size={14} />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                          {getSafeString(order.status || "pending")}
                        </span>
                        <button
                          onClick={() => startEditing(order.id, order.status)}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                          title="Edit Status"
                        >
                          <Edit size={12} />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => viewOrderDetails(order)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Order Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-300" size={48} />
            <div className="mt-4 text-gray-500">No orders found</div>
            <div className="text-gray-400 text-sm mt-2">
              {searchTerm ? "Try adjusting your search terms" : "No orders have been placed yet"}
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-gray-600">Order #{getSafeString(selectedOrder.id)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedOrder.status)}`}>
                  {getSafeString(selectedOrder.status)}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Mail size={18} />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {getSafeString(selectedOrder.customerName) || `User ${getSafeString(selectedOrder.userId)}`}</p>
                    <p><span className="font-medium">Email:</span> {getPlaceholderText(getSafeString(selectedOrder.customerEmail), "No email provided")}</p>
                    <p><span className="font-medium">Phone:</span> {getPlaceholderText(getSafeString(selectedOrder.customerPhone), "No phone provided")}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin size={18} />
                    Shipping Address
                  </h3>
                  <div className="space-y-2">
                    <p>{getPlaceholderText(getSafeString(selectedOrder.shippingAddress?.street), "Address not specified")}</p>
                    <p>
                      {getSafeString(selectedOrder.shippingAddress?.city)} 
                      {selectedOrder.shippingAddress?.city && selectedOrder.shippingAddress?.zipCode && ', '}
                      {getSafeString(selectedOrder.shippingAddress?.zipCode)}
                    </p>
                    <p>
                      {getSafeString(selectedOrder.shippingAddress?.state)}
                      {selectedOrder.shippingAddress?.state && selectedOrder.shippingAddress?.country && ', '}
                      {getPlaceholderText(getSafeString(selectedOrder.shippingAddress?.country), "Country not specified")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Package size={18} />
                  Order Items
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Product</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{getSafeString(item.name)}</div>
                            <div className="text-gray-500 text-sm">SKU: {getPlaceholderText(getSafeString(item.sku), "N/A")}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">₹{getSafeNumber(item.price)}</td>
                          <td className="px-4 py-3 text-gray-700">{getSafeNumber(item.quantity)}</td>
                          <td className="px-4 py-3 font-medium text-gray-900">₹{getSafeNumber(item.price) * getSafeNumber(item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard size={18} />
                    Payment Information
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Payment Method:</span> {getPlaceholderText(getSafeString(selectedOrder.paymentMethod), "Not specified")}</p>
                    <p><span className="font-medium">Payment Status:</span> 
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                        selectedOrder.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getSafeString(selectedOrder.paymentStatus) || 'Unknown'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{getSafeNumber(selectedOrder.totalAmount || selectedOrder.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>₹{getSafeNumber(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>₹{getSafeNumber(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold">
                      <span>Total:</span>
                      <span>₹{getSafeNumber(selectedOrder.totalAmount || selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Ordered on {formatDate(selectedOrder.createdAt || selectedOrder.orderDate || new Date())}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}