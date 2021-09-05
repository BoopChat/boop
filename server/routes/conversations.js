var express = require('express');
var router = express.Router();
var controller = require("../controllers/conversations");

// Manage all conversations (JUST FOR TESTING)
router
    .route("/")
    .get(controller.getAllConversations)// get all the conversations in the database

// Manage a single user's conversations
router
    .route("/:user_id")
    .get(controller.getConversations)// get all a user's conversations
    .post(controller.addConversation)// create a new conversation

// // Get a conversation's participants
// router
//     .route("/participants/:id")
//     .get(controller.getParticipants)

// // Get a conversation's messages
// router
//     .route("/messages/:id")
//     .get(controller.getMessages)


module.exports = router;