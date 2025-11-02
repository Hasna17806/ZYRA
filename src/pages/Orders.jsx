import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Orders() {
  const { user } = useSelector((state) => state.auth);

  // Get orders from localStorage
  const storedOrders = JSON.parse(localStorage.getItem("ordersByUser")) || {};
  const userOrders = user?.email ? storedOrders[user.email] || [] : [];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Safe function to get product name from any structure
  const getProductName = (item) => {
    // Try different possible structures
    if (item.product && item.product.title) return item.product.title;
    if (item.title) return item.title;
    if (item.name) return item.name;
    if (item.product && item.product.name) return item.product.name;
    return "Product";
  };

  // Safe function to get product price
  const getProductPrice = (item) => {
    if (item.product && item.product.price) return item.product.price;
    if (item.price) return item.price;
    return 0;
  };

  // Safe function to get product image
  const getProductImage = (item) => {
    if (item.product && item.product.image) return item.product.image;
    if (item.image) return item.image;
    return "";
  };

  if (!user) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        Please log in to view your orders.
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        You have no past orders.
      </div>
    );
  }

  // Process orders with safe data handling
  const processedOrders = userOrders.map(order => ({
    id: order.id || "Unknown Order",
    date: order.date || "Unknown Date", 
    status: order.status || "pending",
    total: order.total || 0,
    items: order.items?.map(item => ({
      ...item,
      name: getProductName(item),
      price: getProductPrice(item),
      image: getProductImage(item),
      quantity: item.quantity || 1
    })) || []
  }));

  // Filter orders
  const filteredOrders = processedOrders
    .slice()
    .reverse()
    .filter(order => {
      const matchesFilter = activeFilter === "all" || order.status === activeFilter;
      const matchesSearch = searchQuery === "" || 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchesFilter && matchesSearch;
    });

  // Status counts
  const statusCounts = {
    all: processedOrders.length,
    pending: processedOrders.filter(order => order.status === "pending").length,
    processing: processedOrders.filter(order => order.status === "processing").length,
    shipped: processedOrders.filter(order => order.status === "shipped").length,
    delivered: processedOrders.filter(order => order.status === "delivered").length,
    cancelled: processedOrders.filter(order => order.status === "cancelled").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "shipped": return <Truck className="w-4 h-4" />;
      case "processing": return <Package className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track and manage your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Orders List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by order number or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              {[
                { key: "all", label: "All" },
                { key: "pending", label: "Pending" },
                { key: "processing", label: "Processing" },
                { key: "shipped", label: "Shipped" },
                { key: "delivered", label: "Delivered" },
                { key: "cancelled", label: "Cancelled" },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === filter.key
                      ? "bg-black text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-300"
                  }`}
                >
                  {filter.label} ({statusCounts[filter.key]})
                </button>
              ))}
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-lg border-2 cursor-pointer transition-all ${
                    selectedOrder?.id === order.id
                      ? "border-black shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <p className="text-sm text-gray-500">{order.date}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="text-sm font-medium capitalize">{order.status}</span>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="space-y-2">
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {item.name}
                            {item.quantity > 1 && ` (Qty: ${item.quantity})`}
                          </span>
                          <span className="font-medium">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-500">
                          +{order.items.length - 2} more items
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{order.items.length} items</span>
                      <span className="font-semibold text-lg">₹{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Panel - Order Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 sticky top-24">
              {selectedOrder ? (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
                  
                  {/* Order Status Timeline */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Order Status</h3>
                    <div className="space-y-3">
                      {["placed", "processing", "shipped", "delivered"].map((step, index) => {
                        const isCompleted = 
                          (step === "placed") ||
                          (step === "processing" && ["processing", "shipped", "delivered"].includes(selectedOrder.status)) ||
                          (step === "shipped" && ["shipped", "delivered"].includes(selectedOrder.status)) ||
                          (step === "delivered" && selectedOrder.status === "delivered");
                        
                        const isCurrent = 
                          (step === "placed" && selectedOrder.status === "pending") ||
                          (step === "processing" && selectedOrder.status === "processing") ||
                          (step === "shipped" && selectedOrder.status === "shipped") ||
                          (step === "delivered" && selectedOrder.status === "delivered");

                        return (
                          <div key={step} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full border-2 ${
                              isCompleted 
                                ? "bg-green-500 border-green-500" 
                                : isCurrent
                                ? "bg-white border-green-500"
                                : "bg-white border-gray-300"
                            }`} />
                            <span className={`text-sm ${
                              isCompleted ? "text-green-600 font-medium" : "text-gray-500"
                            }`}>
                              {step === "placed" && "Order Placed"}
                              {step === "processing" && "Processing"}
                              {step === "shipped" && "Shipped"}
                              {step === "delivered" && "Delivered"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Items ({selectedOrder.items.length})</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">
                      {user.address?.street || "123 Main St."}<br />
                      {user.address?.city && `${user.address.city}, `}
                      {user.address?.state || "New York, NY 10001"}
                    </p>
                  </div>

                  {/* Tracking Info */}
                  {selectedOrder.status === "shipped" && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Tracking Number</h3>
                      <p className="text-sm text-gray-600 font-mono">
                        TRK{(selectedOrder.id).slice(-8).toUpperCase()}
                      </p>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹0.00</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-4">
                      <span>Total</span>
                      <span>₹{selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 space-y-3">
                    
                    {selectedOrder.status === "delivered" && (
                      <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                        Return Items
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select an order to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}