package com.example.userauthentication.authentication.Services;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Repository.AuctionRepository;
import com.example.userauthentication.authentication.Repository.UserRepository;
import java.util.List;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// import java.util.Set;

@Service
public class AuctionService {

  private final AuctionRepository auctionRepository;

  private final UserRepository userRepository;

  public AuctionService(
    AuctionRepository auctionRepository,
    UserRepository userRepository
  ) {
    this.auctionRepository = auctionRepository;
    this.userRepository = userRepository;
  }

  public List<Auction> getAllAuctions() {
    return auctionRepository.findAll();
  }

  public Auction getAuctionById(Long id) {
    if (id == null) {
      return null;
    }
    return auctionRepository.findById(id).orElse(null);
  }

  public Auction saveAuction(Auction auction) {
    if (auction == null) {
      return null;
    }
    return auctionRepository.save(auction);
  }

  public void deleteAuction(Long id) {
    if (id == null) {
      return;
    }
    auctionRepository.deleteById(id);
  }

  public List<Auction> getAuctionsByUser(Integer userId) {
    if (userId == null) {
      return null;
    }
    ApplicationUser user = userRepository
      .findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));
    return auctionRepository.findByUser(user);
  }

  public Auction updateAuctionStatus(Long id, String newStatus) {
    if (id == null || newStatus == null) {
      return null;
    }
    Auction auction = auctionRepository
      .findById(id)
      .orElseThrow(() -> new RuntimeException("Auction not found"));
    try {
      Auction.Status status = Auction.Status.valueOf(newStatus.toUpperCase());
      auction.setStatus(status);
    } catch (IllegalArgumentException e) {
      throw new RuntimeException("Invalid status value: " + newStatus);
    }
    return auctionRepository.save(auction);
  }

  public List<Auction> getAuctionByCategoryId(Long categoryId) {
    return auctionRepository.findByCategory_CategoryId(categoryId);
  }
}
