import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Package, 
  Users, 
  UserX, 
  TrendingUp, 
  TrendingDown,
  ShoppingCart,
  BarChart3,
  Eye,
  Edit,
  Plus,
  DollarSign,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    inactiveProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from JSON Server
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, usersRes, ordersRes] = await Promise.all([
          fetch("http://localhost:4000/products"),
          fetch("http://localhost:4000/users"),
          fetch("http://localhost:4000/orders"),
        ]);

        const products = await productsRes.json();
        const users = await usersRes.json();
        const orders = await ordersRes.json();

        // Count active/soft-deleted products
        const activeProducts = products.filter(
          (p) => p.status !== "inactive"
        ).length;
        const inactiveProducts = products.filter(
          (p) => p.status === "inactive"
        ).length;

        // Count users by status
        const activeUsers = users.filter(
          (u) => !u.isBlocked && u.status !== "inactive" && u.role !== "admin"
        ).length;
        const blockedUsers = users.filter((u) => u.isBlocked).length;

        // Calculate recent orders (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentOrdersList = orders.filter(order => 
          new Date(order.createdAt || order.date) > oneWeekAgo
        );

        // Get low stock products
        const lowStock = products.filter(p => p.stock < 10 && p.status !== "inactive").slice(0, 5);

        // Get recent orders for display
        const sortedOrders = [...orders]
          .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
          .slice(0, 5);

        setStats({
          totalProducts: activeProducts,
          inactiveProducts,
          totalUsers: users.filter(u => u.role !== "admin").length,
          activeUsers,
          blockedUsers,
          totalOrders: orders.length,
          recentOrders: recentOrdersList.length,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
          pendingOrders: orders.filter(o => o.status === "pending").length,
          completedOrders: orders.filter(o => o.status === "completed").length,
        });

        setRecentOrders(sortedOrders);
        setLowStockProducts(lowStock);
      } catch (err) {
        console.error("❌ Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
        <div className="animate-pulse max-w-7xl mx-auto">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white h-40 rounded-2xl shadow-sm"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white h-64 rounded-2xl shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    ); 
  } 

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${(stats.totalRevenue || 0).toLocaleString()}`,
      subtitle: "All time sales",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+12.5%",
      trendUp: true,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      subtitle: `${stats.recentOrders || 0} this week`,
      icon: ShoppingCart,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+8.2%",
      trendUp: true,
    },
    {
      title: "Active Products",
      value: stats.totalProducts,
      subtitle: `${stats.inactiveProducts} inactive`,
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      trend: "+3",
      trendUp: true,
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      subtitle: `${stats.activeUsers} active, ${stats.blockedUsers} blocked`,
      icon: Users,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      trend: "+15.3%",
      trendUp: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your store today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard stat={stat} />
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <QuickActionCard
            title="Manage Products"
            description="Add, edit, or archive products in your catalog"
            icon={<Package size={24} />}
            iconHover={<Plus size={20} />}
            gradient="from-blue-500 to-blue-600"
            link="/admin/products"
            badge="Product management"
            badgeIcon={<Edit size={16} />}
          />
          
          <QuickActionCard
            title="Manage Users"
            description="View user accounts and manage permissions"
            icon={<Users size={24} />}
            iconHover={<Eye size={20} />}
            gradient="from-green-500 to-green-600"
            link="/admin/users"
            badge="User management"
            badgeIcon={<UserX size={16} />}
          />
          
          <QuickActionCard
            title="View Analytics"
            description="Detailed sales reports and performance metrics"
            icon={<BarChart3 size={24} />}
            iconHover={<TrendingUp size={20} />}
            gradient="from-purple-500 to-purple-600"
            link="/admin/analytics"
            badge="Sales analytics"
            badgeIcon={<BarChart3 size={16} />}
          />
        </motion.div>

        {/* Recent Orders & Low Stock */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
              <Link 
                to="/admin/orders" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 group"
              >
                View all
                <TrendingUp size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900">Order #{order.id}</p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt || order.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{order.total?.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </motion.div>

          {/* Low Stock Alert */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertCircle size={20} className="text-orange-500" />
                Low Stock Alert
              </h2>
              <Link 
                to="/admin/products" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 group"
              >
                Manage
                <Edit size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {lowStockProducts.length > 0 ? (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100"
                  >
                    <img
                      src={product.image || "https://via.placeholder.com/60"}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1 mb-1">
                        {product.title}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-orange-600">
                        {product.stock} left
                      </p>
                      <p className="text-xs text-gray-500">units</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <p>All products are well stocked</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickStat
              value={stats.pendingOrders || 0}
              label="Pending Orders"
              icon={<Clock size={20} />}
              color="bg-yellow-50 text-yellow-600"
            />
            <QuickStat
              value={stats.completedOrders || 0}
              label="Completed Orders"
              icon={<CheckCircle size={20} />}
              color="bg-green-50 text-green-600"
            />
            <QuickStat
              value={stats.activeUsers}
              label="Active Users"
              icon={<Users size={20} />}
              color="bg-blue-50 text-blue-600"
            />
            <QuickStat
              value={stats.totalProducts}
              label="Live Products"
              icon={<Package size={20} />}
              color="bg-purple-50 text-purple-600"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ stat }) {
  const Icon = stat.icon;
  const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;

  return (
    <div className={`bg-gradient-to-br ${stat.bgColor} border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
          <Icon className={stat.iconColor} size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          stat.trendUp ? "text-green-600" : "text-red-600"
        }`}>
          <TrendIcon size={16} />
          {stat.trend}
        </div>
      </div>
      <h3 className="text-gray-700 text-sm font-medium mb-2">
        {stat.title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">
        {stat.value}
      </p>
      <p className="text-sm text-gray-600">{stat.subtitle}</p>
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ title, description, icon, iconHover, gradient, link, badge, badgeIcon }) {
  return (
    <Link
      to={link}
      className={`group bg-gradient-to-br ${gradient} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          {iconHover}
        </div>
      </div>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-white/90 text-sm opacity-90 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center mt-4 text-white/80 text-sm">
        {badgeIcon}
        <span className="ml-2">{badge}</span>
      </div>
    </Link>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
    completed: { color: "bg-green-100 text-green-700", icon: CheckCircle },
    cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
    processing: { color: "bg-blue-100 text-blue-700", icon: Clock },
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

// Quick Stat Component
function QuickStat({ value, label, icon, color }) {
  return (
    <div className={`p-4 ${color} rounded-xl text-center hover:scale-105 transition-transform`}>
      <div className="flex justify-center mb-2">
        {icon}
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs font-medium opacity-80">{label}</div>
    </div>
  );
}