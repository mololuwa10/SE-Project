"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { useState, useEffect, useCallback, SetStateAction } from "react";

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function User() {
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [roles, setRoles] = useState([]);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [errors, setErrors] = useState({});
	const [userDetails, setUserDetails] = useState(null);
	const [userRole, setUserRole] = useState<string | null>(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [allUsers, setAllUsers] = useState<any[]>([]);

	function useFetchAndFormat(url: string, formatData: (data: any) => any) {
		const [data, setData] = useState<any[]>([]);

		useEffect(() => {
			fetch(url)
				.then((response) => response.json())
				.then((fetchedData) => {
					if (Array.isArray(fetchedData)) {
						const formattedData = fetchedData.map(formatData);
						setData(formattedData);
					} else {
						const formattedData = [formatData(fetchedData)];
						setData(formattedData);
					}
				});
		}, [url, formatData]);

		return data;
	}

	// Get all user details -------------
	const fetchUserInfo = useCallback(async () => {
		try {
			const jwt = localStorage.getItem("jwt");

			if (!jwt) {
				setIsLoggedIn(false);
				return;
			}

			fetch("http://localhost:8080/api/user/info", {
				headers: { Authorization: "Bearer " + jwt },
			})
				.then((response) => {
					if (!response.ok) {
						setIsLoggedIn(false);
						throw Error(response.statusText);
					}
					return response.json();
				})
				.then((data) => {
					if (data) {
						console.log(data);
						setUserDetails(data);

						// CHECKING IF THE USER LOGGED IN IS AN ADMIN
						const isAdmin = data.authorities.some(
							(authority: { roleId: number; authority: string }) =>
								authority.authority === "ADMIN"
						);

						setUserRole(isAdmin ? "ADMIN" : "USER");
						setIsLoggedIn(true);
					} else {
						setIsLoggedIn(false);
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		} catch (error) {
			console.error("Error:", error);
		}
	}, []);

	const fetchAllUsers = useCallback(async () => {
		const jwt = localStorage.getItem("jwt");
		if (!jwt || userRole !== "ADMIN") {
			return;
		}

		try {
			const response = await fetch("http://localhost:8080/api/admin/allUsers", {
				headers: { Authorization: "Bearer " + jwt },
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const users = await response.json();
			console.log(users);
			setAllUsers(users);
		} catch (error) {
			console.error("Error:", error);
		}
	}, [userRole]);

	useEffect(() => {
		fetchUserInfo();
		fetchAllUsers();
	}, [fetchUserInfo, fetchAllUsers]);
	// -----------------------------------

	// Handling adding of users ---------------
	let formErrors: Record<string, string> = {};

	function validateField(
		fieldName: string | number,
		fieldValue: string,
		errorMessage: string
	) {
		if (!fieldValue.trim()) {
			formErrors[fieldName] = errorMessage;
		}
	}

	const fieldsToValidate = {
		firstname: { value: firstname, message: "First name is required" },
		lastname: { value: lastname, message: "Last name is required" },
		user_email: { value: user_email, message: "Email is required" },
		username: { value: username, message: "Username is required" },
		password: {
			value: password,
			message: "Password must include an uppercase character and a number",
			additionalCheck: () => !/(?=.*[A-Z])(?=.*[0-9])/.test(password),
		},
	};

	const validateForm = () => {
		Object.entries(fieldsToValidate).forEach(
			([fieldName, { value, message, additionalCheck }]) => {
				if (!value.trim() || (additionalCheck && additionalCheck())) {
					formErrors[fieldName] = message;
				}
			}
		);

		// If there are any errors, display them in an alert and return false
		if (Object.keys(formErrors).length > 0) {
			alert(Object.values(formErrors).join("\n"));
			setErrors(formErrors);
			return false;
		}

		// If there are no errors, return true
		return true;
	};

	useEffect(() => {
		if (errors.firstname) {
			alert(errors.firstname);
		}
	}, [errors.firstname]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		setErrors({});

		if (!validateForm()) {
			return;
		}

		setSubmitting(true);
		setSubmitError(null);

		try {
			const response = await fetch("http://localhost:8080/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					firstname,
					lastname,
					user_email,
					username,
					password,
				}),
			});
			if (response.status === 200) {
				setSubmitSuccess(true);
				window.location.reload();
			} else if (response.status === 400) {
				// handle bad request
				alert("Bad request. Please check your input.");
			} else if (response.status === 409) {
				// handle conflict (e.g., username already exists)
				alert("Conflict. The username already exists.");
			} else {
				// handle other response statuses
				const errorData = await response.json();
				setSubmitError(errorData.message);
			}
		} catch (error) {
			console.error(error);
			// handle error
			setSubmitError(error.message);
			alert("Bad Credentials");
		} finally {
			setSubmitting(false);
		}
	};
	// ---------------------------------------

	// Handling Editing of users -------------------
	type UserType = {
		userId: number;
		firstname: string;
		lastname: string;
		username: string;
		email: string;
		authorities?: Array<{ roleId: number; authority: string }>;
	};

	const [editingUserId, setEditingUserId] = useState<number | null>(null);
	const [newUserDetails, setNewUserDetails] = useState<UserType | null>(null);
	const [newFirstname, setNewFirstname] = useState("");
	const [newLastname, setNewLastname] = useState("");
	const [newUsername, setNewUsername] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRole, setNewRoles] = useState("");
	const [newAuthorities, setNewAuthorities] = useState("");

	const startEditingHandler = (user: UserType) => {
		setEditingUserId(user.userId);
		setNewUserDetails(user);
	};

	const stopEditingHandler = () => {
		setEditingUserId(null);
		setNewUserDetails(null);
	};

	const handleUserDetailChange = (field: keyof UserType, value: string) => {
		if (newUserDetails) {
			setNewUserDetails({ ...newUserDetails, [field]: value });
		}
	};

	const handleEditUser = useCallback(
		(userId: number) => {
			const jwtToken = localStorage.getItem("jwt");
			if (!jwtToken) {
				alert("You're not authenticated");
				return;
			}
			// Create a user from form data and send it to server
			const url = `http://localhost:8080/api/admin/updateUser/${userId}`;
			fetch(url, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwtToken}`,
				},
				body: JSON.stringify({
					firstname: newFirstname,
					lastname: newLastname,
					username: newUsername,
					user_email: newEmail,
					password: newPassword,
					authorities: [{ roleId: newRole, authority: newAuthorities }],
				}),
			})
				.then((response) => {
					if (response.ok) {
						// Update the UI with the new category name
						setAllUsers((prevUsers: UserType[]) =>
							prevUsers.map((user) =>
								user.userId === userId
									? {
											...user,
											firstname: newFirstname,
											lastname: newLastname,
											username: newUsername,
											email: newEmail,
											password: newPassword,
											roleId: newRole,
											authorities: newAuthorities,
									  }
									: user
							)
						);
						// Reset editing state
						alert("Updated user successfully");
						// Reload the page
						window.location.reload();
						setEditingUserId(null);
						setNewFirstname("");
						setNewLastname("");
						setNewUsername("");
						setNewEmail("");
						setNewPassword("");
						setNewRoles("");
						setNewAuthorities("");
					} else {
						alert("Failed to update user");
					}
				})
				.catch(() => {
					alert("Error updating user");
				});
		},
		[
			newFirstname,
			newLastname,
			newUsername,
			newEmail,
			newPassword,
			newRole,
			newAuthorities,
		]
	);

	// Handling filtering of Users
	const [searchTerm, setSearchTerm] = useState("");
	const filteredUsers = allUsers.filter((user) => {
		return (
			user.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.authorities.some((auth: { authority: string }) =>
				auth.authority.toLowerCase().includes(searchTerm.toLowerCase())
			)
		);
	});

	// States for pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage, setUsersPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	// Calculating pages
	useEffect(() => {
		if (allUsers && usersPerPage) {
			setTotalPages(Math.ceil(allUsers.length / usersPerPage));
		}
	}, [allUsers, usersPerPage]);

	// Handling Page Change --------------------------
	const handlePageChange = (pageNumber: SetStateAction<number>) => {
		setCurrentPage(pageNumber);
	};

	// Displaying currrent page of users
	const indexOfLastUser = currentPage * usersPerPage;
	const indexOfFirstUser = indexOfLastUser - usersPerPage;
	const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

	// Pagination Component
	const PaginationComponent = () => {
		return (
			<Pagination className="mt-5">
				<PaginationContent>
					<PaginationPrevious
						className="cursor-pointer"
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
					/>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<PaginationItem key={page}>
							<PaginationLink
								className="cursor-pointer"
								onClick={() => setCurrentPage(page)}
								isActive={currentPage === page}>
								{page}
							</PaginationLink>
						</PaginationItem>
					))}
					<PaginationNext
						className="cursor-pointer"
						onClick={() =>
							setCurrentPage(Math.min(totalPages, currentPage + 1))
						}
					/>
				</PaginationContent>
			</Pagination>
		);
	};

	return (
		<>
			<div className="h-screen pt-2 pb-24 pl-2 pr-2 overflow-auto md:pt-0 md:pr-0 md:pl-0">
				<div className="mb-4 w-[100%]">
					<div className="w-full p-4 bg-white shadow-lg rounded-2xl dark:bg-gray-700">
						<Popover>
							<PopoverTrigger asChild className="mb-5">
								<Button size={"lg"} variant="outline">
									+ Add User
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-80">
								<form>
									{submitting && <p>Submitting...</p>}
									{submitError && <p>Error: {submitError}</p>}
									{submitSuccess && <p>Form submitted successfully!</p>}
									<div className="grid gap-4">
										<div className="grid gap-2">
											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">User firstname</Label>
												<Input
													id="firstname"
													defaultValue="Enter user firstname"
													value={firstname}
													onChange={(e) => setFirstname(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>

											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">User lastname</Label>
												<Input
													id="lastname"
													defaultValue="Enter user lastname"
													value={lastname}
													onChange={(e) => setLastname(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>

											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">Username</Label>
												<Input
													id="username"
													defaultValue="Enter username"
													value={username}
													onChange={(e) => setUsername(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>

											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">User email</Label>
												<Input
													id="email"
													defaultValue="Enter user email"
													value={user_email}
													onChange={(e) => setEmail(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>

											<div className="grid grid-cols-3 items-center gap-4">
												<Label htmlFor="name">User password</Label>
												<Input
													id="password"
													type="password"
													defaultValue="Enter user password"
													value={password}
													onChange={(e) => setPassword(e.target.value)}
													className="col-span-2 h-8"
												/>
											</div>
										</div>
										{/* Add user */}
										<button
											onClick={handleSubmit}
											disabled={submitting}
											className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2 mt-3">
											Add User
										</button>
									</div>
								</form>
							</PopoverContent>
						</Popover>

						{/* Filter Textbox Using the Input Component*/}
						<Input
							className="mb-5 w-64 rounded border border-black"
							placeholder="Filter by user details..."
							type="text"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<Table>
							<TableCaption>User List</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>User Id</TableHead>
									<TableHead>User Firstname</TableHead>
									<TableHead>User Lastname</TableHead>
									<TableHead>Username</TableHead>
									<TableHead>User email</TableHead>
									<TableHead>Role Id</TableHead>
									<TableHead>User Authorities</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{currentUsers.map((user) => (
									<TableRow key={user.userId}>
										<TableCell>{user.userId}</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newFirstname}
													onChange={(e) => setNewFirstname(e.target.value)}
												/>
											) : (
												user.firstname
											)}
										</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newLastname}
													onChange={(e) => setNewLastname(e.target.value)}
												/>
											) : (
												user.lastname
											)}
										</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newUsername}
													onChange={(e) => setUsername(e.target.value)}
												/>
											) : (
												user.username
											)}
										</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newEmail}
													onChange={(e) => setEmail(e.target.value)}
												/>
											) : (
												user.user_email
											)}
										</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newRole}
													onChange={(e) => setNewRoles(e.target.value)}
												/>
											) : (
												user.authorities
													.map((a: { authority: any }) => a.roleId)
													.join(", ")
											)}
										</TableCell>
										<TableCell>
											{editingUserId === user.userId ? (
												<Input
													value={newAuthorities}
													onChange={(e) => setNewAuthorities(e.target.value)}
												/>
											) : (
												user.authorities
													.map((a: { authority: any }) => a.authority)
													.join(", ")
											)}
										</TableCell>
										<TableCell>
											<div className="p-2 flex">
												{editingUserId === user.userId ? (
													<>
														<Button
															className="mr-2"
															onClick={() => handleEditUser(user.userId)}>
															Save
														</Button>
														<Button onClick={() => setEditingUserId(null)}>
															Cancel
														</Button>
													</>
												) : (
													<Button
														className="mr-4"
														onClick={() => {
															setEditingUserId(user.userId);
															setNewFirstname(user.firstname);
															setNewLastname(user.lastname);
															setNewUsername(user.username);
															setNewEmail(user.user_email);
															setNewPassword("");
															setNewRoles(
																user.authorities
																	.map((a: { authority: any }) => a.roleId)
																	.join(", ")
															);
															setNewAuthorities(
																user.authorities
																	.map((a: { authority: any }) => a.authority)
																	.join(", ")
															);
														}}>
														Edit
													</Button>
												)}
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
						<PaginationComponent />
					</div>
				</div>
			</div>
		</>
	);
}
