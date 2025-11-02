import { useState } from "react";
import { Save, Bell, Shield, CreditCard, Globe, IndianRupee, Building, Mail, MapPin, FileText, Phone } from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    storeName: "ZYRA",
    storeEmail: "contact@zyra.com",
    storeDescription: "Premium fashion and lifestyle brand offering curated collections for the modern individual.",
    storeAddress: "123 Fashion Street, Mumbai, Maharashtra 400001, India",
    storePhone: "+91 98765 43210",
    currency: "INR",
    timezone: "IST",
    notifications: {
      email: true,
      sms: false,
      push: true,
      orderUpdates: true,
      inventoryAlerts: true
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    payment: {
      stripe: true,
      paypal: false,
      razorpay: true,
      cod: true
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (section, field) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handleNumberChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Settings saved:", settings);
      setSaveMessage("Settings updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("Error saving settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "general", name: "General", icon: <Building size={18} /> },
    { id: "notifications", name: "Notifications", icon: <Bell size={18} /> },
    { id: "security", name: "Security", icon: <Shield size={18} /> },
    { id: "payment", name: "Payment", icon: <CreditCard size={18} /> },
  ];

  const currencies = [
    { code: "INR", name: "Indian Rupee", symbol: "₹" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "EUR", name: "Euro", symbol: "€" },
    { code: "GBP", name: "British Pound", symbol: "£" },
  ];

  const renderGeneralTab = () => (
    <div className="space-y-6">
      {/* Store Information Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
            <p className="text-sm text-gray-600 mt-1">Basic details about your store</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Store Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Store Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Store Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows="3"
                name="storeDescription"
                value={settings.storeDescription}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Describe your store..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Store Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows="2"
                name="storeAddress"
                value={settings.storeAddress}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                placeholder="Enter your complete store address..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Base Currency
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select 
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none bg-white"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {saveMessage && (
              <div className={`px-4 py-2 rounded-lg ${
                saveMessage.includes("Error") 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                {saveMessage}
              </div>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Save size={20} />
            {isLoading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-6">
          {[
            { key: "email", label: "Email Notifications", description: "Receive order updates and reports via email" },
            { key: "sms", label: "SMS Notifications", description: "Get important alerts via SMS" },
            { key: "push", label: "Push Notifications", description: "Browser notifications for real-time updates" },
            { key: "orderUpdates", label: "Order Updates", description: "Notify when new orders are placed" },
            { key: "inventoryAlerts", label: "Inventory Alerts", description: "Get alerts when stock is low" }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.label}</h4>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              </div>
              <button
                onClick={() => handleToggleChange("notifications", item.key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                  settings.notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg ${
                    settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={() => handleToggleChange("security", "twoFactor")}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                settings.security.twoFactor ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg ${
                  settings.security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleNumberChange("security", "sessionTimeout", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <p className="text-sm text-gray-600">Automatically log out after inactivity</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password Expiry (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleNumberChange("security", "passwordExpiry", e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <p className="text-sm text-gray-600">Require password change after</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
        
        <div className="space-y-4">
          {[
            { key: "stripe", label: "Stripe", description: "Credit card payments", color: "bg-blue-500" },
            { key: "paypal", label: "PayPal", description: "International payments", color: "bg-blue-400" },
            { key: "razorpay", label: "Razorpay", description: "Indian payment gateway", color: "bg-orange-500" },
            { key: "cod", label: "Cash on Delivery", description: "Pay when product arrives", color: "bg-green-500" }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {item.label.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleChange("payment", item.key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                  settings.payment[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg ${
                    settings.payment[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Currency Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <IndianRupee className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Currency & Region</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Base Currency
            </label>
            <select 
              name="currency"
              value={settings.currency}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
              <option>IST - India Standard Time</option>
              <option>UTC - Coordinated Universal Time</option>
              <option>EST - Eastern Standard Time</option>
            </select>
          </div>
        </div>

        {settings.currency === "INR" && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h4 className="font-medium text-blue-900 mb-2">Indian Payment Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  GST Number
                </label>
                <input
                  type="text"
                  placeholder="07AABCU9603R1ZM"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-1">
                  Business PAN
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store configuration and preferences</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <div className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-gray-600" />
            <span className="font-medium text-gray-700 text-sm">
              Base: {settings.currency}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2 sticky top-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-4 rounded-xl font-medium flex items-center gap-3 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${
                  activeTab === tab.id ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {tab.icon}
                </div>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {activeTab === "general" && renderGeneralTab()}
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "security" && renderSecurityTab()}
            {activeTab === "payment" && renderPaymentTab()}
          </div>
        </div>
      </div>
    </div>
  );
}