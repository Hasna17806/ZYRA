import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { fetchProducts } from "../redux/productSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Heart } from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  // Load products if not available
  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items]);

  const product = items.find((p) => p.id.toString() === id);
  const isInWishlist = wishlistItems.some((item) => item.id === product?.id);

  useEffect(() => {
    if (product) document.title = `ZYRA | ${product.title}`;
  }, [product]);

  const handleWishlistClick = () => {
    if (!user) {
      toast.error("Please login to save items to wishlist!");
      navigate("/login");
      return;
    }

    if (isInWishlist) {
      dispatch(removeFromWishlist(product.id));
      toast.success("Removed from wishlist!");
    } else {
      dispatch(addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        description: product.description,
        stock: product.stock
      }));
      toast.success("Added to wishlist!");
    }
  };

  if (isLoading || !product) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading product...
      </p>
    );
  }

  const stock = product.stock ?? 10;

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login before adding to cart!");
      navigate("/login");
      return;
    }

    dispatch(addToCart({ product, quantity: 1 }));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16 bg-white"
    >
      {/* Product Images */}
      <div className="lg:w-1/2 space-y-4">
        <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[500px] object-contain hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
         <button
      onClick={handleWishlistClick}
       className={`w-full sm:w-auto border px-8 py-3 rounded-md transition-all duration-300 text-sm uppercase tracking-wide ${
         isInWishlist
          ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100"
        : "border-gray-300 text-gray-700 hover:bg-gray-100"
         }`}
>
      {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
          </div>
      </div>    

      {/* Product Info */}
      <div className="lg:w-1/2 flex flex-col justify-between">
        <div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight">
            {product.title}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-6 text-yellow-500 text-sm">
            ★★★★☆ <span className="text-gray-500 ml-2">(128 reviews)</span>
          </div>

          <p className="text-gray-600 text-base mb-8 leading-relaxed">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-3xl font-bold text-gray-900">
              ₹{product.price}
            </span>
            <span className="text-gray-400 line-through text-lg">
              ₹{(product.price * 1.2).toFixed(0)}
            </span>
            <span className="text-green-600 font-semibold text-sm">
              20% OFF
            </span>
          </div>

          {/* Stock Info */}
          <p className="text-sm text-gray-500 mb-6">
            {stock > 0
              ? `In Stock (${stock} available)`
              : "Out of Stock"}
          </p>
        </div>

        {/* Add to Cart Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-all duration-300 shadow-md text-sm uppercase tracking-wide"
          >
            Add to Cart
          </button>

          <button
            onClick={handleWishlistClick}
            className={`w-full sm:w-auto border px-8 py-3 rounded-md transition-all duration-300 text-sm uppercase tracking-wide ${
              isInWishlist
                ? "border-red-500 text-red-600 bg-red-50 hover:bg-red-100"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
          >
            {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-100 transition-all duration-300 text-sm uppercase tracking-wide"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </motion.div>
  );
}