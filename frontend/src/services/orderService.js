import apiClient from '../api/apiClient';

export const orderService = {
  placeOrder: async (userId) => {
    const response = await apiClient.post('/api/orders/place', { userId });
    return response.data;
  },

  getOrders: async (userId) => {
    const response = await apiClient.get(`/api/orders/${userId}`);
    return response.data;
  },

  getAdminOrders: async () => {
    const response = await apiClient.get('/api/orders/admin');
    return response.data;
  },

  getDashboardSummary: async () => {
    const response = await apiClient.get('/api/orders/summary');
    return response.data;
  },

  getOrderDetails: async (orderId) => {
    const response = await apiClient.get(`/api/orders/details/${orderId}`);
    return response.data;
  },

  cancelOrder: async (userId, orderId) => {
    const response = await apiClient.post(`/api/orders/${orderId}/cancel`, { userId });
    return response.data;
  },
};
