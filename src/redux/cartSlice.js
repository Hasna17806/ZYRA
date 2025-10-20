

// import { createSlice } from "@reduxjs/toolkit";

// const savedCart = JSON.parse(localStorage.getItem("cart")) || [];

// const cartSlice = createSlice({
//     name: "cart",
//     initialState: {
//         items: savedCart,
//     },
//     reducers: {
//         addToCart: (state, action) => {
//             const existing = state.items.find((i) => i.id === action.payload.id);
//             if (existing) {
//                 existing.quantity += 1;
//             } else {
//                 state.items.push({ ...action.payload, quantity: 1 });
//             }
//             localStorage.setItem("cart", JSON.stringify(state.items));
//         },
//         removeFromCart: (state, action) => {
//             state.items = state.items.filter((i) => i.id !== action.payload);
//             localStorage.setItem("cart", JSON.stringify(state.items));
//         },
//         increaseQty: (state, action) => {
//             const item = state.items.find((i) => i.id === action.payload);
//             if (item) item.quantity += 1;
//             localStorage.setItem("cart", JSON.stringify(state.items));
//         },
//         decreaseQty: (state, action) => {
//             const item = state.items.find((i) => i.id ===action.payload);
//             if (item && item.quantity > 1) item.quantity -=1
//             localStorage.setItem("cart", JSON.stringify(state.items));
//         },
//         clearCart: (state) => {
//             state.items =[];
//             localStorage.removeItem("cart");
//         },
//     },
// });

// export const {addToCart, removeFromCart, increaseQty, decreaseQty, clearCart} = cartSlice.actions;

// export default cartSlice.reducer;


//----------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = JSON.parse(localStorage.getItem("cart")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: cartFromStorage, 
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existing = state.items.find(item => item.product.id === product.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === id);
      if (item) item.quantity = quantity;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
