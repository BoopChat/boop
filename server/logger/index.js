const prodLogger = require("./productionLogger");
const devLogger = require("./developmentLogger");

let logger = null;

switch(process.env.NODE_ENV) {
    case "production":
        logger = prodLogger();
        break;
    case "development":
    default: // node env not set assume dev
        logger = devLogger();
}

module.exports = logger;