package com.handmadecrafts.backend.repository;

import com.handmadecrafts.backend.entity.Wishlist;
import com.handmadecrafts.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {

    List<Wishlist> findByUser(User user);

    Optional<Wishlist> findByUserAndProductProductId(User user, Integer productId);

    @Modifying
    @Transactional
    void deleteByUserAndProductProductId(User user, Integer productId);

    long countByUser(User user);
}