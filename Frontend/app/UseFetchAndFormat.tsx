import { useState, useEffect, useCallback } from "react";

export function useFetchAndFormat(
	url: string,
	formatDataFunc: (data: any) => any
) {
	const [data, setData] = useState([]);
	const [count, setCount] = useState(0);

	const formatData = useCallback(formatDataFunc, [formatDataFunc]);

	useEffect(() => {
		fetch(url)
			.then((response) => response.json())
			.then((fetchedData) => {
				const formattedData = fetchedData.map(formatData);
				setData(formattedData);
				setCount(fetchedData.length);
			});
	}, [url, formatData]);

	return [data, count];
}
