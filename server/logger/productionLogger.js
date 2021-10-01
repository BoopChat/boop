const { createLogger, format, transports } = require("winston");
const { printf, combine, timestamp } = format;

const prodFormat = printf(({ level, message, timestamp }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`);

const ProductionLogger = () => {
    return createLogger({
        level: "http",
        format: combine(timestamp(), prodFormat),
        transports: [
            new transports.File({ filename: "error.log", level: "error" }),
            new transports.File({ filename: "combined.log" }),
        ],
    });
};

module.exports = ProductionLogger;