import { useSelector, useDispatch } from "react-redux";
import { removeFromWishlist, clearWishlist } from "../redux/wishlistSlice";
import { addToCart } from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Wishlist() {
  const { items } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromWishlist = (productId, productName) => {
    dispatch(removeFromWishlist(productId));
    toast.success(`Removed from wishlist`);
  };

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    dispatch(addToCart({
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image
      },
      quantity: 1
    }));
    toast.success(`${product.title} added to cart`);
  };

  const handleMoveAllToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    items.forEach(product => {
      dispatch(addToCart({
        product: {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image
        },
        quantity: 1
      }));
    });
    dispatch(clearWishlist());
    toast.success("All items moved to cart");
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header Section - Matching your Products page */}
      <section className="bg-white border-b border-gray-200 py-8 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-serif font-light text-gray-900 mb-2">
          MY WISHLIST
        </h1>
        <p className="text-gray-500 text-sm">
          {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </section>

      <main className="flex-1 px-4 sm:px-8 md:px-16 py-8">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Save items you love for later. They will appear here.
            </p>
            <Link
              to="/products"
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-all duration-300 inline-block text-sm uppercase tracking-wide"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Actions Bar */}
            <div className="flex justify-between items-center">
              <button
                onClick={handleMoveAllToCart}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-all duration-300 text-sm uppercase tracking-wide"
              >
                <ShoppingBag className="w-4 h-4" />
                Move All to Cart
              </button>
              <button
                onClick={() => dispatch(clearWishlist())}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {/* Wishlist Items Grid - Matching your Products page */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map((product) => (
                  <div 
                    key={product.id} 
                    className="group flex flex-col text-center cursor-pointer transition-all duration-300 hover:shadow-xl bg-white rounded-xl overflow-hidden border border-gray-100"
                  >
                    {/* Image Section */}
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFromWishlist(product.id, product.title)}
                        className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white hover:text-red-500 transition-all duration-300 group-hover:opacity-100 opacity-0"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="absolute bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-black text-white rounded-full shadow-md text-xs tracking-widest uppercase transition-all duration-300 group-hover:opacity-100 opacity-0 hover:bg-gray-800"
                      >
                        Add to Cart
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}