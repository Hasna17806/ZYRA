import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

export default function Orders() {
  const { user } = useSelector((state) => state.auth);

  // Always pull fresh data from localStorage
  const storedOrders = JSON.parse(localStorage.getItem("ordersByUser")) || {};
  const userOrders = user?.email ? storedOrders[user.email] || [] : [];

  const [expandedOrder, setExpandedOrder] = useState(null);

  if (!user) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        Please log in to view your orders.
      </div>
    );
  }

  if (userOrders.length === 0) {
    return (
      <div className="text-center mt-32 text-gray-500 text-lg">
        You have no past orders.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-10 text-center tracking-tight">
        My Orders
      </h1>

      <div className="space-y-6">
        {userOrders
          .slice()
          .reverse()
          .map((order) => {
            const isOpen = expandedOrder === order.id;
            const randomStatus =
              ["Delivered", "Processing", "Shipped"][
                Math.floor(Math.random() * 3)
              ];

            const statusColor =
              randomStatus === "Delivered"
                ? "bg-green-100 text-green-700"
                : randomStatus === "Processing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700";

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >
                {/* Top summary row */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Order #{order.id}
                    </p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                    >
                      {randomStatus}
                    </span>
                    <button
                      onClick={() =>
                        setExpandedOrder(isOpen ? null : order.id)
                      }
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {isOpen ? "Hide Details" : "View Details"}
                    </button>
                  </div>
                </div>

                {/* Collapsible details */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="divide-y">
                        {order.items.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex justify-between py-3 items-center"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <p className="font-medium">
                                  {item.product.title}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold">
                              ₹
                              {(
                                item.product.price * item.quantity
                              ).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="text-right mt-4 font-bold text-lg">
                        Total: ₹{order.total.toFixed(2)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
