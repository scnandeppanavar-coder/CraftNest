package com.handmadecrafts.backend.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDto {

    private Integer cartId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
}
