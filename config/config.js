const mongoose = require("mongoose");
require("dotenv").config();

const connectDB =
	process.env.NODE_ENV === "local"
		? mongoose.connect(process.env.LOCAL_DB_URI, {
				dbName: process.env.LOCAL_DB_NAME,
		  })
		: mongoose.connect("mongodb://localhost:27017", {
				dbName: "stock_analysis",
		  });

module.exports = connectDB;
