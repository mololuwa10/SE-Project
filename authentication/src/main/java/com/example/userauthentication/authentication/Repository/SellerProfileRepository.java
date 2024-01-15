package com.example.userauthentication.authentication.Repository;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.SellerProfile;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SellerProfileRepository
  extends JpaRepository<SellerProfile, Integer> {
  // Add custom query methods if needed
  Optional<SellerProfile> findBySeller(ApplicationUser applicationUser);
}
