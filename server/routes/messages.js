var express = require('express');
var router = express.Router();
var controller = require("../controllers/messages");

// Manage all conversations (JUST FOR TESTING)
router
    .route("/")
    .get(controller.getAllMessages)// get all messages in the database

// Manage a single user's conversations
router
    .route("/:user_id/:conversation_id")
    .get(controller.getMessages)// get all messages from a conversation
    .post(controller.addMessage)//create a new message in the conversation


// router
//     .route("/:sender_id/sent")
//     .get(controller.getSentMessages)//get all the messages a user has sent


// router
//     .route("/:sender_id/received")
//     .get(controller.getReceivedMessages)//get all the messages a user has received




module.exports = router;