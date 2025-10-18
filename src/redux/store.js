import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice';
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
    reducer: {
        products: productReducer,
        auth: authReducer,
        cart: cartReducer,
    },
});