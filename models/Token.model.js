const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 60 * 24 * 30, // The document will be automatically deleted after 30 days of its creation time
	},
});

const RefreshToken = mongoose.model("token", TokenSchema);
module.exports = RefreshToken;
