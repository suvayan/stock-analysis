const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

const Schema = mongoose.Schema;
const UserSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		phone: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		verified: {
			type: Boolean,
			defult: false,
		},
	},
	{
		timestamps: {
			createdAt: "create_date",
			updatedAt: "update_date",
		},
	}
);

UserSchema.pre("save", async function (next) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(this.password, salt);
		this.password = hashPassword;
		this.verified = false;
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.pre("findOneAndUpdate", async function (next) {
	try {
		const { password } = this.getUpdate();
		if (password) {
			const salt = await bcrypt.genSalt(10);
			const hashPassword = await bcrypt.hash(password, salt);
			this._update.password = hashPassword;
		}
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.isValidPassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (err) {
		throw err;
	}
};

UserSchema.methods.isAccountVerified = async function () {
	try {
		return this.verified;
	} catch (err) {
		throw err;
	}
};

const User = mongoose.model("user", UserSchema);
module.exports = User;
