const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

require("dotenv").config();

let transporter = nodemailer.createTransport({
	service: process.env.MAIL_SERVICE,
	host: process.env.MAIL_HOST,
	auth: {
		user: process.env.MAIL_USER,
		pass: process.env.MAIL_PASS,
	},
});

const handlebarOptions = {
	viewEngine: {
		extName: ".html",
		partialsDir: "./templates",
		defaultLayout: false,
	},
	viewPath: "./templates",
	extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

module.exports.otpMailSender = async (email, otp, purpose) => {
	const mailOptions = {
		from: "suvayan.eije.258@gmail.com",
		to: email,
		subject: `One-time password (OTP) systems provide for ${purpose}`,
		template: "otp",
		context: {
			purpose: purpose,
			otp: otp,
		},
	};

	let info = await transporter.sendMail(mailOptions);
	return info;
};
