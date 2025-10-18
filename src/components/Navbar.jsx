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
        <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
            <h1
              onClick={() => navigate("/products")}
              className="text-2xl font-extrabold text-green-700 cursor-pointer hover:text-green-600 transition mr-25"
            >
                      Zyra
            </h1>
             
             <div className="flex items-center gap-4">
             {user ? (
                <>
                <div className=" flex items-center gap-4 text-gray-700 text-sm sm:text-base font-medium">
                    <span className="text-lg">Hi, <span className="font-semibold text-green-700">{user.name}</span>
                    </span>

                    <button onClick={handleLogout}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                    >
                    Logout
                    </button>
                    </div>
                 </>
                

             ) : (
                <>
                    <button
                    onClick={() => navigate("/login")}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg  hover:bg-green-700 transition"
                    >
                     Login
                    </button>

                    <button
                      onClick={() => navigate("/register")}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                    >
                    Register
                    </button>
                    </>
             )}
             </div>
        </nav>
    );
}