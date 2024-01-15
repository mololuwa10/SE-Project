package com.example.userauthentication.authentication.Models;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;

@Entity
@Table(name = "auction")
public class Auction {

  public enum Status {
    UPCOMING,
    ONGOING,
    COMPLETED
  }

  public enum Period {
    MORNING,
    AFTERNOON,
    EVENING
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "auction_id")
  private Long auctionId;

  @Column(name = "auction_name")
  private String auctionName;

  @JsonDeserialize(using = LocalDateDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  @Column(name = "registration_date")
  private LocalDate registrationDate;

  @JsonDeserialize(using = LocalDateDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  @Column(name = "auction_date")
  private LocalDate auctionDate;

  @JsonDeserialize(using = LocalTimeDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
  @Column(name = "start_time")
  private LocalTime startTime;

  @JsonDeserialize(using = LocalTimeDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
  @Column(name = "end_time")
  private LocalTime endTime;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private Status status;

  @Enumerated(EnumType.STRING)
  @Column(name = "auction_period")
  private Period auctionPeriod;

  @Column(name = "auction_image")
  private String auctionImage;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private ApplicationUser user;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToOne
  @JoinColumn(name = "location_id")
  private Locations locations;

  // @Column(name = "drawing_medium")
  // private String drawingMedium; // for Drawings

  // @Column(name = "is_framed")
  // private Boolean isFramed; // for Drawings and Paintings

  // @Column(name = "medium_used")
  // private String mediumUsed; // for Paintings

  // @Column(name = "image_type")
  // private String imageType; // for Photographic Images

  // @Column(name = "material_used")
  // private String materialUsed; // for Sculptures and Carvings

  // @Column(name = "approx_weight")
  // private Double approxWeight; // for Sculptures and Carvings

  // Constructors
  public Auction() {
  }

  // Getters and Setters

  public Auction(String auctionName, LocalDate auctionDate, LocalTime startTime, LocalTime endTime, Status status,
      String auctionImage, Category category, Locations locations, Period auctionPeriod) {
    this.auctionName = auctionName;
    this.auctionDate = auctionDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.status = status;
    this.auctionImage = auctionImage;
    this.category = category;
    this.locations = locations;
    this.auctionPeriod = auctionPeriod;
  }

  public Long getAuctionId() {
    return auctionId;
  }

  public void setAuctionId(Long auctionId) {
    this.auctionId = auctionId;
  }

  public String getAuctionName() {
    return auctionName;
  }

  public void setAuctionName(String auctionName) {
    this.auctionName = auctionName;
  }

  public LocalDate getAuctionDate() {
    return auctionDate;
  }

  public void setAuctionDate(LocalDate auctionDate) {
    this.auctionDate = auctionDate;
  }

  public LocalTime getStartTime() {
    return startTime;
  }

  public void setStartTime(LocalTime startTime) {
    this.startTime = startTime;
  }

  public LocalTime getEndTime() {
    return endTime;
  }

  public void setEndTime(LocalTime endTime) {
    this.endTime = endTime;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public String getAuctionImage() {
    return auctionImage;
  }

  public void setAuctionImage(String auctionImage) {
    this.auctionImage = auctionImage;
  }

  public LocalDate getRegistrationDate() {
    return registrationDate;
  }

  public void setRegistrationDate(LocalDate registrationDate) {
    this.registrationDate = registrationDate;
  }

  public ApplicationUser getUser() {
    return user;
  }

  public void setUser(ApplicationUser user) {
    this.user = user;
  }

  public Category getCategory() {
    return category;
  }

  public void setCategory(Category category) {
    this.category = category;
  }

  public Locations getLocations() {
    return locations;
  }

  public void setLocations(Locations locations) {
    this.locations = locations;
  }

  public Period getAuctionPeriod() {
    return auctionPeriod;
  }

  public void setAuctionPeriod(Period auctionPeriod) {
    this.auctionPeriod = auctionPeriod;
  }
}