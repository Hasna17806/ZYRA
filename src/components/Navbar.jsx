import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { clearCart } from "../redux/cartSlice";
import { ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import CartDrawer from "./CartDrawer";
import logo from "../assets/logo.png";
import Wishlist from "../pages/Wishlist";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const [scrolled, setScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsUserMenuOpen(false);
  };

  const handleWishlistClick = () => {
    navigate("/wishlist");
  };

  // Add this function for Orders
  const handleOrdersClick = () => {
    navigate("/orders");
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white shadow-md" : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4">
          {/* Left: Logo + Categories */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="ZYRA"
                className="h-8 w-auto transition hover:opacity-80 lg:h-12"
              />
            </Link>

            {/* Desktop Categories near Logo */}
            <div className="hidden lg:flex items-center gap-8 font-medium text-gray-900 uppercase tracking-wide text-sm">
              <Link
                to="/products?category=women"
                className="hover:text-gray-600 transition-colors py-2 border-b-2 border-transparent hover:border-gray-900"
              >
                WOMEN
              </Link>
              <Link
                to="/products?category=men"
                className="hover:text-gray-600 transition-colors py-2 border-b-2 border-transparent hover:border-gray-900"
              >
                MEN
              </Link>
              <Link
                to="/products?category=kids"
                className="hover:text-gray-600 transition-colors py-2 border-b-2 border-transparent hover:border-gray-900"
              >
                KIDS
              </Link>
            </div>
          </div>

          {/* Right: Icons + Hamburger Menu */}
          <div className="flex items-center gap-4 lg:gap-6 text-gray-700">
            {/* Icons - Desktop Only */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Wishlist Icon */}
              <button
                onClick={handleWishlistClick}
                className="relative p-1 hover:text-black transition"
                title="Wishlist"
              >
                <Heart 
                  size={22} 
                  className={wishlistCount > 0 ? "text-red-500" : ""}
                  />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1 hover:text-black transition"
                title="Cart"
              >
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Icon */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-1 hover:text-black transition"
                  title={user ? "Account" : "Login"}
                >
                  <User size={22} />
                </button>

                {/* Dropdown Menu - Updated with Orders */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                    {user ? (
                      <>
                        <button
                          onClick={handleProfileClick}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Profile
                        </button>
                        <button
                          onClick={handleOrdersClick}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={handleWishlistClick}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Wishlist
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          navigate("/login");
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                      >
                        Sign In
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white/70 backdrop-blur-sm">
            {/* Menu panel slides from right */}
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200">
              <div className="p-6 h-full overflow-y-auto">
                {/* Close Button */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                  <img src={logo} alt="ZYRA" className="h-7 w-auto" />
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-1">
                  <Link
                    to="/products?category=women"
                    className="block py-4 px-2 text-base font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WOMEN
                  </Link>
                  <Link
                    to="/products?category=men"
                    className="block py-4 px-2 text-base font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    MEN
                  </Link>
                  <Link
                    to="/products?category=kids"
                    className="block py-4 px-2 text-base font-medium hover:bg-gray-50 transition-colors border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    KIDS
                  </Link>

                  {/* User Options - Updated with Orders */}
                  <div className="pt-6 border-t border-gray-200 mt-4">
                    {user ? (
                      <div className="space-y-1">
                        <div className="px-2 py-3 text-sm text-gray-500 border-b border-gray-100">
                          Welcome, {user.name}
                        </div>
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={handleOrdersClick}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          My Orders
                        </button>
                        <button
                          onClick={handleWishlistClick}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          My Wishlist
                        </button>
                        <button
                          onClick={() => {
                            setIsCartOpen(true);
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          My Cart ({cartCount})
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left py-3 px-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors mt-2"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            navigate("/login");
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors border-b border-gray-100"
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate("/register");
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left py-3 px-2 text-sm hover:bg-gray-50 transition-colors"
                        >
                          Create Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Close dropdown when clicking outside */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
}