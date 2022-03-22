const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT ?? 5432,
    "dialect": "postgres",
    "dialectOptions": {
        "useUTC": true,
        "ssl": process.env.NODE_ENV === "production" ? {
            "require": true,
            "rejectUnauthorized": false
        } : {
            "require": false
        }
    },
    "timezone": "+00:00",
    "define": {
        "timestamps": true
    }
};

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