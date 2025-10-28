import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        🛍 Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 px-6">
      <h2 className="text-4xl font-semibold mb-8 text-center">Your Shopping Bag</h2>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex flex-col sm:flex-row justify-between items-center border-b pb-4"
          >
            <div className="flex items-center gap-6">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="w-24 h-28 object-cover rounded-md"
              />
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {item.product.title}
                </h3>
                <p className="text-gray-500 capitalize">{item.product.category}</p>
                <p className="text-gray-800 font-semibold mt-1">
                  ₹{item.product.price}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  dispatch(
                    updateQuantity({
                      id: item.product.id,
                      quantity: Number(e.target.value),
                    })
                  )
                }
                className="w-14 border rounded-md text-center"
              />
              <button
                onClick={() => dispatch(removeFromCart(item.product.id))}
                className="text-red-500 hover:text-red-700 transition text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Section */}
      <div className="mt-10 flex justify-between items-center">
        <p className="text-xl font-semibold">Total: ₹{total.toFixed(2)}</p>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition"
        >
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
