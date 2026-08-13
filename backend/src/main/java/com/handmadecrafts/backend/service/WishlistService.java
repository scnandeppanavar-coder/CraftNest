package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.WishlistCountDto;
import com.handmadecrafts.backend.dto.WishlistDto;
import com.handmadecrafts.backend.entity.Product;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.entity.Wishlist;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.repository.ProductRepository;
import com.handmadecrafts.backend.repository.UserRepository;
import com.handmadecrafts.backend.repository.WishlistRepository;
import com.handmadecrafts.backend.repository.ProductImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           UserRepository userRepository,
                           ProductRepository productRepository,
                           ProductImageRepository productImageRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
    }

    public void addToWishlist(Integer userId, Integer productId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (wishlistRepository.findByUserAndProductProductId(user, productId).isPresent()) {
            return;
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .createdAt(LocalDateTime.now())
                .build();

        wishlistRepository.save(wishlist);
    }

    public List<WishlistDto> getWishlist(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return wishlistRepository.findByUser(user)
        .stream()
        .map(item -> {

            String imageUrl = productImageRepository
                    .findByProductProductId(item.getProduct().getProductId())
                    .stream()
                    .findFirst()
                    .map(image -> image.getImageUrl())
                    .orElse(null);

            return WishlistDto.builder()
                    .wishlistId(item.getWishlistId())
                    .productId(item.getProduct().getProductId())
                    .productName(item.getProduct().getName())
                    .price(item.getProduct().getPrice())
                    .imageUrl(imageUrl)
                    .build();
        })
        .collect(Collectors.toList());
    }

    public WishlistCountDto getWishlistCount(Integer userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return WishlistCountDto.builder()
                .count(wishlistRepository.countByUser(user))
                .build();
    }

@Transactional
    public void removeFromWishlist(Integer userId, Integer productId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        wishlistRepository.deleteByUserAndProductProductId(user, productId);
    }
}