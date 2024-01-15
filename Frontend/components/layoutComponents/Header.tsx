"use client";

import { Menu, Link, ShoppingCart, Sun, Moon } from "lucide-react";
import React from "react";
import { Fragment, useState } from "react";
import { LanguageComboBox } from "./LanguageComboBox";
import { LocationComboBox } from "./LocationComboBox";
import { NavigationMenuDemo } from "./NavigationMenuDemo";
import { Button } from "../ui/button";
import Container from "@/components/ui/container";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import ProfileButton from "./ProfileButton";
import SearchBar from "./SearchBar";

// import { Dialog, Disclosure, Popover, Transition } from '@headlessui/react'
// import {
//   ArrowPathIcon,
//   Bars3Icon,
//   ChartPieIcon,
//   CursorArrowRaysIcon,
//   FingerPrintIcon,
//   SquaresPlusIcon,
//   XMarkIcon,
// } from '@heroicons/react/24/outline'
// import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

// const products = [
// 	{
// 		name: "Analytics",
// 		description: "Get a better understanding of your traffic",
// 		href: "#",
// 		icon: ChartPieIcon,
// 	},
// 	{
// 		name: "Engagement",
// 		description: "Speak directly to your customers",
// 		href: "#",
// 		icon: CursorArrowRaysIcon,
// 	},
// 	{
// 		name: "Security",
// 		description: "Your customers’ data will be safe and secure",
// 		href: "#",
// 		icon: FingerPrintIcon,
// 	},
// 	{
// 		name: "Integrations",
// 		description: "Connect with third-party tools",
// 		href: "#",
// 		icon: SquaresPlusIcon,
// 	},
// 	{
// 		name: "Automations",
// 		description: "Build strategic funnels that will convert",
// 		href: "#",
// 		icon: ArrowPathIcon,
// 	},
// ];

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	return (
		<div>
			<header className="sm:flex sm:justify-end py-3 px-4 border-b">
				<div
					className="relative px-4 sm:px-6 lg:px-8 flex items-center
				justify-end w-full">
					<SearchBar />
					<LanguageComboBox />
					<LocationComboBox />
				</div>
			</header>
			<header className="sm:flex sm:justify-between py-3 px-4 border-b">
				<Container>
					<div
						className="relative px-4 sm:px-6 lg:px-8 flex h-12 items-center
				justify-between w-full">
						<div className="flex items-center ml-4">
							{/* <Sheet>
								<SheetTrigger>
									<Menu className="h-6 md:hidden w-6" />
								</SheetTrigger>
								<SheetContent side={"left"} className="w-[300px] sm:w-[400px]">
									<nav className="flex flex-col gap-4">
										<div className="block px-2 py-1 text-lg">
											<NavigationMenuDemo />
										</div>
									</nav>
								</SheetContent>
							</Sheet> */}
							<a href="/" className="ml-1 lg:ml-0 text-lg font-bold">
								FOTHEBY&apos;S
							</a>
						</div>
						<nav className="mx-6 flex items-center space-x-4 lg:space-x-6 md:block white-text">
							<NavigationMenuDemo />
						</nav>
						<div className="flex items-center">
							<Button
								variant={"ghost"}
								size={"icon"}
								className="mr-6"
								aria-label="Shopping Cart">
								<ShoppingCart className="h-6 w-6" />
								<span className="sr-only">Shopping Cart</span>
							</Button>

							{/* <Button
								variant={"ghost"}
								size={"icon"}
								aria-label="Toggle Theme"
								className="mr-6"
								onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
								<Sun className="h-6 w-6 rotate-0 scale-100 tranisition-all dark:-rotate-90 dark:scale-0" />
								<Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" />
								<span className="sr-only">Toggle Theme</span>
							</Button> */}
							<ProfileButton />
						</div>
					</div>
				</Container>
			</header>
		</div>
	);
}
