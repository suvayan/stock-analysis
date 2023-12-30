const mongoose = require("mongoose");

const { otpMailSender } = require("../utils/mailSender");

const Schema = mongoose.Schema;
const OtpSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

OtpSchema.pre("save", async function (next) {
	try {
		console.log(this.isNew);
		if (this.isNew) {
			await otpMailSender(this.email, this.otp, this.purpose);
		}
		next();
	} catch (err) {
		next(err);
	}
});

const OTP = mongoose.model("otp", OtpSchema);
module.exports = OTP;
