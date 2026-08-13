package com.handmadecrafts.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.handmadecrafts.backend.dto.CartCountDto;
import com.handmadecrafts.backend.dto.CartDto;
import com.handmadecrafts.backend.entity.Cart;
import com.handmadecrafts.backend.entity.Product;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.repository.CartRepository;
import com.handmadecrafts.backend.repository.ProductRepository;
import com.handmadecrafts.backend.repository.UserRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public void addToCart(Integer userId, Integer productId, Integer quantity) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        Cart cart = Cart.builder()
                .user(user)
                .product(product)
                .quantity(quantity)
                .createdAt(LocalDateTime.now())
                .build();

        cartRepository.save(cart);
    }

    public List<CartDto> getCart(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return cartRepository.findByUser(user)
                .stream()
                .map(cart -> CartDto.builder()
                .cartId(cart.getCartId())
                .productId(cart.getProduct().getProductId())
                .productName(cart.getProduct().getName())
                .price(cart.getProduct().getPrice())
                .quantity(cart.getQuantity())
                .build())
                .collect(Collectors.toList());
    }

    public CartCountDto getCartCount(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return CartCountDto.builder()
                .count(cartRepository.countByUser(user))
                .build();
    }
}
