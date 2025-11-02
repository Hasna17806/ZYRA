import { useState } from "react";
import { Save, Bell, Shield, CreditCard, Building, Mail, MapPin, FileText, Phone, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings saved:", settings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Error saving settings");
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
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Description
            </label>
            <textarea
              rows="3"
              name="storeDescription"
              value={settings.storeDescription}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Store Address
            </label>
            <textarea
              rows="2"
              name="storeAddress"
              value={settings.storeAddress}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="storePhone"
                value={settings.storePhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select 
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          <Save size={20} />
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
      
      <div className="space-y-4">
        {[
          { key: "email", label: "Email Notifications", description: "Receive updates via email" },
          { key: "sms", label: "SMS Notifications", description: "Get alerts via SMS" },
          { key: "push", label: "Push Notifications", description: "Browser notifications" },
          { key: "orderUpdates", label: "Order Updates", description: "Notify on new orders" },
          { key: "inventoryAlerts", label: "Inventory Alerts", description: "Low stock alerts" }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div>
              <h4 className="font-medium text-gray-900">{item.label}</h4>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <button
              onClick={() => handleToggleChange("notifications", item.key)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.notifications[item.key] ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
              <p className="text-sm text-gray-600">Extra security for your account</p>
            </div>
            <button
              onClick={() => handleToggleChange("security", "twoFactor")}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                settings.security.twoFactor ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                  settings.security.twoFactor ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleNumberChange("security", "sessionTimeout", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Expiry (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={settings.security.passwordExpiry}
                onChange={(e) => handleNumberChange("security", "passwordExpiry", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Methods</h3>
        
        <div className="space-y-4">
          {[
            { key: "stripe", label: "Stripe", description: "Credit card payments", color: "bg-blue-500" },
            { key: "paypal", label: "PayPal", description: "International payments", color: "bg-blue-600" },
            { key: "razorpay", label: "Razorpay", description: "Indian payment gateway", color: "bg-purple-500" },
            { key: "cod", label: "Cash on Delivery", description: "Pay on delivery", color: "bg-green-500" }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                  {item.label.charAt(0)}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleChange("payment", item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.payment[item.key] ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.payment[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 pt-20 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-gray-600 mt-1">Manage your store configuration</p>
        </div>
        <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-gray-700 text-sm">{settings.currency}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "general" && renderGeneralTab()}
          {activeTab === "notifications" && renderNotificationsTab()}
          {activeTab === "security" && renderSecurityTab()}
          {activeTab === "payment" && renderPaymentTab()}
        </div>
      </div>
    </div>
  );
}