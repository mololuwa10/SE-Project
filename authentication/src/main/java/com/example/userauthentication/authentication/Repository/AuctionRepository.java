package com.example.userauthentication.authentication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Auction;
// import com.example.userauthentication.authentication.Models.Lot;

// import java.time.LocalDate;
import java.util.List;
// import java.util.Set;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
  List<Auction> findByUser(ApplicationUser user);

  List<Auction> findByCategory_CategoryId(Long categoryId);

  // @Query("SELECT a FROM auction a WHERE a.auctionDate < ?1 AND a.status IN
  // ('UPCOMING', 'ONGOING')")
  // List<Auction> findAuctionsToClose(LocalDate currentDate);
}