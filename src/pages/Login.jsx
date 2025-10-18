import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    if (user) navigate("/products");
  }, [user, navigate]);

  
    return (
     <div className="flex justify-center items-center min-h-screen bg-gray-50  mb-50 ">

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">

        <h2 className=" flex justify-center items-center text-xl font-bold mb-4">Login</h2>

        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 w-full" />

        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2 w-full" />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="bg-green-500 text-white w-full py-2 rounded">Login</button>

        <p className="text-center text-sm text-gray-600 mt-3">Don't have an account?{" "}

          <Link to="/register" className="text-blue-500 hover:underline">
          Register
          </Link>
        </p>

      </form>

    </div>
  );
}