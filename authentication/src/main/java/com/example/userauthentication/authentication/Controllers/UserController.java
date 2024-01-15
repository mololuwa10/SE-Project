package com.example.userauthentication.authentication.Controllers;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.RoleRequest;
import com.example.userauthentication.authentication.Repository.RoleRequestRepository;
import com.example.userauthentication.authentication.Repository.UserRepository;
// import com.example.userauthentication.authentication.Services.UserService;
import com.example.userauthentication.authentication.Services.UserService;
import java.security.Principal;
import java.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
// import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.Authentication;
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
@RequestMapping("/api/user")
public class UserController {

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserService userService;

  @Autowired
  private RoleRequestRepository roleRequestRepository;

  // @GetMapping("/")
  // public String helloUserController() {
  // return "User access level";
  // }

  @GetMapping("/info")
  public ResponseEntity<ApplicationUser> getUserDetails() {
    Authentication authentication = SecurityContextHolder
      .getContext()
      .getAuthentication();
    if (!(authentication instanceof AnonymousAuthenticationToken)) {
      Jwt jwt = (Jwt) authentication.getPrincipal();
      String username = jwt.getClaim("sub");
      Optional<ApplicationUser> optionalUser = userRepository.findByUsername(
        username
      );
      if (optionalUser.isPresent()) {
        ApplicationUser user = optionalUser.get();
        user.setPassword(null);
        return ResponseEntity.ok(user);
      } else {
        throw new ResponseStatusException(
          HttpStatus.NOT_FOUND,
          "User not found"
        );
      }
    } else {
      throw new ResponseStatusException(
        HttpStatus.UNAUTHORIZED,
        "User not authenticated"
      );
    }
  }

  @PutMapping("/{userId}")
  public ResponseEntity<?> updateUser(
    @PathVariable Integer userId,
    @RequestBody ApplicationUser updatedUser
  ) {
    Authentication authentication = SecurityContextHolder
      .getContext()
      .getAuthentication();
    if (!(authentication instanceof AnonymousAuthenticationToken)) {
      Jwt jwt = (Jwt) authentication.getPrincipal();
      Long authenticatedUserIdLong = jwt.getClaim("userId");

      // Safely convert Long to Integer
      Integer authenticatedUserId = authenticatedUserIdLong != null
        ? authenticatedUserIdLong.intValue()
        : null;

      // Check if the authenticated user is trying to update their own details
      if (authenticatedUserId == null || !userId.equals(authenticatedUserId)) {
        return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body("You can only update your own details.");
      }

      try {
        ApplicationUser user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
      } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
      }
    } else {
      return ResponseEntity
        .status(HttpStatus.UNAUTHORIZED)
        .body("User not authenticated");
    }
  }

  @PostMapping("/request-seller")
  public ResponseEntity<?> requestSellerRole(Principal principal) {
    userService.requestSellerRole(principal.getName());
    return ResponseEntity.ok(
      "Request to become a seller submitted successfully."
    );
  }

  @GetMapping("/role-request-status")
  public ResponseEntity<?> checkRoleRequestStatus(Principal principal) {
    Optional<ApplicationUser> userOpt = userRepository.findByUsername(
      principal.getName()
    );

    if (userOpt.isPresent()) {
      ApplicationUser user = userOpt.get();
      Optional<RoleRequest> roleRequestOpt = roleRequestRepository.findByUser(
        user
      );

      if (roleRequestOpt.isPresent() && !roleRequestOpt.get().isApproved()) {
        return ResponseEntity.ok(
          Collections.singletonMap("hasPendingRequest", true)
        );
      }
    }

    return ResponseEntity.ok(
      Collections.singletonMap("hasPendingRequest", false)
    );
  }
}
