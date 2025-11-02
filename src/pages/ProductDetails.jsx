import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
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

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

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

  if (isLoading || !product) {
    return (
      <p className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading product...
      </p>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login before adding to cart!");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size before adding to cart!");
      return;
    }
    dispatch(addToCart({ product, quantity: 1, selectedSize, selectedColor }));
    toast.success(`${product.title} added to cart!`);
  };

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
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist!");
    }
  };

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = product.colors || ["#000000"]; // fallback if not provided

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto px-6 py-10 md:py-16 bg-white"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
        {/* LEFT: Single Image */}
        <div className="flex justify-center">
          <div className="relative bg-gray-50 rounded-lg overflow-hidden max-w-md w-full flex justify-center items-center shadow-sm">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[450px] sm:h-[550px] object-contain"
            />
            <button
              onClick={handleWishlistClick}
              className={`absolute top-4 right-4 p-2 rounded-full border transition-all duration-300 ${
                isInWishlist
                  ? "bg-red-100 border-red-400 text-red-600"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2 leading-tight">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-2xl font-semibold text-gray-900">
              ₹{product.price}
            </span>
            <span className="line-through text-gray-400">
              ₹{(product.price * 1.2).toFixed(0)}
            </span>
            <span className="text-green-600 font-medium">20% OFF</span>
          </div>

          <div className="flex items-center gap-1 text-yellow-500 mb-6 text-sm">
            ★★★★☆ <span className="text-gray-500 ml-1">(128)</span>
          </div>

          {/* Dynamic Colors */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-800 mb-2 uppercase">
              Color:
            </h4>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border ${
                    selectedColor === color
                      ? "border-gray-800 ring-1 ring-gray-900"
                      : "border-gray-300"
                  } transition-all duration-300`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-800 uppercase">
                Size:
              </h4>
              <button className="text-xs text-gray-600 underline hover:text-gray-900">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border text-sm uppercase ${
                    selectedSize === size
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-300 hover:border-gray-800"
                  } transition-all duration-300`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 rounded-md uppercase tracking-wide hover:bg-gray-900 transition-all duration-300"
            >
              Add to Bag
            </button>
            <button
              onClick={() => navigate("/products")}
              className="w-full border border-gray-300 text-gray-800 py-3 rounded-md uppercase tracking-wide hover:bg-gray-50 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
