"use client";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { words } from "@/lib/data";

const SearchBar = () => {
	const [activeSearch, setActiveSearch] = useState<string[]>([]);

	const handleSeacrh = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.value == "") {
			setActiveSearch([]);
			return false;
		}
		setActiveSearch(
			words.filter((w) => w.includes(e.target.value)).slice(0, 8)
		);
	};
	return (
		<form className="w-[500px] relative">
			<div className="relative">
				<input
					type="search"
					placeholder="Search for anything"
					className="w-full p-4 rounded-full text-black bg-gray-200"
					onChange={(e) => handleSeacrh(e)}
				/>
				<button className="absolute right-1 top-1/2 -translate-y-1/2 p-3 rounded-full">
					<Search />
				</button>
			</div>

			{activeSearch.length > 0 && (
				<div className="absolute top-20 p-4 bg-slate-800 text-white w-full rounded-xl left-1/32 left-1/2 -translate-x-1/2 flex flex-col gap-2">
					{activeSearch.map((s) => (
						// eslint-disable-next-line react/jsx-key
						<span>{s}</span>
					))}
				</div>
			)}
		</form>
	);
};

export default SearchBar;
