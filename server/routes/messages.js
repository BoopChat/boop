var express = require("express");
var router = express.Router();
var controller = require("../controllers/Messages");
const { isParticipant } = require("../middleware/authMiddleware");

// Manage a single user's conversations
router
    .route("/:conversationId")
    // get all messages from a conversation
    .get(isParticipant, controller.getMessages)
    //create a new message in the conversation
    .post(isParticipant, controller.addMessage);

module.exports = router;