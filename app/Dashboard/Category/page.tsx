"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn, cn2 } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import React, { useState, useEffect, useCallback, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Category() {
	type CategoryType = {
		value: number | string;
		label: string;
		checked?: boolean;
	};

	// Category function
	const [category, setCategory] = useState<CategoryType[]>([]);
	const [categoryName, setCategoryName] = useState("");
	const [editingCategoryId, setEditingCategoryId] = useState<
		string | number | null
	>(null);
	const [newCategoryName, setNewCategoryName] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [addCategory, setAddCategory] = useState([]);

	// Fetch category data on page load
	useEffect(() => {
		fetch("http://localhost:8080/api/categories")
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				const formattedData = data.map((category: any) => ({
					value: category.categoryId,
					label: category.categoryName,
					checked: false,
				}));
				setCategory(formattedData);
				console.log(data);
			});
	}, []);

	// Add category handler
	const handleAddCategory = useCallback(
		(event: {
			preventDefault: () => void;
			currentTarget: HTMLFormElement | undefined;
		}) => {
			event.preventDefault();
			// if (formRef.current) {
			const data = new FormData(event.currentTarget);
			console.log(addCategory);
			fetch("http://localhost:8080/api/categories", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(categoryName),
			})
				.then((response) => response.json())
				.then((data) => {
					alert("Category Added Successfully");
					window.location.reload();
				})
				.catch((error) => {
					alert("Error creating category");
				});
			// }
		},
		[addCategory, categoryName]
	);

	// Edit category handler
	const handleSaveEdit = useCallback(
		(categoryId: number) => {
			const url = `http://localhost:8080/api/categories/${categoryId}`;
			fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ categoryName: newCategoryName }),
			})
				.then((response) => {
					if (response.ok) {
						// Update the UI with the new category name
						setCategory((prevCategories: CategoryType[]) =>
							prevCategories.map((cat) =>
								cat.value === categoryId
									? { ...cat, label: newCategoryName }
									: cat
							)
						);
						// Reset editing state
						alert("Updated category successfully");
						setEditingCategoryId(null);
						setNewCategoryName("");
					} else {
						alert("Failed to update category");
					}
				})
				.catch(() => {
					alert("Error updating category");
				});
		},
		[newCategoryName, setCategory]
	);

	// Filter category handler
	const filteredCategories = category.filter((cat) => {
		return cat.label.toLowerCase().includes(searchTerm.toLowerCase());
	});

	// Delete category handler
	const handleDelete = useCallback(
		(categoryId: number) => {
			const confirmation = window.confirm(
				"Are you sure you want to delete this category?"
			);
			if (confirmation) {
				const url = `http://localhost:8080/api/categories/${categoryId}`;
				fetch(url, {
					method: "DELETE",
				})
					.then((response) => {
						if (response.ok) {
							// Update the UI with the new category name
							setCategory((prevCategories: CategoryType[]) =>
								prevCategories.filter((cat) => cat.value !== categoryId)
							);
							// Reset editing state
							alert("Deleted category successfully");

							setEditingCategoryId(null);
							setNewCategoryName("");
						} else {
							alert("Failed to delete category");
						}
					})
					.catch(() => {
						alert("Error deleting category");
					});
			}
		},
		[setCategory]
	);

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						<Popover>
							<PopoverTrigger asChild className="mb-5">
								<Button size={"lg"} variant="outline">
									+ Add Category
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<form onSubmit={handleAddCategory}>
									<div className="grid gap-4">
										<div className="grid gap-2">
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">Category Name</Label>
												<Input
													id="name"
													defaultValue="Enter category name"
													value={categoryName}
													onChange={(e) => setCategoryName(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>
										</div>
										{/* Add category */}
										<Button
											size={"lg"}
											variant={"outline"}
											className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2 mt-3">
											Add Category
										</Button>
									</div>
								</form>
							</PopoverContent>
						</Popover>
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by category details..."
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Table>
							<TableCaption>Category List</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Category Id</TableHead>
									<TableHead>Category Name</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredCategories.map((category) => (
									<TableRow key={category.value}>
										<TableCell>{category.value}</TableCell>
										<TableCell>
											{editingCategoryId === category.value ? (
												<Input
													value={newCategoryName}
													onChange={(e) => setNewCategoryName(e.target.value)}
												/>
											) : (
												category.label
											)}
										</TableCell>
										<TableCell>
											<div className="p-2 flex">
												{editingCategoryId === category.value ? (
													<>
														<Button
															onClick={() => handleSaveEdit(category.value)}
															className="mr-2 mb-2 flex hover:bg-gray-700">
															Save
														</Button>

														<Button onClick={() => setEditingCategoryId(null)}>
															Cancel
														</Button>
													</>
												) : (
													<Button
														onClick={() => {
															setEditingCategoryId(category.value);
															setNewCategoryName(category.label);
														}}
														className="mr-2 mb-2 flex hover:bg-gray-700">
														Edit
													</Button>
												)}
												<Button
													size={"lg"}
													variant={"outline"}
													className="hover:bg-gray-200"
													onClick={() => handleDelete(Number(category.value))}>
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
