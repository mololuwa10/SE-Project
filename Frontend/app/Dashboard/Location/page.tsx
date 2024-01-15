"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

export default function Location() {
	type LocationType = {
		value: number | string;
		label: string;
		checked?: boolean;
	};

	const [locations, setLocations] = useState<LocationType[]>([]);
	const [locationName, setLocationName] = useState("");
	const [editingLocationId, setEditingLocationId] = useState(null);
	const [addLocation, setAddLocation] = useState([]);
	const [newLocationName, setNewLocationName] = useState("");

	// Handling Adding Locations
	const handleAddLocation = useCallback(
		(event: {
			preventDefault: () => void;
			currentTarget: HTMLFormElement | undefined;
		}) => {
			event.preventDefault();
			// if (formRef.current) {
			const data = new FormData(event.currentTarget);
			console.log(addLocation);
			fetch("http://localhost:8080/api/locations", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(locationName),
			})
				.then((response) => response.json())
				.then((data) => {
					alert("Location Added Successfully");
					window.location.reload();
				})
				.catch((error) => {
					alert("Error creating Location");
				});
			// }
		},
		[addLocation, locationName]
	);

	// States For Pagination ---------------
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	// ---------------------

	type PaginationProps = {
		totalPages: number;
		currentPage: number;
		onPageChange: (page: number) => void;
	};

	function useFetchAndFormat(url: string, formatData: (data: any) => any) {
		const [data, setData] = useState<any[]>([]);

		useEffect(() => {
			fetch(url)
				.then((response) => response.json())
				.then((fetchedData) => {
					if (Array.isArray(fetchedData)) {
						const formattedData = fetchedData.map(formatData);
						setData(formattedData);
					} else {
						const formattedData = [formatData(fetchedData)];
						setData(formattedData);
					}
				});
		}, [url, formatData]);

		return data;
	}

	const formatLocation = useCallback((locations: any) => {
		console.log(locations);
		return {
			value: locations.id,
			label: locations.locationName,
			checked: false,
		};
	}, []);

	// Edit Location Handler
	const handleSaveEdit = useCallback(
		(id: number) => {
			const url = `http://localhost:8080/api/locations/${id}`;
			fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ locationName: newLocationName }),
			})
				.then((response) => {
					if (response.ok) {
						// Update the UI with the new category name
						setLocations((prevLocations: LocationType[]) =>
							prevLocations.map((location) =>
								location.value === id
									? { ...location, label: newLocationName }
									: location
							)
						);
						// Reset editing state
						alert("Updated Location successfully");
						window.location.reload();
						setEditingLocationId(null);
						setNewLocationName("");
					} else {
						alert("Failed to update Location");
					}
				})
				.catch(() => {
					alert("Error updating Location");
				});
		},
		[newLocationName, setLocations]
	);

	// Delete location handler
	const handleDelete = useCallback(
		(id: number) => {
			const confirmation = window.confirm(
				"Are you sure you want to delete this Location?"
			);
			if (confirmation) {
				const url = `http://localhost:8080/api/locations/${id}`;
				fetch(url, {
					method: "DELETE",
				})
					.then((response) => {
						if (response.ok) {
							// Update the UI with the new category name
							setLocations((prevLocations: LocationType[]) =>
								prevLocations.filter((location) => location.value !== id)
							);
							// Reset editing state
							alert("Deleted Location successfully");
							window.location.reload();
							setEditingLocationId(null);
							setNewLocationName("");
						} else {
							alert("Failed to delete Location");
						}
					})
					.catch(() => {
						alert("Error deleting Location");
					});
			}
		},
		[setLocations]
	);

	const allLocations = useFetchAndFormat(
		"http://localhost:8080/api/locations",
		formatLocation
	);

	// Handling filtering of Users
	const [searchTerm, setSearchTerm] = useState("");
	const filteredLocations = allLocations.filter((location) => {
		return location.label.toLowerCase().includes(searchTerm.toLowerCase());
	});

	const indexOfLastLocation = currentPage * itemsPerPage;
	const indexOfFirstLocation = indexOfLastLocation - itemsPerPage;
	const currentLocations = filteredLocations.slice(
		indexOfFirstLocation,
		indexOfLastLocation
	);

	// Handling pagination - Calculating Total Pages
	useEffect(() => {
		setTotalPages(Math.ceil(allLocations.length / itemsPerPage));
	}, [allLocations, itemsPerPage]);
	// ------------------------------------------------

	// Handling pagination - Changing Current Page
	const handlePageChange = (page: SetStateAction<number>) => {
		setCurrentPage(page);
	};
	// ----------------------------------------------

	// Pagination Component
	const CustomPagination: React.FC<PaginationProps> = ({
		totalPages,
		currentPage,
		onPageChange,
	}) => {
		return (
			<Pagination className="mt-5">
				<PaginationContent>
					{/* Previous Page */}
					<PaginationItem>
						<PaginationPrevious
							className="cursor-pointer"
							onClick={() => onPageChange(Math.max(1, currentPage - 1))}
						/>
					</PaginationItem>

					{/* Page Numbers */}
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								className="cursor-pointer"
								onClick={() => onPageChange(page)}
								isActive={currentPage === page}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}

					{/* Next Page */}
					<PaginationItem>
						<PaginationNext
							className="cursor-pointer"
							onClick={() =>
								onPageChange(Math.min(totalPages, currentPage + 1))
							}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>
		);
	};

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						<Popover>
							<PopoverTrigger asChild className="mb-5">
								<Button size={"lg"} variant="outline">
									+ Add Location
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<form onSubmit={handleAddLocation}>
									<div className="grid gap-4">
										<div className="grid gap-2">
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">Location Name</Label>
												<Input
													id="name"
													defaultValue="Enter Location name"
													value={locationName}
													onChange={(e) => setLocationName(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>
										</div>
										{/* Add Location */}
										<Button
											size={"lg"}
											variant={"outline"}
											className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2 mt-3">
											Add Location
										</Button>
									</div>
								</form>
							</PopoverContent>
						</Popover>
						{/* Filter Textbox Using the Input Component*/}
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by location details..."
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Table>
							<TableCaption>Locations</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Location Id</TableHead>
									<TableHead>Location Name</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentLocations.map((location) => (
									<TableRow key={location.value}>
										<TableCell>{location.value}</TableCell>
										<TableCell>
											{editingLocationId === location.value ? (
												<Input
													value={newLocationName}
													onChange={(e) => setNewLocationName(e.target.value)}
												/>
											) : (
												location.label
											)}
										</TableCell>
										<TableCell>
											<div className="p-2 flex">
												{editingLocationId === location.value ? (
													<>
														<Button
															onClick={() => handleSaveEdit(location.value)}
															className="mr-2 mb-2 flex hover:bg-gray-700">
															Save
														</Button>

														<Button onClick={() => setEditingLocationId(null)}>
															Cancel
														</Button>
													</>
												) : (
													<Button
														onClick={() => {
															setEditingLocationId(location.value);
															setNewLocationName(location.label);
														}}
														className="mr-2 mb-2 flex hover:bg-gray-700">
														Edit
													</Button>
												)}
												<Button
													size={"lg"}
													variant={"outline"}
													className="hover:bg-gray-200"
													onClick={() => handleDelete(Number(location.value))}>
													Delete
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<CustomPagination
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
