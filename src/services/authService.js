import axios from "axios";

const API_URL = "http://localhost:4000/users";

//Register user
export const register = async (userData) => {
    const res = await axios.post(API_URL, userData);
    return res.data;
};

// Login user
export const login = async (email, password) => {
    const res = await axios.get(API_URL);
    const users = res.data;

    const user = users.find(
        (u) => u.email === email && u.password === password
    );

    if (user) {
        const token = btoa(user.id + new Date().getTime());
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        return user;
    } else {
        throw new Error("Invalid email or password");
    }
};


// Logout
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");

};