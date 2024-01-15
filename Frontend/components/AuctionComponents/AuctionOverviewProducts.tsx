import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import checkLogin from "@/app/session";
import { useRouter, usePathname } from "next/navigation";

export default function AuctionOverviewProducts() {
	const [auctions, setAuctions] = useState([]);
	const [imageError, setImageError] = useState(false);
	const [userId, setUserId] = useState(null);
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

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

						// Extract and set the user ID
						const fetchedUserId = data.userId;
						setUserId(fetchedUserId);

						// Other user role checks
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

	const handleImageError = () => {
		setImageError(true);
	};

	useEffect(() => {
		fetch(`http://localhost:8080/api/auctions/user/${userId}`)
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((auction: any) => {
					return {
						value: auction.auctionId,
						label: auction.auctionName,
						image: auction.auctionImage,
						regiDate: auction.registrationDate,
						auctDate: auction.auctionDate,
						startTime: auction.startTime,
						endTime: auction.endTime,
						userFirstname: auction.user ? auction.user.firstname : null,
						userLastname: auction.user ? auction.user.lastname : null,
						status: auction.status,
						categoryId: auction.category ? auction.category.categoryId : null,
						locationName: auction.locations
							? auction.locations.locationName
							: null,
						checked: false,
					};
				});
				setAuctions(formattedData);
				console.log(data);
			});
	}, [userId]);

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
			<section className="mt-[-82px]">
				<div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
					<ul className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
						{auctions.map((auction) => (
							<li key={auction.value}>
								<Link
									href={{
										pathname: `/lotOverview`,
										query: { auctionId: auction.value },
									}}
									className="group block overflow-hidden">
									<Image
										src={`http://localhost:8080${auction.image}`}
										alt=""
										width={500}
										height={300}
										onError={handleImageError}
										unoptimized={true}
										className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
									/>

									<div className="relative bg-white pt-3">
										<h5 className="font-normal text-gray-700 group-hover:underline group-hover:underline-offset-4">
											{auction.status} EXHIBITION
										</h5>

										<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
											{auction.label}
										</h2>

										<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
											{auction.description}
										</h4>

										<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4 mt-4">
											{formatDate(auction.regiDate)} -{" "}
											{formatDate(auction.auctDate)}
										</h4>

										<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
											{auction.locationName}
										</h4>

										<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
											Owner: {auction.userFirstname} {auction.userLastname}
										</h4>

										<p className="mt-6">
											<span className="tracking-wider text-gray-900">
												{" "}
												<Button
													size={"lg"}
													variant={"ghost"}
													className="border-2 border-black">
													View Works
												</Button>
											</span>
										</p>
									</div>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>
		</>
	);
}
