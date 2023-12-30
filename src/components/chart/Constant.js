export const candleStickOptions = {
	chart: {
		type: "candlestick",
		height: 200,
		zoom: {
			enabled: true,
			type: "x",
			resetIcon: {
				offsetX: -10,
				offsetY: 0,
				fillColor: "#fff",
				strokeColor: "#37474F",
			},
			selection: {
				background: "#90CAF9",
				border: "#0D47A1",
			},
		},
	},
	title: {
		align: "left",
	},
	xaxis: {
		type: "datetime",
	},
	yaxis: {
		tooltip: {
			enabled: true,
		},
	},
};
