package com.example.userauthentication.authentication.Controllers;

import java.io.IOException;

import java.nio.file.*;

import java.util.*;

import org.springframework.http.*;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Models.Lot;
import com.example.userauthentication.authentication.Services.AuctionService;
import com.example.userauthentication.authentication.Services.LotService;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = {
    "http://localhost:3000",
}, methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST
})

@RestController
@RequestMapping("/api/lots")
public class LotController {
  private final LotService lotService;
  private final AuctionService auctionService;

  public LotController(LotService lotService, AuctionService auctionService) {
    this.lotService = lotService;
    this.auctionService = auctionService;
  }

  @GetMapping
  public List<Lot> getAllLots() {
    return lotService.getAllLots();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Lot> getLotById(@PathVariable Long id) {
    return lotService.getLotById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping
  public ResponseEntity<Lot> createLot(@RequestParam("lot") String lotStr, @RequestParam("image") MultipartFile image) {
    try {
      // Implement this method to handle image storage
      String imageUrl = storeImage(image);

      ObjectMapper mapper = new ObjectMapper();
      Lot lot = mapper.readValue(lotStr, Lot.class);
      lot.setLotImage(imageUrl);

      // Set the lot number
      lot.setLotNumber(lotService.generateNextLotNumber());

      // Fetch and set the associated auction
      Auction auction = auctionService.getAuctionById(lot.getAuctionId());
      if (auction != null) {
        lot.setAuction(auction);
      } else {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
      }

      Lot createdLot = lotService.saveLot(lot);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdLot);
    } catch (IOException e) {
      // Handling IOException, loggging the error
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Lot> updateLot(@PathVariable Long id, @RequestParam("image") MultipartFile image,
      @RequestParam("lot") String lotJson) throws IOException {
    Optional<Lot> existingLotOptional = lotService.getLotById(id);
    if (!existingLotOptional.isPresent()) {
      return ResponseEntity.notFound().build();
    }

    Lot existingLot = existingLotOptional.get();

    if (existingLot.getAuction().getStatus() == Auction.Status.COMPLETED) {
      return ResponseEntity.badRequest().body(null);
    }

    Lot updatedLot = new ObjectMapper().readValue(lotJson, Lot.class);

    // Preserve the existing lot number
    updatedLot.setLotNumber(existingLot.getLotNumber());

    if (image != null && !image.isEmpty()) {
      String imageUrl = storeImage(image);
      updatedLot.setLotImage(imageUrl);
    } else {
      updatedLot.setLotImage(existingLot.getLotImage());
    }

    updatedLot.setLotId(id);
    return ResponseEntity.ok(lotService.saveLot(updatedLot));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteLot(@PathVariable Long id) {
    Optional<Lot> existingLotOptional = lotService.getLotById(id);
    if (!existingLotOptional.isPresent()) {
      return ResponseEntity.notFound().build();
    }

    Lot existingLot = existingLotOptional.get();

    if (existingLot.getAuction().getStatus() == Auction.Status.COMPLETED) {
      return ResponseEntity.badRequest().body(null);
    }

    lotService.deleteLot(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/lotAuction/{auctionId}")
  public List<Lot> getLotsByAuctionId(@PathVariable Long auctionId) {
    return lotService.getLotsByAuctionId(auctionId);
  }

  private String storeImage(MultipartFile image) throws IOException {
    if (image != null && !image.isEmpty()) {
      // Define the path to the directory where the images will be stored
      Path uploadDir = Paths.get("uploads");

      // If the directory doesn't exist, create it
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      // Generate a unique filename using the current time and the original filename
      String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();

      // Save the image file to the upload directory
      Files.copy(image.getInputStream(), uploadDir.resolve(filename));

      // Return the URL of the image (change this to the actual URL in your
      // application)
      return "/uploads/" + filename;
    }
    return null;
  }

  @GetMapping("/price-band")
  public ResponseEntity<List<Lot>> getAuctionsByPriceBand(@RequestParam("band") int band) {
    List<Lot> lots = lotService.getAuctionsByPriceBand(band);
    return ResponseEntity.ok(lots);
  }

  // @GetMapping("/details")
  // public ResponseEntity<Map<String, Set<String>>> getLotDetails() {
  // Set<String> artists = lotService.getAllArtists();
  // Set<String> subjectClassifications =
  // lotService.getAllSubjectClassifications();
  // Set<Integer> yearsProduced = lotService.getAllYearsProduced();

  // Map<String, Set<String>> response = new HashMap<>();
  // response.put("artists",
  // artists.stream().map(String::valueOf).collect(Collectors.toSet()));
  // response.put("subjectClassifications", subjectClassifications);
  // response.put("yearsProduced",
  // yearsProduced.stream().map(String::valueOf).collect(Collectors.toSet()));

  // return ResponseEntity.ok(response);
  // }
}
