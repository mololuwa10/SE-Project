"use client";

import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GitPullRequest, MapPin, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import checkLogin from "../session";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	// Check if the user is admin and is logged in
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const fetchUserInfo = useCallback(async () => {
		setIsLoading(true);
		const jwt = localStorage.getItem("jwt");

		if (!jwt) {
			router.push("/");
			return;
		}

		try {
			const response = await fetch("http://localhost:8080/api/user/info", {
				headers: { Authorization: "Bearer " + jwt },
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = await response.json();
			const isAdmin = data.authorities.some(
				(authority: { roleId: number; authority: string }) =>
					authority.authority === "ADMIN"
			);

			if (isAdmin) {
				setIsLoggedIn(true);
				setUserRole("ADMIN");
			} else {
				router.push("/");
			}
		} catch (error) {
			console.error("Error:", error);
			router.push("/");
		} finally {
			setIsLoading(false);
		}
	}, [router]);

	useEffect(() => {
		fetchUserInfo();
	}, [fetchUserInfo]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isLoggedIn || userRole !== "ADMIN") {
		return <div>Redirecting...</div>;
	}
	// const handleLogout = async () => {
	// 	localStorage.removeItem("jwt");
	// 	setIsLoggedIn(false);
	// 	setUserDetails(null);
	// 	router.push("/signIn");
	// };

	return (
		<>
			<div className={inter.className}>
				<main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-2xl">
					<div className="flex items-start justify-between">
						<div className="relative hidden h-screen my-4 ml-4 shadow-lg lg:block w-80">
							<div className="h-full bg-white rounded-2xl dark:bg-gray-700">
								<div className="flex items-center justify-center pt-6">
									<Image
										src="/img/fothebylogo.jpg"
										alt="Company logo"
										width={150}
										height={100}
									/>
								</div>
								<nav className="mt-6">
									<div>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-blue-500 uppercase transition-colors duration-200 border-r-4 border-blue-500 bg-gradient-to-r from-white to-blue-100 dark:from-gray-700 dark:to-gray-800"
											href="/Dashboard">
											<span className="text-left">
												<svg
													width="20"
													height="20"
													fill="currentColor"
													viewBox="0 0 2048 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">
												Dashboard
											</span>
										</Link>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/Catalogue">
											<span className="text-left">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="lucide lucide-book-image">
													<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
													<circle cx="10" cy="8" r="2" />
													<path d="m20 13.7-2.1-2.1c-.8-.8-2-.8-2.8 0L9.7 17" />
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">
												Catalogue
											</span>
										</Link>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/Auction">
											<span className="text-left">
												<svg
													width="20"
													height="20"
													fill="currentColor"
													className="m-auto"
													viewBox="0 0 2048 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M685 483q16 0 27.5-11.5t11.5-27.5-11.5-27.5-27.5-11.5-27 11.5-11 27.5 11 27.5 27 11.5zm422 0q16 0 27-11.5t11-27.5-11-27.5-27-11.5-27.5 11.5-11.5 27.5 11.5 27.5 27.5 11.5zm-812 184q42 0 72 30t30 72v430q0 43-29.5 73t-72.5 30-73-30-30-73v-430q0-42 30-72t73-30zm1060 19v666q0 46-32 78t-77 32h-75v227q0 43-30 73t-73 30-73-30-30-73v-227h-138v227q0 43-30 73t-73 30q-42 0-72-30t-30-73l-1-227h-74q-46 0-78-32t-32-78v-666h918zm-232-405q107 55 171 153.5t64 215.5h-925q0-117 64-215.5t172-153.5l-71-131q-7-13 5-20 13-6 20 6l72 132q95-42 201-42t201 42l72-132q7-12 20-6 12 7 5 20zm477 488v430q0 43-30 73t-73 30q-42 0-72-30t-30-73v-430q0-43 30-72.5t72-29.5q43 0 73 29.5t30 72.5z"></path>
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">Auctions</span>
										</Link>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/Category">
											<span className="text-left">
												<svg
													width="20"
													height="20"
													fill="currentColor"
													className="m-auto"
													viewBox="0 0 2048 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z"></path>
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">Category</span>
										</Link>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/User">
											<span className="text-left">
												<UserRound />
											</span>
											<span className="mx-4 text-sm font-normal">
												User Profile
											</span>
										</Link>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/Location">
											<span className="text-left">
												<MapPin />
											</span>
											<span className="mx-4 text-sm font-normal">Location</span>
										</Link>
										<a
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="#">
											<span className="text-left">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="lucide lucide-mail">
													<rect width="20" height="16" x="2" y="4" rx="2" />
													<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">Messages</span>
										</a>
										<a
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="#">
											<span className="text-left">
												<svg
													width="20"
													height="20"
													fill="currentColor"
													className="m-auto"
													viewBox="0 0 2048 1792"
													xmlns="http://www.w3.org/2000/svg">
													<path d="M1024 1131q0-64-9-117.5t-29.5-103-60.5-78-97-28.5q-6 4-30 18t-37.5 21.5-35.5 17.5-43 14.5-42 4.5-42-4.5-43-14.5-35.5-17.5-37.5-21.5-30-18q-57 0-97 28.5t-60.5 78-29.5 103-9 117.5 37 106.5 91 42.5h512q54 0 91-42.5t37-106.5zm-157-520q0-94-66.5-160.5t-160.5-66.5-160.5 66.5-66.5 160.5 66.5 160.5 160.5 66.5 160.5-66.5 66.5-160.5zm925 509v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm0-260v-56q0-15-10.5-25.5t-25.5-10.5h-568q-15 0-25.5 10.5t-10.5 25.5v56q0 15 10.5 25.5t25.5 10.5h568q15 0 25.5-10.5t10.5-25.5zm0-252v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm256-320v1216q0 66-47 113t-113 47h-352v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-768v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-352q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1728q66 0 113 47t47 113z"></path>
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">Reports</span>
										</a>
										<Link
											className="flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="/Dashboard/RoleRequest">
											<span className="text-left">
												<GitPullRequest />
											</span>
											<span className="mx-4 text-sm font-normal">
												Role Request
											</span>
										</Link>
										<Link
											className="mt-6 flex items-center justify-start w-full p-4 my-2 font-thin text-gray-500 uppercase transition-colors duration-200 dark:text-gray-200 hover:text-blue-500"
											href="#">
											<span className="text-left">
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="2"
													strokeLinecap="round"
													strokeLinejoin="round"
													className="lucide lucide-log-out">
													<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
													<polyline points="16 17 21 12 16 7" />
													<line x1="21" x2="9" y1="12" y2="12" />
												</svg>
											</span>
											<span className="mx-4 text-sm font-normal">Log out</span>
										</Link>
									</div>
								</nav>
							</div>
						</div>
						<div className="flex flex-col w-full pl-0 md:p-4 md:space-y-4">
							<header className="z-40 items-center w-full h-16 bg-white shadow-lg dark:bg-gray-700 rounded-2xl">
								<div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
									<div className="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0">
										<div className="container relative left-0 z-50 flex w-3/4 h-full">
											<div className="relative flex items-center w-full h-full lg:w-64 group">
												<div className="absolute z-50 flex items-center justify-center w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
													<svg
														fill="none"
														className="relative w-5 h-5"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth="2"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
													</svg>
												</div>
												<svg
													className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 20 20">
													<path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
												</svg>
												<input
													type="text"
													className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
													placeholder="Search"
												/>
												<div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
													+
												</div>
											</div>
										</div>
										<div className="relative flex items-center justify-end w-1/4 p-1 ml-5 mr-4 sm:mr-0 sm:right-auto">
											<a href="#" className="relative block">
												{/* <img
													alt="profil"
													src="/images/person/1.jpg"
													className="mx-auto object-cover rounded-full h-10 w-10 "
												/> */}
											</a>
										</div>
									</div>
								</div>
							</header>
							<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
								<div className="mb-4 w-full max-w-full">
									<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
										{children}
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
