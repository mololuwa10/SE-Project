"use client";

import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Register() {
	const router = useRouter();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);

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
				const data = await response.json();
				localStorage.setItem("jwt", data.jwt);
				router.push("/"); // redirect to the home page
			} else if (response.status === 400) {
				// handle bad request
				alert("Bad request. Please check your input.");
			} else if (response.status === 409) {
				// handling conflict (e.g., username already exists)
				alert("Conflict. The username already exists.");
			} else {
				// handling other response statuses
				const errorData = await response.json();
				setSubmitError(errorData.message);
			}
		} catch (error) {
			console.error(error);
			// handling error
			setSubmitError(error.message);
			alert("Bad Credentials");
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="flex flex-wrap w-full">
			<div className="flex flex-col w-full md:w-1/2">
				<div className="flex justify-center pt-12 md:justify-start md:pl-12 md:-mb-24">
					<a href="#" className="p-4 text-xl font-bold text-white bg-black">
						FOTHEBY'S.
					</a>
				</div>
				<div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32 mb-[22px]">
					<p className="text-3xl text-center">Register Here.</p>
					<form className="flex flex-col pt-3 md:pt-8">
						{submitting && <p>Submitting...</p>}
						{submitError && <p>Error: {submitError}</p>}
						{submitSuccess && <p>Form submitted successfully!</p>}

						{/* Firstname label */}
						<div className="flex flex-col pt-4">
							<div className="flex relative ">
								<span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-square-user-round">
										<path d="M18 21a6 6 0 0 0-12 0" />
										<circle cx="12" cy="11" r="4" />
										<rect width="18" height="18" x="3" y="3" rx="2" />
									</svg>
								</span>
								<input
									type="text"
									id="firstname"
									className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="Firstname"
									value={firstname}
									onChange={(e) => setFirstname(e.target.value)}
								/>
							</div>
						</div>

						{/* Lastname label */}
						<div className="flex flex-col pt-4">
							<div className="flex relative ">
								<span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-square-user-round">
										<path d="M18 21a6 6 0 0 0-12 0" />
										<circle cx="12" cy="11" r="4" />
										<rect width="18" height="18" x="3" y="3" rx="2" />
									</svg>
								</span>
								<input
									type="text"
									id="lastname"
									className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="Lastname"
									value={lastname}
									onChange={(e) => setLastname(e.target.value)}
								/>
							</div>
						</div>

						{/* Email label */}
						<div className="flex flex-col pt-4">
							<div className="flex relative ">
								<span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										className="lucide lucide-mail">
										<rect width="20" height="16" x="2" y="4" rx="2" />
										<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
									</svg>
								</span>
								<input
									type="text"
									id="email"
									className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="Email"
									value={user_email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								{/* {errors.user_email && <p>{errors.user_email}</p>} */}
							</div>
						</div>

						{/* Username label */}
						<div className="flex flex-col pt-4">
							<div className="flex relative ">
								<span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
									<svg
										width="15"
										height="15"
										fill="currentColor"
										viewBox="0 0 1792 1792"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M1792 710v794q0 66-47 113t-113 47h-1472q-66 0-113-47t-47-113v-794q44 49 101 87 362 246 497 345 57 42 92.5 65.5t94.5 48 110 24.5h2q51 0 110-24.5t94.5-48 92.5-65.5q170-123 498-345 57-39 100-87zm0-294q0 79-49 151t-122 123q-376 261-468 325-10 7-42.5 30.5t-54 38-52 32.5-57.5 27-50 9h-2q-23 0-50-9t-57.5-27-52-32.5-54-38-42.5-30.5q-91-64-262-182.5t-205-142.5q-62-42-117-115.5t-55-136.5q0-78 41.5-130t118.5-52h1472q65 0 112.5 47t47.5 113z"></path>
									</svg>
								</span>
								<input
									type="text"
									id="username"
									className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="Username"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
								/>
							</div>
						</div>

						{/* Password label */}
						<div className="flex flex-col pt-4 mb-12">
							<div className="flex relative ">
								<span className=" inline-flex  items-center px-3 border-t bg-white border-l border-b  border-gray-300 text-gray-500 shadow-sm text-sm">
									<svg
										width="15"
										height="15"
										fill="currentColor"
										viewBox="0 0 1792 1792"
										xmlns="http://www.w3.org/2000/svg">
										<path d="M1376 768q40 0 68 28t28 68v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-320q0-185 131.5-316.5t316.5-131.5 316.5 131.5 131.5 316.5q0 26-19 45t-45 19h-64q-26 0-45-19t-19-45q0-106-75-181t-181-75-181 75-75 181v320h736z"></path>
									</svg>
								</span>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									className=" flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col">
							<div className="flex relative ">
								<input
									type="checkbox"
									id="togglePassword"
									onChange={() => setShowPassword(!showPassword)}
									className="... your styles ..."
								/>
								<label
									htmlFor="password"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
									Show password
								</label>
							</div>
						</div>
						<button
							onClick={handleSubmit}
							// type="submit"
							className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2 mt-3"
							disabled={submitting}>
							<span className="w-full">Submit</span>
						</button>
					</form>
					<div className="pt-12 pb-12 text-center">
						<p>
							Already Have An Account?
							<a href="/signIn" className="font-semibold underline">
								Sign in here.
							</a>
						</p>
					</div>
				</div>
			</div>
			<div className="w-1/2 shadow-2xl">
				<img
					className="hidden object-cover w-full h-screen md:block"
					src="/img/auction1.jpg"
				/>
			</div>
		</div>
	);
}
