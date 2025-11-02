import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  Users, 
  UserX, 
  TrendingUp, 
  Archive,
  ShoppingCart,
  BarChart3,
  Eye,
  Edit,
  Plus
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    inactiveProducts: 0,
  });
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
          (u) => !u.isBlocked && u.status !== "inactive"
        ).length;
        const blockedUsers = users.filter((u) => u.isBlocked).length;

        // Calculate recent orders (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentOrders = orders.filter(order => 
          new Date(order.createdAt) > oneWeekAgo
        ).length;

        setStats({
          totalProducts: activeProducts,
          inactiveProducts,
          totalUsers: users.length,
          activeUsers,
          blockedUsers,
          totalOrders: orders.length,
          recentOrders,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0)
        });
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
      <div className="p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div> 
    ); 
  } 

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 mt-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-slate-600 mt-2">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Total Products */}
        <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 relative group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-slate-700 text-sm font-medium mb-2">
            Active Products
          </h3>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            {stats.totalProducts}
          </p>
          <div className="flex items-center text-xs text-slate-500">
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {stats.inactiveProducts} inactive
            </span>
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-sm border border-green-100 relative group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Users className="text-green-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-slate-700 text-sm font-medium mb-2">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            {stats.totalUsers}
          </p>
          <div className="flex items-center text-xs text-slate-500">
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full mr-2">
              {stats.activeUsers} active
            </span>
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {stats.blockedUsers} blocked
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100 relative group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <ShoppingCart className="text-purple-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-slate-700 text-sm font-medium mb-2">
            Total Orders
          </h3>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            {stats.totalOrders || 0}
          </p>
          <div className="flex items-center text-xs text-slate-500">
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {stats.recentOrders || 0} this week
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100 relative group hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-slate-700 text-sm font-medium mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-slate-800 mb-2">
            ₹{(stats.totalRevenue || 0).toLocaleString()}
          </p>
          <div className="text-xs text-slate-500">
            All time sales
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Manage Products */}
        <Link
          to="/admin/products"
          className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Package size={24} />
            </div>
            <Plus className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
          <p className="text-blue-100 text-sm opacity-90">
            Add, edit, or archive products in your catalog
          </p>
          <div className="flex items-center mt-4 text-blue-200 text-sm">
            <Edit size={16} className="mr-2" />
            Product management
          </div>
        </Link>

        {/* Manage Users */}
        <Link
          to="/admin/users"
          className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={24} />
            </div>
            <Eye className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-green-100 text-sm opacity-90">
            View user accounts and manage permissions
          </p>
          <div className="flex items-center mt-4 text-green-200 text-sm">
            <UserX size={16} className="mr-2" />
            User management
          </div>
        </Link>

        {/* View Analytics */}
        <Link
          to="/admin/analytics"
          className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <BarChart3 size={24} />
            </div>
            <TrendingUp className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
          <h2 className="text-xl font-semibold mb-2">View Analytics</h2>
          <p className="text-purple-100 text-sm opacity-90">
            Detailed sales reports and performance metrics
          </p>
          <div className="flex items-center mt-4 text-purple-200 text-sm">
            <BarChart3 size={16} className="mr-2" />
            Sales analytics
          </div>
        </Link>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          <Link 
            to="/admin/orders" 
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View all
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{stats.recentOrders || 0}</div>
            <div className="text-sm text-blue-700">Orders This Week</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
            <div className="text-sm text-green-700">Active Users</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
            <div className="text-sm text-purple-700">Live Products</div>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-orange-600">
             ₹{((stats.totalRevenue || 0) / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-orange-700">Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
}