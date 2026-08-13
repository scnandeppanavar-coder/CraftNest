package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.PaymentOrderRequest;
import com.handmadecrafts.backend.dto.PaymentOrderResponse;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String keyId;

    public PaymentService(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }

    public PaymentOrderResponse createOrder(PaymentOrderRequest request) throws Exception {

        JSONObject options = new JSONObject();
        options.put("amount", request.getAmount() * 100);
        options.put("currency", "INR");
        options.put("receipt", "receipt_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(options);

        return PaymentOrderResponse.builder()
                .orderId(order.get("id"))
                .amount(request.getAmount())
                .currency("INR")
                .key(keyId)
                .build();
    }
}