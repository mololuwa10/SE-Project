"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import checkLogin from "@/app/session";

import React, { useState, useEffect, useCallback, useRef } from "react";
import AddAuctionAndLot from "@/components/ProfileComponents/AddAuctionAndLot";
import ProfileFilterAuctionComponents from "@/components/ProfileComponents/ProfileFilterAuctionComponents";

export default function Selling() {
	const navItems = ["Add Auction", "Add Lot"];
	const pathname = usePathname();
	const router = useRouter();
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [requestSubmitted, setRequestSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUserInfo = useCallback(async () => {
		try {
			const jwt = localStorage.getItem("jwt");

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

						// CHECKING IF THE USER LOGGED IN IS AN ADMIN
						const isSeller = data.authorities.some(
							(authority: { roleId: number; authority: string }) =>
								authority.authority === "SELLER"
						);

						setUserRole(isSeller ? "SELLER" : "USER");
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

		// Redirect if not logged in and trying to access a protected page
		if (loggedIn) {
			fetchUserInfo();
		} else {
			router.push("/");
		}
	}, [fetchUserInfo, router]);

	const sellerContent = (
		<>
			<div className="seller-content-container text-center my-16">
				{/* <ProfileFilterAuctionComponents /> */}
				SELLER CONTENT
			</div>
		</>
	);

	const handleRequestSeller = async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			alert("You must be logged in to perform this action.");
			return;
		}

		try {
			const response = await fetch(
				"http://localhost:8080/api/user/request-seller",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Handle plain text response

			const textResponse = await response.text();
			setRequestSubmitted(true);
			alert(textResponse);
		} catch (error) {
			console.error("Error:", error);
			alert("Failed to submit the request.");
		}
	};

	const checkRequestStatus = useCallback(async () => {
		setIsLoading(true);
		const jwt = localStorage.getItem("jwt");
		if (jwt) {
			try {
				const response = await fetch(
					"http://localhost:8080/api/user/role-request-status",
					{
						headers: {
							Authorization: `Bearer ${jwt}`,
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to check request status");
				}

				const result = await response.json();
				setRequestSubmitted(result.hasPendingRequest);
			} catch (error) {
				console.error("Error:", error);
			}
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		checkRequestStatus();
	}, [checkRequestStatus]);

	const userContent = (
		<div>
			<div className="consignment-message-container text-center my-16">
				<h2 className="mb-5 text-2xl">
					You do not have any Seller profile with us at Fotheby's.com
				</h2>
				<p className="mb-5">
					Do you have something you would like to sell with us?
				</p>
				{!requestSubmitted ? (
					<Button
						onClick={handleRequestSeller}
						className="request-seller-btn text-white cursor-pointer text-lg mb-5 py-2.5 px-5 border-none"
						size={"lg"}>
						Request to be a seller
					</Button>
				) : (
					<div className="awaiting-request-container text-center my-16">
						<p className="text-2xl">Awaiting Request Approval .......</p>
					</div>
				)}
				<div className="help-text">
					<p className="mb-5">Need help selling?</p>
					<p>
						<a href="#" className="chat-link underline">
							Chat with us
						</a>{" "}
						or contact
						<a href="#" className="client-services-link underline">
							{" "}
							Client Services
						</a>
					</p>
				</div>
			</div>
		</div>
	);

	return (
		<>
			<nav className="flex">
				{/* <ul className="flex items-center gap-8 px-12 py-4">
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
				</ul> */}
				<AddAuctionAndLot />
			</nav>

			{userRole === "SELLER" ? sellerContent : userContent}

			<div className="gap-8 mx-auto px-8 py-8">
				<div className="relative">
					<a href="/">
						<Image src={"/img/auction2.jpg"} alt="" width={500} height={10} />
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl hover:underline-offset-8 hover:text-slate-900">
							How to sell with us{" "}
							<span className="inline-block mb-[-5px]">
								<ChevronRight />
							</span>
						</h2>
					</a>
				</div>
			</div>
		</>
	);
}
