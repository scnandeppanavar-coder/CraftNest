package com.handmadecrafts.backend.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.handmadecrafts.backend.entity.Product;

import jakarta.persistence.criteria.Predicate;

public class ProductSpecification {

    private ProductSpecification() {
    }

    public static Specification<Product> filterProducts(
            String keyword,
            Integer categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean onlyActive) {

        return (root, query, cb) -> {

            Predicate predicate = cb.conjunction();

            if (Boolean.TRUE.equals(onlyActive)) {
                predicate = cb.and(predicate, cb.equal(root.get("active"), true));
            }

            // Search by product name or description
            if (keyword != null && !keyword.isBlank()) {
                String search = "%" + keyword.toLowerCase() + "%";

                Predicate namePredicate = cb.like(
                        cb.lower(root.get("name")),
                        search);

                Predicate descriptionPredicate = cb.like(
                        cb.lower(root.get("description")),
                        search);

                predicate = cb.and(predicate,
                        cb.or(namePredicate, descriptionPredicate));
            }

            // Filter by category
            if (categoryId != null) {
                predicate = cb.and(predicate,
                        cb.equal(root.get("category").get("categoryId"), categoryId));
            }

            // Minimum price
            if (minPrice != null) {
                predicate = cb.and(predicate,
                        cb.greaterThanOrEqualTo(root.get("price"), minPrice));
            }

            // Maximum price
            if (maxPrice != null) {
                predicate = cb.and(predicate,
                        cb.lessThanOrEqualTo(root.get("price"), maxPrice));
            }

            return predicate;
        };
    }
}
