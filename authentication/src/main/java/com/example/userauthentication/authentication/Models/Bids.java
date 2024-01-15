package com.example.userauthentication.authentication.Models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
// import java.util.Optional;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalTimeDeserializer;

import jakarta.persistence.*;

@Entity
@Table(name = "bids")
public class Bids {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "bid_id")
  private Long bidId;

  @ManyToOne
  @JoinColumn(name = "lot_id", nullable = false)
  private Lot lot;

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private ApplicationUser user;

  @Column(name = "bid_amount", nullable = false)
  private BigDecimal bidAmount;

  @JsonDeserialize(using = LocalTimeDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
  @Column(name = "bid_time", nullable = false)
  private LocalTime bidTime;

  @JsonDeserialize(using = LocalDateDeserializer.class)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
  @Column(name = "bid_date", nullable = false)
  private LocalDate bidDate;

  // CONSTRUCTORS
  public Bids() {
  }

  public Bids(Lot lot, ApplicationUser user, BigDecimal bidAmount, LocalTime bidTime, LocalDate bidDate) {
    this.lot = lot;
    this.user = user;
    this.bidAmount = bidAmount;
    this.bidTime = bidTime;
    this.bidDate = bidDate;
  }

  // GETTERS AND SETTERS

  public Long getBidId() {
    return bidId;
  }

  public void setBidId(Long bidId) {
    this.bidId = bidId;
  }

  public Lot getLot() {
    return lot;
  }

  public ApplicationUser getUser() {
    return user;
  }

  public void setUser(ApplicationUser user) {
    this.user = user;
  }

  public BigDecimal getBidAmount() {
    return bidAmount;
  }

  public void setBidAmount(BigDecimal bidAmount) {
    this.bidAmount = bidAmount;
  }

  public LocalTime getBidTime() {
    return bidTime;
  }

  public void setBidTime(LocalTime bidTime) {
    this.bidTime = bidTime;
  }

  public LocalDate getBidDate() {
    return bidDate;
  }

  public void setBidDate(LocalDate bidDate) {
    this.bidDate = bidDate;
  }

  public void setLot(Lot lot) {
    this.lot = lot;
  }

}
