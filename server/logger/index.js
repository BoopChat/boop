const prodLogger = require("./productionLogger");
const devLogger = require("./developmentLogger");

process.env.TZ = "UTC";

module.exports.setup = (isInitial=false) => {
    let logger = null;

    switch (process.env.NODE_ENV) {
        case "production":
            logger = prodLogger();
            break;
        case "development":
        default: // node env not set assume dev
            logger = devLogger();
    }

    if (isInitial){
        // put the following log here so that it's the 1st thing that gets logged
        logger.info("Starting server setup...");

        logger.info(`Using ${(process.env.NODE_ENV === "production") ? "production" : "development"} logger`);
    }

    return logger;
};