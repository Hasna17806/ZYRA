import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-gray shadow-md">
            <h1
              onClick={() => navigate("/products")}
              className="text-7xl font-extrabold text-stone-700 cursor-pointer hover:text-stone-600 transition mr-25 ml-5"
            >
                    Zyra
                    
                  </h1>
            {/* <Link to="/products" className="text-2xl font-extrabold text-green-700 cursor-pointer hover:text-green-600 transition mr-25">
                 Zyra
            </Link> */}
                     
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/products" className="hover:underline">Products</Link>
             
             <div className="flex items-center gap-4">
             {user ? (
                <>
                <div className=" flex items-center gap-4 text-gray-700 text-sm sm:text-base font-medium">
                    <span className="text-lg">Hi, <span className="font-semibold text-Zinc-950">{user.name}</span>
                    </span>

                    {/* cart link */}
                    <Link 
                      to="/cart"
                      className=" text-white px-3 py-1.5 rounded-lg hover:bg-black-700 transition"
                      >
                        🛒
                      </Link>

                    <button onClick={handleLogout}
                    className="bg-black text-white px-3 py-1.5 rounded-lg hover:bg-black-700 transition"
                    >
                    Logout
                    </button>
                    </div>
                 </>
                

             ) : (
                <>
                    <button
                    onClick={() => navigate("/login")}
                    className="bg-green-700  text-white px-3 py-1.5 rounded-lg  hover:bg-green-900 transition"
                    >
                     Login
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                    className="bg-blue-800 text-white px-3 py-1.5 rounded-lg hover:bg-blue-900 transition"
                    >
                    Register
                    </button>
                    </>
             )}
             </div>
        </nav>
    );
}