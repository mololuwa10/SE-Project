import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LotOverviewProducts() {
	const searchParams = useSearchParams();
	const auctionId = searchParams.get("auctionId");
	const [lots, setLots] = useState([]);
	const [selectedPriceBand, setSelectedPriceBand] = useState(null);

	const [imageError, setImageError] = useState(false);

	const handleImageError = () => {
		setImageError(true);
	};

	useEffect(() => {
		if (auctionId) {
			// fetch the lots data when the component mounts and whenever the auction id changes
			let url = `http://localhost:8080/api/lots/lotAuction/${auctionId}`;
			if (selectedPriceBand) {
				url += `?band=${selectedPriceBand}`;
			}
			fetch(url)
				.then((response) => response.json())
				.then((data) => {
					const formattedData = data.map((lot: any) => {
						return {
							value: lot.lotId,
							label: lot.lotTitle,
							image: lot.lotImage,
							description: lot.description,
							estimate: lot.estimatedPrice,
							lotNumber: lot.lotNumber,
							auctionId: lot.auctionId,
							checked: false,
						};
					});
					console.log(data);
					setLots(formattedData);
				});
		}
	}, [auctionId, selectedPriceBand]);

	return (
		<section className="mt-[-82px]">
			<div className="mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<ul className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
					{lots.map((lot) => (
						<li key={lot.value}>
							<Link
								href={{
									pathname: "/Bid",
									query: { lotId: lot.value, auctionId: lot.auctionId },
								}}
								className="group block overflow-hidden">
								<Image
									src={`http://localhost:8080${lot.image}`}
									alt="Auction 1"
									width={500}
									height={300}
									onError={handleImageError}
									unoptimized={true}
									className="h-[350px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[450px]"
								/>

								<div className="relative bg-white pt-3">
									<h4 className="font-medium text-gray-700 group-hover:underline group-hover:underline-offset-4">
										Lot {lot.lotNumber}
									</h4>

									<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
										{lot.label}
									</h2>

									<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4">
										{lot.description}
									</h4>

									<h4 className="text-gray-700 group-hover:underline group-hover:underline-offset-4 mt-4">
										Estimate
									</h4>

									<h2 className="text-xl font-semibold text-gray-700 group-hover:underline group-hover:underline-offset-4">
										£{lot.estimate}
									</h2>

									<p className="mt-6">
										<span className="tracking-wider text-gray-900">
											{" "}
											<Link
												href={{
													pathname: `/Bid`,
													query: { lotId: lot.value, auctionId: lot.auctionId },
												}}>
												<Button
													size={"lg"}
													variant={"ghost"}
													className="border-2 border-black">
													Follow Lots
												</Button>
											</Link>
										</span>
									</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
