import { useDispatch, useSelector } from "react-redux";
import { clearCart, updateQuantity, removeFromCart } from "../redux/cartSlice";
import { addOrder } from "../redux/orderSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Handle placing the order
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
      //  Add to Redux for UI
      dispatch(addOrder({ userId: user.email, order: newOrder }));

      //  Save order to JSON server automatically
      const response = await fetch("http://localhost:4000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error("Failed to save order");

      //  Clear cart and navigate to orders
      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Error saving order:", error);
      toast.error("Something went wrong while saving your order.");
    }
  };

  // ✅ Change quantity
  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ id, quantity }));
  };

  // ✅ Remove item from cart
  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 pt-24 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          Your cart is empty.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* 🛍️ Cart Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.title}</h2>
                  <p className="text-gray-500">Price: ₹{item.product.price}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <input
                      type="number"
                      value={item.quantity}
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(
                          item.product.id,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-16 p-1 border rounded text-center"
                    />
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* 💰 Order Summary */}
          <div className="p-6 bg-gray-50 rounded-lg shadow-inner flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition font-semibold"
            >
              Confirm Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
