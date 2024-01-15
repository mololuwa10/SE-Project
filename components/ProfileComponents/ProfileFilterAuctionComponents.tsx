import React, { Fragment, useState, useEffect, useCallback } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
// import { XMarkIcon } from "@heroicons/react/24/outline";
import {
	ChevronDownIcon,
	FunnelIcon,
	MinusIcon,
	PlusIcon,
	Squares2X2Icon,
} from "@heroicons/react/20/solid";
import checkLogin from "@/app/session";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileFilterAuctionComponents() {
	const [auctionCount, setAuctionCount] = useState(0);
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

	function useFetchAndFormat(url: string, formatData: (data: any) => any) {
		const [data, setData] = useState([]);

		useEffect(() => {
			fetch(url)
				.then((response) => response.json())
				.then((fetchedData) => {
					const formattedData = fetchedData.map(formatData);
					setData(formattedData);
				});
		}, [url, formatData]);

		return data;
	}

	const formatCategories = useCallback(
		(category: { categoryId: number | string; categoryName: string }) => {
			console.log(category.categoryId);
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

	const formatLocations = useCallback(
		(location: { id: number | string; locationName: string }) => {
			console.log(location.id);
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

	useEffect(() => {
		fetch(`http://localhost:8080/api/auctions/user/${userId}`)
			.then((response) => response.json())
			.then((data) => {
				setAuctionCount(data.length);
			});
	}, [userId]);

	const filters = [
		{
			id: "color",
			name: "Events",
			options: [
				{ value: "live", label: "Live", checked: false },
				{ value: "online", label: "Online", checked: false },
			],
		},
		{
			id: "category",
			name: "Category",
			options: categories,
		},
		{
			id: "locations",
			name: "Locations",
			options: locations,
		},
	];

	// State for selected filters
	const [selectedFilters, setSelectedFilters] = useState({
		category: new Set(),
		locations: new Set(),
		events: new Set(),
	});

	// Fetch auctions with applied filters
	type FilterType = "category" | "locations" | "events";
	const [filteredAuctions, setFilteredAuctions] = useState([]);

	// Handle change in filters
	const handleFilterChange = (
		filterType: FilterType,
		value: any,
		isChecked: boolean
	) => {
		setSelectedFilters((prevFilters) => {
			const updatedFilters = new Set(prevFilters[filterType]);
			if (isChecked) {
				updatedFilters.add(value);
			} else {
				updatedFilters.delete(value);
			}
			return { ...prevFilters, [filterType]: updatedFilters };
		});
	};

	// Fetch and filter auctions
	useEffect(() => {
		fetch("http://localhost:8080/api/auctions")
			.then((response) => response.json())
			.then((data) => {
				// Apply filters here
				const filteredData = data.filter(
					(auction: any) =>
						selectedFilters.category.size === 0 ||
						selectedFilters.category.has(auction.categoryId)
					// Add similar conditions for other filters
				);
				setFilteredAuctions(filteredData);
				setAuctionCount(filteredData.length);
			});
	}, [selectedFilters]);

	return (
		<>
			<div className="bg-white">
				<div>
					<main className="mx-auto px-4 sm:px-6 mt-[10px]">
						<div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-">
							<h4 className="text-2xl font-medium tracking-tight text-gray-900">
								Showing {auctionCount} results
							</h4>
						</div>

						<section aria-labelledby="products-heading" className="pb-24 pt-6">
							<h2 id="products-heading" className="sr-only">
								Products
							</h2>

							<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
								{/* Filters */}
								<form className="hidden lg:block">
									{filters.map((section) => (
										<Disclosure
											as="div"
											key={section.id}
											className="border-b border-gray-200 py-6">
											{({ open }: { open: boolean }) => (
												<>
													<h3 className="-my-3 flow-root">
														<Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
															<span className="font-medium text-gray-900">
																{section.name}
															</span>
															<span className="ml-6 flex items-center">
																{open ? (
																	<MinusIcon
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																) : (
																	<PlusIcon
																		className="h-5 w-5"
																		aria-hidden="true"
																	/>
																)}
															</span>
														</Disclosure.Button>
													</h3>
													<Disclosure.Panel className="pt-6">
														<div className="space-y-4">
															{section.options.map((option, optionIdx) => (
																<div
																	key={option.value}
																	className="flex items-center">
																	<input
																		id={`filter-${section.id}-${optionIdx}`}
																		name={`${section.id}[]`}
																		defaultValue={option.value}
																		type="checkbox"
																		defaultChecked={option.checked}
																		className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																	/>
																	<label
																		htmlFor={`filter-${section.id}-${optionIdx}`}
																		className="ml-3 text-sm text-gray-600">
																		{option.label}
																	</label>
																</div>
															))}
														</div>
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									))}
								</form>

								{/* Product grid */}
								<div className="lg:col-span-3">
									{/* Display filtered auctions here */}
									{/* {filteredAuctions.map(auction => <AuctionComponent key={auction.id} auction={auction} /> */}
									<ProfileFilterAuctionComponents />
								</div>
							</div>
						</section>
					</main>
				</div>
			</div>
		</>
	);
}
