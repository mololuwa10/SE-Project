package com.example.userauthentication.authentication.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "locations")
public class Locations {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "location_id")
  private Long id;

  @Column(name = "location_name")
  private String locationName;

  // Constructors, getters and setters...
  public Locations() {

  }

  public Locations(String locationName) {
    this.locationName = locationName;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getLocationName() {
    return locationName;
  }

  public void setLocationName(String locationName) {
    this.locationName = locationName;
  }
}
