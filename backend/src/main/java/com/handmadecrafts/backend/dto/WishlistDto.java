package com.handmadecrafts.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDto {

    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private BigDecimal price;
    private String imageUrl;
}