import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import { ShoppingCart } from "lucide-react";


export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logoutUser());
        dispatch(clearCart());
        navigate("/login");
    };

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="fixed top-0 left-0 w-full bg-white shadow-sm border-b border-gray-200 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
         
            <Link to="/"
             className="text-3xl tracking-wideset font-extrabold text-gray-900 hover:opacity-70 transition">
                 ZYRA௹
            </Link>
                    
          {/* Navigation Links */}

         <div className="flex items-center gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-black transition-colors duration-200">Home</Link>
          <Link to="/products" className="hover:text-black transition-colors duration-200">Shop</Link>


                  </div>

                  {/* Auth Section */}
                <div className="flex items-center gap-4">
             {user ? (
                <>
    
                    <span className="text-gray-700 text-sm">Hi, <span className="font-semibold">{user.name}</span>
                    </span>
                    <button onClick={handleLogout}
                    className="text-sm font-medium border border-gray-900 px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                    >
                    Logout
                    </button>

                   
              <Link
                 to="/cart"
                className="relative flex items-center hover:text-black transition-colors duration-200"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right -3 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                  </Link>

                 </>
                
             ) : (
                <>

                <Link
                  to="/login"
                  className="text-sm font-medium hover:text-black transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium border border-gray-900 px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all"
                >
                 Register
                </Link>


                    </>
             )}
             </div>
             </div>
        </nav>
    );
}


