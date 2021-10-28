const logger = require("../logger");
const jwt = require("jsonwebtoken");

global.io.on("connection", (socket) => {
    // Authentication middle was for socket io connection
    io.use((socket, next) => {
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
                next();
            }
        } catch (e) {
            logger.error(e);
            next(new Error("Invalid jwt token"));
        }
    });

    socket.on("joinConversations", (conversationIds) => {
        for (const conversationId of conversationIds) {
            socket.join(conversationId);
        }
    });
});
