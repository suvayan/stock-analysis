import axios from "axios";
// 68JSR111MICFWYZM, 8R7NDOVLOF8H02MM
export const tickerSearch = async (keyword) => {
	try {
		const { data } = await axios.get(
			`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=demo`
		);
		return data;
	} catch (err) {
		throw err;
	}
};

export const getStockChartData = async (keyword) => {
	try {
		let url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${keyword}&apikey=demo`;
		const { data } = await axios.get(url);
		return data;
	} catch (err) {
		throw err;
	}
};
