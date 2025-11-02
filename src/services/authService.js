import axios from "axios";

const API_URL = "http://localhost:4000/users";

// Register user
export const register = async (userData) => {
  const res = await axios.post(API_URL, userData);
  return res.data;
};

// Login user
export const login = async (email, password) => {
  try {
    const { data: users } = await axios.get(API_URL);
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error("Invalid email or password");

    // Handle blocked or inactive users
    if (user.status === "blocked") throw new Error("Your account is blocked");
    if (user.status === "inactive") throw new Error("Account inactive");

    // Generate token
    const token = btoa(user.id + Date.now());
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (err) {
    throw err;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
  localStorage.removeItem("wishlist");

  // Prevent browser back
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
};
