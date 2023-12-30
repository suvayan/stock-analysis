import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import Loader from "./components/loader/Loader";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<BrowserRouter>
		<Suspense fallback={<Loader />}>
			<App />
		</Suspense>
	</BrowserRouter>
);
