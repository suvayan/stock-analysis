import { useContext, useCallback, useEffect, useRef } from "react";
import AppContext from "../../context/AppContext";
import style from "./SearchBar.module.css";
import { FaSearch, FaTimesCircle } from "react-icons/fa";
import * as api from "../../network/api";
import secureLocalStorage from "react-secure-storage";

const SearchBar = () => {
	const {
		states: { input, show, isDdl, searchResult },
		setStates: { setInput, setShow, setSearchResult, setIsDdl },
		handler: { searchResultListing, chartRouteHandler },
	} = useContext(AppContext);

	const newRef = useRef(null);

	const debounce = (func) => {
		let timer;
		return function (...args) {
			const context = this;
			if (timer) clearTimeout(timer);
			timer = setTimeout(() => {
				timer = null;
				func.apply(context, args);
			}, 300);
		};
	};

	const searchHandlet = async (value) => {
		try {
			if (value) {
				const list = await api.tickerSearch(value);
				if (list && list.bestMatches && list.bestMatches.length > 0) {
					secureLocalStorage.removeItem("input");
					secureLocalStorage.removeItem("searchResult");
					secureLocalStorage.setItem("input", value);
					secureLocalStorage.setItem(
						"searchResult",
						list.bestMatches
					);
					setSearchResult(list.bestMatches); //
					setIsDdl(true);
				} else {
					setSearchResult([]);
					setIsDdl(false);
				}
			} else {
				setSearchResult([]);
				setIsDdl(false);
			}
		} catch (err) {
			console.log(err.stack);
		}
	};

	const optimizedFn = useCallback(debounce(searchHandlet), []);

	const changeHandler = (e) => {
		setInput(e.target.value);

		optimizedFn(e.target.value);
		if (input) {
			setShow(true);
		} else {
			setShow(false);
		}
	};

	const searchhandler = (e) => {
		if (e.key === "Enter") {
			searchResultListing();
		}
	};

	const handleOutsideClick = (e) => {
		if (newRef.current && !newRef.current.contains(e.target)) {
			setIsDdl(false);
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	});

	return (
		<div className={style.container}>
			<div className={style.inputWraper}>
				<input
					className={style.searchInput}
					placeholder="What are you looking for today?"
					value={input}
					onChange={changeHandler}
					onKeyUp={(e) => searchhandler(e)}
					onFocus={() => setIsDdl(true)}
				/>
				<div className={style.iconBox}>
					{show && (
						<FaTimesCircle
							className={style.iconPointer}
							onClick={() => setInput("")}
						/>
					)}
					<FaSearch
						className={style.iconPointer}
						onClick={searchResultListing}
					/>
				</div>
			</div>
			<div ref={newRef}>
				{isDdl && searchResult && searchResult.length > 0 && (
					<div className={style.listing}>
						{searchResult.map((d, i) => (
							<div
								className={style.listItem}
								key={`ticker${i}`}
								onClick={() => chartRouteHandler(d)}
							>
								<span>{d["2. name"]}</span>
							</div>
						))}
					</div>
				)}
			</div>
			{/* {path[1] === "chart" && (
				
			)} */}
		</div>
	);
};

export default SearchBar;
