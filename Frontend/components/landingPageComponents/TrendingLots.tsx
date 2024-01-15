// "use client";

// import Link from "next/link";
// import { Button } from "../ui/button";
// import { CalendarCheck, MapPin, Printer } from "lucide-react";

// import * as React from "react";

// import { Card, CardContent } from "@/components/ui/card";
// import {
// 	Carousel,
// 	CarouselContent,
// 	CarouselItem,
// 	CarouselNext,
// 	CarouselPrevious,
// } from "@/components/ui/carousel";

// export default function TrendingLots() {
// 	return (
// 		<>
// 			<Carousel
// 				opts={{
// 					align: "start",
// 				}}
// 				className="w-full max-w-sm">
// 				<CarouselContent>
// 					{Array.from({ length: 5 }).map((_, index) => (
// 						<CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
// 							<div className="p-1">
// 								<Card>
// 									<CardContent className="flex aspect-square items-center justify-center p-6">
// 										{/* <span className="text-3xl font-semibold">{index + 1}</span> */}
// 										<ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
// 											<li>
// 												<a href="#" className="group block overflow-hidden">
// 													<img
// 														src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
// 														alt=""
// 														className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
// 													/>

// 													<div className="relative bg-white pt-3">
// 														<h3 className="text-xs text-gray-700 group-hover:underline group-hover:underline-offset-4">
// 															Basic Tee
// 														</h3>

// 														<p className="mt-2">
// 															<span className="sr-only"> Regular Price </span>

// 															<span className="tracking-wider text-gray-900">
// 																{" "}
// 																£24.00 GBP{" "}
// 															</span>
// 														</p>
// 													</div>
// 												</a>
// 											</li>
// 										</ul>
// 									</CardContent>
// 								</Card>
// 							</div>
// 						</CarouselItem>
// 					))}
// 				</CarouselContent>
// 				<CarouselPrevious />
// 				<CarouselNext />
// 			</Carousel>
// 		</>
// 	);
// }
