package com.example.userauthentication.authentication.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.userauthentication.authentication.Models.Locations;

@Repository
public interface LocationRepository extends JpaRepository<Locations, Long> {
  // Find Locations by locationName
  List<Locations> findByLocationName(String locationName);

  // Find Locations by part of a locationName
  List<Locations> findByLocationNameContaining(String locationName);
}
