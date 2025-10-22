// import axios from "axios";

// const API = "http://localhost:4000/carts";

// export const getCartByUser = async (userId) => {
//     const res = await axios.get(`${API}?userId=${userId}`);
//     return res.data;
// };

// // create a new cart object for user
// export const createCart = async (userId, items = []) => {
//     const res = await axios.post(API, { userId, items });
//     return res.data;
// };

// // update existing cart by cart id
// export const updateCart = async (cartId, items = []) => {
//     const res = await axios.put(`${API}/${cartId}`, { items, id: cartId });
//     return res.data;
// };