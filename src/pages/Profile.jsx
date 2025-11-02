import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, updateProfile } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { clearOrders } from "../redux/orderSlice";
import { useEffect, useState, useRef } from "react";
import { User, MapPin, Lock, Edit2, Save, X, Camera, Mail, Phone, Package, Heart, LogOut, Shield, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: {
      city: "",
      district:"",
      state: "",
      zipCode: "",
      country: "India"
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user) navigate("/login");
    // Initialize form data with user data
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "India"
        }
      });
      setProfileImage(user.profileImage || null);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    dispatch(clearOrders({ userId: user.email }));
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleSaveProfile = async () => {
    try {
      // Create updated user data
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage: profileImage
      };

      // Dispatch the updateProfile action to save to Redux and localStorage
      dispatch(updateProfile(updatedUser));
      
      // Also update in JSON server if you're using it
      try {
        const response = await fetch(`http://localhost:4000/users/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        });

        if (!response.ok) throw new Error("Failed to update profile on server");
      } catch (serverError) {
        console.warn("Could not update profile on server:", serverError);
        // Continue anyway since Redux state is updated
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      // Update password in JSON server
      const updatedUser = {
        ...user,
        password: passwordData.newPassword // In real app, hash this password
      };

      const response = await fetch(`http://localhost:4000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) throw new Error("Failed to update password");

      setIsEditingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || {
        city: "",
        district: "",
        state: "",
        zipCode: "",
        country: "India"
      }
    });
    setProfileImage(user.profileImage || null);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        // Auto-save when profile image is changed
        const updatedUser = {
          ...user,
          profileImage: e.target.result
        };
        dispatch(updateProfile(updatedUser));
        toast.success("Profile photo updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    const updatedUser = {
      ...user,
      profileImage: null
    };
    dispatch(updateProfile(updatedUser));
    toast.success("Profile photo removed");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-2">Manage your profile, address, and security settings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Welcome back, {user.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Enhanced Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              {/* Profile Summary */}
              <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-gray-100">
                <div className="relative mb-4 group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={triggerFileInput}
                    className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <div className="flex items-center gap-1 mt-2">
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    activeTab === "profile" 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === "profile" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <User className={`w-4 h-4 ${activeTab === "profile" ? "text-blue-600" : "text-gray-600"}`} />
                  </div>
                  Profile Settings
                </button>

                <button 
                  onClick={() => navigate("/orders")}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-orange-600" />
                  </div>
                  My Orders
                </button>

                <button 
                  onClick={() => navigate("/wishlist")}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 text-red-600" />
                  </div>
                  My Wishlist
                </button>

                <button 
                  onClick={() => setActiveTab("security")}
                  className={`w-full text-left px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-3 ${
                    activeTab === "security" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === "security" ? "bg-green-100" : "bg-gray-100"
                  }`}>
                    <Shield className={`w-4 h-4 ${activeTab === "security" ? "text-green-600" : "text-gray-600"}`} />
                  </div>
                  Security
                </button>

                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 flex items-center gap-3 mt-4"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-red-600" />
                  </div>
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Enhanced Personal Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                          <p className="text-sm text-gray-500">Update your personal details</p>
                        </div>
                      </div>
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200"
                          >
                            <Save className="w-4 h-4" />
                            Save Changes
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your full name"
                          />
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <p className="text-gray-900 font-medium">{user.name}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-gray-900 font-medium">{user.email}</p>
                            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        {isEditing ? (
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <p className="text-gray-900 font-medium">{formData.phone || "Not provided"}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Address Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
                          <p className="text-sm text-gray-500">Manage your shipping addresses</p>
                        </div>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => {
                            setFormData({
                              ...formData,
                              address: {
                                street: "",
                                city: "",
                                state: "",
                                zipCode: "",
                                country: "India"
                              }
                            });
                          }}
                          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({
                              ...formData, 
                              address: {...formData.address, street: e.target.value}
                            })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Enter your street address"
                          />
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-gray-900 font-medium">{formData.address.street || "Not provided"}</p>
                          </div>
                        )}
                      </div>

                      {["city", "state", "zipCode", "country"].map((field) => (
                        <div key={field} className="space-y-1">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field === "zipCode" ? "ZIP Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {isEditing ? (
                            field === "country" ? (
                              <select
                                value={formData.address.country}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  address: {...formData.address, country: e.target.value}
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              >
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                                <option value="Canada">Canada</option>
                                <option value="Australia">Australia</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={formData.address[field]}
                                onChange={(e) => setFormData({
                                  ...formData, 
                                  address: {...formData.address, [field]: e.target.value}
                                })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder={`Enter ${field}`}
                              />
                            )
                          ) : (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-gray-900 font-medium">{formData.address[field] || "Not provided"}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                {/* Enhanced Change Password Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Lock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                          <p className="text-sm text-gray-500">Secure your account with a new password</p>
                        </div>
                      </div>
                      {!isEditingPassword ? (
                        <button
                          onClick={() => setIsEditingPassword(true)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-all duration-200 hover:shadow-md"
                        >
                          <Edit2 className="w-4 h-4" />
                          Change Password
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={handleSavePassword}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-all duration-200"
                          >
                            <Save className="w-4 h-4" />
                            Update Password
                          </button>
                          <button
                            onClick={() => setIsEditingPassword(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg border border-gray-300 transition-all duration-200"
                          >
                            <X className="w-4 h-4" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingPassword && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                        {["currentPassword", "newPassword", "confirmPassword"].map((field) => (
                          <div key={field} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field === "currentPassword" ? "Current Password" : 
                               field === "newPassword" ? "New Password" : "Confirm New Password"}
                            </label>
                            <input
                              type="password"
                              value={passwordData[field]}
                              onChange={(e) => setPasswordData({...passwordData, [field]: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                              placeholder={`Enter ${field === "currentPassword" ? "current" : "new"} password`}
                            />
                          </div>
                        ))}
                        <div className="md:col-span-2">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements</h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                              <li> At least 6 characters long</li>
                              <li> Include uppercase and lowercase letters</li>
                              <li> Include numbers and special characters</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Security Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                        <p className="text-sm text-gray-500">Manage your account security preferences</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Enable
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h3 className="font-medium text-gray-900">Login Notifications</h3>
                          <p className="text-sm text-gray-500">Get notified of new sign-ins</p>
                        </div>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-gray-300">
                          <input type="checkbox" className="sr-only" defaultChecked />
                          <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}