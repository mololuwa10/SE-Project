"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function RoleRequest() {
	const [roleRequests, setRoleRequests] = useState<Request[]>([]);

	interface Request {
		id: number | string;
		approved: boolean;
		user: {
			userId: number | string;
			firstname: string;
			lastname: string;
		};
	}

	useEffect(() => {
		const fetchRoleRequests = async () => {
			const jwt = localStorage.getItem("jwt");
			if (!jwt) {
				console.error("No JWT token found");
				return;
			}

			try {
				const response = await fetch(
					"http://localhost:8080/api/admin/role-requests",
					{
						headers: {
							Authorization: `Bearer ${jwt}`,
						},
					}
				);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();
				setRoleRequests(data);
				console.log(data);
			} catch (error) {
				console.error("Error fetching role requests:", error);
			}
		};

		fetchRoleRequests();
	}, []);

	const handleApproveRequest = async (userId: any) => {
		const jwt = localStorage.getItem("jwt");
		try {
			const response = await fetch(
				`http://localhost:8080/api/admin/approve-seller/${userId}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${jwt}`,
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			alert("Role Request Approved Sucessfully!!");
			// Updating the roleRequests state to reflect the change
			setRoleRequests((prevRequests: Request[]) =>
				prevRequests.map((request) =>
					request.user.userId === userId
						? { ...request, approved: true }
						: request
				)
			);
		} catch (error) {
			console.error("Error approving request:", error);
		}
	};

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						{/* Filter Textbox Using the Input Component*/}
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by location details..."
							type="text"
							// value={searchTerm}
							// onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Table>
							<TableCaption>Role Request</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>Role Request Id</TableHead>
									<TableHead>Role Approved?</TableHead>
									<TableHead>User ID</TableHead>
									<TableHead>users Name</TableHead>
									<TableHead>Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(roleRequests as Request[]).map((requests) => (
									<TableRow key={requests.id}>
										<TableCell>{requests.id}</TableCell>
										<TableCell>
											{requests.approved ? "Approved" : "Awaiting Response"}
										</TableCell>
										<TableCell>{requests.user.userId}</TableCell>
										<TableCell>
											{requests.user.firstname} {requests.user.lastname}
										</TableCell>

										<TableCell>
											<div className="p-2 flex">
												{requests.approved ? (
													<Button
														size={"lg"}
														className="cursor-pointer"
														// Implement revoke logic
													>
														Revoke Approval
													</Button>
												) : (
													<Button
														size={"lg"}
														className="cursor-pointer"
														onClick={() =>
															handleApproveRequest(requests.user.userId)
														}>
														Approve Request
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						{/* <CustomPagination
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/> */}
					</div>
				</div>
			</div>
		</>
	);
}
