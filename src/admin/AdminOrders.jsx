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
  Package
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [tempStatus, setTempStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from server
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/orders");
      const data = await response.json();
      setOrders(data);
      toast.success("Orders loaded");
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      
      await fetch(`http://localhost:4000/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, status: newStatus }),
      });

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      
      setEditingOrderId(null);
      toast.success("Status updated!");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Format date - Fixed to handle timestamp order IDs
  const formatDate = (order) => {
    // First try regular date fields
    if (order.date) {
      const date = new Date(order.date);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN');
      }
    }
    
    if (order.createdAt) {
      const date = new Date(order.createdAt);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-IN');
      }
    }
    
    // If no valid date fields, try to extract from order ID (timestamp)
    if (order.id) {
      // Remove the '#' if present and convert to number
      const orderId = order.id.toString().replace('#', '');
      const timestamp = parseInt(orderId);
      
      // Check if it's a valid timestamp (13 digits for milliseconds)
      if (!isNaN(timestamp) && orderId.length === 13) {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('en-IN');
        }
      }
    }
    
    return 'Date not available';
  };

  if (loading) {
    return (
      <div className="p-6 pt-20">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold">{orders.length}</div>
          <div className="text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold text-yellow-600">{pendingOrders}</div>
          <div className="text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-gray-600">Revenue</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Order ID</th>
              <th className="px-6 py-3 text-left font-semibold">Customer</th>
              <th className="px-6 py-3 text-left font-semibold">Date</th>
              <th className="px-6 py-3 text-left font-semibold">Total</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">#{order.id}</td>
                <td className="px-6 py-4">{order.customerName || `User ${order.userId}`}</td>
                <td className="px-6 py-4">{formatDate(order)}</td>
                <td className="px-6 py-4 font-bold">₹{order.total}</td>
                <td className="px-6 py-4">
                  {editingOrderId === order.id ? (
                    <div className="flex gap-2">
                      <select
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value)}
                        className="px-2 py-1 border rounded text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => updateOrderStatus(order.id, tempStatus)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingOrderId(null)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <button
                        onClick={() => {
                          setEditingOrderId(order.id);
                          setTempStatus(order.status);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit size={14} />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Order #{selectedOrder.id}</h2>
                <p className="text-gray-600 mt-1">Placed on {formatDate(selectedOrder)}</p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Mail size={16} />
                  Customer
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerEmail || 'N/A'}</p>
                  <p><strong>User ID:</strong> {selectedOrder.userId || 'N/A'}</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin size={16} />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p>{selectedOrder.shippingAddress?.street || 'N/A'}</p>
                  <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.zipCode}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Package size={16} />
                  Items
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Product</th>
                        <th className="px-4 py-2 text-left text-sm">Qty</th>
                        <th className="px-4 py-2 text-right text-sm">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2">{item.name || item.product?.title}</td>
                          <td className="px-4 py-2">{item.quantity}</td>
                          <td className="px-4 py-2 text-right">₹{item.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}