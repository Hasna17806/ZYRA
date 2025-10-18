import { useDispatch, useSelector } from "react-redux";
import { increaseQty, decreaseQty, removeFromCart, clearCart } from "../redux/cartSlice";

export default function Cart (){
    const { items } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (items.length === 0)
        return (
           <div className="text-center mt-20 text-gray-600">
            Your cart is empty 🛒

           </div>
        );

    return (

        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold mb-4 text-center">🛍 Your Cart</h2>

         {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b py-4">
                <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-gray-500">₹{item.price}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                  <button onClick={() => dispatch(decreaseQty(item.id))}
                    className="px-2 py-1 border rounded"
                    >
                     -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                   onClick={() => dispatch(increaseQty(item.id))}
                   className="px-2 py-1 border rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-600 ml-4"
                  >
                  Remove
                  </button>
                  </div>
                </div>
         ))}

         <div className="mt-6 text-right">
        <p className="text-xl font-semibold text-green-700">Total:₹{total.toFixed(2)}
     </p> 
       <button onClick={() => dispatch(clearCart())}
        className="bg-red-600 text-white px-5 py-2 rounded-lg mt-3 hover:bg-red-700"
        >
       Clear Cart
     </button>
         </div>

        </div>
    );
}