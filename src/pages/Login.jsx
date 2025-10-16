import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/authSlice";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector((state) => state.auth);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        if (user) navigate("/products");
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2 w-full"
        />
        <button className="bg-green-500 text-white w-full py-2 rounded" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>

    )
}