import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity, clearCart } from "../redux/cartSlice";
import CartItem from "./CartItem";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function CartDrawer({ isOpen, onClose }) {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* --- Backdrop --- */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* --- Drawer --- */}
          <motion.div
            className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-white z-50 flex flex-col rounded-l-2xl shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 250, damping: 28 }}
          >
            {/* --- Header --- */}
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold tracking-wide uppercase">
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-black transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* --- Cart Items --- */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
              {items.length > 0 ? (
                items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onRemove={() => dispatch(removeFromCart(item.product.id))}
                    onQuantityChange={(q) =>
                      dispatch(
                        updateQuantity({ id: item.product.id, quantity: q })
                      )
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full text-gray-500 mt-24">
                  <p className="text-lg">Your cart is empty 🛍️</p>
                  <p
                    onClick={() => {
                      onClose();
                      navigate("/products");
                    }}
                    className="mt-3 text-sm text-black underline cursor-pointer"
                  >
                    Continue Shopping
                  </p>
                </div>
              )}
            </div>

            {/* --- Footer --- */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="font-semibold text-lg text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 rounded-xl text-sm uppercase tracking-wider hover:bg-gray-800 transition-all"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => dispatch(clearCart())}
                  className="w-full mt-3 text-gray-500 text-sm hover:underline"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
