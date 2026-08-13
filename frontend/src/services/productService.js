import apiClient from '../api/apiClient';

export const productService = {
  getAllProducts: async () => {
    const response = await apiClient.get('/api/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await apiClient.get(`/api/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId) => {
    const response = await apiClient.get(`/api/products/category/${categoryId}`);
    return response.data;
  },

  searchProducts: async (keyword) => {
    const response = await apiClient.get('/api/products/search', {
      params: { keyword },
    });
    return response.data;
  },

  filterProducts: async (filters = {}) => {
    const response = await apiClient.get('/api/products/filter', {
      params: filters,
    });
    return response.data;
  },

  getProductImages: async (id) => {
    const response = await apiClient.get(`/api/products/${id}/images`);
    return response.data;
  },

  // Admin CRUD methods
  getAdminProducts: async () => {
    const response = await apiClient.get('/api/products/admin');
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await apiClient.post('/api/products', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await apiClient.put(`/api/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/api/products/${id}`);
    return response.data;
  },

  uploadImages: async (formData) => {
    const response = await apiClient.post('/api/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
