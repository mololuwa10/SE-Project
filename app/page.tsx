import AuctionCollection from "@/components/landingPageComponents/AuctionCollection";
import BlogSection from "@/components/landingPageComponents/BlogSection";
import HomeImageSlider from "@/components/landingPageComponents/HomeImageSlider";
import HomeTestimonial from "@/components/landingPageComponents/HomeTestimonial";
import NewArrivals from "@/components/landingPageComponents/NewArrivals";
// import TrendingLots from "@/components/landingPageComponents/TrendingLots";
import Footer from "@/components/layoutComponents/Footer";
import Header from "@/components/layoutComponents/Header";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const images = [
	{ src: "./img/auction1.jpg" },
	{ src: "./img/auction2.jpg" },
	{ src: "./img/auction3.jpg" },
	{ src: "./img/auction4.jpg" },
];

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col justify-between">
			<Header />

			<HomeImageSlider />

			<div className="flex items-center justify-between px-20 py-10">
				<h2 className="text-bold font-medium text-4xl ml-16 tracking-tight text-gray-900 sm:text-3xl">
					Upcoming Auctions
				</h2>
				<Link href="/Auctions">
					<Button
						size={"lg"}
						variant={"ghost"}
						className="text-md text-2xl font-medium text-blue-500 hover:text-blue-400">
						VIEW ALL
					</Button>
				</Link>
			</div>

			{/* <div className="flex flex-row justify-between items-center w-full h-full px-20 py-10">
				<h1 className="text-bold font-medium text-4xl ml-16">
					Upcoming Auctions
				</h1>

				<Link href="/Auctions" className="cursor-pointer">
					<Button size={"lg"} variant={"ghost"} className="text-blue-500">
						VIEW ALL
					</Button>
				</Link>
			</div> */}

			<div>
				<AuctionCollection />
			</div>

			<div className="flex flex-row justify-between items-center w-full h-full px-20 py-2">
				<h1 className="text-bold font-medium text-4xl ml-16">
					Shop New Arrivals From Our Online Store
				</h1>

				<a href="/">
					<Button
						size={"lg"}
						variant={"ghost"}
						className="text-blue-500 cursor-pointer">
						VIEW ALL
					</Button>
				</a>
			</div>

			<div>
				<NewArrivals />
			</div>

			{/* <div>
				<TrendingLots />
			</div> */}

			<div className="grid grid-cols-2 gap-2 mx-auto px-1 py-1">
				<div className="relative group-hover:scale-105">
					<a href="/">
						<Image src={"/img/auction2.jpg"} alt="" width={600} height={200} />
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl">
							How to buy with us{" "}
							<span className="inline-block mb-[-5px]">
								<ChevronRight />
							</span>
						</h2>
					</a>
				</div>
				<div className="relative">
					<a href="/">
						<Image src={"/img/auction2.jpg"} alt="" width={600} height={400} />
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl">
							How to sell with us{" "}
							<span className="inline-block mb-[-5px]">
								<ChevronRight />
							</span>
						</h2>
					</a>
				</div>
			</div>

			<div>
				<BlogSection />
			</div>

			<div className="border-gray-700 rounded-lg">
				<HomeTestimonial />
			</div>

			<Footer />
		</main>
	);
}
