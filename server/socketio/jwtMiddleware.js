const jwt = require("jsonwebtoken");

module.exports = (socket, io) => {
    console.log("web socket connected", socket.id);
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
                socket.user = user;
                next();
            }
        } catch (e) {
            console.log(e);
            next(new Error("Invalid jwt token"));
        }
    });

    socket.on("joinConversations", () => {
        const conversations = []; // Query database, add conversations to array
        for (const id of conversations) {
            // Add ids to conversations array
            socket.join(id);
        }
    });
};
