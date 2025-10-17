import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () =>{
        dispatch(logoutUser());
        navigate("/login");
    };

    return (
        <nav className="flex justify-between items-center px-6 py-3 bg-green-600 text-white">
            <h1
              onClick={() => navigate("/products")}
              className="text-xl font-bold cursor-pointer"
            >
                     🛍️ MyShop
            </h1>
             
             {user ? (
                <div className="flex items-center gap-4">
                    <span className="text-sm">Hi, {user.name}</span>
                    <button onClick={handleLogout}
                    className="bg-white text-green-600 px-3 py-1 rounded hover:bg-gray-100"
                    >
                    Logout
                    </button>

                </div>

             ) : (
                <div className="flex gap-3">
                    <button
                    onClick={() => navigate("/login")}
                    className="bg-white text-white-600 px-1 py-1 rounded hover:bg-gray-100 ml-10"
                    >
                     Login
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                    className="border border-white px-1 py-1 rounded hover:bg-green-700"
                    >
                    Register
                    </button>
                </div>
             )}
        </nav>
    );
}