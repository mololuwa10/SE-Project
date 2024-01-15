"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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

export default function Auction() {
	interface Auction {
		value: number | string;
		label: string;
		auctDate: Date;
		startTime: string;
		endTime: string;
		status: string;
		regiDate: Date;
		userId: number | string;
		categoryId: number | string;
		locationId: number | string;
	}

	const [auctions, setAuctions] = useState<Auction[]>([]);
	const [auctionCount, setAuctionCount] = useState(0);
	const [auctionName, setAuctionName] = useState("");
	const [auctionImage, setAuctionImage] = useState(null);
	const [allUsers, setAllUsers] = useState<any[]>([]);
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [auctionDate, setAuctionDate] = React.useState<Date>();
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [registrationDate, setRegistrationDate] = React.useState<Date>();
	const [status, setStatus] = useState("");
	const [selectedUser, setSelectedUser] = useState<number | null>(null);
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

	// Fetch All users
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

	const fetchAllUsers = useCallback(async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt || userRole !== "ADMIN") {
			return;
		}

		try {
			const response = await fetch("http://localhost:8080/api/admin/allUsers", {
				headers: { Authorization: "Bearer " + jwt },
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const users = await response.json();
			console.log(users);
			setAllUsers(users);
		} catch (error) {
			console.error("Error:", error);
		}
	}, [userRole]);

	useEffect(() => {
		fetchUserInfo();
		fetchAllUsers();
	}, [fetchUserInfo, fetchAllUsers]);
	// ------------------------------------------------------------

	// Fetch Location data
	const formatLocations = useCallback(
		(location: { id: number | string; locationName: string }) => {
			return {
				value: location.id,
				label: location.locationName,
				checked: false,
			};
		},
		[]
	);

	const locations = useFetchAndFormat(
		"http://localhost:8080/api/locations",
		formatLocations
	);

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
	// ---------------------------------------------------

	useEffect(() => {
		fetch("http://localhost:8080/api/auctions")
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map((auction: any) => ({
					value: auction.auctionId,
					label: auction.auctionName,
					image: auction.auctionImage,
					regiDate: auction.registrationDate,
					auctDate: auction.auctionDate,
					startTime: auction.startTime,
					endTime: auction.endTime,
					userId: auction.user ? auction.user.userId : null,
					status: auction.status,
					categoryId: auction.category ? auction.category.categoryId : null,
					locationId: auction.locations ? auction.locations.id : null,
					checked: false,
				}));
				setAuctions(formattedData);
				setAuctionCount(data.length);
				console.log(data);
			});
	}, []);

	function formatDate(dateString: Date) {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	// Handling Addition of Auction -------------------------------------------
	// Function to handle form field changes
	const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const userId = Number(event.target.value);
		setSelectedUser(userId);
	};

	const handleCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const categoryId = Number(event.target.value);
		setSelectedCategory(categoryId);
	};

	const handleLocationChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const locationId = Number(event.target.value);
		setSelectedLocation(locationId);
	};

	// Reference to the hidden file input
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Function to handle file selection
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setSelectedImage(event.target.files[0]);
		}
	};

	// Function to open file dialog
	const handleSelectImageClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// Handle form submission
	const handleAddAuction = async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			console.error("No JWT token found");
			return;
		}

		const formData = new FormData();
		if (selectedImage) {
			formData.append("image", selectedImage);
		}

		const auctionData = {
			auctionName,
			auctionDate: auctionDate ? format(auctionDate, "yyyy-MM-dd") : "",
			registrationDate: registrationDate
				? format(registrationDate, "yyyy-MM-dd")
				: "",
			startTime,
			endTime,
			status: "UPCOMING",
			user: { userId: selectedUser }, // The ID of the user
			category: { categoryId: selectedCategory }, // The ID of the category
			locations: { id: selectedLocation }, // The ID of the location
		};

		// Converting the auction data to a JSON string
		const auctionDataJson = JSON.stringify(auctionData);

		// Appending the JSON string to the FormData
		formData.append("auction", auctionDataJson);

		try {
			const response = await fetch("http://localhost:8080/api/auctions", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${jwt}`,
				},
				body: formData,
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			alert("Auction Added Succesfully");
			window.location.reload();
			const newAuction = await response.json();
			// Update auctions list
			setAuctions([...auctions, newAuction]);
			setAuctionName("");
			setAuctionImage(null);
			setAuctionDate(undefined);
			setStartTime("");
			setEndTime("");
			setRegistrationDate(undefined);
			setStatus("UPCOMING");
			setSelectedUser(null);
			setSelectedCategory(null);
			setSelectedLocation(null);
		} catch (error) {
			console.error("Error adding auction:", error);
		}
	};
	// ------------------------------------------------------------

	// Handling Editing Auction
	// Function to handle form field changes
	const [editingAuctionId, setEditingAuctionId] = useState<number | string>("");
	const [newAuctionName, setNewAuctionName] = useState("");
	const [editSelectedImage, setEditSelectedImage] = useState<File | null>(null);
	const [editAuctionDate, setEditAuctionDate] = React.useState<Date>();
	const [editStartTime, setEditStartTime] = useState("");
	const [editEndTime, setEditEndTime] = useState("");
	const [editRegistrationDate, setEditRegistrationDate] =
		React.useState<Date>();
	const [editStatus, setEditStatus] = useState("");
	const [editSelectedUser, setEditSelectedUser] = useState<number | null>(null);
	const [editSelectedCategory, setEditSelectedCategory] = useState<
		number | null
	>(null);
	const [editSelectedLocation, setEditSelectedLocation] = useState<
		number | null
	>(null);

	const handleEditUserChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const userId = Number(event.target.value);
		setEditSelectedUser(userId);
	};

	const handleEditCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const categoryId = Number(event.target.value);
		setEditSelectedCategory(categoryId);
	};

	const handleEditLocationChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const locationId = Number(event.target.value);
		setEditSelectedLocation(locationId);
	};

	// Reference to the hidden file input
	const editFileInputRef = useRef<HTMLInputElement>(null);

	// Function to handle file selection
	const handleEditFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setEditSelectedImage(event.target.files[0]);
		}
	};
	// Function to open file dialog
	const handleEditSelectImageClick = () => {
		if (editFileInputRef.current) {
			editFileInputRef.current.click();
		}
	};

	// Handle form submission
	const handleEditAuction = async (auctionId: number | string) => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt) {
			console.error("No JWT token found");
			return;
		}

		const formData = new FormData();
		if (selectedImage) {
			formData.append("image", selectedImage);
		}

		const auctionData = {
			auctionName: newAuctionName,
			auctionDate: editAuctionDate ? format(editAuctionDate, "yyyy-MM-dd") : "",
			registrationDate: editRegistrationDate
				? format(editRegistrationDate, "yyyy-MM-dd")
				: "",
			startTime: editStartTime,
			endTime: editEndTime,
			status: "UPCOMING",
			user: { userId: editSelectedUser }, // Updating backend model
			category: { categoryId: editSelectedCategory }, // Updating backend model
			locations: { locationId: editSelectedLocation }, // Updating backend model
		};

		// Converting the auction data to a JSON string
		const auctionDataJson = JSON.stringify(auctionData);
		formData.append("auction", auctionDataJson);

		try {
			const response = await fetch(
				`http://localhost:8080/api/auctions/${auctionId}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
					body: formData,
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const updatedAuction = await response.json();
			updateAuctionsList(updatedAuction);
			alert("Auction Updated Successfully");
		} catch (error) {
			console.error("Error updating auction:", error);
		}
	};

	// Function to update the auctions list
	const updateAuctionsList = (updatedAuction: { auctionId: any }) => {
		const updatedAuctions = auctions.map((auction) => {
			if (auction.value === updatedAuction.auctionId) {
				return { ...auction, ...updatedAuction };
			}
			return auction;
		});

		setAuctions(updatedAuctions);
	};

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						<Popover>
							<PopoverTrigger asChild className="mb-5">
								<Button size={"lg"} variant="outline">
									+ Add Auction
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<input
											type="file"
											ref={fileInputRef}
											onChange={handleFileChange}
										/>

										{/* Auction Name */}
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="name">Auction Name</Label>
											<Input
												id="name"
												value={auctionName}
												onChange={(event) => setAuctionName(event.target.value)}
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
														selected={auctionDate}
														onSelect={(selectedDate) =>
															setAuctionDate(selectedDate)
														}
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
												value={startTime}
												onChange={(event) => setStartTime(event.target.value)}
												className="col-span-2 h-8"
											/>
										</div>

										{/* End Time */}
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="endTime">End Time</Label>
											<Input
												id="endTime"
												defaultValue="HH:mm:ss"
												value={endTime}
												onChange={(event) => setEndTime(event.target.value)}
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

										{/* Users */}
										<div className="grid grid-cols-3 items-center gap-4 ">
											<Label htmlFor="user">User</Label>
											{/* <Select>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Select a User" />
												</SelectTrigger>
												<SelectContent>
													<SelectGroup>
														<SelectLabel>Users</SelectLabel>
														{allUsers.map((user) => (
															<SelectItem
																value={user.userId}
																key={user.userId}
																onClick={() => handleUserSelect(user.userId)}
																className="cursor-pointer">
																{user.userId} - {user.firstname} {user.lastname}
																<span>({user.username})</span>
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select> */}

											<select
												className="w-[180px] rounded-md"
												onChange={handleUserChange}
												value={selectedUser || ""} // To handle controlled component behavior
											>
												<option value="">Select a User</option>
												{allUsers.map((user) => (
													<option key={user.userId} value={user.userId}>
														{user.userId} - {user.firstname} {user.lastname} (
														{user.username})
													</option>
												))}
											</select>
										</div>

										{/* Category */}
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="category">Category</Label>
											<select
												className="w-[180px] rounded-md"
												onChange={handleCategoryChange}
												value={selectedCategory || ""} // To handle controlled component behavior
											>
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
												onChange={handleLocationChange}
												value={selectedLocation || ""} // To handle controlled component behavior
											>
												<option value="">Select a Location</option>
												{locations.map((location) => (
													<option key={location.value} value={location.value}>
														{location.label}
													</option>
												))}
											</select>
										</div>

										{/* Auction Image */}
										<div className="grid grid-cols-3 items-center gap-4">
											<Label htmlFor="auctionImage">Auction Image</Label>
											<Button
												size={"lg"}
												variant={"outline"}
												onClick={handleSelectImageClick}
												className=" px-3 py-3 w-[182px]">
												Select Image
											</Button>
										</div>

										<Button
											size={"lg"}
											variant={"outline"}
											onClick={handleAddAuction}>
											Add Auction
										</Button>
									</div>
								</div>
							</PopoverContent>
						</Popover>
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by auction details..."
							type="text"
						/>
						<Table>
							<TableCaption>AUCTIONS</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[100px]">Auction ID</TableHead>
									<TableHead>Auction Name</TableHead>
									<TableHead>Auction Date</TableHead>
									<TableHead>Start Time</TableHead>
									<TableHead>End Time</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Registration Date</TableHead>
									<TableHead>User ID</TableHead>
									<TableHead>Category ID</TableHead>
									<TableHead>Location ID</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(auctions as Auction[]).map((auction, index) => (
									<TableRow key={index}>
										<TableCell>{auction.value}</TableCell>
										<TableCell className="font-medium">
											{editingAuctionId === auction.value ? (
												<Input
													type="text"
													value={newAuctionName}
													onChange={(e) => setNewAuctionName(e.target.value)}
												/>
											) : (
												auction.label
											)}
										</TableCell>
										<TableCell>
											{editingAuctionId === auction.value ? (
												<Input
													type="text"
													value={editAuctionDate}
													onChange={(e) => setEditAuctionDate(e.target.value)}
												/>
											) : (
												formatDate(auction.auctDate)
											)}
										</TableCell>
										<TableCell>{auction.startTime}</TableCell>
										<TableCell>{auction.endTime}</TableCell>
										<TableCell>{auction.status}</TableCell>
										<TableCell>{formatDate(auction.regiDate)} </TableCell>
										<TableCell>{auction.userId}</TableCell>
										<TableCell>{auction.categoryId}</TableCell>
										<TableCell>{auction.locationId}</TableCell>
										<TableCell>
											<div className="p-2 flex">
												{editingAuctionId === auction.value ? (
													<>
														<Button
															onClick={() => handleEditAuction(auction.value)}
															className="mr-2 mb-2 flex hover:bg-gray-700">
															Save
														</Button>
														<Button onClick={() => setEditingAuctionId("")}>
															Cancel
														</Button>
													</>
												) : (
													<Button
														onClick={() => {
															setEditingAuctionId(auction.value);
															setNewAuctionName(auction.label);
														}}
														className="mr-2 mb-2 flex hover:bg-gray-700">
														Edit
													</Button>
												)}
												<Button
													size={"lg"}
													variant={"outline"}
													className="hover:bg-gray-200">
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={8}>Total</TableCell>
									<TableCell className="flex">
										{auctionCount} auctions
									</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</div>
			</div>
		</>
	);
}
