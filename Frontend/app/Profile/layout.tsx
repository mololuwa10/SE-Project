"use client";
import { Inter } from "next/font/google";

import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import checkLogin from "@/app/session";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
// import { useRouter } from "next/navigation";

const navItems = ["Buying", "Selling", "Interest", "Setting"];

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

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

						// CHECKING IF THE USER LOGGED IN IS AN ADMIN
						const isAdmin = data.authorities.some(
							(authority: { roleId: number; authority: string }) =>
								authority.authority === "ADMIN"
						);

						setUserRole(isAdmin ? "ADMIN" : "USER");
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
		let pathname = window.location.pathname;
		if (loggedIn) {
			fetchUserInfo();
		} else {
			router.push("/");
		}
	}, [fetchUserInfo, router]);

	return (
		<>
			<div className={inter.className}>
				<Header />
				<div
					className="sm:h-80 flex flex-col justify-center items-center relative"
					style={{
						backgroundRepeat: "no-repeat",
						backgroundPosition: "center center",
						backgroundSize: "cover",
						backgroundImage: "url(./img/auction2.jpg)",
					}}>
					<div
						className="sm:w-28 sm:h-28 flex justify-center items-center text-white mb-3"
						style={{ backgroundSize: "contain" }}>
						<Avatar className="h-28 w-28">
							<AvatarImage
								src="https://github.com/shadcn.png"
								alt={`loading`}
							/>
							{/* @${userDetails?.username} */}
						</Avatar>
					</div>
					<div className="w-full text-white text-2xl mb-1 text-center text-ellipsis overflow-hidden whitespace-nowrap font-medium">
						<span>
							{userDetails?.firstname} {userDetails?.lastname}
						</span>
					</div>
					<div className="mb-4">
						<div className="inline-flex relative whitespace-nowrap text-white">
							<span>
								ACCOUNT - {userDetails?.userId} - MR {userDetails?.firstname}{" "}
								{userDetails?.lastname}
							</span>
						</div>
					</div>
					<nav className="block font-inherit m-0 b-0 p-0 align-baseline items-center">
						<ul className="absolute left-1/2 bottom-0 z-10 flex whitespace-nowrap mt-4 list-none transform -translate-x-1/2">
							{navItems.map((item, index) => (
								<li
									className={`fotheby-nav__list-item ${
										index < navItems.length - 1 ? "mr-16" : ""
									}`}
									key={index}>
									<Link
										className={` ${
											pathname.startsWith(`/Profile/${item}`)
												? " text-white border-b-8"
												: ""
										} font-medium text-white hover:border-b-8`}
										href={`/Profile/${item}`}>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</nav>
				</div>
				{children}

				<div className="mt-6"></div>
				<Footer />
			</div>
		</>
	);
}
