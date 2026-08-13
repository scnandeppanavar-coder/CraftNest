package com.handmadecrafts.backend.service;

import com.handmadecrafts.backend.dto.AddressDto;
import com.handmadecrafts.backend.entity.Address;
import com.handmadecrafts.backend.entity.User;
import com.handmadecrafts.backend.exception.ResourceNotFoundException;
import com.handmadecrafts.backend.repository.AddressRepository;
import com.handmadecrafts.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public List<AddressDto> getAddressesByUser(Integer userId) {
        return addressRepository.findByUserUserId(userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AddressDto addAddress(Integer userId, AddressDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Address> existing = addressRepository.findByUserUserId(userId);
        boolean isFirst = existing.isEmpty();

        boolean shouldBeDefault = isFirst || dto.isDefault();

        if (shouldBeDefault) {
            unsetDefaultsForUser(userId);
        }

        Address address = Address.builder()
                .user(user)
                .name(dto.getName())
                .phone(dto.getPhone())
                .streetAddress(dto.getStreetAddress())
                .city(dto.getCity())
                .state(dto.getState())
                .zipCode(dto.getZipCode())
                .isDefault(shouldBeDefault)
                .build();

        Address saved = addressRepository.save(address);
        return toDto(saved);
    }

    @Transactional
    public AddressDto updateAddress(Integer addressId, AddressDto dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        address.setName(dto.getName());
        address.setPhone(dto.getPhone());
        address.setStreetAddress(dto.getStreetAddress());
        address.setCity(dto.getCity());
        address.setState(dto.getState());
        address.setZipCode(dto.getZipCode());

        if (dto.isDefault() && !address.isDefault()) {
            unsetDefaultsForUser(address.getUser().getUserId());
            address.setDefault(true);
        } else if (!dto.isDefault() && address.isDefault()) {
            address.setDefault(false);
        }

        Address saved = addressRepository.save(address);
        return toDto(saved);
    }

    @Transactional
    public void deleteAddress(Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        boolean wasDefault = address.isDefault();
        Integer userId = address.getUser().getUserId();

        addressRepository.delete(address);

        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUserUserId(userId);
            if (!remaining.isEmpty()) {
                Address newDefault = remaining.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }

    @Transactional
    public AddressDto setDefaultAddress(Integer userId, Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("Address does not belong to this user");
        }

        unsetDefaultsForUser(userId);
        address.setDefault(true);
        Address saved = addressRepository.save(address);
        return toDto(saved);
    }

    private void unsetDefaultsForUser(Integer userId) {
        List<Address> defaults = addressRepository.findByUserUserId(userId);
        for (Address addr : defaults) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private AddressDto toDto(Address address) {
        return AddressDto.builder()
                .addressId(address.getAddressId())
                .userId(address.getUser().getUserId())
                .name(address.getName())
                .phone(address.getPhone())
                .streetAddress(address.getStreetAddress())
                .city(address.getCity())
                .state(address.getState())
                .zipCode(address.getZipCode())
                .isDefault(address.isDefault())
                .build();
    }
}
