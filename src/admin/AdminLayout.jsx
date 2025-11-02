import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logoutUser } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronDown, 
  Settings,
  ShoppingBag,
  BarChart3
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={20} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem ? currentItem.name : "Dashboard";
  };

  const getPageDescription = () => {
    const title = getPageTitle();
    switch (title) {
      case "Dashboard": return "Manage your e-commerce store efficiently";
      case "Products": return "Manage your product catalog, inventory, and pricing";
      case "Users": return "Manage user accounts, permissions, and access controls";
      case "Orders": return "Manage and track customer orders";
      case "Analytics": return "Track your store performance and insights";
      case "Settings": return "Manage your store settings and preferences";
      default: return "Admin panel management";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}

      <div className={`         
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
               
                <div className="mt-16">
                  <p className="text-gray-500 text-sm">Admin Panel</p>
                </div>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            
            <div className="mt-7 ">
              <p className="text-gray-500 text-sm">Welcome back,</p>
              <p className="text-gray-900 font-semibold">
                {user?.name}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-black text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className={`
                    transition-colors duration-200
                    ${isActive ? 'text-white' : 'text-gray-400'}
                  `}>
                    {item.icon}
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between p-4 lg:px-6">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <Menu size={20} className="text-gray-700" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {getPageDescription()}
                </p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="text-left hidden lg:block"> 
                    <div className="font-semibold text-gray-900">
                      {user?.name || "Admin User"}
                    </div>
                    <div className="text-gray-500 text-sm">Administrator</div>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900">{user?.name || "Admin User"}</div>
                      <div className="text-gray-500 text-sm">Administrator</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}