import apiClient from '../api/apiClient';

export const addressService = {
  getAddresses: async (userId) => {
    const response = await apiClient.get(`/api/addresses/user/${userId}`);
    return response.data;
  },

  addAddress: async (userId, addressData) => {
    const response = await apiClient.post(`/api/addresses/user/${userId}`, addressData);
    return response.data;
  },

  updateAddress: async (addressId, addressData) => {
    const response = await apiClient.put(`/api/addresses/${addressId}`, addressData);
    return response.data;
  },

  deleteAddress: async (addressId) => {
    const response = await apiClient.delete(`/api/addresses/${addressId}`);
    return response.data;
  },

  setDefaultAddress: async (userId, addressId) => {
    const response = await apiClient.put(`/api/addresses/user/${userId}/default/${addressId}`);
    return response.data;
  },
};
