import apiClient from '../api/apiClient';

export const userService = {
  getAllUsers: async () => {
    const response = await apiClient.get('/api/users');
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const response = await apiClient.put(`/api/users/${userId}`, userData);
    return response.data;
  },
};
