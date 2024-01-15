import { Button } from "./ui/button";

interface AddAuctionFormProps {
	onSubmit: (auction: {
		auctionName: string /* ... other form fields */;
	}) => void;
}

const AddAuctionForm = ({ onSubmit }) => {
	// State for form fields
	const [auctionName, setAuctionName] = useState("");
	// ... other form states

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ auctionName /* ... other form fields */ });
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label
					htmlFor="auctionName"
					className="block text-sm font-medium text-gray-700">
					Auction Name
				</label>
				<input
					type="text"
					id="auctionName"
					value={auctionName}
					onChange={(e) => setAuctionName(e.target.value)}
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
					placeholder="Enter auction name"
				/>
			</div>
			{/* Add other form fields here */}
			<div>
				<Button type="submit">Add Auction</Button>
			</div>
		</form>
	);
};
