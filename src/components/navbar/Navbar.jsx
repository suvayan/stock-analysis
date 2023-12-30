import { useEffect, useContext, useState, useRef } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import AppContext from "../../context/AppContext";
import img from "./logo.png";
import SearchBar from "../searchbar/SearchBar";
import Headroom from "react-headroom";
import { getUserData } from "../../network/services";
import style from "./Navbar.module.css";

const Navbar = () => {
	const {
		states: { isLoggedin },
		setStates: { setIsLoggedin },
		handler: { onOpenModal },
	} = useContext(AppContext);
	const newRef = useRef(null);
	const [isUserBox, setIsUserBox] = useState(false);
	const [userDetail, setUserDetails] = useState({});

	const location = useLocation();
	const navigate = useNavigate();
	const userDetails = async () => {
		try {
			const response = await getUserData();
			if (response.success) {
				const { name, email } = response.result;
				const symbol = name.charAt(0).toUpperCase();
				setUserDetails({ name, email, symbol });
			}
		} catch (err) {
			throw err;
		}
	};
	const logoutHandler = () => {
		localStorage.removeItem("token");
		setIsLoggedin(false);
	};

	const handleOutsideClick = (e) => {
		if (newRef.current && !newRef.current.contains(e.target)) {
			setIsUserBox(false);
		}
	};

	useEffect(() => {
		if (isLoggedin) {
			userDetails();
		}
	}, [isLoggedin]);

	useEffect(() => {
		document.addEventListener("click", handleOutsideClick);
		return () => {
			document.removeEventListener("click", handleOutsideClick);
		};
	}, []);
	return (
		<div
			className={`${style.navcontainer} ${
				location.pathname === "/" && style.containerpadding
			}`}
		>
			<div
				className={`${style.navbar} ${
					location.pathname === "/"
						? style.flexend
						: style.spacebetween
				}`}
			>
				{location.pathname !== "/" && (
					<div
						className={style.navlogo}
						onClick={() => navigate("/")}
					>
						<img src={img} alt="logo" />
					</div>
				)}
				{location.pathname !== "/" && (
					<div className={style.searchbar}>
						<SearchBar />
					</div>
				)}
				{isLoggedin ? (
					<div className={style.userInfo} ref={newRef}>
						{userDetail.symbol && (
							<div
								className={style.user}
								onClick={() => setIsUserBox(true)}
							>
								{userDetail.symbol}
							</div>
						)}
						{isUserBox && (
							<div className={style.userbox}>
								<div className={style.closeusebox}>
									<div
										className={style.close}
										onClick={() => setIsUserBox(false)}
									>
										X
									</div>
								</div>
								<div>
									{userDetail.email && userDetail.email}
								</div>
								{userDetail.symbol && (
									<div className={style.user}>
										{userDetail.symbol}
									</div>
								)}
								<div>
									{userDetail.name &&
										`Hi, ${userDetail.name}`}
								</div>
								<div
									className={style.logoutbox}
									onClick={logoutHandler}
								>
									Sign out
								</div>
							</div>
						)}
					</div>
				) : (
					<div className={style.authbtn} onClick={onOpenModal}>
						<span>Login/Register</span>
					</div>
				)}
			</div>
			{location.pathname !== "/" && (
				<Headroom>
					<div className={style.navlistcontainer}>
						<div className={style.navlist}>
							<NavLink
								className={({ isActive }) =>
									isActive
										? style.navitemactive
										: style.navitem
								}
								to="/all"
							>
								All
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									isActive
										? style.navitemactive
										: style.navitem
								}
								to="/equity"
							>
								Equity
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									isActive
										? style.navitemactive
										: style.navitem
								}
								to="/mutual-fund"
							>
								Mutual Fund
							</NavLink>
							<NavLink
								className={({ isActive }) =>
									isActive
										? style.navitemactive
										: style.navitem
								}
								to="/etf"
							>
								ETF
							</NavLink>
						</div>
					</div>
				</Headroom>
			)}
		</div>
	);
};

export default Navbar;
