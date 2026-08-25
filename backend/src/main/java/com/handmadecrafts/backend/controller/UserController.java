package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.UserDto;
import com.handmadecrafts.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<UserDto> updateUserProfile(
            @PathVariable Integer userId,
            @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUserProfile(userId, userDto));
    }

    @DeleteMapping("/users/{userId}/profile-picture")
    public ResponseEntity<UserDto> removeProfilePicture(@PathVariable Integer userId) {
        return ResponseEntity.ok(userService.removeProfilePicture(userId));
    }
}
