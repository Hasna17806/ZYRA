// const API_URL = 'http://localhost:4000';

// export const orderService = {
//   // Get all orders
//   async getOrders() {
//     const response = await fetch(`${API_URL}/orders`);
//     return await response.json();
//   },

//   // Get orders by user ID
//   async getOrdersByUserId(userId) {
//     const response = await fetch(`${API_URL}/orders?userId=${userId}`);
//     return await response.json();
//   },

//   // Create new order
//   async createOrder(orderData) {
//     const response = await fetch(`${API_URL}/orders`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(orderData),
//     });
//     return await response.json();
//   },

//   // Update order status
//   async updateOrderStatus(orderId, status) {

//   }
//     // First get the current order