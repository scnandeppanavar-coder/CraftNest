package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.OrderDetailsDto;
import com.handmadecrafts.backend.dto.OrderDto;
import com.handmadecrafts.backend.dto.OrderItemDto;
import com.handmadecrafts.backend.dto.OrderSummaryDto;
import com.handmadecrafts.backend.dto.PlaceOrderRequest;
import com.handmadecrafts.backend.entity.*;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductImageRepository productImageRepository;

    public OrderService(OrderRepository orderRepository,
                    OrderItemRepository orderItemRepository,
                    CartRepository cartRepository,
                    UserRepository userRepository,
                    ProductImageRepository productImageRepository) {

    this.orderRepository = orderRepository;
    this.orderItemRepository = orderItemRepository;
    this.cartRepository = cartRepository;
    this.userRepository = userRepository;
    this.productImageRepository = productImageRepository;
}

    @Transactional
    public Order cancelOrder(Integer userId, Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getUser() == null || !order.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own orders");
        }

        OrderStatus status = order.getStatus();
        if (status != OrderStatus.PENDING && status != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("This order can no longer be cancelled");
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }

    @Transactional
    public String placeOrder(PlaceOrderRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Cart> cartItems = cartRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            return "Cart is empty";
        }

        BigDecimal total = BigDecimal.ZERO;

        for (Cart cart : cartItems) {
            total = total.add(
                    cart.getProduct().getPrice()
                            .multiply(BigDecimal.valueOf(cart.getQuantity()))
            );
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(total)
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);

        for (Cart cart : cartItems) {

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(cart.getProduct())
                    .quantity(cart.getQuantity())
                    .price(cart.getProduct().getPrice())
                    .build();

            orderItemRepository.save(item);
        }

        cartRepository.deleteAll(cartItems);

        return "Order placed successfully";
    }

    public List<OrderDto> getOrders(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return orderRepository.findByUser(user)
                .stream()
                .map(this::toOrderDto)
                .sorted(Comparator.comparing(OrderDto::getOrderId).reversed())
                .collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::toOrderDto)
                .sorted(Comparator.comparing(OrderDto::getOrderId).reversed())
                .collect(Collectors.toList());
    }

    public OrderSummaryDto getDashboardSummary() {
        List<Order> allOrders = orderRepository.findAll();
        List<User> registeredCustomers = userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.CUSTOMER)
                .toList();

        BigDecimal revenue = allOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return OrderSummaryDto.builder()
                .totalOrders(allOrders.size())
                .registeredCustomers(registeredCustomers.size())
                .revenue(revenue)
                .build();
    }

    private OrderDto toOrderDto(Order order) {
        User user = order.getUser();
        return OrderDto.builder()
                .orderId(order.getOrderId())
                .userId(user != null ? user.getUserId() : null)
                .customerName(user != null ? user.getUsername() : null)
                .customerEmail(user != null ? user.getEmail() : null)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .orderDate(order.getOrderDate())
                .build();
    }

    public OrderDetailsDto getOrderDetails(Integer orderId) {

    Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

    List<OrderItemDto> items = orderItemRepository.findByOrder(order)
            .stream()
            .map(item -> {

                List<ProductImage> images =
                        productImageRepository.findByProductProductId(
                                item.getProduct().getProductId());

                String imageUrl = images.isEmpty()
                        ? null
                        : images.get(0).getImageUrl();

                return OrderItemDto.builder()
                        .productId(item.getProduct().getProductId())
                        .productName(item.getProduct().getName())
                        .imageUrl(imageUrl)
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build();
            })
            .toList();

    return OrderDetailsDto.builder()
            .orderId(order.getOrderId())
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus().name())
            .orderDate(order.getOrderDate())
            .items(items)
            .userId(order.getUser() != null ? order.getUser().getUserId() : null)
            .customerName(order.getUser() != null ? (order.getUser().getFullName() != null ? order.getUser().getFullName() : order.getUser().getUsername()) : null)
            .customerEmail(order.getUser() != null ? order.getUser().getEmail() : null)
            .build();
}
}