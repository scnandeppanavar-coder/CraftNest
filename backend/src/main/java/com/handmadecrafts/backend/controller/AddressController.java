package com.handmadecrafts.backend.controller;

import com.handmadecrafts.backend.dto.AddressDto;
import com.handmadecrafts.backend.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDto>> getAddresses(@PathVariable Integer userId) {
        return ResponseEntity.ok(addressService.getAddressesByUser(userId));
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressDto> addAddress(
            @PathVariable Integer userId,
            @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.addAddress(userId, addressDto));
    }

    @PutMapping("/{addressId}")
    public ResponseEntity<AddressDto> updateAddress(
            @PathVariable Integer addressId,
            @RequestBody AddressDto addressDto) {
        return ResponseEntity.ok(addressService.updateAddress(addressId, addressDto));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<String> deleteAddress(@PathVariable Integer addressId) {
        addressService.deleteAddress(addressId);
        return ResponseEntity.ok("Address deleted successfully");
    }

    @PutMapping("/user/{userId}/default/{addressId}")
    public ResponseEntity<AddressDto> setDefaultAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        return ResponseEntity.ok(addressService.setDefaultAddress(userId, addressId));
    }
}
