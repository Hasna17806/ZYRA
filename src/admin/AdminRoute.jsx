import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Shield, AlertCircle, Loader } from "lucide-react";

/**
 * Protects admin-only routes.
 * Redirects if user is not logged in or not an admin.
 * Also prevents access after logout via browser back.
 */

export default function AdminRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // Clear history stack after redirect (prevents back navigation)
  useEffect(() => {
    if (!user || user.role !== "admin") {
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.go(1);
      };
    }
  }, [user]);

  // Simulate authentication check delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <Shield className="absolute inset-0 m-auto text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Checking Access</h3>
          <p className="text-slate-600">Verifying admin permissions...</p>
        </div>
      </div>
    );
  }

  // If not logged in - redirect to login with nice message
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location,
          message: "Please log in to access the admin panel",
          type: "warning"
        }} 
        replace 
      />
    );
  }

  // If logged in but not an admin - show access denied
  if (user.role !== "admin") {
    return (
      <Navigate 
        to="/" 
        state={{ 
          from: location,
          message: "Access denied. Admin privileges required.",
          type: "error"
        }} 
        replace 
      />
    );
  }

  // ✅ Admin allowed - render with admin layout context
  return (
    <div className="admin-route">
      {children}
    </div>
  );
}

// Optional: You can also add this AccessDenied component for better UX
export function AccessDenied() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-red-600" size={40} />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-800 mb-4">
          Access Denied
        </h1>
        
        <p className="text-slate-600 mb-6">
          You don't have permission to access the admin panel. 
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-slate-600 text-white py-3 px-4 rounded-xl hover:bg-slate-700 transition-colors font-medium"
          >
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full border border-slate-300 text-slate-700 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors font-medium"
          >
            Return to Home
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-slate-100 rounded-lg">
          <p className="text-sm text-slate-500">
            Need help? Contact your system administrator for access permissions.
          </p>
        </div>
      </div>
    </div>
  );
}