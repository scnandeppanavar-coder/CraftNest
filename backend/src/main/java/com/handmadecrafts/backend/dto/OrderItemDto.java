package com.handmadecrafts.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {

    private Integer productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;
}