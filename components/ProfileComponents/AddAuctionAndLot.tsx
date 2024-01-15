"use client";

import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn, cn2 } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

import React, { useState, useEffect, useCallback, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import checkLogin from "@/app/session";

export default function AddAuctionAndLot() {
	// User details state
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();

	// Auction state
	const [registrationDate, setRegistrationDate] = React.useState<Date>();
	const [auctionDate, setAuctionDate] = React.useState<Date>();
	const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
	const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

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

	// Fetch Category data
	const formatCategories = useCallback(
		(category: { categoryId: number | string; categoryName: string }) => {
			return {
				value: category.categoryId,
				label: category.categoryName,
				checked: false,
			};
		},
		[]
	);

	const categories = useFetchAndFormat(
		"http://localhost:8080/api/categories",
		formatCategories
	);

	const handleCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const categoryId = Number(event.target.value);
		setSelectedCategory(categoryId);
	};
	// ----------------------------------------------------------
	return (
		<>
			{/* Add Auction Sheet */}
			<Sheet>
				<SheetTrigger className="flex items-center gap-8 px-12 py-4">
					<Button className="border-none" variant="outline">
						Add Auction
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>ADD AUCTION</SheetTitle>
						<SheetDescription>Click save when you're done.</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<Input
							type="file"
							// ref={fileInputRef}
							// onChange={handleFileChange}
						/>

						{/* Auction Name */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="name">Auction Name</Label>
							<Input
								id="name"
								// value={auctionName}
								// onChange={(event) => setAuctionName(event.target.value)}
								className="col-span-2 h-8"
							/>
						</div>

						{/* Auction Date */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="auctionDate">Auction Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										className={cn(
											"col-span-2 h-8 justify-start text-left font-normal",
											!auctionDate && "text-muted-foreground"
										)}>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{auctionDate ? (
											format(auctionDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										// selected={auctionDate}
										// onSelect={(selectedDate) => setAuctionDate(selectedDate)}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Start Time */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="startTime">Start Time</Label>
							<Input
								id="startTime"
								defaultValue="HH:mm:ss"
								// value={startTime}
								// onChange={(event) => setStartTime(event.target.value)}
								className="col-span-2 h-8"
							/>
						</div>

						{/* End Time */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="endTime">End Time</Label>
							<Input
								id="endTime"
								defaultValue="HH:mm:ss"
								// value={endTime}
								// onChange={(event) => setEndTime(event.target.value)}
								className="col-span-2 h-8"
							/>
						</div>

						{/* Registration Date */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="regDate">Registration Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										variant={"outline"}
										// onClick={() =>
										// 	date && handleRegistrationDateChange(date)
										// }
										className={cn(
											"col-span-2 h-8 justify-start text-left font-normal",
											!registrationDate && "text-muted-foreground"
										)}>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{registrationDate ? (
											format(registrationDate, "PPP")
										) : (
											<span>Pick a date</span>
										)}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0" align="start">
									<Calendar
										mode="single"
										selected={registrationDate}
										onSelect={(selectedDate) =>
											setRegistrationDate(selectedDate)
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Category */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="category">Category</Label>
							<select
								className="w-[180px] rounded-md"
								onChange={handleCategoryChange}
								value={selectedCategory || ""}>
								<option value="">Select a Category</option>
								{categories.map((category) => (
									<option key={category.value} value={category.value}>
										{category.label}
									</option>
								))}
							</select>
						</div>

						{/* Location */}
						<div className="grid grid-cols-3 items-center gap-4">
							<Label htmlFor="location">Location</Label>
							<select
								className="w-[180px] rounded-md"
								// onChange={handleLocationChange}
								//value={selectedLocation || ""} To handle controlled component behavior
							>
								<option value="">Select a Location</option>
								{/* {locations.map((location) => (   key={location.value} value={location.value}*/}
								<option>
									{/* {location.label} */}
									LOCATION 1
								</option>
								{/* ))} */}
							</select>
						</div>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button type="submit">Save changes</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>

			{/* Add Lot Sheet */}
			<Sheet>
				<SheetTrigger className="flex items-center gap-8 py-4">
					<Button className="border-none" variant="outline">
						Add Lot
					</Button>
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>ADD LOT</SheetTitle>
						<SheetDescription>Click save when you're done.</SheetDescription>
					</SheetHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="title" className="text-right">
								Lot Title
							</Label>
							<Input
								id="title"
								value="Starry Moonlight"
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">
								Artist Name
							</Label>
							<Input id="name" value="Pedro Duarte" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="description" className="text-right">
								Lot Description
							</Label>
							<Input
								id="description"
								value="mesmerising swell of art"
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="subClass" className="text-right">
								Subject Classification
							</Label>
							<Input id="subClass" value="Portrait" className="col-span-3" />
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="year" className="text-right">
								Year Produced
							</Label>
							<Input id="year" value="1998" className="col-span-3" />
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="dimesnsions" className="text-right">
								Dimensions
							</Label>
							<Input
								id="dimesnsions"
								value="80cm x 50cm"
								className="col-span-3"
							/>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="auctions" className="text-right">
								Auctions
							</Label>
							<select
								className="w-[180px] rounded-md"
								// onChange={handleCategoryChange}
								// value={selectedCategory || ""}  To handle controlled component behavior
							>
								<option value="">Select an Auction</option>
								{/* {categories.map((category) => (   key={category.value} value={category.value} */}
								<option>Auction 1</option>
								<option>Auction 2</option>
								{/* ))} */}
							</select>
						</div>

						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="lotImage">Lot Image</Label>
							<Input className="w-[347px]" id="image" type="file" />
						</div>
					</div>
					<SheetFooter>
						<SheetClose asChild>
							<Button type="submit">Save changes</Button>
						</SheetClose>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		</>
	);
}
