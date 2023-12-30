export const stockDataFormat = (stockData, data) => {
	const formattedData = [];
	const year = new Date().getFullYear();
	const month = new Date().getMonth() + 1;
	const date = new Date().getDate();

	if (stockData["Monthly Adjusted Time Series"]) {
		Object.entries(stockData["Monthly Adjusted Time Series"]).map(
			([key, value]) => {
				if (data["1y"]) {
					if (key.includes(year) || key.includes(year - 1)) {
						formattedData.push({
							x: new Date(key),
							y: [
								value["1. open"],
								value["2. high"],
								value["3. low"],
								value["4. close"],
							],
						});
					}
				} else if (data["2y"]) {
					if (
						key.includes(year) ||
						key.includes(year - 1) ||
						key.includes(year - 2)
					) {
						formattedData.push({
							x: new Date(key),
							y: [
								value["1. open"],
								value["2. high"],
								value["3. low"],
								value["4. close"],
							],
						});
					}
				} else {
					if (
						key.includes(year) ||
						key.includes(year - 1) ||
						key.includes(year - 2) ||
						key.includes(year - 3)
					) {
						formattedData.push({
							x: new Date(key),
							y: [
								value["1. open"],
								value["2. high"],
								value["3. low"],
								value["4. close"],
							],
						});
					}
				}
			}
		);
	}

	return formattedData;
};
