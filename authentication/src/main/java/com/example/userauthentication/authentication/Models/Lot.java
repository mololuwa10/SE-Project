package com.example.userauthentication.authentication.Models;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "lot")
public class Lot {
  public enum Status {
    OPEN,
    CLOSED
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "lot_id")
  private Long lotId;

  @Column(name = "lot_title")
  private String lotTitle;

  @ManyToOne
  @JoinColumn(name = "auction_id", nullable = false)
  private Auction auction;

  @Column(name = "lot_number")
  private String lotNumber;

  @Column(name = "artist")
  private String artist;

  @Column(name = "year_produced")
  private Integer yearProduced;

  @Column(name = "subject_classification")
  private String subjectClassification;

  @Column(name = "description")
  private String description;

  @Column(name = "estimated_price")
  private BigDecimal estimatedPrice;

  @Column(name = "lot_image")
  private String lotImage;

  @Column(name = "dimensions")
  private String dimensions;

  @Enumerated(EnumType.STRING)
  @Column(name = "lot_status")
  private Status status;

  // Constructors
  public Lot() {
  }

  public Lot(Long lotId, Auction auction, String lotNumber, String artist, Integer yearProduced,
      String subjectClassification, String description, BigDecimal estimatedPrice,
      String lotImage, String lotTitle, String dimensions, Status status) {
    this.lotId = lotId;
    this.auction = auction;
    this.lotNumber = lotNumber;
    this.artist = artist;
    this.yearProduced = yearProduced;
    this.subjectClassification = subjectClassification;
    this.description = description;
    this.estimatedPrice = estimatedPrice;
    this.lotImage = lotImage;
    this.lotTitle = lotTitle;
    this.dimensions = dimensions;
    this.status = status;
  }

  // Getters and setters
  public Long getLotId() {
    return lotId;
  }

  public void setLotId(Long lotId) {
    this.lotId = lotId;
  }

  public String getLotTitle() {
    return lotTitle;
  }

  public void setLotTitle(String lotTitle) {
    this.lotTitle = lotTitle;
  }

  public Long getAuctionId() {
    return auction != null ? auction.getAuctionId() : null;
  }

  public void setAuctionId(Long auctionId) {
    if (auction == null) {
      auction = new Auction();
    }
    auction.setAuctionId(auctionId);
  }

  // public String getAuctionName() {
  // return auction.getAuctionName();
  // }

  public Auction getAuction() {
    return auction;
  }

  public void setAuction(Auction auction) {
    this.auction = auction;
  }

  public String getLotNumber() {
    return lotNumber;
  }

  public String getArtist() {
    return artist;
  }

  public Integer getYearProduced() {
    return yearProduced;
  }

  public String getSubjectClassification() {
    return subjectClassification;
  }

  public String getDescription() {
    return description;
  }

  public BigDecimal getEstimatedPrice() {
    return estimatedPrice;
  }

  public void setLotNumber(String lotNumber) {
    this.lotNumber = lotNumber;
  }

  public void setArtist(String artist) {
    this.artist = artist;
  }

  public void setYearProduced(Integer yearProduced) {
    this.yearProduced = yearProduced;
  }

  public void setSubjectClassification(String subjectClassification) {
    this.subjectClassification = subjectClassification;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public void setEstimatedPrice(BigDecimal estimatedPrice) {
    this.estimatedPrice = estimatedPrice;
  }

  public void setLotImage(String lotImage) {
    this.lotImage = lotImage;
  }

  public String getLotImage() {
    return lotImage;
  }

  public String getDimensions() {
    return dimensions;
  }

  public void setDimensions(String dimensions) {
    this.dimensions = dimensions;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

}
