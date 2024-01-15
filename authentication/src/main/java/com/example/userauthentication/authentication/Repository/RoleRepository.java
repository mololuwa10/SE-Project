package com.example.userauthentication.authentication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.userauthentication.authentication.Models.Roles;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Roles, Integer> {
  Optional<Roles> findByAuthority(String authority);
}
