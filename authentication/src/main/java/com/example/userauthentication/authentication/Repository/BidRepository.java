package com.example.userauthentication.authentication.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.userauthentication.authentication.Models.ApplicationUser;
import com.example.userauthentication.authentication.Models.Bids;
// import com.example.userauthentication.authentication.Models.Lot;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bids, Long> {
  List<Bids> findByUser(ApplicationUser user);

  List<Bids> findByLot_LotId(Long lotId);
}
