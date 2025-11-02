import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { Heart, Eye } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isInWishlist = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to wishlist!");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist");
    }
  };

 const discount = product.discount || null;
const currentPrice = product.price;
const originalPrice = discount ? (currentPrice / (1 - discount / 100)).toFixed(0) : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block relative overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        )}
        
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.title || product.name}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } ${isHovered ? "scale-110" : "scale-100"}`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Discount Badge */}
        {discount && discount > 0 && (
      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
      {discount}% OFF
     </div>
       )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isInWishlist
              ? "bg-red-500 text-white scale-110"
              : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
          } shadow-lg z-10`}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={18}
            fill={isInWishlist ? "currentColor" : "none"}
            className="transition-all"
          />
        </button>

        {/* Quick View Button */}
        <div
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-medium text-gray-900">
            <Eye size={16} />
            Quick View
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-600 transition-colors leading-snug">
          {product.title || product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-yellow-400 text-sm">
            {"★".repeat(4)}
            {"☆".repeat(1)}
          </div>
          <span className="text-xs text-gray-500">(128)</span>
        </div>

        {/* Price */}
      <div className="flex items-center gap-2 flex-wrap">
  <span className="text-lg font-bold text-gray-900">
    ₹{currentPrice}
  </span>
  {discount && (
    <>
      <span className="text-sm line-through text-gray-400">
        ₹{originalPrice}
      </span>
      <span className="text-xs text-green-600 font-semibold">
        Save ₹{(originalPrice - currentPrice).toFixed(0)}
      </span>
      </>
     )}
    </div>

        {/* Stock Status */}
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-600">In Stock</span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div
        className={`absolute inset-0 border-2 rounded-xl pointer-events-none transition-all duration-300 ${
          isHovered ? "border-gray-300" : "border-transparent"
        }`}
      />
    </Link>
  );
}