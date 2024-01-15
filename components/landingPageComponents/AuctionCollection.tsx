"use client";
import { ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";

export default function AuctionCollection() {
	const [auctions, setAuctions] = useState([]);

	useEffect(() => {
		fetch("http://localhost:8080/api/auctions")
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
	}, []);

	function formatDate(dateString: string) {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "long",
			day: "numeric",
		};
		return new Date(dateString).toLocaleDateString(undefined, options);
	}

	return (
		<section className="mt-[-55px] p-5">
			<div className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<Carousel
					opts={{
						align: "start",
					}}
					className="w-full p-4">
					<CarouselContent>
						{auctions.slice(0, 10).map((auction, index) => (
							<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
								<div className="">
									<Card>
										<CardContent className="flex aspect-square items-center justify-center p-6">
											<Link
												href={{
													pathname: `/lotOverview`,
													query: { auctionId: auction.value },
												}}
												className="group block overflow-hidden">
												<Image
													src={`http://localhost:8080${auction.image}`}
													alt={`Auction ${auction.value}`}
													width={500}
													height={300}
													className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
												/>
												<div className="relative bg-white pt-3">
													<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
														{auction.label}
													</h2>
													<h3 className="text-xl text-gray-700 group-hover:underline group-hover:underline-offset-4 mt-7">
														{formatDate(auction.regiDate)} -{" "}
														{formatDate(auction.auctDate)}
													</h3>
													<p className="mt-6">
														<span className="tracking-wider text-gray-900">
															<Button
																size={"lg"}
																variant={"ghost"}
																className="border-2 border-black">
																View Auction
															</Button>
														</span>
													</p>
												</div>
											</Link>
										</CardContent>
									</Card>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious />
					<CarouselNext />
				</Carousel>
			</div>
		</section>
	);
}
