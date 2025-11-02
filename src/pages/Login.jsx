import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/products");
      }
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8)
      errors.push("Password must be at least 8 characters long");
    if (!/[a-z]/.test(password))
      errors.push("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password))
      errors.push("Password must contain at least one number");
    if (!/[!@#$%^&*]/.test(password))
      errors.push("Password must contain at least one special character (!@#$%^&*)");
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword(password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // ✅ Call login thunk
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const loggedUser = resultAction.payload;

      // Blocked user
      if (loggedUser.status === "blocked") {
        toast.error("Your account has been blocked. Please contact support.");
        return;
      }

      // ✅ Role-based redirect
      if (loggedUser.role === "admin") {
        toast.success(`Welcome back, Admin ${loggedUser.name}!`);
        navigate("/admin/dashboard");
      } else {
        toast.success(`Welcome back, ${loggedUser.name}!`);
        navigate("/products");
      }
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Login
        </h3>

        {/* Email Input */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
            required
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordErrors([]); // clear old errors when typing
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <p className="text-right text-sm text-gray-500 mt-2">
            <Link to="/forgot-password" className="text-black hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>

        {/* Password Error Messages */}
        {passwordErrors.length > 0 && (
          <ul className="mb-4 text-sm text-red-600 list-disc list-inside space-y-1">
            {passwordErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {/* API Error Message */}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold mb-4"
        >
          Login
        </button>

        {/* Link to Register */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-black font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
