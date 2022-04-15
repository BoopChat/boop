const morgan = require("morgan");

let logger = require("./").setup(true);

// Build the morgan middleware
const morganLogger = morgan(
    // Define message format string (this is the default one).
    ":method :url :status :res[content-length] - :response-time ms",
    // Options: overwrite the stream logic.
    {
        // Override the stream method by telling
        // Morgan to use our custom logger instead of the console.log.
        stream: {
            write: (message) => logger.http(message),
        }
    }
);

module.exports = morganLogger;
