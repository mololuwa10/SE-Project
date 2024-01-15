package com.example.userauthentication.authentication.Services;

import java.time.Instant;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
// import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.example.userauthentication.authentication.Models.ApplicationUser;

@Service
public class TokenService {
  @Autowired
  private JwtEncoder jwtEncoder;

  // @Autowired
  // private JwtDecoder jwtDecoder;

  public String generateJwt(Authentication auth) {

    Instant now = Instant.now();

    // Cast the Authentication's principal to your ApplicationUser class
    ApplicationUser user = (ApplicationUser) auth.getPrincipal();

    String scope = auth.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(" "));

    JwtClaimsSet claims = JwtClaimsSet.builder()
        .issuer("self")
        .issuedAt(now)
        .subject(auth.getName())
        .claim("roles", scope)
        .claim("userId", user.getUserId())
        .build();

    return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
  }
}
