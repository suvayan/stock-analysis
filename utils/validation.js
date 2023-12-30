const { body, param, query, validationResult } = require("express-validator");

module.exports.myValidationResult = validationResult.withDefaults({
	formatter: (error) => {
		return { [error.path]: error.msg };
	},
});

module.exports.signupSchema = [
	body("name")
		.exists({ checkFalsy: true })
		.withMessage("you must type name")
		.isLength({ min: 3 })
		.withMessage("name must have minimum three characters"),
	body("email")
		.exists({ checkFalsy: true })
		.withMessage("you must type email")
		.isEmail()
		.withMessage("invalid email"),
	body("phone")
		.exists({ checkFalsy: true })
		.withMessage("you must type phone")
		.matches(/^[0-9]{10}$/)
		.withMessage("invalid phone"),
	body("password")
		.exists({ checkFalsy: true })
		.withMessage("you must type a password")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		)
		.withMessage(
			"Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
		),
	body("confirmedPassword")
		.exists({ checkFalsy: true })
		.withMessage("you must type a confirmation password")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("the passwords do not match"),
];

module.exports.optVerificationSchema = [
	body("otp")
		.exists({ checkFalsy: true })
		.withMessage("you must type otp")
		.isLength({ min: 6 })
		.withMessage("otp must have six characters"),
	body("email")
		.exists({ checkFalsy: true })
		.withMessage("you must type email"),
];

module.exports.isEmailPassSchema = [
	body("email")
		.exists({ checkFalsy: true })
		.withMessage("you must type email")
		.isEmail()
		.withMessage("invalid email"),
];

module.exports.updatePassword = [
	body("email")
		.exists({ checkFalsy: true })
		.withMessage("you must type email")
		.isEmail()
		.withMessage("invalid email"),
	body("password")
		.exists({ checkFalsy: true })
		.withMessage("you must type a password")
		.matches(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		)
		.withMessage(
			"Password must have minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
		),
	body("confirmedPassword")
		.exists({ checkFalsy: true })
		.withMessage("you must type a confirmation password")
		.custom((value, { req }) => value === req.body.password)
		.withMessage("the passwords do not match"),
];

module.exports.signinSchema = [
	body("email")
		.exists({ checkFalsy: true })
		.withMessage("you must type email")
		.isEmail()
		.withMessage("invalid email"),
	body("password")
		.exists({ checkFalsy: true })
		.withMessage("you must type password"),
];
