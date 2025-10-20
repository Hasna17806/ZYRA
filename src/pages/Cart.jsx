import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  if (items.length === 0)
    return <p className="text-center mt-10 text-gray-500">Your cart is empty 🛒</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Cart</h2>
      {items.map((item) => (
        <div key={item.product.id} className="flex justify-between items-center border-b py-4">
          <div>
            <h3 className="font-semibold">{item.product.title}</h3>
            <p>₹{item.product.price} × {item.quantity}</p>
          </div>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                dispatch(updateQuantity({ id: item.product.id, quantity: Number(e.target.value) }))
              }
              className="border p-1 w-16 rounded"
            />
            <button
              onClick={() => dispatch(removeFromCart(item.product.id))}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      <h3 className="text-xl font-bold text-right mt-4">Total: ₹{total.toFixed(2)}</h3>
      <button
        onClick={() => dispatch(clearCart())}
        className="mt-4 bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Clear Cart
      </button>
    </div>
  );
}
