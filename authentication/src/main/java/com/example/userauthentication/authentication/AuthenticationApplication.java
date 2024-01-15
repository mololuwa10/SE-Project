package com.example.userauthentication.authentication;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Roles;
import com.example.userauthentication.authentication.Repository.RoleRepository;
import com.example.userauthentication.authentication.Repository.UserRepository;
import java.util.HashSet;
import java.util.Set;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AuthenticationApplication {

  public static void main(String[] args) {
    SpringApplication.run(AuthenticationApplication.class, args);
  }

  @Bean
  CommandLineRunner run(
    RoleRepository roleRepository,
    UserRepository userRepository,
    PasswordEncoder passwordEncoder
  ) {
    return args -> {
      if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

      Roles adminRole = roleRepository.save(new Roles("ADMIN"));
      roleRepository.save(new Roles("USER"));

      Set<Roles> roles = new HashSet<>();
      roles.add(adminRole);

      ApplicationUser admin = new ApplicationUser(
        1,
        "Michael",
        "Segilola",
        "segilolamololuwa@gmail.com",
        "Michael",
        passwordEncoder.encode("password123"),
        passwordEncoder.encode("33793167"),
        passwordEncoder.encode("205112"),
        "07473143014",
        "86 Park Lane",
        roles
      );

      userRepository.save(admin);
    };
  }
}
