var express = require("express");
var router = express.Router();
var controller = require("../controllers/Messages");

// Manage a single user's conversations
router
    .route("/:user_id/:conversation_id")
    // get all messages from a conversation
    .get(controller.getMessages)
    //create a new message in the conversation
    .post(controller.addMessage)

module.exports = router;