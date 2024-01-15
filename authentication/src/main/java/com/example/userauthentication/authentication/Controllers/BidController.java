package com.example.userauthentication.authentication.Controllers;

// import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
// import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.AuctionBidsDTO;
import com.example.userauthentication.authentication.Models.Bids;
import com.example.userauthentication.authentication.Models.Lot;
import com.example.userauthentication.authentication.Services.BidService;
import com.example.userauthentication.authentication.Services.LotService;
import com.example.userauthentication.authentication.Services.UserService;
// import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = {
    "*",
}, methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST
})

@RestController
@RequestMapping("/api/bids")
public class BidController {
  private static final Logger logger = LoggerFactory.getLogger(BidController.class);

  private final BidService bidService;
  private final UserService userService;
  private final LotService lotService;

  public BidController(BidService bidService, UserService userService, LotService lotService) {
    this.bidService = bidService;
    this.userService = userService;
    this.lotService = lotService;
  }

  // Get all bids
  @GetMapping
  public List<Bids> getAllBids() {
    return bidService.getAllBids();
  }

  // Get bids by id
  @GetMapping("/{id}")
  public ResponseEntity<Bids> getBidById(@PathVariable Long id) {
    Bids bid = bidService.getBidById(id);
    if (bid != null) {
      return ResponseEntity.ok(bid);
    } else {
      return ResponseEntity.notFound().build();
    }
    // return new ResponseEntity<>(bid, HttpStatus.OK);
  }

  @GetMapping("/{lotId}/highestBidder")
  public ResponseEntity<ApplicationUser> getHighestBidderByLot(@PathVariable Long lotId) {
    Bids highestBid = bidService.getBidByLotId(lotId);
    if (highestBid != null) {
      ApplicationUser highestBidder = highestBid.getUser();
      return ResponseEntity.ok(highestBidder);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping
  public ResponseEntity<?> createOrUpdateBid(@RequestBody Map<String, Object> bidData, Principal principal) {
    try {
      if (!bidData.containsKey("bidAmount") || !bidData.containsKey("lotId")) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing bidAmount or lotId");
      }

      Double bidAmount = null;
      Long lotId = null;
      try {
        bidAmount = Double.valueOf(bidData.get("bidAmount").toString());
        lotId = Long.valueOf(bidData.get("lotId").toString());
      } catch (NumberFormatException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid bidAmount or lotId");
      }

      ApplicationUser user = userService.findByUsername(principal.getName());
      if (user == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User does not exist");
      }

      Lot lot = lotService.getLotById(lotId).orElseThrow(() -> new RuntimeException("Lot does not exist"));

      Bids existingBid = bidService.getBidByLotId(lotId);
      if (existingBid != null) {
        if (BigDecimal.valueOf(bidAmount).compareTo(existingBid.getBidAmount()) <= 0) {
          return ResponseEntity.status(HttpStatus.BAD_REQUEST)
              .body("New bid amount must be greater than the current bid amount");
        }
        existingBid.setBidAmount(BigDecimal.valueOf(bidAmount));
        existingBid.setUser(user);
        existingBid.setBidDate(LocalDate.now());
        existingBid.setBidTime(LocalTime.now());
        bidService.updateBid(existingBid.getBidId(), existingBid);
        return ResponseEntity.ok(existingBid);
      } else {
        Bids newBid = new Bids();
        newBid.setBidAmount(BigDecimal.valueOf(bidAmount));
        newBid.setUser(user);
        newBid.setLot(lot);
        newBid.setBidDate(LocalDate.now());
        newBid.setBidTime(LocalTime.now());
        bidService.createBids(newBid);
        return ResponseEntity.ok(newBid);
      }
    } catch (Exception e) {
      logger.error("Error creating or updating bid", e);
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<Map<Long, AuctionBidsDTO>> getGroupedBidsByUser(@PathVariable Integer userId) {
    Map<Long, AuctionBidsDTO> groupedBids = bidService.getGroupedBidsByUser(userId);
    return new ResponseEntity<>(groupedBids, HttpStatus.OK);
  }

  @GetMapping("/lot/{lotId}")
  public ResponseEntity<Bids> getBidsByLot(@PathVariable Long lotId) {
    Bids bids = bidService.getBidByLotId(lotId);
    return new ResponseEntity<>(bids, HttpStatus.OK);
  }

  // Delete bids
  @DeleteMapping("/{id}")
  public ResponseEntity<Bids> deleteBid(@PathVariable Long id) {
    bidService.deleteBid(id);
    return ResponseEntity.noContent().build();
  }
}
