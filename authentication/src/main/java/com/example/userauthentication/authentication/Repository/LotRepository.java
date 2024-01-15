package com.example.userauthentication.authentication.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
// import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
// import org.springframework.data.jpa.repository.Query;
// import org.springframework.data.jpa.repository.Modifying;
// import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

// import com.example.userauthentication.authentication.Models.Auction;
import com.example.userauthentication.authentication.Models.Lot;
// import java.math.BigDecimal;

@Repository
public interface LotRepository extends JpaRepository<Lot, Long> {
  List<Lot> findByAuction_AuctionId(Long auctionId);

  // List<Lot> findByCategory_CategoryId(Long categoryId);
  Optional<Lot> findTopByOrderByLotNumberDesc();

  // @Query("UPDATE Lot l SET l.status = :status WHERE l.auction.auctionId =
  // :auctionId")
  // @Modifying
  // void updateLotStatusByAuction(Long auctionId, Lot.Status status);

  // @Query("SELECT DISTINCT l.artist FROM lot l")
  // Set<String> findAllArtists();

  // @Query("SELECT DISTINCT l.subject_classification FROM lot l")
  // Set<String> findAllSubjectClassifications();

  // @Query("SELECT DISTINCT l.year_produced FROM lot l")
  // Set<Integer> findAllYearsProduced();
  List<Lot> findByEstimatedPriceBetween(BigDecimal start, BigDecimal end);

  List<Lot> findByEstimatedPriceGreaterThan(BigDecimal price);
}