const createError = require("http-errors");
const otpGenerator = require("otp-generator");
const User = require("../models/User.model");
const OTP = require("../models/Otp.model");
const RefreshToken = require("../models/Token.model");
const { myValidationResult } = require("../utils/validation");
const { matchedData } = require("express-validator");
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require("../utils/jwt");

module.exports.registration = async (req, res, next) => {
	try {
		const errors = myValidationResult(req).array();
		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { name, email, phone, password } = matchedData(req);

		const isEmail = await User.findOne({ email: email });
		if (isEmail) {
			throw createError.Conflict(`${email} is already exist`);
		}
		const isPhone = await User.findOne({ phone: phone });
		if (isPhone) {
			throw createError.Conflict(`${phone} is already exist`);
		}

		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const otpBody = await OTP.create({
			email: email,
			otp: otp,
			purpose: "Sign Up",
		});

		const user = new User({ name, email, phone, password });
		const save = await user.save();
		const accessToken = await signAccessToken(save.id);

		res.status(201).json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `OTP is send to the email ${email}`,
			result: {
				token: accessToken,
				user: save,
				otp: otpBody,
			},
		});
	} catch (err) {
		next(err);
	}
};

module.exports.otpVerification = async (req, res, next) => {
	try {
		// console.log(req.body);
		const errors = myValidationResult(req).array();
		// console.log(errors);

		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { email, otp } = matchedData(req);
		const response = await OTP.find({ email })
			.sort({ createdAt: -1 })
			.limit(1);

		if (response.length === 0) {
			throw createError.Unauthorized(`otp is expired`);
		} else if (otp !== response[0].otp) {
			throw createError.Unauthorized(`otp not matched`);
		} else {
			res.status(202).json({
				url: req.originalUrl,
				status: 202,
				success: true,
				message: `OTP is accepted`,
			});
		}
	} catch (err) {
		next(err);
	}
};

module.exports.sendOtp = async (req, res, next) => {
	try {
		const errors = myValidationResult(req).array();
		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { email } = matchedData(req);

		const isEmail = await User.findOne({ email: email });
		if (!isEmail) {
			throw createError.NotImplemented(`${email} is not exist`);
		}

		let otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});

		const otpBody = await OTP.create({
			email: email,
			otp: otp,
			purpose: req.purpose,
		});

		res.status(201).json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `OTP is send to the emsil ${email}`,
			result: otpBody,
		});
	} catch (err) {
		next(err);
	}
};

module.exports.accountVerification = async (req, res, next) => {
	try {
		const errors = myValidationResult(req).array();
		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { email } = matchedData(req);
		const isEmail = await User.findOne({ email: email });
		if (!isEmail) {
			throw createError.NotImplemented(`${email} is not exist`);
		}
		const response = await User.findOneAndUpdate(
			{ email: email },
			{ verified: true },
			{
				new: true,
			}
		);
		res.json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `now you are authorized for login`,
			result: response,
		});
	} catch (err) {
		next(err);
	}
};

module.exports.updatePassword = async (req, res, next) => {
	try {
		const errors = myValidationResult(req).array();
		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { email, password } = matchedData(req);
		const response = await User.findOneAndUpdate(
			{ email: email },
			{ password: password },
			{
				new: true,
			}
		);
		res.json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `password is updated successfully `,
			result: response,
		});
	} catch (err) {
		next(err);
	}
};

module.exports.login = async (req, res, next) => {
	try {
		const errors = myValidationResult(req).array();
		if (errors && errors.length) {
			throw createError.Forbidden(errors);
		}

		const { email, password } = matchedData(req);

		const user = await User.findOne({ email: email });

		if (!user) {
			throw createError.NotFound("user not registered");
		}
		const isMatched = await user.isValidPassword(password);
		if (!isMatched) {
			throw createError.Unauthorized("password not matched");
		}
		const isVerified = await user.isAccountVerified();
		if (!isVerified) {
			throw createError.Unauthorized("account is not verified");
		}
		const accessToken = await signAccessToken(user.id);

		res.status(201).json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `now you are logged in`,
			token: accessToken,
		});
	} catch (err) {
		next(err);
	}
};

module.exports.refreshAccessToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			throw createError.BadRequest();
		}
		const userId = await verifyRefreshToken(refreshToken);
		const access_token = await signAccessToken(userId);
		res.json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: `access token`,
			access_token: access_token,
		});
	} catch (err) {
		next(err);
	}
};

module.exports.logout = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			throw createError.BadRequest();
		}
		const userId = await verifyRefreshToken(refreshToken);
		const responce = RefreshToken.deleteOne({ userId: userId });
		if (!responce) {
			throw createError.HttpError();
		}
		res.json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: "logout",
		});
	} catch (err) {
		next(err);
	}
};
