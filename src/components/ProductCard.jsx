import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ShoppingBag, Check, Heart } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);
  const wishlistState = useSelector((state) => state.wishlist);
  const wishlistItems = wishlistState?.items || [];

  const [isAdding, setIsAdding] = useState(false);

  // Check if already in cart
  const isInCart = cartItems.some((item) => item.product.id === product.id);
  
  // Check if in wishlist
  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to cart", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
      return;
    }

    if (isInCart) {
      toast("Already in your cart 🛒", {
        icon: "ℹ️",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
      return;
    }

    setIsAdding(true);
    setTimeout(() => {
      dispatch(addToCart({ product, quantity: 1 }));
      setIsAdding(false);
      toast.success(`${product.title} added to cart`, {
        icon: "🛍️",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
    }, 700);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to save items to wishlist", {
        icon: "🔒",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist", {
        icon: "💔",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
    } else {
      dispatch(addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        stock: product.stock
      }));
      toast.success("Added to wishlist", {
        icon: "❤️",
        style: {
          borderRadius: "10px",
          background: "#fff",
          color: "#333",
          fontSize: "14px",
        },
      });
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group flex flex-col text-center cursor-pointer transition-all duration-300 hover:shadow-xl bg-white rounded-xl overflow-hidden border border-gray-100"
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Heart Button - Top Right */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 ${
            isInWishlist 
              ? "bg-red-500 text-white shadow-lg" 
              : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500 group-hover:opacity-100 opacity-0"
          }`}
        >
          <Heart 
            size={18} 
            className={isInWishlist ? "fill-current" : ""}
          />
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full shadow-md text-xs tracking-widest uppercase transition-all duration-300
          ${isInCart
            ? "bg-green-600 text-white"
            : "bg-black text-white group-hover:opacity-100 opacity-0"}
          ${isAdding ? "opacity-75 cursor-wait" : ""}
          `}
        >
          {isInCart ? (
            <span className="flex items-center gap-1">
              <Check size={14} /> In Cart
            </span>
          ) : isAdding ? (
            <span className="flex items-center gap-1 animate-pulse">
              <ShoppingBag size={14} /> Adding...
            </span>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>

      {/* Product Info */}
      <div className="px-4 py-5">
        <h3 className="text-base font-medium text-gray-900 truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>

        {/* Rating */}
        <div className="flex justify-center items-center gap-2 mt-2 text-xs text-yellow-500">
          ★★★★☆ 
        </div>

        {product.stock && (
          <p className="mt-2 text-xs text-green-600 font-semibold">
            In Stock: {product.stock}
          </p>
        )}
      </div>
    </div>
  );
}