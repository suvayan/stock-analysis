import { useContext, useEffect } from "react";
import AppContext from "./context/AppContext";
import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "./network/services";

const PrivateRoute = () => {
	const {
		handler: { onOpenModal },
	} = useContext(AppContext);
	const auth = isAuthenticated();

	useEffect(() => {
		if (!auth) {
			onOpenModal();
		}
	}, []);

	return auth ? <Outlet /> : <Navigate to="/all" />;
};

export default PrivateRoute;
