import { useDispatch, useSelector } from "react-redux";
import { clearCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addOrder } from "../redux/orderSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Form state
  const [email, setEmail] = useState(user?.email || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [newsletter, setNewsletter] = useState(false);

  // Handle placing the order
  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!user || !user.email) {
      toast.error("Please log in to place an order.");
      navigate("/login");
      return;
    }

    const newOrder = {
      id: Date.now(),
      userId: user.id || user.email,
      date: new Date().toLocaleString(),
      status: "pending",
      total: items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
    };

    try {
      // Add to Redux for UI
      dispatch(addOrder({ userId: user.email, order: newOrder }));

      // Save order to JSON server automatically
      const response = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Failed to save order");

      // Clear cart and navigate to orders
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Something went wrong while saving your order.");
    }
  };

  // Change quantity
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Render region input based on selected country
  const renderRegionInput = () => {
    switch (country) {
      case "United States":
        return (
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          >
            <option value="">Select state</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        );
      
      case "Canada":
        return (
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          >
            <option value="">Select province</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NB">New Brunswick</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NS">Nova Scotia</option>
            <option value="ON">Ontario</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="NT">Northwest Territories</option>
            <option value="NU">Nunavut</option>
            <option value="YT">Yukon</option>
          </select>
        );
      
      case "Australia":
        return (
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          >
            <option value="">Select state</option>
            <option value="NSW">New South Wales</option>
            <option value="QLD">Queensland</option>
            <option value="SA">South Australia</option>
            <option value="TAS">Tasmania</option>
            <option value="VIC">Victoria</option>
            <option value="WA">Western Australia</option>
            <option value="ACT">Australian Capital Territory</option>
            <option value="NT">Northern Territory</option>
          </select>
        );
      
      case "United Kingdom":
        return (
          <select
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          >
            <option value="">Select county</option>
            <option value="ENG">England</option>
            <option value="SCT">Scotland</option>
            <option value="WLS">Wales</option>
            <option value="NIR">Northern Ireland</option>
          </select>
        );
      
      default:
        return (
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            placeholder="Region"
          />
        );
    }
  };

  // Get region label based on country
  const getRegionLabel = () => {
    switch (country) {
      case "United States": return "State";
      case "Canada": return "Province";
      case "Australia": return "State/Territory";
      case "United Kingdom": return "County";
      default: return "Region";
    }
  };

  // Get postal code label based on country
  const getPostalCodeLabel = () => {
    switch (country) {
      case "United States": return "ZIP code";
      case "Canada": return "Postal code";
      case "United Kingdom": return "Postcode";
      default: return "Postal code";
    }
  };

  // Get postal code placeholder based on country
  const getPostalCodePlaceholder = () => {
    switch (country) {
      case "United States": return "ZIP";
      case "Canada": return "A1A 1A1";
      case "United Kingdom": return "SW1A 1AA";
      default: return "Postal code";
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 pt-24 bg-white">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="ml-2 font-medium">Information</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-gray-500">Shipping</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-gray-500">Payment</span>
          </div>
        </div>
        <div className="text-center">
          <button className="text-sm font-medium text-blue-600 hover:underline">
            Express checkout
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left column - Checkout forms */}
          <div className="md:col-span-2 space-y-8">
            {/* PayPal section */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">PayPal</h2>
              <p className="text-gray-600 mb-4">
                You will be redirected to your chosen secure checkout where you can complete your payment.
              </p>
              <button className="w-full bg-yellow-400 text-black py-3 rounded-md hover:bg-yellow-500 transition font-semibold">
                Checkout with PayPal
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Contact information */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Contact information</h2>
              {!user && (
                <p className="text-sm text-gray-600 mb-4">
                  Already have an account? <button className="text-blue-600 hover:underline">Log in</button>
                </p>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Enter your email"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                  Email me with news and offers
                </label>
              </div>
            </div>

            {/* Shipping address */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
              <p className="text-sm text-gray-600 mb-4">
                Please enter your shipping address using only standard English characters, numbers and punctuation.
              </p>
              
              {/* Country */}
              <div className="mb-4">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country/region
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                >
                  <option value="United States">United States</option>
                  <option value="Australia">Australia</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Japan">Japan</option>
                  <option value="India">India</option>
                </select>
              </div>
              
              {/* Name */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Address"
                />
              </div>
              
              {/* Apartment/Suite */}
              <div className="mb-4">
                <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc. (optional)
                </label>
                <input
                  type="text"
                  id="apartment"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              
              {/* City, Region, Postal Code */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                    placeholder="City"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                      {getRegionLabel()}
                    </label>
                    {renderRegionInput()}
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                      {getPostalCodeLabel()}
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
                      placeholder={getPostalCodePlaceholder()}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="md:col-span-1">
            <div className="border rounded-lg p-6 bg-gray-50 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {/* Cart items in summary */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-start">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-md mr-3"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.product.title}</h3>
                      <p className="text-gray-500 text-xs">iPhone 13</p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">₹{item.product.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Discount code */}
              <div className="mb-4">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Gift card or discount code"
                    className="flex-1 p-3 border border-gray-300 rounded-l-md focus:ring-black focus:border-black"
                  />
                  <button className="bg-gray-200 text-gray-800 px-4 rounded-r-md hover:bg-gray-300 transition">
                    Apply
                  </button>
                </div>
              </div>
              
              {/* Referral */}
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Been referred by a friend?
                </p>
              </div>
              
              {/* Price breakdown */}
              <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-500">Calculated at next step</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-300">
                  <span>Total</span>
                  <div>
                    <span className="text-xs text-gray-500 mr-1">USD</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold mt-6"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}