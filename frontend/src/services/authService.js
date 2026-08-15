import apiClient from '../api/apiClient';

export const authService = {

  // ==========================
  // Register
  // ==========================

  register: async (username, email, password, fullName) => {
    const response = await apiClient.post('/api/auth/register', {
      username,
      email,
      password,
      fullName,
    });
    return response.data;
  },

  verifyRegistrationOtp: async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-registration-otp', {
      email,
      otp,
    });
    return response.data;
  },

  // ==========================
  // CUSTOMER LOGIN
  // ==========================

  login: async (email, password) => {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });

    return response.data;
  },

  // ==========================
  // ADMIN LOGIN
  // ==========================

  adminLogin: async (email, password) => {
    const response = await apiClient.post('/api/auth/admin/login', {
      email,
      password,
    });

    return response.data;
  },

  // ==========================
  // Forgot Password
  // ==========================

  forgotPassword: async (email) => {
    const response = await apiClient.post('/api/auth/forgot-password', {
      email,
    });
    return response.data;
  },

  verifyForgotPasswordOtp: async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-forgot-password-otp', {
      email,
      otp,
    });
    return response.data;
  },

  resetPassword: async (email, newPassword, confirmPassword) => {
    const response = await apiClient.post('/api/auth/reset-password', {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  changePassword: async (email, oldPassword, newPassword, confirmPassword) => {
    const response = await apiClient.post('/api/auth/change-password', {
      email,
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },
};