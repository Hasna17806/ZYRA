import axios from "axios";

const API_URL = "http://localhost:4000/products";

// Fetch all products
export const getProducts = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};