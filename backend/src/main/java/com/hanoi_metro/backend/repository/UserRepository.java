package com.hanoi_metro.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hanoi_metro.backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // Check if email exists
    boolean existsByEmail(String email);

    // Find user by email
    Optional<User> findByEmail(String email);

    boolean existsByIdAndUsedVouchers_Id(String userId, String voucherId);
}
