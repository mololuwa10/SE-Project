"use client";
import { ChevronLeft, ChevronRight, CircleDot } from "lucide-react";
import React, { useState } from "react";

export default function HomeImageSlider() {
	const images = [
		{ src: "./img/auction1.jpg" },
		{ src: "./img/auction2.jpg" },
		{ src: "./img/auction3.jpg" },
		{ src: "./img/auction4.jpg" },
	];

	const [currentIndex, setCurrentIndex] = useState(0);

	const prevSlide = () => {
		const isFirstSlide = currentIndex === 0;
		const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
		setCurrentIndex(newIndex);
	};

	const nextSlide = () => {
		const isLastSlide = currentIndex === images.length - 1;
		const newIndex = isLastSlide ? 0 : currentIndex + 1;
		setCurrentIndex(newIndex);
	};

	const goToSlide = (slideIndex: number) => {
		setCurrentIndex(slideIndex);
	};

	return (
		<div className=" h-[630px] w-full m-auto py-5 px-1 relative group">
			<div
				style={{ backgroundImage: `url(${images[currentIndex].src})` }}
				className="w-full h-full bg-center bg-cover duration-500">
				{/* Left Arrow */}
				<div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
					<ChevronLeft onClick={prevSlide} size={50} />
				</div>
				{/* Right Arrow */}
				<div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
					<ChevronRight onClick={nextSlide} size={50} />
				</div>
			</div>
			<div className="flex top-4 justify-center py-2">
				{/* Slider Indicators */}
				{images.map((image, imageIndex) => (
					<div
						key={imageIndex}
						onClick={() => goToSlide(imageIndex)}
						className="cursor-pointer">
						<CircleDot />
					</div>
				))}
			</div>
		</div>
	);
}
