import apiClient from '../api/apiClient';

export const categoryService = {
  getAllCategories: async () => {
    const response = await apiClient.get('/api/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await apiClient.get(`/api/categories/${id}`);
    return response.data;
  },

  // Admin CRUD methods
  createCategory: async (categoryData) => {
    const response = await apiClient.post('/api/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id, categoryData) => {
    const response = await apiClient.put(`/api/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return response.data;
  },
};
