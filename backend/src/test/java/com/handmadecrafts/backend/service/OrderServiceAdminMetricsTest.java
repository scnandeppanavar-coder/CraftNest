package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.OrderDto;
import com.handmadecrafts.backend.dto.OrderSummaryDto;
import com.handmadecrafts.backend.entity.Order;
import com.handmadecrafts.backend.entity.OrderStatus;
import com.handmadecrafts.backend.entity.Role;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class OrderServiceAdminMetricsTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductImageRepository productImageRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void shouldCancelOrderWhenItIsStillCancellable() {
        User customer = User.builder()
                .userId(1)
                .username("alice")
                .email("alice@example.com")
                .role(Role.CUSTOMER)
                .build();

        Order order = Order.builder()
                .orderId(15)
                .user(customer)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("1200"))
                .orderDate(LocalDateTime.of(2026, 8, 8, 9, 15, 0))
                .build();

        when(orderRepository.findById(15)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);

        Order cancelled = orderService.cancelOrder(1, 15);

        assertEquals(OrderStatus.CANCELLED, cancelled.getStatus());
    }

    @Test
    void shouldRejectCancellationAfterOrderIsNoLongerCancellable() {
        User customer = User.builder()
                .userId(2)
                .username("bob")
                .email("bob@example.com")
                .role(Role.CUSTOMER)
                .build();

        Order order = Order.builder()
                .orderId(16)
                .user(customer)
                .status(OrderStatus.SHIPPED)
                .totalAmount(new BigDecimal("900"))
                .orderDate(LocalDateTime.of(2026, 8, 8, 9, 15, 0))
                .build();

        when(orderRepository.findById(16)).thenReturn(Optional.of(order));

        assertThrows(IllegalStateException.class, () -> orderService.cancelOrder(2, 16));
    }

    @Test
    void shouldReturnDashboardSummaryFromPersistedOrdersAndCustomers() {
        User customer = User.builder()
                .userId(1)
                .username("alice")
                .email("alice@example.com")
                .role(Role.CUSTOMER)
                .build();

        User admin = User.builder()
                .userId(2)
                .username("admin")
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();

        when(userRepository.findAll()).thenReturn(List.of(customer, admin));
        when(orderRepository.findAll()).thenReturn(List.of(
                Order.builder()
                        .orderId(5)
                        .user(customer)
                        .status(OrderStatus.PENDING)
                        .totalAmount(new BigDecimal("1099"))
                        .orderDate(LocalDateTime.of(2026, 8, 8, 9, 15, 0))
                        .build(),
                Order.builder()
                        .orderId(6)
                        .user(customer)
                        .status(OrderStatus.DELIVERED)
                        .totalAmount(new BigDecimal("500"))
                        .orderDate(LocalDateTime.of(2026, 8, 8, 10, 0, 0))
                        .build()
        ));

        OrderSummaryDto summary = orderService.getDashboardSummary();

        assertEquals(2, summary.getTotalOrders());
        assertEquals(1, summary.getRegisteredCustomers());
        assertEquals(new BigDecimal("1599"), summary.getRevenue());
    }

    @Test
    void shouldMapCustomerNameAndEmailForAdminOrderList() {
        User customer = User.builder()
                .userId(7)
                .username("bob")
                .email("bob@example.com")
                .role(Role.CUSTOMER)
                .build();

        when(orderRepository.findAll()).thenReturn(List.of(
                Order.builder()
                        .orderId(10)
                        .user(customer)
                        .status(OrderStatus.SHIPPED)
                        .totalAmount(new BigDecimal("999"))
                        .orderDate(LocalDateTime.of(2026, 8, 9, 11, 30, 0))
                        .build()
        ));

        List<OrderDto> orders = orderService.getAllOrders();

        assertEquals(1, orders.size());
        assertEquals("bob", orders.get(0).getCustomerName());
        assertEquals("bob@example.com", orders.get(0).getCustomerEmail());
    }
}
