package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.UserDto;
import com.handmadecrafts.backend.entity.Role;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.repository.UserRepository;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.exception.EmailAlreadyExistsException;
import com.handmadecrafts.backend.exception.UsernameAlreadyExistsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .userId(user.getUserId())
                        .username(user.getUsername())
                        .email(user.getEmail())
                        .role(user.getRole())
                        .createdAt(user.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<UserDto> getAllCustomers() {
        return getAllUsers().stream()
                .filter(user -> user.getRole() == Role.CUSTOMER)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateUserProfile(Integer userId, UserDto userDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getUsername().equals(userDto.getUsername())) {
            if (userRepository.existsByUsername(userDto.getUsername())) {
                throw new UsernameAlreadyExistsException("Username already exists");
            }
            user.setUsername(userDto.getUsername());
        }

        if (!user.getEmail().equals(userDto.getEmail())) {
            if (userRepository.existsByEmail(userDto.getEmail())) {
                throw new EmailAlreadyExistsException("Email already exists");
            }
            user.setEmail(userDto.getEmail());
        }

        user = userRepository.save(user);

        return UserDto.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
