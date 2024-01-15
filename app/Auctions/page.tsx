"use client";

import FilterAuctions from "@/components/AuctionComponents/FilterAuctions";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";

export default function Auctions() {
	return (
		<>
			<Header />

			{/* <div className="mx-auto px-4 sm:px-6 border-t"> */}
			<FilterAuctions />
			{/* </div> */}

			<Footer />
		</>
	);
}
