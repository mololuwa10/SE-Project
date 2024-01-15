package com.example.userauthentication.authentication.Services;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Models.AuctionBidsDTO;
import com.example.userauthentication.authentication.Models.Bids;
import com.example.userauthentication.authentication.Models.Lot;
// import com.example.userauthentication.authentication.Models.Lot;
import com.example.userauthentication.authentication.Repository.BidRepository;
// import com.example.userauthentication.authentication.Repository.LotRepository;
import com.example.userauthentication.authentication.Repository.UserRepository;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class BidService {

  private final BidRepository bidRepository;
  private final UserRepository userRepository;

  // private final LotRepository lotRepository;

  public BidService(
    BidRepository bidRepository,
    UserRepository userRepository
  ) {
    this.bidRepository = bidRepository;
    this.userRepository = userRepository;
    // this.lotRepository = lotRepository;
  }

  public Bids createBids(Bids bids) {
    if (bids == null) {
      return null;
    }
    return bidRepository.save(bids);
  }

  public List<Bids> getAllBids() {
    return bidRepository.findAll();
  }

  public Bids getBidById(Long id) {
    if (id == null) {
      return null;
    }
    return bidRepository.findById(id).orElse(null);
  }

  public List<Bids> getBidsByUser(Integer userId) {
    if (userId == null) {
      return null;
    }
    ApplicationUser user = userRepository
      .findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));
    return bidRepository.findByUser(user);
  }

  public Bids getBidByLotId(Long lotId) {
    List<Bids> bids = bidRepository.findByLot_LotId(lotId);
    if (!bids.isEmpty()) {
      // Return the first Bids object in the list
      return bids.get(0);
    } else {
      // Return null if the list is empty
      return null;
    }
  }

  public Bids updateBid(Long id, Bids bidDetails) {
    Bids bid = getBidById(id);
    bid.setBidAmount(bidDetails.getBidAmount());
    bid.setBidTime(bidDetails.getBidTime());
    return bidRepository.save(bid);
  }

  public void deleteBid(Long id) {
    Bids bid = getBidById(id);
    if (bid == null) {
      return;
    }
    bidRepository.delete(bid);
  }

  public Map<Long, AuctionBidsDTO> getGroupedBidsByUser(Integer userId) {
    if (userId == null) {
      return null;
    }
    ApplicationUser user = userRepository
      .findById(userId)
      .orElseThrow(() -> new RuntimeException("User not found"));

    List<Bids> userBids = bidRepository.findByUser(user);

    return userBids
      .stream()
      .collect(
        Collectors.groupingBy(
          bid -> bid.getLot().getAuction().getAuctionId(),
          Collectors.toList()
        )
      )
      .entrySet()
      .stream()
      .collect(
        Collectors.toMap(
          Map.Entry::getKey,
          entry -> {
            Auction auction = entry.getValue().get(0).getLot().getAuction();
            List<Lot> lots = entry
              .getValue()
              .stream()
              .map(Bids::getLot)
              .distinct()
              .collect(Collectors.toList());
            return new AuctionBidsDTO(auction, lots, entry.getValue());
          }
        )
      );
  }
}
