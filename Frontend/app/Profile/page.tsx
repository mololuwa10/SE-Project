import Link from "next/link";
import { ChevronRight } from "lucide-react";

import Image from "next/image";
export default function Profile() {
	return (
		<>
			<div>
				<div className="flex flex-col justify-center items-center relative px-20 py-20 text-4xl font-semibold">
					<h1>Welcome To Your Account</h1>
				</div>

				<div>
					<ul className="grid grid-cols-3 gap-8 mx-auto px-20 py-8 text-center items-center">
						<li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>
								Track Your Registered Auctions, Bids and Lots
							</Link>
						</li>
						<li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>Manage Your Account</Link>
						</li>
						<li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>View results for past auctions and lots</Link>
						</li>
						{/* <li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>Manage Your Account</Link>
						</li>
						<li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>Manage Your Account</Link>
						</li> */}
						<li className="flex relative flex-col flex-grow-1 mb-16 lg:flex lg:flex-shrink-0 lg:flex-grow-0 lg:max-w-1/3 hover:underline cursor-pointer">
							<Link href={"/"}>
								Customise your interest for personalised recommendations
							</Link>
						</li>
					</ul>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-8 mx-auto px-8 py-8">
				<div className="relative group-hover:scale-105">
					<a href="/">
						<Image src={"/img/auction2.jpg"} alt="" width={600} height={200} />
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl hover:underline-offset-8 hover:text-slate-900">
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
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl hover:underline-offset-8 hover:text-slate-900">
							How to sell with us{" "}
							<span className="inline-block mb-[-5px]">
								<ChevronRight />
							</span>
						</h2>
					</a>
				</div>
				<div className="relative">
					<a href="/">
						<Image src={"/img/auction2.jpg"} alt="" width={600} height={400} />
						<h2 className="absolute bottom-0 left-0 text-white p-4 text-2xl hover:underline-offset-8 hover:text-slate-900">
							FAQs{" "}
							<span className="inline-block mb-[-5px]">
								<ChevronRight />
							</span>
						</h2>
					</a>
				</div>
			</div>
		</>
	);
}
