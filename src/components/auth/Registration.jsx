import { useContext, Fragment, useState } from "react";
import img from "./logo.png";
import AppContext from "../../context/AppContext";
import style from "./Style.module.css";
import Error from "./Error";
import { registration } from "./validation";
import { Formik, Form, Field } from "formik";
import { registrationService, setAuthToken } from "../../network/services";
const Registration = () => {
	const {
		setStates: { setCurrentAuth, setAuthInfo },
	} = useContext(AppContext);

	const initialValues = {
		name: "",
		email: "",
		phone: "",
		password: "",
		confirmedPassword: "",
	};

	const [isBtnClick, setIsBtnClick] = useState(false);

	const onSubmit = async (value) => {
		setIsBtnClick(true);
		try {
			const response = await registrationService(value);
			if (response.success) {
				localStorage.setItem("token", response.result.token);
				setAuthToken(response.result.token);
				setAuthInfo({ opt: "registration", payload: value });
				setCurrentAuth("otp");
			}
		} catch (err) {
			console.log(err.message);
		} finally {
			// console.log("res");
			setIsBtnClick(false);
		}
	};

	return (
		<Fragment>
			<div className={style.imgbox}>
				<img src={img} alt="logo" />
			</div>
			<div className={style.title}>Create Account</div>
			<Formik
				initialValues={initialValues}
				validationSchema={registration}
				onSubmit={onSubmit}
			>
				{({ errors }) => (
					<Form>
						<div className={style.mb2}>
							<Field
								type="text"
								className={
									errors?.name
										? style.formcontrolerror
										: style.formcontrol
								}
								name="name"
								id="name"
								placeholder="Name"
							/>
							<Error name="name" />
						</div>
						<div className={style.mb2}>
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
						<div className={style.mb2}>
							<Field
								type="text"
								className={
									errors?.phone
										? style.formcontrolerror
										: style.formcontrol
								}
								name="phone"
								id="phone"
								placeholder="Phone"
							/>
							<Error name="phone" />
						</div>
						<div className={style.mb2}>
							<Field
								type="text"
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
						<div className={style.mb2}>
							<Field
								type="text"
								className={
									errors?.confirmedPassword
										? style.formcontrolerror
										: style.formcontrol
								}
								name="confirmedPassword"
								id="confirmedPassword"
								placeholder="Confirmed Password"
							/>
							<Error name="confirmedPassword" />
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
					Have an account ?{" "}
					<span
						className={`${style.lebelinfo} ${style.pointer}`}
						onClick={() => setCurrentAuth("login")}
					>
						Sign in now
					</span>
				</div>
			</div>
		</Fragment>
	);
};

export default Registration;
