"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import Header from "@/components/layoutComponents/Header";
import Footer from "@/components/layoutComponents/Footer";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import checkLogin from "@/app/session";
import { useRouter, useSearchParams } from "next/navigation";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CountdownTimer from "../CountdownTimer";
import { Input } from "@/components/ui/input";

const reviews = { href: "#", average: 4, totalCount: 117 };

interface Lot {
	value: number;
}

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

export default function Bid() {
	const searchParams = useSearchParams();
	const lotId = searchParams.get("lotId");
	const auctionId = searchParams.get("auctionId");
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<{
		userId: number | string;
	} | null>(null);
	const [imageError, setImageError] = useState(false);
	const [bid_amount, setBidAmount] = useState("");
	const [lot, setLot] = useState<Lot[]>([]);
	const [currentBid, setCurrentBid] = useState<number | null>(null);
	const [userId, setUserId] = useState(null);

	useEffect(() => {
		const fetchCurrentBid = async () => {
			try {
				const response = await fetch(
					`http://localhost:8080/api/bids/lot/${lotId}`
				);
				if (response.ok) {
					const text = await response.text();
					try {
						const data = JSON.parse(text);
						setCurrentBid(data ? data.bidAmount : null);
					} catch (e) {
						console.error("Failed to parse response as JSON:", e);
					}
				} else {
					console.error(
						"Failed to fetch current bid, status:",
						response.status
					);
				}
			} catch (error) {
				console.error("Error fetching current bid:", error);
			}
		};

		fetchCurrentBid();
	}, [lotId]);

	function useFetchAndFormat(url: string, formatData: (data: any) => any) {
		const [data, setData] = useState<any[]>([]);

		useEffect(() => {
			fetch(url)
				.then((response) => {
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					return response.json();
				})
				.then((fetchedData) => {
					if (Array.isArray(fetchedData)) {
						const formattedData = fetchedData.map(formatData);
						setData(formattedData);
					} else {
						const formattedData = [formatData(fetchedData)];
						setData(formattedData);
					}
				})
				.catch((error) => {
					console.error("Error fetching data:", error);
				});
		}, [url, formatData]);

		return data;
	}

	const formatHighestBidderData = useCallback((highestBidder: any) => {
		console.log(highestBidder);
		if (!highestBidder) {
			return null;
		}
		return {
			value: highestBidder.userId,
			firstname: highestBidder.firstname,
			lastname: highestBidder.lastname,
			checked: false,
		};
	}, []);

	const highestBidderData = useFetchAndFormat(
		`http://localhost:8080/api/bids/${lotId}/highestBidder`,
		formatHighestBidderData
	);

	const formatLots = useCallback((lot: any) => {
		console.log(lot);
		return {
			value: lot.lotId,
			label: lot.lotTitle,
			subClass: lot.subjectClassification,
			yearProduced: lot.yearProduced,
			image: lot.lotImage,
			description: lot.description,
			estimate: lot.estimatedPrice,
			lotNumber: lot.lotNumber,
			artist: lot.artist,
			auctionId: lot.auctionId,
			auctionName: lot.auctionName,
			checked: false,
		};
	}, []);

	const getLotByAuctionId = useFetchAndFormat(
		`http://localhost:8080/api/lots/lotAuction/${auctionId}`,
		formatLots
	);

	const formatAuction = useCallback((auction: any) => {
		console.log(auction);
		return {
			value: auction.auctionId,
			label: auction.auctionName,
			auctionDate: auction.auctionDate,
			startTime: auction.startTime,
			endTime: auction.endTime,
			checked: false,
		};
	}, []);

	const auctions = useFetchAndFormat(
		`http://localhost:8080/api/auctions/${auctionId}`,
		formatAuction
	);

	const lots = useFetchAndFormat(
		`http://localhost:8080/api/lots/${lotId}`,
		formatLots
	);

	const handleImageError = () => {
		setImageError(true);
	};

	const fetchUserInfo = useCallback(async () => {
		try {
			const jwt = localStorage.getItem("jwt");
			console.log(jwt);

			if (!jwt) {
				setIsLoggedIn(false);
				return;
			}

			fetch("http://localhost:8080/api/user/info", {
				headers: { Authorization: "Bearer " + jwt },
			})
				.then((response) => {
					if (!response.ok) {
						setIsLoggedIn(false);
						throw Error(response.statusText);
					}
					return response.json();
				})
				.then((data) => {
					if (data) {
						console.log(data);
						setUserDetails(data);
						setIsLoggedIn(true);

						setUserId(data.userId);
					} else {
						setIsLoggedIn(false);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	}, []);

	const fetchUpdatedLotData = async (lotId: number) => {
		try {
			const response = await fetch(`http://localhost:8080/api/lots/${lotId}`);
			if (response.ok) {
				const data = await response.json();
				return formatLots(data);
			} else {
				console.error("Failed to fetch updated lot data");
				return null;
			}
		} catch (error) {
			console.error("Error fetching updated lot data:", error);
			return null;
		}
	};

	const handlePlaceBid = async () => {
		try {
			await fetchUserInfo();

			// GETTING THE USER ID FROM THE LOCAL STORAGE
			if (isLoggedIn && userDetails) {
				const jwt = localStorage.getItem("jwt");

				if (lotId === null) {
					alert("lotId is null");
					return;
				}

				// Place a bid by sending a POST request
				const response = await fetch("http://localhost:8080/api/bids", {
					method: "POST",
					headers: {
						Authorization: "Bearer " + jwt,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						bidAmount: parseFloat(bid_amount),
						lotId: Number(lotId),
						userId: userDetails.userId,
					}),
				});

				if (response.ok) {
					window.location.reload();
					alert("Bid Placed successfully");
				} else {
					alert(
						"Failed to place bid! You have to enter a bid higher than the current one"
					);
					window.location.reload();
				}
			} else {
				alert("User is not logged in");
			}
		} catch (error) {
			alert("Error placing bid: " + error);
			console.error("Error placing bid:", error);
			window.location.reload();
		}
	};

	useEffect(() => {
		const loggedIn = checkLogin();
		setIsLoggedIn(loggedIn);
		if (loggedIn) {
			fetchUserInfo();
		}
	}, [fetchUserInfo]);

	return (
		<>
			<Header />

			{lots.map((lot) => (
				<div className="bg-white" key={lot.value}>
					<div className="pt-6">
						<nav aria-label="Breadcrumb" className="border-b">
							<ol
								role="list"
								className="mx-auto flex max-w-2xl items-center space-x-2 px-4 pb-4 sm:px-6 lg:max-w-7xl lg:px-8">
								{auctions.map((auction) => (
									<li key={auction.value}>
										<div className="flex items-center">
											<Link
												href={{
													pathname: "/lotOverview",
													query: { auctionId: auction.value },
												}}
												className="flex items-center mr-2 text-sm font-medium text-gray-900 hover:underline">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="lucide lucide-arrow-left mr-2">
													<path d="m12 19-7-7 7-7" />
													<path d="M19 12H5" />
												</svg>
												{auction.label}
											</Link>
										</div>
									</li>
								))}
							</ol>
						</nav>

						{/* Image gallery */}
						<div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:px-8">
							<div className="aspect-h-4 aspect-w-3 hidden overflow-hidden rounded-lg lg:block">
								<Image
									src={`http://localhost:8080${lot.image}`}
									alt={lot.label}
									width={700}
									height={300}
									className="h-full w-full object-cover object-center"
								/>
							</div>
						</div>

						{/* Product info */}
						<div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
							<div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
								<h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
									{lot.label}
								</h1>
							</div>

							{/* Options */}
							<div className="mt-4 lg:row-span-3 lg:mt-0">
								<h2 className="sr-only">Lot Estimate</h2>
								<p className="text-3xl tracking-tight text-gray-900">
									Estimated Price: £{lot.estimate}
								</p>

								{/* Reviews */}
								<div className="mt-6">
									<h3 className="sr-only">Reviews</h3>
									<div className="flex items-center">
										<div className="flex items-center">
											{[0, 1, 2, 3, 4].map((rating) => (
												<StarIcon
													key={rating}
													className={classNames(
														reviews.average > rating
															? "text-gray-900"
															: "text-gray-200",
														"h-5 w-5 flex-shrink-0"
													)}
													aria-hidden="true"
												/>
											))}
										</div>
										<p className="sr-only">{reviews.average} out of 5 stars</p>
										<a
											href={reviews.href}
											className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
											{reviews.totalCount} reviews
										</a>
									</div>
								</div>

								{auctions.map((auction: any) => (
									<div key={auction.value}>
										<h3 className="text-2xl font-semibold text-gray-900 mt-5">
											Time Left:
										</h3>
										<p className="mt-1 text-xl font-medium text-gray-900">
											<CountdownTimer auction={formatAuction(auction)} />
										</p>
									</div>
								))}

								<div>
									<h3 className="text-2xl font-medium text-gray-900 mt-5">
										Current Bid:
									</h3>
									<p className="mt-1 text-3xl font-semibold text-gray-900">
										£{currentBid !== null ? currentBid.toFixed(2) : " N/A"}
									</p>
									{/* SETTING THE NAME OF THE USER WITH THE HIGHEST BID */}
									{highestBidderData.map((highestBidder: any) => (
										<div className="mt-1" key={highestBidder.value}>
											<h3 className="text-2xl font-medium text-gray-900 mt-5">
												Current Highest Bidder:
											</h3>
											<p className="mt-1 text-3xl font-semibold text-gray-900">
												{/* User firstname and lastname */}
												{highestBidder.firstname} {highestBidder.lastname}
											</p>
										</div>
									))}
								</div>

								<form className="mt-10" onSubmit={handlePlaceBid}>
									{isLoggedIn ? (
										<>
											<Input
												type="text"
												placeholder="Enter The Amount You Will Like To Place"
												value={bid_amount}
												onChange={(e) => setBidAmount(e.target.value)}
											/>
											<button
												type="submit"
												className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-slate-900 px-8 py-3 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
												Place Your Bid!
											</button>
										</>
									) : (
										<Link href="/signIn">
											<Button
												className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-slate-900 px-8 py-3 text-base font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
												type="button">
												Sign in to place bid
											</Button>
										</Link>
									)}
								</form>
							</div>

							<div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
								{/* Description and details */}
								<div>
									<h3 className="sr-only">Description</h3>

									<div className="space-y-6">
										<p className="text-base text-gray-900">{lot.description}</p>
									</div>
								</div>

								<div className="mt-10">
									<h3 className="text-sm font-medium text-gray-900">
										Highlights
									</h3>

									<div className="mt-4">
										<ul
											role="list"
											className="list-disc space-y-2 pl-4 text-sm">
											<li className="text-gray-400">
												<span className="text-gray-600">
													Year Produced: {lot.yearProduced}
												</span>
											</li>
											<li className="text-gray-400">
												<span className="text-gray-600">
													Subject Classification: {lot.subClass}
												</span>
											</li>
										</ul>
									</div>
								</div>

								<div className="mt-10">
									<h2 className="text-sm font-medium text-gray-900">
										Brought to you by:
									</h2>

									<div className="mt-4 space-y-6">
										<p className="text-sm text-gray-600">{lot.artist}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}

			{auctions.map((auction) => (
				<section className="mt-[-82px] p-5" key={auction.value}>
					<div className="flex items-center justify-between px-20 py-10">
						<h2 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
							More From:{" "}
							<span className="font-normal text-2xl"> {auction.label} </span>
						</h2>
						<Link
							href={{
								pathname: "/lotOverview",
								query: { auctionId: auction.value },
							}}>
							<h6 className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
								View all
							</h6>
						</Link>
					</div>

					<div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
						<Carousel
							opts={{
								align: "start",
							}}
							className="w-full p-4">
							<CarouselContent>
								{getLotByAuctionId
									.filter(
										(getLotByAuctionId) =>
											getLotByAuctionId.value !== Number(lotId)
									)
									.slice(0, 10)
									.map((getLotByAuctionId, index) => (
										<CarouselItem
											key={index}
											className="md:basis-1/2 lg:basis-1/3">
											<div className="mt-[-75px]">
												<Card>
													<CardContent className="flex aspect-square items-center justify-center p-6">
														<Link
															href={{
																pathname: "/Bid",
																query: {
																	lotId: getLotByAuctionId.value,
																	auctionId: getLotByAuctionId.auctionId,
																},
															}}
															className="group block overflow-hidden">
															<Image
																src={`http://localhost:8080${getLotByAuctionId.image}`}
																alt="Auction 1"
																width={500}
																height={300}
																onError={handleImageError}
																unoptimized={true}
																className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
															/>

															<div className="relative bg-white pt-3">
																<h4 className="font-medium text-gray-700 group-hover:underline group-hover:underline-offset-4">
																	Lot {getLotByAuctionId.lotNumber}
																</h4>

																<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
																	{getLotByAuctionId.label}
																</h2>

																<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
																	{getLotByAuctionId.description}
																</h4>

																<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4 mt-4">
																	Estimate
																</h4>

																<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
																	£{getLotByAuctionId.estimate}
																</h2>

																<p className="mt-6">
																	<span className="tracking-wider text-gray-900">
																		{" "}
																		<Link
																			href={{
																				pathname: `/Bid`,
																				query: {
																					lotId: getLotByAuctionId.value,
																				},
																			}}>
																			<Button
																				size={"lg"}
																				variant={"ghost"}
																				className="border-2 border-black">
																				Follow Lots
																			</Button>
																		</Link>
																	</span>
																</p>
															</div>
														</Link>
													</CardContent>
												</Card>
											</div>
										</CarouselItem>
									))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				</section>
			))}

			<Footer />
		</>
	);
}
