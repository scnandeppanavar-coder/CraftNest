package com.handmadecrafts.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Integer reviewId;
    private Integer productId;
    private Integer userId;
    private String username;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String productName;
    private String productImageUrl;
}
