import apiClient from '../api/apiClient';

export const paymentService = {
  createRazorpayOrder: async (amount) => {
    // amount in Rupees (e.g. 500)
    const response = await apiClient.post('/api/payment/create-order', {
      amount: Math.round(amount),
    });
    return response.data; // Returns PaymentOrderResponse: { orderId, amount, currency, key }
  },
};
