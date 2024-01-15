package com.example.userauthentication.authentication.Services;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.SellerProfile;
import com.example.userauthentication.authentication.Repository.SellerProfileRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SellerProfileService {

  @Autowired
  private SellerProfileRepository sellerProfileRepository;

  public List<SellerProfile> getAllSellerProfiles() {
    return sellerProfileRepository.findAll();
  }

  public Optional<SellerProfile> getSellerProfileById(Integer id) {
    if (id == null) {
      return Optional.empty();
    }
    return sellerProfileRepository.findById(id);
  }

  public SellerProfile saveOrUpdateSellerProfile(
    SellerProfile sellerProfileProfile
  ) {
    if (sellerProfileProfile == null) {
      return null;
    }
    return sellerProfileRepository.save(sellerProfileProfile);
  }

  public void deleteSellerProfile(Integer id) {
    if (id == null) {
      return;
    }
    sellerProfileRepository.deleteById(id);
  }

  // Method to find SellerProfile by ApplicationUser
  public Optional<SellerProfile> findBySeller(ApplicationUser seller) {
    Optional<SellerProfile> profiles = sellerProfileRepository.findBySeller(
      seller
    );
    return profiles.isEmpty() ? Optional.empty() : Optional.of(profiles.get());
  }
}
