import { createSlice } from "@reduxjs/toolkit";

// Load all user orders from localStorage

const ordersFromStorage = JSON.parse(localStorage.getItem("ordersByUser")) || {};

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    byUser: ordersFromStorage, //  Store orders per user
  },
  reducers: {
    addOrder: (state, action) => {
      const { userId, order } = action.payload;

      if (!state.byUser[userId]) {
        state.byUser[userId] = [];
      }

      state.byUser[userId].push(order);

      //  Save updated orders to localStorage
      
      localStorage.setItem("ordersByUser", JSON.stringify(state.byUser));
    },

    clearOrders: (state, action) => {
      const { userId } = action.payload;

      if (state.byUser[userId]) {
        delete state.byUser[userId];
        localStorage.setItem("ordersByUser", JSON.stringify(state.byUser));
      }
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;