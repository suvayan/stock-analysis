import React from "react";
import { ErrorMessage, getIn } from "formik";
import style from "./Style.module.css";

const Error = (props) => {
	return (
		<ErrorMessage
			name={props.name}
			render={(msg) => <span className={style.reqMsg}>{msg}</span>}
		/>
	);
};

export const fieldError = (errors, fieldName) => {
	if (getIn(errors, fieldName)) {
		return {
			border: "1px solid #bb2d3b",
		};
	}
};

export default Error;
