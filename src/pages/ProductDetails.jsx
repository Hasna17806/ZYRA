import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addToCart } from "../redux/cartSlice";
import { addToWishlist, removeFromWishlist } from "../redux/wishlistSlice";
import { fetchProducts } from "../redux/productSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RefreshCw, 
  Star,
  ChevronLeft,
  Share2,
  Minus,
  Plus
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, isLoading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (!items || items.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, items]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const product = items.find((p) => p.id.toString() === id);
  const isInWishlist = wishlistItems.some((item) => item.id === product?.id);
  const isInCart = cartItems.some((item) => item.product.id === product?.id);

  useEffect(() => {
    if (product) {
      document.title = `ZYRA | ${product.title}`;
      setSelectedColor(product.colors?.[0] || "#000000");
    }
  }, [product]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-white pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login before adding to cart!");
      navigate("/login");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size!");
      return;
    }
    
    dispatch(
      addToCart({ 
        product, 
        quantity, 
        selectedSize, 
        selectedColor 
      })
    );
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingBag size={16} />
        <span>Added to cart!</span>
      </div>
    );
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on ZYRA`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = product.colors || ["#000000", "#FFFFFF", "#E5E7EB"];
  const images = product.images || [product.image];
  
  // Get discount from product data (if exists), otherwise null
  const discount = product.discount || null;
  const currentPrice = product.price;
  const originalPrice = discount ? (currentPrice / (1 - discount / 100)).toFixed(0) : null;
  const savedAmount = discount ? (originalPrice - currentPrice).toFixed(0) : null;

  const relatedProducts = items
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-gray-900 transition"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span>/</span>
          <button onClick={() => navigate("/products")} className="hover:text-gray-900 transition">
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 capitalize">{product.category}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-4 aspect-square">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistClick}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-lg ${
                  isInWishlist
                    ? "bg-red-500 text-white scale-110"
                    : "bg-white/90 text-gray-700 hover:bg-white hover:scale-110"
                }`}
              >
                <Heart size={22} fill={isInWishlist ? "currentColor" : "none"} />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="absolute top-4 left-4 p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
              >
                <Share2 size={22} />
              </button>

              {/* Discount Badge - Only show if discount exists */}
              {discount && (
                <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-gray-900 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col"
          >
            {/* Category Badge */}
            <span className="inline-block text-xs uppercase tracking-widest text-gray-500 font-semibold mb-3">
              {product.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((star) => (
                  <Star key={star} size={18} className="fill-yellow-400 text-yellow-400" />
                ))}
                <Star size={18} className="text-gray-300" />
              </div>
              <span className="text-sm text-gray-600">(4.0) · 128 reviews</span>
            </div>

            {/* Price - Show discount only if it exists */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-200">
              <span className="text-4xl font-bold text-gray-900">
                ₹{currentPrice}
              </span>
              {discount && (
                <>
                  <span className="text-xl line-through text-gray-400">
                    ₹{originalPrice}
                  </span>
                  <span className="text-lg text-green-600 font-semibold">
                    Save ₹{savedAmount}
                  </span>
                </>
              )}
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Color
                </h3>
                <span className="text-sm text-gray-500">
                  {selectedColor}
                </span>
              </div>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      selectedColor === color
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-2 scale-110"
                        : "border-gray-300 hover:border-gray-500 hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Size
                </h3>
                <button className="text-sm text-gray-500 hover:text-gray-900 underline transition">
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 text-sm font-medium border-2 rounded-lg transition-all duration-300 ${
                      selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white shadow-md"
                        : "border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Quantity
              </h3>
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={18} />
                </button>
                <span className="w-16 text-center font-semibold text-gray-900 text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={quantity >= 10}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="w-full bg-black text-white py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <ShoppingBag size={20} />
                {isInCart ? "Update Cart" : "Add to Bag"}
              </button>

              <button
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate("/cart"), 500);
                }}
                disabled={!selectedSize}
                className="w-full border-2 border-gray-900 text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck size={20} className="text-blue-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Free Shipping</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield size={20} className="text-green-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RefreshCw size={20} className="text-purple-600" />
                </div>
                <p className="text-xs text-gray-600 font-medium">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="flex gap-6 border-b border-gray-200 mb-8">
            {["description", "shipping", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                  activeTab === tab
                    ? "text-gray-900 border-b-2 border-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl"
            >
              {activeTab === "description" && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {product.description || 
                      "Experience premium quality and timeless style with this carefully crafted piece. Made from the finest materials, this product combines comfort with elegance, perfect for any occasion."}
                  </p>
                  <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>Premium quality materials</li>
                    <li>Comfortable fit</li>
                    <li>Easy care instructions</li>
                    <li>Sustainable production</li>
                  </ul>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Information</h4>
                    <p>Free shipping on orders over ₹500. Standard delivery takes 3-5 business days.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Return Policy</h4>
                    <p>30-day return policy. Items must be unworn and in original packaging.</p>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold text-gray-900">4.0</div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} size={20} className="fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star size={20} className="text-gray-300" />
                      </div>
                      <p className="text-sm text-gray-600">Based on 128 reviews</p>
                    </div>
                  </div>
                  <button className="border-2 border-gray-900 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Write a Review
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <button
                  key={relatedProduct.id}
                  onClick={() => navigate(`/product/${relatedProduct.id}`)}
                  className="group text-left"
                >
                  <div className="aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden mb-3 relative">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedProduct.discount && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                        {relatedProduct.discount}% OFF
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-600 transition-colors">
                    {relatedProduct.title}
                  </h3>
                  <p className="text-lg font-bold text-gray-900">₹{relatedProduct.price}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}