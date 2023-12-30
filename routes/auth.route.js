const express = require("express");
const auth = express.Router();
const controller = require("../controllers/auth.controller");
const {
	signinSchema,
	signupSchema,
	optVerificationSchema,
	isEmailPassSchema,
	updatePassword,
} = require("../utils/validation");

auth.post("/login", signinSchema, controller.login);

auth.post("/registration", signupSchema, controller.registration);

auth.post(
	"/otp-verification",
	optVerificationSchema,
	controller.otpVerification
);

auth.post("/otp-send", isEmailPassSchema, controller.sendOtp);

auth.post(
	"/account-verification",
	isEmailPassSchema,
	controller.accountVerification
);

auth.post("/update-password", updatePassword, controller.updatePassword);

auth.post("/refresh-access-token", controller.refreshAccessToken);

auth.delete("/logout", controller.logout);

module.exports = auth;
