import apiClient from '../api/apiClient';

export const wishlistService = {
  getWishlist: async (userId) => {
    const response = await apiClient.get(`/api/wishlist/user/${userId}`);
    return response.data;
  },

  addToWishlist: async (userId, productId) => {
    const response = await apiClient.post('/api/wishlist/add', null, {
      params: {
        userId,
        productId,
      },
    });
    return response.data;
  },

  getWishlistCount: async (userId) => {
    const response = await apiClient.get(`/api/wishlist/count/${userId}`);
    return response.data;
  },

  removeFromWishlist: async (userId, productId) => {
    const response = await apiClient.delete('/api/wishlist/remove', {
      params: {
        userId,
        productId,
      },
    });
    return response.data;
  },
};
