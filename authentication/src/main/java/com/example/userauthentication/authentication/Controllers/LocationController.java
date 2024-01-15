package com.example.userauthentication.authentication.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.userauthentication.authentication.Models.Locations;
import com.example.userauthentication.authentication.Services.LocationService;

@CrossOrigin(origins = {
    "http://localhost:3000",
}, methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST
})

@RestController
@RequestMapping("/api/locations")
public class LocationController {
  private final LocationService locationService;

  public LocationController(LocationService locationService) {
    this.locationService = locationService;
  }

  @GetMapping
  public List<Locations> getAllLocations() {
    return locationService.getAllLocations();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Locations> getLocationById(@PathVariable Long id) {
    return locationService.getLocationById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Object> createLocation(@RequestBody Locations location) {
    List<Locations> existingLocations = locationService.getLocationsByName(location.getLocationName());
    if (!existingLocations.isEmpty()) {
      for (Locations existingLocation : existingLocations) {
        if (existingLocation.getLocationName().equalsIgnoreCase(location.getLocationName())) {
          return ResponseEntity.status(HttpStatus.CONFLICT).body("Location Already Exists");
        }
      }
    }
    Locations newLocation = locationService.saveLocation(location);
    return ResponseEntity.status(HttpStatus.CREATED).body(newLocation);
  }

  @PutMapping("/{id}")
  public ResponseEntity<Locations> updateLocation(@PathVariable Long id, @RequestBody Locations location) {
    Optional<Locations> existingLocation = locationService.getLocationById(id);
    if (!existingLocation.isPresent()) {
      return ResponseEntity.notFound().build();
    }
    location.setId(id);
    Locations updatedLocation = locationService.saveLocation(location);
    return ResponseEntity.ok(updatedLocation);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
    locationService.deleteLocation(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/search")
  public List<Locations> searchLocations(@RequestParam String name) {
    return locationService.getLocationsByNameContaining(name);
  }
}
