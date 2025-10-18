import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/products" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />


        {/* Protected Page */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
       <Route path="/products/:id" element={
        <ProtectedRoute>
        <ProductDetails />
        </ProtectedRoute>
        }
         />

     <Route path="/cart" element={
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
     }
      />
      </Routes>
    </BrowserRouter>
  );
}


// import Products from "./pages/products";

// export default function App() {
//   return <Products />;
// }