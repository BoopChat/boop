var express = require('express');
var router = express.Router();
var controller = require("../controllers/Conversations");

// Manage a single user's conversations
router
    .route("/:user_id")
    // get all a user's conversations
    .get(controller.getConversations)
    // create a new conversation
    .post(controller.addConversation)
    // soft deletes  participant association which "removes" a user from a conversation
    .delete(controller.leaveConversation)

module.exports = router;