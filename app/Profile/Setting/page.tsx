"use client";

import checkLogin from "@/app/session";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function Settings() {
	const [userProfile, setUserProfile] = useState({
		name: "Mr Mololuwa Segilola",
		email: "mololuwasegi@yahoo.com",
		password: "********",
		authorizedUsers: "None",
		currency: "British pounds",
	});

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setUserProfile({
			...userProfile,
			[name]: value,
		});
	};

	const handleSubmit = (e: any) => {
		e.preventDefault();
		// Handle the form submission, such as sending the data to an API
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
			<nav>
				<ul className="flex items-center gap-8 px-12 py-4">
					<Link href={"#"}>
						<li>DETAILS</li>
					</Link>
					<Link href={"#"}>
						<li>COMMUNICATIONS</li>
					</Link>
					<Link href={"/Profile/Setting/Notifications"}>
						<li>NOTIFICATIONS</li>
					</Link>
				</ul>
			</nav>

			<nav className="border-b">
				<ul className="flex items-center gap-[1100px] px-16 py-6 w-full">
					<li className="font-normal">USER PROFILE</li>
					<Link href={"#"} className="hover:underline">
						<li>Edit Profile</li>
					</Link>
				</ul>
			</nav>
			<div className="settings-container mt-8">
				{/* User Information */}

				<form onSubmit={handleSubmit} className="pl-[474px]">
					<div className="form-group border-b-2 my-6">
						<label htmlFor="name">First Name: </label>
						<input
							id={userDetails?.userId}
							name="name"
							type="text"
							value={userDetails?.firstname}
							onChange={handleChange}
							className="ml-8"
						/>
					</div>
					<div className="form-group border-b-2 my-6">
						<label htmlFor="lastname">Last Name: </label>
						<input
							id={`${userDetails?.userId}-lastname`}
							name="lastname"
							type="text"
							value={userDetails?.lastname}
							onChange={handleChange}
							className="ml-8"
						/>
					</div>

					<div className="form-group border-b-2 my-6">
						<label htmlFor="email">Email: </label>
						<input
							id={userDetails?.userId}
							name="email"
							type="email"
							value={userDetails?.user_email}
							onChange={handleChange}
							className="ml-8"
						/>
					</div>
					<div className="form-group border-b-2 my-6">
						<label htmlFor="email">Username: </label>
						<input
							id={userDetails?.userId}
							name="email"
							type="email"
							value={userDetails?.username}
							onChange={handleChange}
							className="ml-8"
						/>
					</div>
					{/* <div className="form-group border-b-2 my-6">
						<label htmlFor="password">Password: </label>
						<input
							id={userDetails?.userId}
							name="password"
							value={userProfile.password}
							onChange={handleChange}
						/>
					</div> */}
					<div className="form-group border-b-2 my-2">
						<label htmlFor="authorizedUsers">Authorized Users: </label>
						{userDetails?.authorities.map((authority: any, index: any) => (
							<label className="ml-8" key={index}>
								{authority.authority}
							</label>
						))}
					</div>
					<div className="form-group border-b-2 my-6">
						<label htmlFor="telephone">Telephone: </label>
						<label className="ml-8">{userDetails?.contactTelephone}</label>
					</div>

					<div className="form-group border-b-2 my-6">
						<label htmlFor="address">Address: </label>
						<label className="ml-8">{userDetails?.contactAddress}</label>
					</div>

					<div className="form-group border-b-2 my-6">
						<label htmlFor="sortCode">Sort Code: </label>
						<label className="ml-8">{userDetails?.bankSortCode}</label>
					</div>

					<div className="form-group border-b-2 my-6">
						<label htmlFor="accountNumber">Account Number: </label>
						<label className="ml-8">{userDetails?.bankAccountNo}</label>
					</div>
					<div className="form-group border-b-2 my-6">
						<label htmlFor="currency">Currency</label>
						<select
							id="currency"
							name="currency"
							value={userProfile.currency}
							onChange={handleChange}>
							<option value="British pounds">British pounds</option>
							{/* Add other currency options here */}
						</select>
					</div>
					<button type="submit">Save Change</button>
				</form>
			</div>
		</>
	);
}
