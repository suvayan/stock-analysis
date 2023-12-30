import { useContext, Fragment, useState } from "react";
import img from "./logo.png";
import AppContext from "../../context/AppContext";
import style from "./Style.module.css";
import Error from "./Error";
import { login } from "./validation";
import { Formik, Form, Field } from "formik";
import { loginService, setAuthToken } from "../../network/services";
import secureLocalStorage from "react-secure-storage";

const Login = () => {
	const {
		setStates: { setCurrentAuth, setIsLoggedin, setAuthInfo },
		handler: { onCloseModal },
	} = useContext(AppContext);

	const [isBtnClick, setIsBtnClick] = useState(false);

	const initialValues = {
		email: secureLocalStorage.getItem("email") || "",
		password: secureLocalStorage.getItem("password") || "",
		remember: secureLocalStorage.getItem("remember") || false,
	};

	const onSubmit = async (values) => {
		setIsBtnClick(true);
		try {
			const { email, password, remember } = values;
			if (remember) {
				secureLocalStorage.setItem("email", email);
				secureLocalStorage.setItem("password", password);
				secureLocalStorage.setItem("remember", remember);
			} else {
				secureLocalStorage.removeItem("email");
				secureLocalStorage.removeItem("password");
				secureLocalStorage.removeItem("remember");
			}
			const response = await loginService({ email, password });
			if (response.success) {
				localStorage.setItem("token", response.token);
				setAuthToken(response.token);
				setIsLoggedin(true);
				onCloseModal();
			}
		} catch (err) {
			console.log(err.message);
		} finally {
			setIsBtnClick(false);
		}
	};

	const onClickForgotPassword = () => {
		setCurrentAuth("email");
		setAuthInfo({ opt: "forgotPassword" });
	};

	return (
		<Fragment>
			<div className={style.imgbox}>
				<img src={img} alt="img" />
			</div>
			<div className={style.title}>Welcome Back</div>
			<Formik
				initialValues={initialValues}
				validationSchema={login}
				onSubmit={onSubmit}
			>
				{({ errors }) => (
					<Form>
						<div className={style.mb3}>
							<Field
								type="text"
								className={
									errors?.email
										? style.formcontrolerror
										: style.formcontrol
								}
								name="email"
								id="email"
								placeholder="Email"
							/>
							<Error name="email" />
						</div>
						<div className={style.mb3}>
							<Field
								type="password"
								className={
									errors?.password
										? style.formcontrolerror
										: style.formcontrol
								}
								name="password"
								id="password"
								placeholder="Password"
							/>
							<Error name="password" />
						</div>
						<div className={`${style.flexBox} ${style.mb2}`}>
							<div className={style.checkcontainer}>
								<Field
									type="checkbox"
									id="remember"
									name="remember"
								/>
								<span className={style.lebel}>Remember Me</span>
							</div>
							<div
								className={`${style.lebeldanger} ${style.pointer}`}
								onClick={() => onClickForgotPassword()}
							>
								Forgot Password?
							</div>
						</div>
						<div className={style.mb2}>
							<button type="submit" className={style.btn}>
								{isBtnClick ? (
									<div className={style.btnLoad}>
										<i className="fa fa-spinner fa-spin"></i>
										Loading
									</div>
								) : (
									<span>Continue</span>
								)}
							</button>
						</div>
					</Form>
				)}
			</Formik>
			<div className={style.mb2}>
				<div className={style.txtcenter}>
					Not a member ?{" "}
					<span
						className={`${style.lebelinfo} ${style.pointer}`}
						onClick={() => setCurrentAuth("registration")}
					>
						Sign up now
					</span>
				</div>
				{/* <div className={style.txtcenter}>
					Not a verified ?{" "}
					<span
						className={`${style.lebelinfo} ${style.pointer}`}
						onClick={() => setCurrentAuth("email")}
					>
						verify account
					</span>
				</div> */}
			</div>
		</Fragment>
	);
};

export default Login;
