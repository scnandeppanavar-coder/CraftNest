package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.WishlistCountDto;
import com.handmadecrafts.backend.dto.WishlistDto;
import com.handmadecrafts.backend.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToWishlist(
            @RequestParam Integer userId,
            @RequestParam Integer productId) {

        wishlistService.addToWishlist(userId, productId);
        return ResponseEntity.ok("Product added to wishlist");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WishlistDto>> getWishlist(@PathVariable Integer userId) {
        return ResponseEntity.ok(wishlistService.getWishlist(userId));
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<WishlistCountDto> getWishlistCount(@PathVariable Integer userId) {
        return ResponseEntity.ok(wishlistService.getWishlistCount(userId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromWishlist(
            @RequestParam Integer userId,
            @RequestParam Integer productId) {

        wishlistService.removeFromWishlist(userId, productId);
        return ResponseEntity.ok("Product removed from wishlist");
    }
}