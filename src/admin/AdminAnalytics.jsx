import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  IndianRupee, 
  MoreVertical, 
  Calendar, 
  Download, 
  Filter,
  Eye,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalyticsData({
          totalRevenue: 45231,
          totalCustomers: 20,
          totalOrders: 32,
          avgOrderValue: 2847,
          revenueChange: 12.5,
          customerChange: 8.2,
          ordersChange: 15.3,
          aovChange: 5.7,
          salesData: [40, 65, 50, 75, 60, 80, 70],
          customerGrowth: [60, 45, 65, 35, 50, 30, 40],
          topProducts: [
            { id: 1, name: "Classic White T-Shirt", sales: 142, revenue: 42600, growth: 15 },
            { id: 2, name: "Slim Fit Jeans", sales: 98, revenue: 58800, growth: 8 },
            { id: 3, name: "Sports Sneakers", sales: 76, revenue: 68400, growth: 22 },
            { id: 4, name: "Winter Jacket", sales: 65, revenue: 84500, growth: -5 },
            { id: 5, name: "Baseball Cap", sales: 54, revenue: 16200, growth: 12 }
          ],
          recentActivity: [
            { id: 1, action: "New order #3245", time: "2 min ago", amount: 2847, type: "order" },
            { id: 2, action: "Customer registered", time: "10 min ago", type: "customer" },
            { id: 3, action: "Payment received #3244", time: "15 min ago", amount: 5231, type: "payment" },
            { id: 4, action: "New order #3243", time: "22 min ago", amount: 1842, type: "order" },
            { id: 5, action: "Product review added", time: "30 min ago", type: "review" }
          ]
        });
        setLoading(false);
      }, 1000);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const getActivityColor = (type) => {
    const colors = {
      order: "bg-green-500",
      customer: "bg-blue-500",
      payment: "bg-purple-500",
      review: "bg-orange-500"
    };
    return colors[type] || "bg-gray-500";
  };

  const getTrendIcon = (value) => {
    if (value > 0) return <ArrowUpRight size={16} className="text-green-600" />;
    if (value < 0) return <ArrowDownRight size={16} className="text-red-600" />;
    return null;
  };

  const getTrendColor = (value) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const exportData = () => {
    // Implement export functionality
    console.log("Exporting analytics data...");
  };

  if (loading || !analyticsData) {
    return (
      <div className="p-6 pt-20 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
          
          {/* Metrics Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Filter size={18} className="text-gray-500" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-gray-700 text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors"
          >
            <Download size={18} className="text-gray-500" />
            <span className="text-gray-700 text-sm font-medium">Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <IndianRupee className="text-green-600" size={24} />
            </div>
            <Eye size={18} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ₹{analyticsData.totalRevenue.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm mb-2">Total Revenue</div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.revenueChange)}`}>
            {getTrendIcon(analyticsData.revenueChange)}
            <span>{analyticsData.revenueChange > 0 ? '+' : ''}{analyticsData.revenueChange}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-50 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="text-blue-600" size={24} />
            </div>
            <Eye size={18} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.totalCustomers}
          </div>
          <div className="text-gray-600 text-sm mb-2">Total Customers</div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.customerChange)}`}>
            {getTrendIcon(analyticsData.customerChange)}
            <span>{analyticsData.customerChange > 0 ? '+' : ''}{analyticsData.customerChange}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-50 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <ShoppingBag className="text-purple-600" size={24} />
            </div>
            <Eye size={18} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {analyticsData.totalOrders}
          </div>
          <div className="text-gray-600 text-sm mb-2">Total Orders</div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.ordersChange)}`}>
            {getTrendIcon(analyticsData.ordersChange)}
            <span>{analyticsData.ordersChange > 0 ? '+' : ''}{analyticsData.ordersChange}%</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all group cursor-pointer">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-50 p-3 rounded-lg group-hover:scale-110 transition-transform">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
            <Eye size={18} className="text-gray-400 group-hover:text-gray-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            ₹{analyticsData.avgOrderValue.toLocaleString()}
          </div>
          <div className="text-gray-600 text-sm mb-2">Avg. Order Value</div>
          <div className={`flex items-center gap-1 text-sm ${getTrendColor(analyticsData.aovChange)}`}>
            {getTrendIcon(analyticsData.aovChange)}
            <span>{analyticsData.aovChange > 0 ? '+' : ''}{analyticsData.aovChange}%</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <button className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 relative">
            {/* Chart bars */}
            <div className="absolute bottom-0 left-0 right-0 h-56 flex items-end justify-between px-4">
              {analyticsData.salesData.map((height, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer shadow-sm relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ₹{Math.round(height * 1000).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </div>
                </div>
              ))}
            </div>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-56 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>₹80k</span>
              <span>₹60k</span>
              <span>₹40k</span>
              <span>₹20k</span>
              <span>₹0</span>
            </div>
          </div>
        </div>

        {/* Customer Growth Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
            <button className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded transition-colors">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 relative">
            {/* Line chart */}
            <div className="absolute bottom-0 left-0 right-0 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <polyline
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeWidth="3"
                  points="10,60 25,45 40,65 55,35 70,50 85,30 90,40"
                />
                {analyticsData.customerGrowth.map((point, index) => {
                  const x = 10 + (index * 15);
                  return (
                    <circle key={index} cx={x} cy={point} r="3" fill="#3b82f6" />
                  );
                })}
              </svg>
            </div>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-56 flex flex-col justify-between text-xs text-gray-500 py-2">
              <span>1.5k</span>
              <span>1.2k</span>
              <span>900</span>
              <span>600</span>
              <span>300</span>
              <span>0</span>
            </div>
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500 font-medium">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((month, index) => (
                <span key={index}>{month}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-600' :
                    index === 1 ? 'bg-gray-100 text-gray-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {index === 0 ? <Star size={14} fill="currentColor" /> : index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </div>
                    <div className="text-sm text-gray-500">{product.sales} units sold</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-1 text-sm ${getTrendColor(product.growth)}`}>
                    {getTrendIcon(product.growth)}
                    <span>{product.growth > 0 ? '+' : ''}{product.growth}%</span>
                  </div>
                  <div className="font-bold text-gray-900 text-right">
                    ₹{product.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1">
              View All <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-2 group hover:bg-gray-50 px-2 rounded transition-colors">
                <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                    {activity.action}
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
                {activity.amount && (
                  <div className="font-bold text-gray-900 text-sm flex-shrink-0">
                    ₹{activity.amount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}