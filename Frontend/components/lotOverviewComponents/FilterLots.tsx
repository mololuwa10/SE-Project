"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
	ChevronDownIcon,
	FunnelIcon,
	MinusIcon,
	PlusIcon,
	Squares2X2Icon,
} from "@heroicons/react/20/solid";
import LotOverviewProducts from "./LotOverviewProducts";
import { useSearchParams } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export default function FilterLots({}) {
	const [categories, setCategories] = useState([]);
	const searchParams = useSearchParams();
	const auctionId = searchParams.get("auctionId");
	const [lots, setLots] = useState([]);
	const [artistOptions, setArtistOptions] = useState([]);
	const [subjectClassificationOptions, setSubjectClassificationOptions] =
		useState([]);
	const [yearProducedOptions, setYearProducedOptions] = useState([]);
	const [selectedPriceBand, setSelectedPriceBand] = useState("default");

	// Band Changes ---------------------------------------------------
	// Function to fetch data based on selected price band
	const fetchLotsByPriceBand = async (band: any) => {
		try {
			const response = await fetch(
				`http://localhost:8080/api/lots/price-band?band=${band}`
			);
			const data = await response.json();
			setLots(data);
		} catch (error) {
			console.error("Error fetching lots:", error);
		}
	};

	// Function to handle radio group change
	const handlePriceBandChange = (value: any) => {
		setSelectedPriceBand(value);
		// Assuming the band values are integers (1, 2, 3)
		const band = value === "comfortable" ? 2 : value === "compact" ? 3 : 1;
		fetchLotsByPriceBand(band);
	};
	// --------------------------------------------------------------

	useEffect(() => {
		fetch("http://localhost:8080/api/categories")
			.then((response) => response.json())
			.then((data) => {
				const formattedData = data.map(
					(category: { id: number | string; categoryName: string }) => ({
						value: category.id,
						label: category.categoryName,
						checked: false,
					})
				);
				setCategories(formattedData);
			});
	}, []);

	useEffect(() => {
		if (auctionId) {
			// fetch the lots data when the component mounts and whenever the auction id changes
			fetch(`http://localhost:8080/api/lots/lotAuction/${auctionId}`)
				.then((response) => response.json())
				.then((data) => {
					const formattedData = data.map((lot: any) => ({
						value: lot.lotId,
						label: lot.lotTitle,
						image: lot.lotImage,
						description: lot.description,
						estimate: lot.estimatedPrice,
						lotNumber: lot.lotNumber,
						subjectClassification: lot.subjectClassification,
						yearProduced: lot.yearProduced,
						artist: lot.artist,
						auctionId: lot.auction.auctionId,
						checked: false,
					}));
					console.log(data);
					setLots(formattedData);

					setArtistOptions(
						formattedData.map((lot: any) => ({
							value: lot.artist,
							label: lot.artist,
							checked: false,
						}))
					);
					setSubjectClassificationOptions(
						formattedData.map((lot: any) => ({
							value: lot.subjectClassification,
							label: lot.subjectClassification,
							checked: false,
						}))
					);
					setYearProducedOptions(
						formattedData.map((lot: any) => ({
							value: lot.yearProduced,
							label: lot.yearProduced.toString(),
							checked: false,
						}))
					);
				});
		}
	}, [auctionId]);

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
			id: "artiste",
			name: "Artiste",
			options: artistOptions,
		},
		{
			id: "category",
			name: "Category",
			options: categories,
		},
		{
			id: "subject classifications",
			name: "Subject Classification",
			// IDEALLY THERE SHOULD BE ANOTHER SUBJECT CLASSIFICATIONS TABLE IN THE DATABASE
			options: subjectClassificationOptions,
		},
		{
			id: "year produced",
			name: "Year Produced",
			options: yearProducedOptions,
		},
	];
	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

	return (
		<div className="bg-white">
			<div>
				{/* Mobile filter dialog */}
				<Transition.Root show={mobileFiltersOpen} as={Fragment}>
					<Dialog
						as="div"
						className="relative lg:hidden"
						onClose={setMobileFiltersOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0">
							<div className="fixed inset-0 bg-black bg-opacity-25" />
						</Transition.Child>

						<div className="fixed inset-0 z-40 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full">
								<Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
									<div className="flex items-center justify-between px-4">
										<h2 className="text-lg font-medium text-gray-900">
											Filters
										</h2>
										<button
											type="button"
											className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
											onClick={() => setMobileFiltersOpen(false)}>
											<span className="sr-only">Close menu</span>
											<XMarkIcon className="h-6 w-6" aria-hidden="true" />
										</button>
									</div>

									{/* Filters */}
									<form className="mt-4 border-t border-gray-200">
										{filters.map((section) => (
											<Disclosure
												as="div"
												key={section.id}
												className="border-t border-gray-200 px-4 py-6">
												{({ open }: { open: boolean }) => (
													<>
														<h3 className="-mx-2 -my-3 flow-root">
															<Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
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
															<div className="space-y-6">
																{section.options.map((option, optionIdx) => (
																	<div
																		key={option.value}
																		className="flex items-center">
																		<input
																			id={`filter-mobile-${section.id}-${optionIdx}`}
																			name={`${section.id}[]`}
																			defaultValue={option.value}
																			type="checkbox"
																			defaultChecked={option.checked}
																			className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
																		/>
																		<label
																			htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
																			className="ml-3 min-w-0 flex-1 text-gray-500">
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
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				<main className="mx-auto px-4 sm:px-6 mt-[-65px]">
					<div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
						<h1 className="text-4xl font-bold tracking-tight text-gray-900">
							New Arrivals
						</h1>
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

								<RadioGroup
									defaultValue="default"
									onChange={handlePriceBandChange}
									className="text-3xl">
									<div className="flex items-center space-x-2 mt-5">
										<RadioGroupItem value="default" id="r1" />
										<Label htmlFor="r1">Lower Band</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="comfortable" id="r2" />
										<Label htmlFor="r2">Medium Band</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="compact" id="r3" />
										<Label htmlFor="r3">Higher Band</Label>
									</div>
								</RadioGroup>
							</form>

							{/* Product grid */}
							<div className="lg:col-span-3">
								{/* Your content */}
								<LotOverviewProducts />
							</div>
						</div>
					</section>
				</main>
			</div>
		</div>
	);
}
