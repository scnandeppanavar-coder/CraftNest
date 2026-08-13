import apiClient from '../api/apiClient';

export const chatService = {
  sendMessage: async (message, history = []) => {
    const response = await apiClient.post('/api/chat', { message, history });
    return response.data;
  },
};
