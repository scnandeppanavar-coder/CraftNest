import apiClient from '../api/apiClient';

export const reviewService = {
  getUserReviews: async (userId) => {
    const response = await apiClient.get(`/api/reviews/user/${userId}`);
    return response.data;
  },
};
