package com.handmadecrafts.backend.repository;

import com.handmadecrafts.backend.entity.Order;
import com.handmadecrafts.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUser(User user);
}
