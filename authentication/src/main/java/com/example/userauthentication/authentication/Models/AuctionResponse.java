package com.example.userauthentication.authentication.Models;

public class AuctionResponse {
  private String message;
  private Auction auction;

  public AuctionResponse(String message, Auction auction) {
    this.message = message;
    this.auction = auction;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public Auction getAuction() {
    return auction;
  }

  public void setAuction(Auction auction) {
    this.auction = auction;
  }
}
