import * as Yup from "yup";

const phoneRegX = /^[1-9]{1}[0-9]{9}$/;
const otpRegeX = /^[0-9]{6}$/;

export const login = Yup.object({
	email: Yup.string()
		.email("invalid email format")
		.required("email is required"),
	password: Yup.string().required("password is required"),
});

export const email = Yup.object({
	email: Yup.string()
		.email("invalid email format")
		.required("email is required"),
});

export const otp = Yup.object({
	otp: Yup.string()
		.matches(otpRegeX, "invalid otp")
		.required("otp is required"),
});

export const password = Yup.object({
	password: Yup.string()
		.min(8, "password must be 8 characters long")
		.matches(/[0-9]/, "password requires a number")
		.matches(/[a-z]/, "password requires a lowercase letter")
		.matches(/[A-Z]/, "password requires an uppercase letter")
		.matches(/[^\w]/, "password requires a symbol")
		.required("password is required"),
	confirmedPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], 'Must match "password" field value')
		.required("confirmed password is required"),
});

export const registration = Yup.object({
	name: Yup.string()
		.min(3, "name must be 3 characters long")
		.required("name is required"),
	email: Yup.string()
		.email("invalid email format")
		.required("email is required"),
	phone: Yup.string()
		.matches(phoneRegX, "invalid phone number")
		.required("phone is required"),
	password: Yup.string()
		.min(8, "password must be 8 characters long")
		.matches(/[0-9]/, "password requires a number")
		.matches(/[a-z]/, "password requires a lowercase letter")
		.matches(/[A-Z]/, "password requires an uppercase letter")
		.matches(/[^\w]/, "password requires a symbol")
		.required("password is required"),
	confirmedPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], 'Must match "password" field value')
		.required("confirmed password is required"),
});
