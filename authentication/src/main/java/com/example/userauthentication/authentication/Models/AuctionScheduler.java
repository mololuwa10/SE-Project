// package com.example.userauthentication.authentication.Models;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.scheduling.annotation.Scheduled;
// import org.springframework.stereotype.Component;
// // import com.example.userauthentication.authentication.Models.Auction;
// import
// com.example.userauthentication.authentication.Repository.AuctionRepository;
// import
// com.example.userauthentication.authentication.Repository.LotRepository;
// import java.time.LocalDate;
// import java.util.List;

// @Component
// public class AuctionScheduler {

// @Autowired
// private AuctionRepository auctionRepository;

// @Autowired
// private LotRepository lotRepository; // Assuming you have a LotRepository

// // Scheduled task to run every day at midnight
// @Scheduled(cron = "0 0 0 * * *")
// public void closePastAuctions() {
// LocalDate currentDate = LocalDate.now();
// List<Auction> auctionsToClose =
// auctionRepository.findAuctionsToClose(currentDate);

// // In your AuctionScheduler class
// for (Auction auction : auctionsToClose) {
// auction.setStatus(Auction.Status.COMPLETED);
// lotRepository.updateLotStatusByAuction(auction.getAuctionId(),
// Lot.Status.CLOSED);
// auctionRepository.save(auction);
// }
// }
// }
