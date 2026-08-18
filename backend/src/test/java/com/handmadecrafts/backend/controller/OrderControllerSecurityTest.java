package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.entity.Order;
import com.handmadecrafts.backend.entity.OrderStatus;
import com.handmadecrafts.backend.entity.Role;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.repository.OrderRepository;
import com.handmadecrafts.backend.repository.UserRepository;
import com.handmadecrafts.backend.security.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.jpa.database-platform=org.hibernate.dialect.H2Dialect",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "razorpay.key.id=dummy",
    "razorpay.key.secret=dummy",
    "huggingface.api.token=dummy",
    "jwt.secret=dummysecretkeydummysecretkeydummysecretkeydummysecretkey",
    "app.mail.from=dummy@example.com",
    "BREVO_API_KEY=dummy"
})
@AutoConfigureMockMvc
public class OrderControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private User adminUser;
    private User customerUser1;
    private User customerUser2;
    private Order customer1Order;

    @BeforeEach
    void setUp() {
        orderRepository.deleteAll();
        userRepository.deleteAll();

        adminUser = User.builder()
                .username("admin_test")
                .email("admin@test.com")
                .password("password123")
                .role(Role.ADMIN)
                .build();
        adminUser = userRepository.save(adminUser);

        customerUser1 = User.builder()
                .username("customer1_test")
                .email("customer1@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();
        customerUser1 = userRepository.save(customerUser1);

        customerUser2 = User.builder()
                .username("customer2_test")
                .email("customer2@test.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();
        customerUser2 = userRepository.save(customerUser2);

        customer1Order = Order.builder()
                .user(customerUser1)
                .totalAmount(BigDecimal.valueOf(100.00))
                .status(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();
        customer1Order = orderRepository.save(customer1Order);
    }

    @Test
    void testAdminAccessToAnyOrder() throws Exception {
        String token = jwtUtils.generateToken(adminUser.getEmail());

        mockMvc.perform(get("/api/orders/details/" + customer1Order.getOrderId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testCustomerAccessOwnOrder() throws Exception {
        String token = jwtUtils.generateToken(customerUser1.getEmail());

        mockMvc.perform(get("/api/orders/details/" + customer1Order.getOrderId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testCustomerAccessOtherUserOrderDenied() throws Exception {
        String token = jwtUtils.generateToken(customerUser2.getEmail());

        mockMvc.perform(get("/api/orders/details/" + customer1Order.getOrderId())
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void testUnauthenticatedAccessDenied() throws Exception {
        mockMvc.perform(get("/api/orders/details/" + customer1Order.getOrderId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void testInvalidOrderNotFound() throws Exception {
        String token = jwtUtils.generateToken(adminUser.getEmail());

        mockMvc.perform(get("/api/orders/details/99999")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
