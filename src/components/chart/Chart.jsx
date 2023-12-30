import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import style from "./Chart.module.css";
import * as api from "../../network/api";
import { candleStickOptions } from "./Constant";
import { stockDataFormat } from "./DataFormatter";
const Chart = () => {
	const [stockData, setStockData] = useState({});
	const { params } = useParams();
	const searchParams = new URLSearchParams(document.location.search);

	const [data, setData] = useState({
		"1y": true,
		"2y": false,
		"3y": false,
	});

	const dataChangeHandler = (e) => {
		const name = e.target.name;
		let obj = {};
		Object.keys(data).map((key) => {
			if (key === name) {
				obj[key] = true;
			} else {
				obj[key] = false;
			}
		});
		setData(obj);
	};

	const getChartData = async (keyword) => {
		try {
			const chartData = await api.getStockChartData(keyword);
			setStockData(chartData);
		} catch (err) {
			throw err;
		}
	};

	const seriesData = useMemo(
		() => stockDataFormat(stockData, data),
		[stockData]
	);

	useEffect(() => {
		getChartData(params);
	}, [data, params]);

	return (
		<div className={style.container}>
			<div className={style.chartwrapper}>
				<ReactApexChart
					series={[
						{
							data: seriesData,
						},
					]}
					options={candleStickOptions}
					type="candlestick"
				/>
			</div>
			<div className={style.panel}>
				<div className={style.info}>
					<h1>{searchParams.get("name")}</h1>
					<h4>{params}</h4>
					<h4>{searchParams.get("region")}</h4>
					<h4>{searchParams.get("type")}</h4>
					<div className={style.flexbox}>
						<h4 className={style.darktxt}>
							{searchParams.get("timezone")}
						</h4>
						<h4 className={style.darktxt}>
							{searchParams.get("marketOpen")}
						</h4>
						<h4 className={style.darktxt}>
							{searchParams.get("marketClose")}
						</h4>
					</div>
					<div className={style.item}>
						<h4 className={style.darktxt}>Stock Data: </h4>
						{Object.entries(data).map(([key, val], i) => (
							<button
								className={val ? style.btnactive : style.btn}
								name={key}
								onClick={dataChangeHandler}
							>
								{key}
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Chart;
