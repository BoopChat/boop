const dotenv = require("dotenv");
dotenv.config();

let dbConfig = {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT ?? 5432,
    "dialect": "postgres",
    "dialectOptions": {
        "useUTC": true
    },
    "timezone": "+00:00",
    "define": {
        "timestamps": true
    }
};

if (process.env.NODE_ENV === "production") {
    dbConfig.dialectOptions.ssl = {
        "require": true,
        "rejectUnauthorized": false
    };
}

module.exports = dbConfig;

module.exports.urls = {
    "facebookCallback":
        (process.env.NODE_ENV === "development") ?
            ("http://localhost:5000/api/login/auth/facebook/callback") :
            (`${process.env.HOME_URL}/api/login/auth/facebook/callback`),
    "googleCallback":
        (process.env.NODE_ENV === "development") ?
            ("http://localhost:5000/api/login/auth/google/callback") :
            (`${process.env.HOME_URL}/api/login/auth/google/callback`)
};