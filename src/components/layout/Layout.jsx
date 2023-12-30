import style from "./Layout.module.css";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";
const Layout = () => {
	return (
		<div className={style.container}>
			<Navbar />
			<Outlet />
		</div>
	);
};

export default Layout;
