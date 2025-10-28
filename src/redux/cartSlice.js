import { createSlice } from "@reduxjs/toolkit";

//  Get current logged in user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id || "guest";

//  Load this user’s cart from localStorage
let cartFromStorage = [];
try {
  const storedCart = localStorage.getItem(`cart_${userId}`);
  cartFromStorage = storedCart ? JSON.parse(storedCart) : [];
  if (!Array.isArray(cartFromStorage)) cartFromStorage = [];
} catch (error) {
  console.error("Failed to parse cart from localStorage:", error);
  cartFromStorage = [];
}

//  Redux Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: cartFromStorage,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }

      //  Save to user specific localStorage
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => item.product.id !== action.payload
      );
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },

    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.product.id === id);
      if (item) item.quantity = quantity;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(state.items));
    },

    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem(`cart_${userId}`);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;
