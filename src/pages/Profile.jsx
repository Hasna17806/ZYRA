import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, updateProfile } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { useEffect, useState, useRef } from "react";
import { User, MapPin, Lock, Edit2, Save, X, Camera, Mail, Phone, Package, Heart, LogOut, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "India" }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || { street: "", city: "", state: "", zipCode: "", country: "India" }
    });
    setProfileImage(user.profileImage || null);
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  const handleSaveProfile = async () => {
    try {
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        profileImage
      };
      
      dispatch(updateProfile(updatedUser));
      
      // Update on server
      await fetch(`http://localhost:4000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      
      setIsEditing(false);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleSavePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (passwordData.currentPassword !== user.password) {
      toast.error("Current password is incorrect");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const updatedUser = { ...user, password: passwordData.newPassword };
      
      await fetch(`http://localhost:4000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      dispatch(updateProfile(updatedUser));
      setIsEditingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully!");
    } catch (error) {
      toast.error("Failed to update password");
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || { street: "", city: "", state: "", zipCode: "", country: "India" }
    });
    setProfileImage(user.profileImage || null);
    setIsEditing(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setProfileImage(e.target.result);
      dispatch(updateProfile({ ...user, profileImage: e.target.result }));
      toast.success("Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  const navItems = [
    { id: "profile", icon: User, label: "Profile", action: () => setActiveTab("profile") },
    { id: "orders", icon: Package, label: "My Orders", action: () => navigate("/orders") },
    { id: "wishlist", icon: Heart, label: "Wishlist", action: () => navigate("/wishlist") },
    { id: "security", icon: Shield, label: "Security", action: () => setActiveTab("security") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Manage your profile and settings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border shadow-sm p-6 sticky top-24">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6 pb-6 border-b">
                <div className="relative mb-3">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-lg"
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
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                      activeTab === item.id
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors mt-4"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="border-b px-6 py-4 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                      <p className="text-sm text-gray-500">Update your personal details</p>
                    </div>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveProfile}
                          className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{user.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900">{user.email}</span>
                        </div>
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                            placeholder="Enter phone number"
                          />
                        ) : (
                          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-900">{formData.phone || "Not provided"}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <div className="border-b px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                    <p className="text-sm text-gray-500">Your shipping address</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Street */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData({...formData, address: {...formData.address, street: e.target.value}})}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                            placeholder="Street address"
                          />
                        ) : (
                          <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{formData.address.street || "Not provided"}</p>
                        )}
                      </div>

                      {/* City, State, ZIP, Country */}
                      {["city", "state", "zipCode", "country"].map((field) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {field === "zipCode" ? "ZIP Code" : field.charAt(0).toUpperCase() + field.slice(1)}
                          </label>
                          {isEditing ? (
                            field === "country" ? (
                              <select
                                value={formData.address.country}
                                onChange={(e) => setFormData({...formData, address: {...formData.address, country: e.target.value}})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                              >
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                                <option value="United Kingdom">United Kingdom</option>
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={formData.address[field]}
                                onChange={(e) => setFormData({...formData, address: {...formData.address, [field]: e.target.value}})}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                                placeholder={`Enter ${field}`}
                              />
                            )
                          ) : (
                            <p className="p-3 bg-gray-50 rounded-lg text-gray-900">{formData.address[field] || "Not provided"}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Lock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                  </div>
                  
                  {!isEditingPassword ? (
                    <button
                      onClick={() => setIsEditingPassword(true)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      <Edit2 className="w-4 h-4" /> Change Password
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePassword}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Save className="w-4 h-4" /> Update
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditingPassword && (
                  <div className="p-6">
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                          placeholder="Enter current password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                          placeholder="Enter new password"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {!isEditingPassword && (
                  <div className="p-6">
                    <p className="text-gray-600 text-sm">
                      Click "Change Password" to update your password securely.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}