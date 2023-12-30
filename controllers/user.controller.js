const createError = require("http-errors");
const User = require("../models/User.model");

module.exports.getUserDetails = async (req, res, next) => {
	try {
		const userId = req.payload.userId;
		console.log(req.payload);
		const user = await User.findOne({ _id: userId });
		res.json({
			url: req.originalUrl,
			status: 201,
			success: true,
			message: ``,
			result: user,
		});
	} catch (err) {
		next(err);
	}
};
