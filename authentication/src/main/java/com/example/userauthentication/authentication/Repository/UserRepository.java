package com.example.userauthentication.authentication.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.userauthentication.authentication.Models.ApplicationUser;

@Repository
public interface UserRepository extends JpaRepository<ApplicationUser, Integer> {
  Optional<ApplicationUser> findByUsername(String username);
}