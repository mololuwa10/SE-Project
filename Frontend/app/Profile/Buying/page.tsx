"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import checkLogin from "@/app/session";
import { Button } from "@/components/ui/button";
import { CalendarCheck, MapPin, Printer } from "lucide-react";
import Image from "next/image";

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { Disclosure, Menu } from "@headlessui/react";
import { useRouter, usePathname } from "next/navigation";

export default function Buying() {
	const [bidsByUser, setBidsByUser] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userDetails, setUserDetails] = useState<{
		userId: number | string;
	} | null>(null);
	const [userId, setUserId] = useState(null);
	const [bidsUrl, setBidsUrl] = useState("");
	const navItems = ["Auctions", "Private Sales", "Past Bids", "Checkout"];

	// Get user that is logged in
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

						setUserId(data.userId);
					}
				});
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		const loggedIn = checkLogin();
		setIsLoggedIn(loggedIn);
		if (loggedIn) {
			fetchUserInfo();
		}
	}, [fetchUserInfo]);
	// Fetch bids placed by the user

	useEffect(() => {
		if (userId) {
			fetch(`http://localhost:8080/api/bids/user/${userId}`)
				.then((response) => response.json())
				.then((bidData) => {
					setBidsByUser(bidData);
					console.log("Bid Data", bidData);
				});
		}
	}, [userId]);

	function formatDate(dateString: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	const filters = [
		{
			id: "color",
			name: "My Lots in the auction",
			options: [
				{ value: "live", label: "Live", checked: false },
				{ value: "online", label: "Online", checked: false },
			],
		},
	];

	const router = useRouter();
	const pathname = usePathname();
	return (
		<>
			{/* Nav bar of list including Auctions, private sales, past auctions */}
			<nav>
				<ul className="flex items-center gap-8 px-12 py-4">
					{navItems.map((item, index) => (
						<li key={index}>
							<Link
								className={` ${
									pathname.startsWith(`${item}`) ? "border-b-8" : ""
								} font-medium hover:border-b-8`}
								href={`${item}`}>
								{item}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			{Object.keys(bidsByUser).length > 0 ? (
				Object.entries(bidsByUser).map(([auctionId, auctionData]) => (
					<>
						<div
							className="grid md:grid-cols-3 md:grid-flow-col md:grid-rows-3 px-8 px-md-4 px-lg-8 px-xl-11"
							key={auctionId}>
							<div className="mb-4">
								<div className="mt-4 mr-4">
									<p className="text-md uppercase">
										<strong>
											{formatDate(auctionData.auctionDetails.auctionDate)}{" "}
											{auctionData.auctionDetails.startTime}
											EST
										</strong>{" "}
										| Live auction 224
									</p>
								</div>

								<h1 className="text-2xl mt-3">
									{auctionData.auctionDetails.auctionName}
								</h1>
								{/* <Image
							src={auctionData.auctionDetails.auctionImage}
							width={300}
							height={300}
							alt="hello"></Image> */}
							</div>
							<div></div>
							<div className="mt-14 flex flex-wrap">
								<MapPin className="inline-flex align-middle" />{" "}
								<span className="ml-3">
									{auctionData.auctionDetails.locations.locationName}
								</span>
							</div>
							<div></div>
							<div></div>
							<div></div>
							<div className="mt-4 ml-20">
								<p className="text-md">
									Registration Date:{" "}
									<strong>
										{formatDate(auctionData.auctionDetails.registrationDate)}
									</strong>
								</p>
								<p className="text-md">
									Auction Date/Result Day:{" "}
									<strong>
										{formatDate(auctionData.auctionDetails.auctionDate)}
									</strong>
								</p>

								{/* <div className="mt-14 flex flex-wrap">
							<a href="/">
								<CalendarCheck className="inline-flex align-middle" />{" "}
								<span className="ml-3">Add to Calendar</span>
							</a>
						</div>
						<div className="mt-3 flex flex-wrap">
							<a href="/">
								<Printer className="inline-flex align-middle" />{" "}
								<span className="ml-3">Print</span>
							</a>
						</div> */}
							</div>
							<div></div>

							<div className="ml-20 mt-14">
								{isLoggedIn ? (
									<Link href="/">
										<Button
											size={"lg"}
											variant={"ghost"}
											className="border-2 border-black w-full">
											REGISTER
										</Button>
									</Link>
								) : (
									<Link href="/signIn">
										<Button
											size={"lg"}
											variant={"ghost"}
											className="border-2 border-black">
											Sign In to Bid
										</Button>
									</Link>
								)}

								{/* <Link href="/" className="ml-3">
							<Button
								size={"lg"}
								variant={"ghost"}
								className="border-2 border-black bg-black text-white">
								FOLLOW
							</Button>
						</Link> */}
								{/* <div className="mt-4 ml-20"> */}
								<Link href="/" className="hover:underline mt-2">
									Conditions of Sales
								</Link>
								{/* </div> */}
							</div>
						</div>
						<form className="hidden lg:block">
							{filters.map((section) => (
								<Disclosure
									as="div"
									key={section.id}
									className="border-b border-gray-200 py-6 mx-16 hover:underline">
									{({ open }: { open: boolean }) => (
										<>
											<h3 className="-my-3 flow-root">
												<Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
													<span className="font-medium text-gray-900">
														My Lots in This Auction
													</span>
													<span className="ml-6 flex items-center">
														{open ? (
															<MinusIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														) : (
															<PlusIcon
																className="h-5 w-5"
																aria-hidden="true"
															/>
														)}
													</span>
												</Disclosure.Button>
											</h3>
											<Disclosure.Panel className="pt-6">
												<div className="">
													{auctionData.lots.map((lot) => (
														<div
															className="grid md:grid-cols-3 md:grid-flow-col md:grid-rows-1 px-3 px-md-4 px-lg-5 px-xl-11"
															key={lot.lotId}>
															<div className="mb-4">
																<div className="mt-4">
																	<Image
																		src={`http://localhost:8080${lot.lotImage}`}
																		alt="Auction 1"
																		width={200}
																		height={200}
																		className="h-[300px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[300px]"
																	/>
																</div>
															</div>
															<div className="mb-4">
																<div className="mt-4 ml-5 block">
																	<h4 className="text-xl">
																		Lot {lot.lotNumber}
																	</h4>
																	<h2 className="text-3xl font-semibold">
																		{lot.lotTitle}
																	</h2>
																	<h3 className="mt-4 font-normal">
																		{lot.description}
																	</h3>
																	<div className="mt-36 flex flex-wrap">
																		<MapPin className="inline-flex align-middle" />{" "}
																		<span className="ml-2">
																			{
																				auctionData.auctionDetails.locations
																					.locationName
																			}
																		</span>
																	</div>
																</div>
															</div>

															<div className="mb-4 text-right">
																<div className="mt-4 ml-5 block">
																	<h4 className="text-xl">Estimate</h4>
																	<h2 className="text-3xl font-normal">
																		£{lot.estimatedPrice}
																	</h2>

																	<div className="mt-52 flex flex-wrap justify-end">
																		{auctionData.bids.map((bid) => (
																			<span key={bid.bidId}>
																				Current Bid: {bid.bidAmount}
																			</span>
																		))}
																		<Button size={"lg"}>Place Bid</Button>
																		<Button size={"lg"}>Following</Button>
																	</div>
																</div>
															</div>
														</div>
													))}
												</div>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							))}
						</form>
					</>
				))
			) : (
				<div className="flex justify-center items-center py-48">
					<div className="text-center">
						<p className="text-lg font-semibold">No auctions yet</p>
						<p>
							When you follow, register or bid in auctions, you'll see them
							here.
						</p>
					</div>
				</div>
			)}
		</>
	);
}
