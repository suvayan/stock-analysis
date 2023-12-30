import { useContext, Fragment, useState } from "react";
import img from "./logo.png";
import AppContext from "../../context/AppContext";
import style from "./Style.module.css";
import Error from "./Error";
import { email } from "./validation";
import { Formik, Form, Field } from "formik";
import { resendOTP } from "../../network/services";
import { successToastify, errorToastify } from "./toastify";

const Email = () => {
	const {
		states: { authInfo },
		setStates: { setCurrentAuth, setAuthInfo },
	} = useContext(AppContext);
	const initialValues = { email: "" };
	const [isBtnClick, setIsBtnClick] = useState(false);

	const onSubmit = async (values) => {
		setIsBtnClick(true);
		try {
			const { opt } = authInfo;
			const payload = { ...values, purpose: opt };
			const response = await resendOTP(payload);
			if (response.success) {
				setAuthInfo((prevState) => ({
					...prevState,
					payload: { ...values },
				}));
				if (opt === "forgotPassword") {
					setCurrentAuth("password");
				} else {
					setCurrentAuth("otp");
				}
			}
		} catch (err) {
			errorToastify(err.message);
		} finally {
			setIsBtnClick(false);
		}
	};

	return (
		<Fragment>
			<div className={style.imgbox}>
				<img src={img} alt="logo" />
			</div>
			<div className={style.title}>Continue With Email</div>
			<Formik
				initialValues={initialValues}
				validationSchema={email}
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
		</Fragment>
	);
};

export default Email;
