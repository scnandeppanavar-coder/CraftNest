package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.PaymentOrderRequest;
import com.handmadecrafts.backend.dto.PaymentOrderResponse;
import com.handmadecrafts.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(
            @RequestBody PaymentOrderRequest request) throws Exception {

        return ResponseEntity.ok(paymentService.createOrder(request));
    }
}