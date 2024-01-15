"use client";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState, useEffect, useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import checkLogin from "@/app/session";

const ProfileButton = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);

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
		if (loggedIn) {
			fetchUserInfo();
		}
	}, [fetchUserInfo]);

	const handleLogout = async () => {
		localStorage.removeItem("jwt");
		setIsLoggedIn(false);
		setUserDetails(null);
		router.push("/signIn");
	};

	if (!isLoggedIn) {
		return (
			<Link href="/signIn">
				<Button size={"lg"}>Sign In</Button>
			</Link>
		);
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Avatar>
						<AvatarImage
							src="https://github.com/shadcn.png"
							alt={`@${userDetails?.username}`}
						/>
						<AvatarFallback>
							{userDetails
								? `CN${userDetails.username.charAt(0).toUpperCase()}`
								: "Loading..."}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer">
						<Link href={"/Profile"}>Profile</Link>
					</DropdownMenuItem>
					{userRole === "ADMIN" && (
						<DropdownMenuItem className="cursor-pointer">
							<Link href={"/Dashboard"}>Dashboard</Link>
						</DropdownMenuItem>
					)}
					<DropdownMenuItem className="cursor-pointer">
						Settings
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default ProfileButton;
