package com.handmadecrafts.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.handmadecrafts.backend.entity.ProductImage;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProductProductId(Integer productId);
    List<ProductImage> findByProductProductIdIn(List<Integer> productIds);
}
