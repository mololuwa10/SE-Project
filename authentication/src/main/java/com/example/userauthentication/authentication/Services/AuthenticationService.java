package com.example.userauthentication.authentication.Services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.core.token.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.security.core.AuthenticationException;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.LoginResponseDTO;
import com.example.userauthentication.authentication.Models.Roles;
import com.example.userauthentication.authentication.Repository.RoleRepository;
import com.example.userauthentication.authentication.Repository.UserRepository;
// import com.example.userauthentication.authentication.utils.EncryptionUtil;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AuthenticationService {
  @Autowired
  private UserRepository userRepository;

  @Autowired
  private RoleRepository roleRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private AuthenticationManager authenticationManager;

  @Autowired
  private TokenService tokenService;

  public ApplicationUser registerUser(String firstname, String lastname, String user_email, String username,
      String password, String bankAccountNo, String bankSortCode, String contactTelephone, String contactAddress) {
    String encodedPassword = passwordEncoder.encode(password);
    // String encryptedBankAccountNo = EncryptionUtil.encrypt(bankAccountNo);
    // String encryptedBankSortCode = EncryptionUtil.encrypt(bankSortCode);
    Roles userRole = roleRepository.findByAuthority("USER").get();

    Set<Roles> authorities = new HashSet<>();
    authorities.add(userRole);

    return userRepository
        .save(new ApplicationUser(0, firstname, lastname, user_email, username, encodedPassword, bankAccountNo,
            bankSortCode, contactTelephone, contactAddress, authorities));
  }

  public LoginResponseDTO loginUser(String username, String password) {
    try {
      Authentication auth = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(username, password));

      String token = tokenService.generateJwt(auth);

      return new LoginResponseDTO(userRepository.findByUsername(username).get(), token);

    } catch (AuthenticationException e) {
      return new LoginResponseDTO(null, "");
    }
  }
}
