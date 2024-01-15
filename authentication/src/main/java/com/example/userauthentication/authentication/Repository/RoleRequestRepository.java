package com.example.userauthentication.authentication.Repository;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.RoleRequest;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRequestRepository
  extends JpaRepository<RoleRequest, Long> {
  // Add custom query methods if needed
  Optional<RoleRequest> findByUser(ApplicationUser user);
}
