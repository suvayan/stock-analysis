const { createLogger, transports, format } = require("winston");

const logger = createLogger({
	transports: [
		new transports.File({
			filename: "error-logger.log",
			level: "error",
			format: format.combine(format.timestamp(), format.json()),
		}),
		new transports.Console({
			format: format.combine(format.timestamp(), format.json()),
		}),
	],
});

module.exports = logger;
