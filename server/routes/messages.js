var express = require("express");
var router = express.Router();
var controller = require("../controllers/Messages");

// Manage a single user's conversations
router
    .route("/:user_id/:conversation_id")
    .get(controller.getMessages)  // get all messages from a conversation
    .post(controller.addMessage); // create a new message in the conversation

module.exports = router;