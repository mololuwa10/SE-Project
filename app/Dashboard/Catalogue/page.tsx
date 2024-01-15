"use client";

import {
	Table,
	TableCaption,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function Catalogue() {
	const [lot, setLots] = useState([]);
	// Fetch lot data on page load
	useEffect(() => {
		fetch("http://localhost:8080/api/lots")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setLots(data);
			});
	}, []);

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						<Button
							className="ml-auto mb-5 hover:bg-gray-300"
							size={"lg"}
							variant={"outline"}>
							+ Add Lot
						</Button>
						{/* Filter Textbox Using the Input Component*/}
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by lot details..."
							type="text"
						/>
						<Table>
							<TableCaption>Lot List</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Lot Id</TableHead>
									<TableHead>Lot Number</TableHead>
									<TableHead>Lot Title</TableHead>
									<TableHead>Artist</TableHead>
									<TableHead>Year Produced</TableHead>
									<TableHead>Subject Classification</TableHead>
									<TableHead>Estimated Price</TableHead>
									<TableHead>Description</TableHead>
									<TableHead>Auction ID</TableHead>
									<TableHead>Lot Dimensions</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{lot.map((lot) => (
									<TableRow key={lot.lotId}>
										<TableCell>{lot.lotId}</TableCell>
										<TableCell>{lot.lotNumber}</TableCell>
										<TableCell>{lot.lotTitle}</TableCell>
										<TableCell>{lot.artist}</TableCell>
										<TableCell>{lot.yearProduced}</TableCell>
										<TableCell>{lot.subjectClassification}</TableCell>
										<TableCell>{lot.estimatedPrice}</TableCell>
										<TableCell>{lot.description}</TableCell>
										<TableCell>{lot.auctionId}</TableCell>
										<TableCell>{lot.dimensions}</TableCell>
										<TableCell>
											<div className="p-2 flex">
												<Button
													size={"lg"}
													// variant={"outline"}
													className="mr-2 mb-2 flex hover:bg-gray-700">
													Edit
												</Button>
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
						</Table>
					</div>
				</div>
			</div>
		</>
	);
}
