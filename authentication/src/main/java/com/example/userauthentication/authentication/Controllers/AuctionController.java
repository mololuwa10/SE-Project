package com.example.userauthentication.authentication.Controllers;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Models.Locations;
import com.example.userauthentication.authentication.Services.AuctionService;
import com.example.userauthentication.authentication.Services.LocationService;
import com.example.userauthentication.authentication.Services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
// import java.util.Optional;
import java.nio.file.*;
import java.security.Principal;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(
  origins = { "http://localhost:3000" },
  methods = {
    RequestMethod.OPTIONS,
    RequestMethod.GET,
    RequestMethod.PUT,
    RequestMethod.DELETE,
    RequestMethod.POST,
  }
)
@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

  private final AuctionService auctionService;
  private final UserService userService;
  private final LocationService locationService;

  public AuctionController(
    AuctionService auctionService,
    UserService userService,
    LocationService locationService
  ) {
    this.auctionService = auctionService;
    this.userService = userService;
    this.locationService = locationService;
  }

  @GetMapping
  public List<Auction> getAllAuctions() {
    return auctionService.getAllAuctions();
  }

  // @GetMapping
  // public ResponseEntity<List<Auction>> getAuctions(Principal principal) {
  // ApplicationUser user = userRepository.findByUsername(principal.getName())
  // .orElseThrow(() -> new UsernameNotFoundException("User Not Found with
  // username: " + principal.getName()));

  // if (user.getAuthorities().equals("ADMIN")) {
  // return new ResponseEntity<>(auctionService.getAllAuctions(), HttpStatus.OK);
  // } else {
  // return new
  // ResponseEntity<>(auctionService.getAuctionsByUser(user.getUserId()),
  // HttpStatus.OK);
  // }
  // }

  @GetMapping("/{id}")
  public ResponseEntity<Auction> getAuctionById(@PathVariable Long id) {
    Auction auction = auctionService.getAuctionById(id);
    if (auction != null) {
      return ResponseEntity.ok(auction);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping
  public ResponseEntity<Object> createAuction(
    @RequestParam("image") MultipartFile image,
    @RequestParam("auction") String auctionStr,
    Principal principal
  ) {
    try {
      String imageUrl = storeImage(image);

      ObjectMapper mapper = new ObjectMapper();
      Auction auction = mapper.readValue(auctionStr, Auction.class);
      auction.setAuctionImage(imageUrl);

      // Getting the user from user service
      ApplicationUser user = userService.findByUsername(principal.getName());
      if (user == null) {
        throw new RuntimeException("User not found");
      }

      // Getting the location from location service
      Locations location = locationService
        .getLocationById(auction.getLocations().getId())
        .orElseThrow(() -> new RuntimeException("Location not found"));

      auction.setLocations(location);
      auction.setUser(user);
      Auction createdAuction = auctionService.saveAuction(auction);
      return ResponseEntity.status(HttpStatus.CREATED).body(createdAuction);
    } catch (IOException e) {
      // Handling IOException
      e.printStackTrace();
      return ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body("Failed to create auction");
    }
  }

  @GetMapping("/user/{userId}")
  public ResponseEntity<List<Auction>> getAuctionsByUserId(
    @PathVariable Integer userId
  ) {
    try {
      List<Auction> auctions = auctionService.getAuctionsByUser(userId);
      if (auctions.isEmpty()) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      }
      return new ResponseEntity<>(auctions, HttpStatus.OK);
    } catch (RuntimeException e) {
      // This will catch the "User not found" runtime exception
      return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
  }

  @PutMapping("/{id}")
  public ResponseEntity<Auction> updateAuction(
    @PathVariable Long id,
    @RequestParam("image") MultipartFile image,
    @RequestParam("auction") String auctionJson,
    Principal principal
  ) throws IOException {
    Auction updatedAuction = new ObjectMapper()
      .readValue(auctionJson, Auction.class);
    Auction existingAuction = auctionService.getAuctionById(id);
    if (existingAuction != null) {
      String imageUrl = storeImage(image);
      updatedAuction.setAuctionId(id);
      updatedAuction.setAuctionImage(imageUrl);

      // Getting the user from user service
      ApplicationUser user = userService.findByUsername(principal.getName());
      if (user == null) {
        throw new RuntimeException("User not found");
      }

      // Getting the location from location service
      Locations location = locationService
        .getLocationById(updatedAuction.getLocations().getId())
        .orElseThrow(() -> new RuntimeException("Location not found"));

      updatedAuction.setLocations(location);
      updatedAuction.setUser(user);
      return ResponseEntity.ok(auctionService.saveAuction(updatedAuction));
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteAuction(@PathVariable Long id) {
    Auction existingAuction = auctionService.getAuctionById(id);
    if (existingAuction != null) {
      auctionService.deleteAuction(id);
      return ResponseEntity.noContent().build();
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/category/{categoryId}")
  public ResponseEntity<List<Auction>> getLotsByCategoryId(
    @PathVariable Long categoryId
  ) {
    List<Auction> lots = auctionService.getAuctionByCategoryId(categoryId);
    if (lots.isEmpty()) {
      return ResponseEntity.notFound().build();
    } else {
      return ResponseEntity.ok(lots);
    }
  }

  private String storeImage(MultipartFile image) throws IOException {
    if (image != null && !image.isEmpty()) {
      Path uploadDir = Paths.get("uploads");

      // If the directory doesn't exist, create it
      if (!Files.exists(uploadDir)) {
        Files.createDirectories(uploadDir);
      }

      // Generate a unique filename using the current time and the original filename
      String filename =
        System.currentTimeMillis() + "_" + image.getOriginalFilename();

      // Save the image file to the upload directory
      Files.copy(image.getInputStream(), uploadDir.resolve(filename));

      // Return the URL of the image
      return "/uploads/" + filename;
    }
    return null;
  }
}
