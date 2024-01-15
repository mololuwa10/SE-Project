import React, { useEffect, useState } from "react";

interface Auction {
	auctionId: number;
	auctionDate: string;
	startTime: string;
}

interface CountdownTimerProps {
	auction: Auction;
}

function CountdownTimer({ auction }: CountdownTimerProps) {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);
		return () => clearTimeout(timer);
	});

	function calculateTimeLeft() {
		const now = new Date();
		const auctionDate = new Date(`${auction.auctionDate}T${auction.startTime}`);
		// Check if auctionDate is a valid date
		if (isNaN(auctionDate.getTime())) {
			console.error(
				`Invalid date or time: ${auction.auctionDate}T${auction.startTime}`
			);
			return;
		}
		const difference = auctionDate.getTime() - now.getTime();

		return {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / 1000 / 60) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		};
	}

	if (!timeLeft) {
		return <div>Error: Invalid date or time format</div>;
	}

	return (
		<div>
			{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
		</div>
	);
}

export default CountdownTimer;
