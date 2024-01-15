package com.example.userauthentication.authentication.Services;

import com.example.userauthentication.authentication.Models.Locations;
import com.example.userauthentication.authentication.Repository.LocationRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class LocationService {

  private final LocationRepository locationRepository;

  public LocationService(LocationRepository locationRepository) {
    this.locationRepository = locationRepository;
  }

  public List<Locations> getAllLocations() {
    return locationRepository.findAll();
  }

  public Optional<Locations> getLocationById(Long id) {
    if (id == null) {
      return Optional.empty();
    }
    return locationRepository.findById(id);
  }

  public Locations saveLocation(Locations location) {
    if (location == null) {
      return null;
    }
    return locationRepository.save(location);
  }

  public void deleteLocation(Long id) {
    if (id == null) {
      return;
    }
    locationRepository.deleteById(id);
  }

  public List<Locations> getLocationsByName(String name) {
    return locationRepository.findByLocationName(name);
  }

  public List<Locations> getLocationsByNameContaining(String name) {
    return locationRepository.findByLocationNameContaining(name);
  }
}
