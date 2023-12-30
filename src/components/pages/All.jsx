import React, { useContext, useState, useEffect } from "react";
import style from "./Pages.module.css";
import AppContext from "../../context/AppContext";
import TickerCard from "../tickercard/TickerCard";
import * as api from "../../network/api";

const All = () => {
	const {
		states: { input, searchResult },
		setStates: { setSearchResult },
	} = useContext(AppContext);

	const [list, setList] = useState([]);

	const fetchSearchList = async (value) => {
		try {
			const list = await api.tickerSearch(value);
			if (list && list.bestMatches && list.bestMatches.length > 0) {
				setSearchResult(list.bestMatches);
				setList(list.bestMatches);
			}
		} catch (err) {
			throw err;
		}
	};

	useEffect(() => {
		if (searchResult.length === 0) {
			fetchSearchList(input);
		} else {
			setList(searchResult);
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

export default All;
