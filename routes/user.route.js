const express = require("express");
const user = express.Router();
const { verifyAccessToken } = require("../utils/jwt");
const controller = require("../controllers/user.controller");

user.get("/details", verifyAccessToken, controller.getUserDetails);
module.exports = user;
