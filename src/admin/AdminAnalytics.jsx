import { BarChart3, TrendingUp, Users, ShoppingBag, IndianRupee, MoreVertical, Calendar, Download, Filter } from "lucide-react";

export default function AdminAnalytics() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your store performance and insights</p>
        </div>
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
            <Calendar size={18} className="text-gray-500" />
            <span className="text-gray-700">Last 30 days</span>
          </div>
          <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Download size={18} className="text-gray-500" />
            <span className="text-gray-700">Export</span>
          </button>
          <button className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50">
            <Filter size={18} className="text-gray-500" />
            <span className="text-gray-700">Filter</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹45,231</div>
              <div className="text-gray-600">Total Revenue</div>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
              <IndianRupee className="text-green-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp size={16} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">20</div>
              <div className="text-gray-600">Total Customers</div>
            </div>
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp size={16} />
            <span>+8.2% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">32</div>
              <div className="text-gray-600">Total Orders</div>
            </div>
            <div className="bg-purple-50 p-2 rounded-lg">
              <ShoppingBag className="text-purple-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp size={16} />
            <span>+15.3% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">₹2,847</div>
              <div className="text-gray-600">Avg. Order Value</div>
            </div>
            <div className="bg-orange-50 p-2 rounded-lg">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <TrendingUp size={16} />
            <span>+5.7% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Overview Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Overview</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 relative">
            {/* Chart bars */}
            <div className="absolute bottom-0 left-0 right-0 h-56 flex items-end justify-between px-4">
              {[40, 65, 50, 75, 60, 80, 70].map((height, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="text-xs text-gray-500 mt-2">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Customer Growth</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical size={18} />
            </button>
          </div>
          <div className="h-64 relative">
            {/* Line chart */}
            <div className="absolute bottom-0 left-0 right-0 h-56">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points="10,60 25,45 40,65 55,35 70,50 85,30 90,40"
                />
                <circle cx="10" cy="60" r="2" fill="#3b82f6" />
                <circle cx="25" cy="45" r="2" fill="#3b82f6" />
                <circle cx="40" cy="65" r="2" fill="#3b82f6" />
                <circle cx="55" cy="35" r="2" fill="#3b82f6" />
                <circle cx="70" cy="50" r="2" fill="#3b82f6" />
                <circle cx="85" cy="30" r="2" fill="#3b82f6" />
                <circle cx="90" cy="40" r="2" fill="#3b82f6" />
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
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { name: "Classic White T-Shirt", sales: 142, revenue: "₹42,600" },
              { name: "Slim Fit Jeans", sales: 98, revenue: "₹58,800" },
              { name: "Sports Sneakers", sales: 76, revenue: "₹68,400" },
              { name: "Winter Jacket", sales: 65, revenue: "₹84,500" },
              { name: "Baseball Cap", sales: 54, revenue: "₹16,200" }
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">{product.sales} units sold</div>
                </div>
                <div className="font-semibold text-gray-900">{product.revenue}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {[
              { action: "New order #3245", time: "2 min ago", amount: "₹2,847" },
              { action: "Customer registered", time: "10 min ago" },
              { action: "Payment received #3244", time: "15 min ago", amount: "₹5,231" },
              { action: "New order #3243", time: "22 min ago", amount: "₹1,842" },
              { action: "Product review added", time: "30 min ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
                {activity.amount && (
                  <div className="font-semibold text-gray-900">{activity.amount}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}