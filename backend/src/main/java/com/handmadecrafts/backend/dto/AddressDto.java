package com.handmadecrafts.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDto {
    private Integer addressId;
    private Integer userId;
    private String name;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String zipCode;
    private boolean isDefault;
}
