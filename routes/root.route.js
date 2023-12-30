const express = require("express");
const root = express.Router();

/*** auth route ***/
const auth = require("./auth.route");
root.use("/auth", auth);

/*** user route ***/
const user = require("./user.route");
root.use("/user", user);

module.exports = root;
