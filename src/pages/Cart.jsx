import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";

export default function Cart() {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce
  ((sum, item) => sum + item.product.price * item.quantity,
    0
  );

// if (!user)
//     return <p className="text-center mt-10 text-gray-500">Login to view your cart</p>

  if (items.length === 0) {
    return (
  <div className="text-center mt-10">
   <h2 className="text-2xl font-bold mb-3 text-gray-500">Your Cart is Empty</h2>
   {/* <Link to="/products" className="text-blue-500 hover:underline">
    Go shopping
   </Link> */}
   </div>
    );
  }

  return (
    <div className="p-6">
      {/* max-w-4xl mx-auto bg-white rounded-lg shadow-lg mt-10 */}
      <h2 className="text-3xl font-bold mb-4 text-center">Your Cart</h2>

      <div className="space-y-4">
      {items.map((item) => (
        <div 
        key={item.product.id}
         className="flex justify-between items-center border p-3 rounded-lg shadow"
         
        >

          <div className="flex items-center gap-4">
            <img 
               src={item.product.image}
               alt={item.product.title}
               className="w-20 h-20 object-cover rounded"
               />
               <div>
            <h3 className="font-semibold">{item.product.title}</h3>
            <p className="text-gray-500">
              ₹{item.product.price} × {item.quantity}
              </p>
          </div>
          </div>


          <div className="flex gap-2 items-center">
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
              className="border w-16 text-center rounded"
            />
            <button
              onClick={() => dispatch(removeFromCart(item.product.id))}
              className="bg-red-500 text-white px-3 py-1 hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
      </div>

      <div className="text-right mt-6">
      <h3 className="text-2xl font-semibold">Total: ₹{total}</h3>
      <button
        onClick={() => dispatch(clearCart())}
        className=" mt-3 bg-gray-800 text-white px-5 py-2 rounded hover:bg-black"
      >
        Clear Cart
      </button>
    </div>
    </div>
  );
}