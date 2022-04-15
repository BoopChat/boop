const logger = require("../logger").setup();
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;
const Sequelize = require("sequelize");

// Authentication middle was for socket io connection
global.io.use((socket, next) => {
    // extracts authentication token from the socket connection
    const authToken = socket.handshake.auth.token;

    // Verify the token
    try {
        // Continue if verified or cancel connection and send error to user
        const user = jwt.verify(authToken, process.env.TOKEN_SECRET);
        if (!user) {
            next(new Error("No user information stored in JWT"));
        } else {
            socket.join(user.id);
            socket.user = user;
            next();
        }
    } catch (e) {
        logger.error(e);
        next(new Error("Invalid jwt token"));
    }
});

global.io.on("connection", (socket) => {
    socket.on("joinConversations", (conversationIds) => {
        for (const conversationId of conversationIds) {
            socket.join(conversationId);
        }
    });

    const { user } = socket;
    // update last active for user every 10 seconds
    const updater = setInterval(() => {
        User.update({
            lastActive: Sequelize.fn("NOW"),
        }, {
            where: {
                id: user.id,
            },
        }).catch((e) => {
            // catch any errors
            logger.error("Failed to update last active for `" + user.id + "` - " + e);
        });
    }, 10000);

    // user disconnected, stop updating their last active
    socket.on("disconnect", () => clearInterval(updater));
});
