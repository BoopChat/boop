#!/usr/bin/env node

/**
* Module dependencies.
*/

var app = require("../app");
var http = require("http");
const socketio = require("socket.io");
const logger = require("../logger").setup();

/**
* Get port from environment and store in Express.
*/

var port = normalizePort(process.env.PORT || "5000");
app.set("port", port);

/**
* Configured Login services
*/
global.configuredServices = getLoginService();


/**
* Create HTTP server.
*/

var server = http.createServer(app);

/**
*  Create socket io connection
*/
global.io = socketio(server, {
    cors: {
        origin: process.env.HOME_URL,
    },
});

require("../socketio/connection");
/**
* Listen on provided port, on all network interfaces.
*/

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
* Normalize a port into a number, string, or false.
*/

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
* Event listener for HTTP server "error" event.
*/

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
            break;

        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;

        default:
            throw error;
    }
}

/**
* Event listener for HTTP server "listening" event.
*/

function onListening() {
    logger.info("Setting up server event listener");
    const addr = server.address();
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    logger.info("Boop server listening on " + bind);
}

/**
* Gets the configured login services
*/
function getLoginService () {
    logger.info("Starting login service configuration");

    const services = ["GOOGLE_CLIENT", "FACEBOOK_CLIENT", "TWITTER_CLIENT"];
    const configuredServices = {};
    const providerNames = [];

    for (const service of services) {
        const providerName = service.split("_")[0].toLowerCase();
        if (process.env[`${service}_SECRET`] && process.env[`${service}_ID`]){
            configuredServices[providerName] = true;
            providerNames.push(providerName.toLowerCase());
        }
    }

    if (providerNames.length === 0) {
        logger.error("Atleast one OAuth login service has to be configured");
        process.exit(1);
    } else if (providerNames.length >= 1) {
        logger.info(`Configured ${providerNames.join(", ")} as${(providerNames.length === 1) ? " a" : ""} login service${(providerNames.length > 1) && "s"}`);
    }

    return configuredServices;
}