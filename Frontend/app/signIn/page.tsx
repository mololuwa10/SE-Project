"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignIn() {
	const router = useRouter();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [user_email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const response = await fetch("http://localhost:8080/api/auth/login", {
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
				const data = await response.json();
				localStorage.setItem("jwt", data.jwt);
				alert("User Successfully Logged In");
				// console.log(data.jwt);
				localStorage.setItem("firstname", data.user.firstname);
				localStorage.setItem("lastname", lastname);
				localStorage.setItem("user_email", user_email);
				localStorage.setItem("username", username);
				router.push("/"); // redirect to the home page
			}
		} catch (error) {
			console.error(error);
			// handle error
			alert("Bad Credentials");
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
				<div className="flex flex-col justify-center px-8 pt-8 my-auto md:justify-start md:pt-0 md:px-24 lg:px-32">
					<p className="text-3xl text-center">Welcome. Sign In</p>
					<form className="flex flex-col pt-3 md:pt-8">
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
						<div className="flex flex-col mb-4">
							<div className="flex relative">
								<input
									type="checkbox"
									id="togglePassword"
									onChange={() => setShowPassword(!showPassword)}
									className="... your styles ..."
								/>
								<label
									htmlFor="password"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ml-3">
									Show password
								</label>
							</div>
						</div>
						<button
							onClick={handleSubmit}
							// type="submit"
							className="w-full px-4 py-2 text-base font-semibold text-center text-white transition duration-200 ease-in bg-black shadow-md hover:text-black hover:bg-white focus:outline-none focus:ring-2">
							<span className="w-full">Submit</span>
						</button>
					</form>
					<div className="pt-12 pb-12 text-center">
						<p>
							Don&#x27;t have an account?
							<Link href="/Register" className="font-semibold underline">
								Register here.
							</Link>
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
