import { Fragment, useEffect, useState, useContext } from "react";
import img from "./logo.png";
import AppContext from "../../context/AppContext";
import style from "./Style.module.css";
import Error from "./Error";
import { otp } from "./validation";
import { Formik, Form, Field } from "formik";
import {
	verifyOTPService,
	verifyAccount,
	resendOTP,
} from "../../network/services";
import { successToastify, errorToastify } from "./toastify";

const Otp = () => {
	const {
		states: { authInfo },
		setStates: { setIsLoggedin },
		handler: { onCloseModal },
	} = useContext(AppContext);
	// const [isBtnClick, setIsBtnClick] = useState(false);
	const [minutes, setMinutes] = useState(3);
	const [seconds, setSeconds] = useState(59);

	const initialValues = {
		otp: "",
	};

	const onSubmit = async (values) => {
		try {
			const {
				opt,
				payload: { email },
			} = authInfo;
			const payload = { ...values, email };
			if (opt === "registration") {
				const otpResponse = await verifyOTPService(payload);
				if (otpResponse.success) {
					const response = await verifyAccount(email);
					if (response.success) {
						setIsLoggedin(true);
						successToastify("Registration Completed Successfully");
						onCloseModal();
					}
				}
			} else {
				const otpResponse = await verifyOTPService(payload);
				if (otpResponse.success) {
					successToastify("Password Updated Successfully");
					onCloseModal();
				}
			}
		} catch (err) {
			errorToastify(err.message);
		}
	};

	const resendOTPHandler = async () => {
		try {
			const {
				opt,
				payload: { email },
			} = authInfo;

			const payload = { email, purpose: opt };

			const response = await resendOTP(payload);
			if (response.success) {
				successToastify(`OTP is send to the emsil ${email}`);
				setMinutes(4);
				setSeconds(59);
			}
		} catch (err) {
			errorToastify(err.message);
		}
	};

	const addZeroBeforeLesserTen = (val) => {
		const str = val >= 10 ? val : `0${val}`;
		return str;
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (seconds > 0) {
				setSeconds((prevState) => prevState - 1);
			}
			if (seconds === 0) {
				if (minutes === 0) {
					clearInterval(interval);
				} else {
					setSeconds(59);
					setMinutes((prevState) => prevState - 1);
				}
			}
		}, 1000);
		return () => {
			clearInterval(interval);
		};
	}, [seconds]);

	return (
		<Fragment>
			<div className={style.imgbox}>
				<img src={img} alt="img" />
			</div>
			<div className={style.title}>Verify OTP</div>
			<Formik
				initialValues={initialValues}
				validationSchema={otp}
				onSubmit={onSubmit}
			>
				{({ errors }) => (
					<Form>
						<div className={style.mb3}>
							<Field
								type="text"
								className={
									errors?.otp
										? style.formcontrolerror
										: style.formcontrol
								}
								name="otp"
								id="otp"
								placeholder="Enter OTP"
							/>
							<Error name="otp" />
						</div>
						<div className={`${style.flexBox} ${style.mb2}`}>
							<div className={style.lebel}>
								Time Remaining:{" "}
								<span
									className={
										minutes === 0 && seconds <= 10
											? `${style.boldText} ${style.lebeldanger}`
											: `${style.boldText}`
									}
								>
									{addZeroBeforeLesserTen(minutes)}:
									{addZeroBeforeLesserTen(seconds)}
								</span>
							</div>
							<button
								type="button"
								className={
									seconds > 0 || minutes > 0
										? `${style.resentBtn}`
										: `${style.resentBtnActive}`
								}
								disabled={seconds > 0 || minutes > 0}
								onClick={resendOTPHandler}
							>
								Resend OTP
							</button>
						</div>
						<div className={style.mb3}>
							<button type="submit" className={style.btn}>
								<span>Continue</span>
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</Fragment>
	);
};

export default Otp;
