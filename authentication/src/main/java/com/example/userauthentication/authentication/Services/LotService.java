package com.example.userauthentication.authentication.Services;

// import com.example.userauthentication.authentication.Models.Auction;
// import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Models.Lot;
import com.example.userauthentication.authentication.Repository.LotRepository;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
// import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class LotService {

  private final LotRepository lotRepository;

  public LotService(LotRepository lotRepository) {
    this.lotRepository = lotRepository;
  }

  public List<Lot> getAllLots() {
    return lotRepository.findAll();
  }

  public Optional<Lot> getLotById(Long id) {
    if (id == null) {
      return Optional.empty();
    }
    return lotRepository.findById(id);
  }

  public Lot saveLot(Lot lot) {
    if (lot == null) {
      return null;
    }
    return lotRepository.save(lot);
  }

  public void deleteLot(Long id) {
    if (id == null) {
      return;
    }
    lotRepository.deleteById(id);
  }

  public List<Lot> getLotsByAuctionId(Long auctionId) {
    return lotRepository.findByAuction_AuctionId(auctionId);
  }

  public String generateNextLotNumber() {
    String lastLotNumber = lotRepository
      .findTopByOrderByLotNumberDesc()
      .map(Lot::getLotNumber)
      .orElse("00000000");

    long lastNumber = Long.parseLong(lastLotNumber);
    String nextLotNumber = String.format("%08d", lastNumber + 1);
    return nextLotNumber;
  }

  public List<Lot> getAuctionsByPriceBand(int band) {
    switch (band) {
      case 1: // Lower Band: 500 - 9500
        return lotRepository.findByEstimatedPriceBetween(
          BigDecimal.valueOf(5000.00),
          BigDecimal.valueOf(9500.00)
        );
      case 2: // Medium Price Band: 9500.01 - 13400.00
        return lotRepository.findByEstimatedPriceBetween(
          BigDecimal.valueOf(9500.01),
          BigDecimal.valueOf(13400.00)
        );
      case 3: // Higher Band: 13400.01 and above
        return lotRepository.findByEstimatedPriceGreaterThan(
          BigDecimal.valueOf(13400.01)
        );
      default:
        return new ArrayList<>();
    }
  }
  // // Get all subject classifcations in auction table
  // public Set<String> getAllSubjectClassifications() {
  // return lotRepository.findAllSubjectClassifications();
  // }

  // // Get all artists in auction table
  // public Set<String> getAllArtists() {
  // return lotRepository.findAllArtists();
  // }

  // // Get all year produced
  // public Set<Integer> getAllYearsProduced() {
  // return lotRepository.findAllYearsProduced();
  // }
}
