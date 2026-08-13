package com.handmadecrafts.backend.repository;

import com.handmadecrafts.backend.entity.Order;
import com.handmadecrafts.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);
}