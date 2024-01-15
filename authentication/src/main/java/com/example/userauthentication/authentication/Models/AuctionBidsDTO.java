package com.example.userauthentication.authentication.Models;

import java.util.List;

public class AuctionBidsDTO {
  private Auction auctionDetails;
  private List<Lot> lots;
  private List<Bids> bids;

  public List<Bids> getBids() {
    return bids;
  }

  public void setBids(List<Bids> bids) {
    this.bids = bids;
  }

  public AuctionBidsDTO(Auction auctionDetails, List<Lot> lots, List<Bids> bids) {
    this.auctionDetails = auctionDetails;
    this.lots = lots;
    this.bids = bids;
  }

  // Getters and setters

  public Auction getAuctionDetails() {
    return auctionDetails;
  }

  public void setAuctionDetails(Auction auctionDetails) {
    this.auctionDetails = auctionDetails;
  }

  public List<Lot> getLots() {
    return lots;
  }

  public void setLots(List<Lot> lots) {
    this.lots = lots;
  }
}
