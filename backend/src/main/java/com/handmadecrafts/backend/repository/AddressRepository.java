package com.handmadecrafts.backend.repository;

import com.handmadecrafts.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserUserId(Integer userId);
    Optional<Address> findByUserUserIdAndIsDefaultTrue(Integer userId);
}
