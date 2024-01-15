import Link from "next/link";

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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const preferences = [
	{
		id: "1",
		preferences: "Auction Registration",
	},
	{
		id: "2",
		preferences: "Bid Confirmation",
	},
	{
		id: "3",
		preferences: "Bid Result Notification",
	},
	{
		id: "4",
		preferences: "Max Bid Confirmation",
	},
	{
		id: "5",
		preferences: "Outbid Notification",
	},
];

export default function Notifications() {
	return (
		<>
			<nav>
				<ul className="flex items-center gap-8 px-12 py-4">
					<Link href={"/Profile/Setting"}>
						<li>DETAILS</li>
					</Link>
					<Link href={"#"}>
						<li>COMMUNICATIONS</li>
					</Link>
					<Link href={"/Profile/Selling/Notifications"}>
						<li>NOTIFICATIONS</li>
					</Link>
				</ul>
			</nav>

			<div className="flex flex-col items-center justify-center py-6 px-10">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[100px]"></TableHead>
							<TableHead></TableHead>
							<TableHead></TableHead>
							<TableHead></TableHead>
							<TableHead></TableHead>
							<TableHead></TableHead>
							<TableHead className="text-right">EMAIL</TableHead>
							<TableHead className="text-right">SMS</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{preferences.map((preference) => (
							<TableRow key={preference.id}>
								<TableCell className="font-medium">
									{preference.preferences}
								</TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell className="text-right">
									<Checkbox></Checkbox>
								</TableCell>
								<TableCell className="text-right">
									{" "}
									<Checkbox></Checkbox>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TableCell colSpan={3}>
								<Button size={"lg"}>Save Notifications</Button>
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</div>
		</>
	);
}
