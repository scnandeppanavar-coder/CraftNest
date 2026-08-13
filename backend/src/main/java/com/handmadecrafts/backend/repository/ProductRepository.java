package com.handmadecrafts.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.handmadecrafts.backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Integer>,
        JpaSpecificationExecutor<Product> {

    List<Product> findByCategoryCategoryId(Integer categoryId);

    List<Product> findByActiveTrue();

    List<Product> findByCategoryCategoryIdAndActiveTrue(Integer categoryId);

    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String nameKeyword,
            String descKeyword);

}
