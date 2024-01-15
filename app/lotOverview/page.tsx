"use client";

import React, { useCallback, useEffect, useState } from "react";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Button } from "@/components/ui/button";
import { MapPin, CalendarCheck, Printer } from "lucide-react";
import Link from "next/link";
import FilterLots from "@/components/lotOverviewComponents/FilterLots";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "path";
import Image from "next/image";
import checkLogin from "@/app/session";

export default function LotOverview() {
	const [auctions, setAuctions] = useState([]);
	const searchParams = useSearchParams();
	const auctionId = searchParams.get("auctionId");
	const [lots, setLots] = useState([]);

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();
	const [userDetails, setUserDetails] = useState(null);

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

	useEffect(() => {
		const loggedIn = checkLogin();
		setIsLoggedIn(loggedIn);
		if (loggedIn) {
			fetchUserInfo();
		}
	}, [fetchUserInfo]);

	useEffect(() => {
		if (auctionId) {
			fetch(`http://localhost:8080/api/auctions/${auctionId}`)
				.then((response) => response.json())
				.then((data) => {
					const formattedData = {
						value: data.auctionId,
						label: data.auctionName,
						image: data.auctionImage,
						regiDate: data.registrationDate,
						auctDate: data.auctionDate,
						startTime: data.startTime,
						endTime: data.endTime,
						userFirstname: data.user ? data.user.firstname : null,
						userLastname: data.user ? data.user.lastname : null,
						status: data.status,
						categoryId: data.category ? data.category.categoryId : null,
						locationName: data.locations ? data.locations.locationName : null,
					};
					// Use formattedData here
					setAuctions([formattedData]);
					console.log(data);
				});
		}
	}, [auctionId]);

	function formatDate(dateString: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	return (
		<>
			<Header />
			{auctions.map((auction) => (
				<div
					className="grid md:grid-cols-3 md:grid-flow-col md:grid-rows-3 px-8 px-md-4 px-lg-8 px-xl-11"
					key={auction.value}>
					<div className="mb-4">
						<div className="mt-4 mr-4">
							<p className="text-md uppercase">
								<strong>
									{formatDate(auction.auctDate)} {auction.startTime} EST
								</strong>{" "}
								| Live auction 224
							</p>
						</div>
						<h1 className="text-2xl mt-3">{auction.label}</h1>
					</div>
					<div></div>
					<div className="mt-14 flex flex-wrap">
						<MapPin className="inline-flex align-middle" />{" "}
						<span className="ml-3">{auction.locationName}</span>
					</div>
					<div></div>
					<div></div>
					<div></div>
					<div className="mt-4 ml-20">
						<p className="text-md">
							Registration Date: <strong>{formatDate(auction.regiDate)}</strong>
						</p>
						<p className="text-md">
							Bidding Date: <strong>{formatDate(auction.auctDate)}</strong>
						</p>

						<div className="mt-14 flex flex-wrap">
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
						</div>
					</div>

					<div className="mt-20 ml-20">
						{isLoggedIn ? (
							<Link href="/">
								<Button
									size={"lg"}
									variant={"ghost"}
									className="border-2 border-black">
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

						<Link href="/" className="ml-3">
							<Button
								size={"lg"}
								variant={"ghost"}
								className="border-2 border-black bg-black text-white">
								FOLLOW
							</Button>
						</Link>
					</div>
					<div className="mt-14 ml-20">
						<Link href="/" className="hover:underline">
							Conditions of Sales
						</Link>
					</div>
				</div>
			))}

			{/* <LotOverviewLinks /> */}
			<header className="flex flex-row space-x-4 px-4 py-2">
				<Link href="/">
					<Button size={"lg"} variant={"ghost"}>
						Overview
					</Button>
				</Link>
				<Link href="/" className="border-b-2 border-black">
					<Button size={"lg"} variant={"ghost"}>
						Browse Lots
					</Button>
					{/* </a> */}
				</Link>
			</header>

			<div className="mx-auto px-4 sm:px-6">
				<FilterLots />
			</div>

			<Footer />
		</>
	);
}
