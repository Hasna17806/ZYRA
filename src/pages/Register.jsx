import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../redux/authSlice";

export default function Register () {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector((state) => state.auth);
    const [form, setForm] = useState({ 
        name:"",
        email:"",
        password:"",
        role:"user", 
    });

    useEffect(() => {
        if (user) navigate("/products");
    }, [user, navigate]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser(form));
    };

    return (
       <div className="flex justify-center items-center h-screen bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow w-80"
        >
            <h2 className="text-xl font-bold mb-4 text-center">Create Account</h2>

            {error && <p className="text-red-500 text-sm mb-2"> {error}</p>}
            
            <input 
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 mb-2 w-full rounded"
              required
            />

            <input 
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 mb-2 w-full rounded"
              required
            />

         <input
           type="password"
           name="password"
           placeholder="Password"
           value={form.password}
           onChange={handleChange}
           className="border p-2 mb-3 w-full rounded"
           required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded font-medium"
          disabled={isLoading}
        >
          {isLoading ? "Registering..." : "Register"}
        </button>

                <p className="text-center text-sm text-gray-600 mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>

        </form>

       </div>
    );
}