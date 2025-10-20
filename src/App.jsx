import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />               {/* 🏠 Public */}
        <Route path="/products" element={<Products />} />   {/* 🛍 Public */}
        <Route path="/product/:id" element={<ProductDetails />} /> {/* 🛍 Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />           {/* needs login check */}
      </Routes>
    </Router>
  );
}



//----------------------------------------------------------
//     <BrowserRouter>
//     <Navbar />
//       <Routes>
//         <Route path="/" element={<Navigate to="/products" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />


//         {/* Protected Page */}
//         <Route
//           path="/products"
//           element={
//             <ProtectedRoute>
//               <Products />
//             </ProtectedRoute>
//           }
//         />

//        <Route path="/products/:id"
//         element={
//         <ProtectedRoute>
//         <ProductDetails />
//         </ProtectedRoute>
//         }
//          />

//      <Route
//       path="/cart"
//        element={
//       <ProtectedRoute>
//         <Cart />
//       </ProtectedRoute>
//      }
//       />

//       </Routes>
//     </BrowserRouter>
//   );
// }


// import Products from "./pages/products";

// export default function App() {
//   return <Products />;
// }