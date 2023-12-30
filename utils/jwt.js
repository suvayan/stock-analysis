const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const RefreshToken = require("../models/Token.model");
require("dotenv").config();

module.exports.signAccessToken = (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			userId,
		};
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const option = {
			expiresIn: "30 days",
			issuer: `${new Date()}`,
			audience: userId,
		};
		JWT.sign(payload, secret, option, (err, token) => {
			if (err) {
				reject(createError.InternalServerError());
			}
			resolve(token);
		});
	});
};

module.exports.verifyAccessToken = (req, res, next) => {
	if (!req.headers["authorization"]) {
		throw createError.Unauthorized();
	}
	const authHeader = req.headers["authorization"];
	const bearerToken = authHeader.split(" ");
	const token = bearerToken[1];
	JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		if (err) {
			if (err.name === "JsonWebTokenError") {
				throw createError.Unauthorized();
			} else {
				throw createError.Unauthorized(err.message);
			}
		}
		req.payload = payload;
		next();
	});
};

module.exports.signRefreshToken = (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			userId,
		};
		const secret = process.env.REFRESH_TOKEN_SECRET;
		const option = {
			expiresIn: "30 days",
			issuer: `${new Date()}`,
			audience: userId,
		};
		JWT.sign(payload, secret, option, (err, token) => {
			if (err) {
				reject(createError.InternalServerError());
			}
			const query = RefreshToken.create({ userId: userId, token: token });
			query
				.then((res) => {
					console.log(res);
					resolve(token);
				})
				.catch((err) => {
					console.log(err.message);
					reject(createError.InternalServerError());
					return;
				});
		});
	});
};

module.exports.verifyRefreshToken = (refreshToken) => {
	return new Promise((resolve, reject) => {
		JWT.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET,
			(err, payload) => {
				if (err) {
					return reject(createError.Unauthorized());
				}
				const userId = payload.userId;
				const query = RefreshToken.findOne({ userId: userId });
				query
					.then((res) => {
						if (!res) {
							return reject(
								createError.Unauthorized(
									"refresh token is expired"
								)
							);
						} else {
							if (res.token === refreshToken) {
								resolve(userId);
							} else {
								return reject(createError.Unauthorized());
							}
						}
					})
					.catch((err) => {
						console.log(err.message);
						reject(createError.InternalServerError());
						return;
					});
			}
		);
	});
};
