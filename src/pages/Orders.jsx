// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
//     setOrders(savedOrders);
//   }, []);

//   if (orders.length === 0)
//     return (
//       <div className="text-center mt-10">
//         <p className="text-gray-600 mb-4">No orders yet.</p>
//         <button
//           onClick={() => navigate("/products")}
//           className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//         >
//           Start Shopping
//         </button>
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-6 text-green-700">Your Orders</h2>

//       {orders.map((order, idx) => (
//         <div key={idx} className="border-b py-4">
//           <h3 className="font-semibold mb-2">
//             Order #{idx + 1} — {order.date}
//           </h3>
//           {order.items.map((item) => (
//             <div key={item.id} className="flex justify-between text-sm mb-1">
//               <span>
//                 {item.title} × {item.qty}
//               </span>
//               <span>₹{item.price * item.qty}</span>
//             </div>
//           ))}
//           <p className="text-green-700 font-bold mt-2">
//             Total: ₹{order.total}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }
