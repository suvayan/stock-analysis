import React, { Component } from "react";
import AppContext from "../../context/AppContext";
import Login from "./Login";
import Registration from "./Registration";
import Email from "./Email";
// import Password from "./Password";
import Otp from "./Otp";

export class Auth extends Component {
	componentDidMount() {
		this.context.setStates.setCurrentAuth("login");
	}
	render() {
		const {
			states: { currentAuth },
		} = this.context;
		let ComponentToRender;

		switch (currentAuth) {
			case "login":
				ComponentToRender = Login;
				break;
			case "email":
				ComponentToRender = Email;
				break;
			case "registration":
				ComponentToRender = Registration;
				break;
			case "otp":
				ComponentToRender = Otp;
				break;
		}

		return <ComponentToRender />;
	}
}

Auth.contextType = AppContext;

export default Auth;
