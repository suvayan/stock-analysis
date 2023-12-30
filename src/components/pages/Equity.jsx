import React, { useContext, useState, useEffect } from "react";
import style from "./Pages.module.css";
import AppContext from "../../context/AppContext";
import TickerCard from "../tickercard/TickerCard";

const Equity = () => {
	const {
		states: { searchResult },
	} = useContext(AppContext);

	const [list, setList] = useState([]);

	useEffect(() => {
		if (searchResult && searchResult.length) {
			let result = searchResult.filter((d) => d["3. type"] === "Equity");
			setList(result);
		}
	}, [searchResult]);
	return (
		<div className={style.container}>
			<div className={style.lists}>
				{list &&
					list.length > 0 &&
					list.map((d, i) => (
						<TickerCard key={`tickercard${i}`} data={d} />
					))}
			</div>
		</div>
	);
};

export default Equity;
