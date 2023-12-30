import { useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import style from "./Home.module.css";
import Navbar from "../navbar/Navbar";
import SearchBar from "../searchbar/SearchBar";
const Home = () => {
	const {
		setStates: { setInput, setShow, setSearchResult },
	} = useContext(AppContext);

	useEffect(() => {
		setInput("");
		setShow(false);
		setSearchResult([]);
	}, []);
	return (
		<div className={style.container}>
			<Navbar />
			<div className={style.logo}>
				<img src="./assets/img/logo.png" alt="logo" />
			</div>
			<SearchBar />
		</div>
	);
};

export default Home;
