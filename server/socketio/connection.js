const logger = require("../logger");
const jwt = require("jsonwebtoken");

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
<<<<<<< HEAD
=======
            logger.info("joining " + user.id);
>>>>>>> ba8141d3a7be2f72253b6015b45dd30152c7d911
            socket.join(user.id);
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
});
