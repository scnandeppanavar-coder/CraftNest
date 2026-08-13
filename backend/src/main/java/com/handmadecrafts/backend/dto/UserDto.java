package com.handmadecrafts.backend.dto;

import com.handmadecrafts.backend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private Integer userId;
    private String username;
    private String email;
    private Role role;
    private LocalDate createdAt;
}
