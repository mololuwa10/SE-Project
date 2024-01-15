package com.example.userauthentication.authentication.Controllers;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.LoginResponseDTO;
import com.example.userauthentication.authentication.Models.RegistrationDTO;
import com.example.userauthentication.authentication.Services.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthenticationController {

  @Autowired
  private AuthenticationService authenticationService;

  @PostMapping("/register")
  public ApplicationUser registerUser(@RequestBody RegistrationDTO body) {
    return authenticationService.registerUser(body.getFirstname(), body.getLastname(), body.getUser_email(),
        body.getUsername(),
        body.getPassword(), body.getBankAccountNo(), body.getBankSortCode(), body.getContactTelephone(),
        body.getContactAddress());
  }

  @PostMapping("/login")
  public LoginResponseDTO loginUser(@RequestBody RegistrationDTO body) {
    return authenticationService.loginUser(body.getUsername(),
        body.getPassword());
  }
}