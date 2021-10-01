const { createLogger, format, transports } = require("winston");
const { printf, combine, timestamp, colorize } = format;

const devFormat = printf(({ level, message, timestamp }) => `[${timestamp} (${level})]: ${message}`);

const DevelopmentLogger = () => {
    return createLogger({
        level: "debug",
        format: combine(
            colorize(),
            timestamp({ format: "HH:mm:ss" }),
            devFormat
        ),
        transports: [
            new transports.Console(),
            new transports.File({ filename: "error.log", level: "error" }),
            new transports.File({ filename: "combined.log" }),
        ],
    });
};

module.exports = DevelopmentLogger;