package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.ReviewDto;
import com.handmadecrafts.backend.entity.ProductImage;
import com.handmadecrafts.backend.entity.Review;
import com.handmadecrafts.backend.repository.ProductImageRepository;
import com.handmadecrafts.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductImageRepository productImageRepository;

    public ReviewService(ReviewRepository reviewRepository, ProductImageRepository productImageRepository) {
        this.reviewRepository = reviewRepository;
        this.productImageRepository = productImageRepository;
    }

    public List<ReviewDto> getReviewsByUserId(Integer userId) {
        return reviewRepository.findByUserUserId(userId).stream()
                .map(review -> {
                    List<ProductImage> images = productImageRepository.findByProductProductId(review.getProduct().getProductId());
                    String imageUrl = images.isEmpty() ? null : images.get(0).getImageUrl();

                    return ReviewDto.builder()
                            .reviewId(review.getReviewId())
                            .productId(review.getProduct().getProductId())
                            .userId(review.getUser().getUserId())
                            .username(review.getUser().getUsername())
                            .rating(review.getRating())
                            .comment(review.getComment())
                            .createdAt(review.getCreatedAt())
                            .productName(review.getProduct().getName())
                            .productImageUrl(imageUrl)
                            .build();
                })
                .collect(Collectors.toList());
    }
}
