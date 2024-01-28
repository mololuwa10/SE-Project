package com.example.userauthentication.authentication.Controllers;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.RoleRequest;
import com.example.userauthentication.authentication.Models.Roles;
import com.example.userauthentication.authentication.Services.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminController {

  @Autowired
  private UserService userService;

  @GetMapping("/")
  public String helloAdminController() {
    return "Admin access level";
  }

  @GetMapping("/allUsers")
  public List<ApplicationUser> getAllUsers() {
    return userService.getAllUsers();
  }

  @GetMapping("/allRoles")
  public List<Roles> getAllRoles() {
    return userService.getAllRoles();
  }

  @GetMapping("/role-requests")
  public ResponseEntity<List<RoleRequest>> getAllRoleRequests() {
    List<RoleRequest> roleRequests = userService.getAllRoleRequests();
    return ResponseEntity.ok(roleRequests);
  }

  // Update user details and roles by Admin
  @PutMapping("/updateUser/{userId}")
  // @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> updateUserByAdmin(
    @PathVariable Integer userId,
    @RequestBody ApplicationUser updatedUser
  ) {
    try {
      ApplicationUser user = userService.updateUserByAdmin(userId, updatedUser);
      return ResponseEntity.ok(user);
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/approve-seller/{userId}")
  public ResponseEntity<?> approveSellerRequest(@PathVariable Integer userId) {
    userService.approveSellerRequest(userId);
    return ResponseEntity.ok("User approved as a seller.");
  }
}
