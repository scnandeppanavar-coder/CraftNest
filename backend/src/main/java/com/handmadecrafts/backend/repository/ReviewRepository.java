package com.handmadecrafts.backend.repository;

import com.handmadecrafts.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByProductProductId(Integer productId);
    List<Review> findByUserUserId(Integer userId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.productId = :productId")
    Double getAverageRatingForProduct(@Param("productId") Integer productId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.product.productId = :productId")
    Integer getTotalReviewsForProduct(@Param("productId") Integer productId);

    @Query("SELECT r.product.productId, AVG(r.rating), COUNT(r) FROM Review r GROUP BY r.product.productId")
    List<Object[]> getReviewStatsForAllProducts();
}
