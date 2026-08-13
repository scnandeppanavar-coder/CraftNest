package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.OrderDetailsDto;
import com.handmadecrafts.backend.dto.OrderDto;
import com.handmadecrafts.backend.dto.OrderSummaryDto;
import com.handmadecrafts.backend.dto.PlaceOrderRequest;
import com.handmadecrafts.backend.entity.Order;
import com.handmadecrafts.backend.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(request));
    }

    @GetMapping("/admin")
    public ResponseEntity<List<OrderDto>> getAllOrdersForAdmin() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/summary")
    public ResponseEntity<OrderSummaryDto> getDashboardSummary() {
        return ResponseEntity.ok(orderService.getDashboardSummary());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<OrderDto>> getOrders(@PathVariable Integer userId) {
        return ResponseEntity.ok(orderService.getOrders(userId));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Map<String, Object>> cancelOrder(
            @PathVariable Integer orderId,
            @RequestBody Map<String, Integer> request) {

        Integer userId = request.get("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));
        }

        OrderDto cancelledOrder = toOrderDto(orderService.cancelOrder(userId, orderId));
        return ResponseEntity.ok(Map.of(
                "message", "Order cancelled successfully",
                "status", cancelledOrder.getStatus(),
                "orderId", cancelledOrder.getOrderId()
        ));
    }

    @GetMapping("/details/{orderId}")
    public ResponseEntity<OrderDetailsDto> getOrderDetails(@PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getOrderDetails(orderId));
    }

    private OrderDto toOrderDto(Order order) {
        if (order == null || order.getUser() == null) {
            return OrderDto.builder()
                    .orderId(order != null ? order.getOrderId() : null)
                    .status(order != null && order.getStatus() != null ? order.getStatus().name() : null)
                    .build();
        }

        return OrderDto.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .customerName(order.getUser().getUsername())
                .customerEmail(order.getUser().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .build();
    }
}