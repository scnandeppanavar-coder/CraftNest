import apiClient from '../api/apiClient';

export const cartService = {
  getCart: async (userId) => {
    const response = await apiClient.get(`/api/cart/${userId}`);
    return response.data;
  },

  addToCart: async (userId, productId, quantity = 1) => {
    const response = await apiClient.post('/api/cart/add', null, {
      params: {
        userId,
        productId,
        quantity,
      },
    });
    return response.data;
  },

  getCartCount: async (userId) => {
    const response = await apiClient.get(`/api/cart/count/${userId}`);
    return response.data;
  },
};
