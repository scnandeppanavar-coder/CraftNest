package com.handmadecrafts.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.handmadecrafts.backend.dto.CartCountDto;
import com.handmadecrafts.backend.dto.CartDto;
import com.handmadecrafts.backend.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(
            @RequestParam Integer userId,
            @RequestParam Integer productId,
            @RequestParam(defaultValue = "1") Integer quantity) {

        cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok("Product added to cart");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartDto>> getCart(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<CartCountDto> getCartCount(@PathVariable Integer userId) {
        return ResponseEntity.ok(cartService.getCartCount(userId));
    }
}
