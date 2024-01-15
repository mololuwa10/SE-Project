package com.example.userauthentication.authentication.Models;

import jakarta.persistence.*;

@Entity
@Table(name = "seller_profiles")
public class SellerProfile {

  @Id
  @Column(name = "seller_id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer sellerId;

  @OneToOne
  @JoinColumn(name = "user_id", referencedColumnName = "user_id")
  private ApplicationUser seller;

  @Column(name = "bio")
  private String bio;

  @Column(name = "profile_picture")
  private String profilePicture;

  @Column(name = "location")
  private String location;

  // Other artisans details can be entered

  // Constructor
  public SellerProfile() {
    super();
  }

  public SellerProfile(
    ApplicationUser seller,
    String bio,
    String profilePicture,
    String location
  ) {
    super();
    this.seller = seller;
    this.bio = bio;
    this.profilePicture = profilePicture;
    this.location = location;
  }

  //Getters and setters

  public Integer getSellerId() {
    return sellerId;
  }

  public void setSellerId(Integer sellerId) {
    this.sellerId = sellerId;
  }

  public ApplicationUser getSeller() {
    return seller;
  }

  public void setSeller(ApplicationUser seller) {
    this.seller = seller;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getProfilePicture() {
    return profilePicture;
  }

  public void setProfilePicture(String profilePicture) {
    this.profilePicture = profilePicture;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }
}
