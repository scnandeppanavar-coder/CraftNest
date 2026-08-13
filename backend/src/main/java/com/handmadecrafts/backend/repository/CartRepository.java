package com.handmadecrafts.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.handmadecrafts.backend.entity.Cart;
import com.handmadecrafts.backend.entity.User;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUser(User user);

    Optional<Cart> findByUserAndProductProductId(User user, Integer productId);

    long countByUser(User user);

    void deleteByUserAndProductProductId(User user, Integer productId);
}
