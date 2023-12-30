import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import AppContext from "./context/AppContext";
import { CustomModal as Modal } from "./components/modal/Modal";
import { isAuthenticated, setAuthToken } from "./network/services";
import Auth from "./components/auth/Auth";
import secureLocalStorage from "react-secure-storage";
import PrivateRoute from "./PrivateRoute";
const Home = React.lazy(() => import("./components/home/Home"));
const Layout = React.lazy(() => import("./components/layout/Layout"));
const All = React.lazy(() => import("./components/pages/All"));
const Equity = React.lazy(() => import("./components/pages/Equity"));
const MutualFund = React.lazy(() => import("./components/pages/MutualFund"));
const Etf = React.lazy(() => import("./components/pages/Etf"));
const Chart = React.lazy(() => import("./components/chart/Chart"));

const App = () => {
	const [isLoggedin, setIsLoggedin] = useState(false);
	const [input, setInput] = useState(
		secureLocalStorage.getItem("input") || ""
	);
	const [show, setShow] = useState(false);
	const [isDdl, setIsDdl] = useState(false);
	const [searchResult, setSearchResult] = useState(
		secureLocalStorage.getItem("searchResult") || []
	);
	const [openhModal, setOpenModal] = useState(false);
	const [currentAuth, setCurrentAuth] = useState("login");
	const [authInfo, setAuthInfo] = useState({});

	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname.split("/");

	const onOpenModal = () => setOpenModal(true);
	const onCloseModal = () => setOpenModal(false);

	const searchResultListing = () => {
		try {
			if (input) {
				setIsDdl(false);
				if (location.pathname === "/" || path[1] === "chart") {
					navigate("/all");
				} else {
					navigate(location.pathname);
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	const chartRouteHandler = (d) => {
		try {
			const params = `${d["1. symbol"]}`;
			const query = `?name=${d["2. name"]}&region=${d["4. region"]}&currency=${d["8. currency"]}&type=${d["3. type"]}&timezone=${d["7. timezone"]}&marketOpen=${d["5. marketOpen"]}&marketClose=${d["6. marketClose"]}`;
			setIsDdl(false);
			navigate(`/chart/${params}${query}`);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		const loggedIn = isAuthenticated();
		if (loggedIn) {
			const token = localStorage.getItem("token");
			if (token) {
				setAuthToken(token);
			}
			setIsLoggedin(true);
		} else {
			setIsLoggedin(false);
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				states: {
					input,
					show,
					isDdl,
					searchResult,
					openhModal,
					currentAuth,
					authInfo,
					isLoggedin,
				},
				setStates: {
					setInput,
					setShow,
					setSearchResult,
					setIsDdl,
					setCurrentAuth,
					setAuthInfo,
					setIsLoggedin,
				},
				handler: {
					searchResultListing,
					chartRouteHandler,
					onOpenModal,
					onCloseModal,
				},
			}}
		>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="" element={<Layout />}>
					<Route path="all" element={<All />} />
					<Route path="" element={<PrivateRoute />}>
						<Route path="equity" element={<Equity />} />
						<Route path="mutual-fund" element={<MutualFund />} />
						<Route path="etf" element={<Etf />} />
						<Route path="chart/:params" element={<Chart />} />
					</Route>
				</Route>
			</Routes>
			<Modal>
				<Auth />
			</Modal>
		</AppContext.Provider>
	);
};

export default App;
