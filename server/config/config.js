const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    "development": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "postgres",
        "dialectOptions": {
            "useUTC": true
        },
        "timezone": "+00:00",
        "define": {
            "timestamps": true
        }
    },
    "test": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "postgres",
        "dialectOptions": {
            "useUTC": true
        },
        "timezone": "+00:00",
        "define": {
            "timestamps": true
        }
    },
    "production": {
        "username": process.env.DB_USERNAME,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": "postgres",
        "dialectOptions": {
            "useUTC": true
        },
        "timezone": "+00:00",
        "define": {
            "timestamps": true
        }
    }
};