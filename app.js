const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");
const cluster = require("cluster");
const os = require("os");
const connectDB = require("./config/config");
const route = require("./routes/root.route");
const logger = require("./utils/logger");
require("dotenv").config();

connectDB
	.then(() => {
		logger.log(`info`, `mongodb connected successfully`);
	})
	.catch((err) => {
		logger.log(`error`, err.message);
	});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.use(express.static(`${__dirname}/public`));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Accept, Authorization"
	);
	res.header("Access-Control-Allow-Methods", "GET,POST,DELETE");
	next();
});

app.get("/", (req, res) => {
	res.json({
		author: "EY",
		purpose: "Backend",
		name: "Rest API",
	});
});

app.use("/api/v1", route);

app.use(async (req, res, next) => {
	next(createError.NotFound("This route doesnot exist"));
});

app.use(async (err, req, res, next) => {
	res.status(err.status || 5000);
	logger.log(`error`, {
		url: req.originalUrl,
		status: err.status,
		success: false,
		message: err.message,
	});
	res.status(err.status).json({
		url: req.originalUrl,
		status: err.status,
		success: false,
		message: err.message,
	});
});

const PORT = process.env.PORT || 8000;

require("http")
	.createServer(app)
	.listen(PORT, () => console.log(`http://localhost:${process.env.PORT}`));

/*** number of core in cpu ***/
/*
const numCpu = os.cpus().length;

if (cluster.isMaster) {
	for (let i = 0; i < numCpu; i++) {
		cluster.fork();
	}
	cluster.on("exit", () => {
		cluster.fork();
	});
} else {
	if (process.env.NODE_ENV === "PRODUCTION") {
		require("https")
			.createServer(app)
			.listen(PORT, () =>
				console.log(`https://localhost:${process.env.PORT}`)
			);
	} else {
		require("http")
			.createServer(app)
			.listen(PORT, () =>
				console.log(`http://localhost:${process.env.PORT}`)
			);
	}
}
*/
