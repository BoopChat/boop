var express = require('express');
var router = express.Router();
var controller = require("../controllers/participants");

// Manage all participants (JUST FOR TESTING)
router
    .route("/")
    .get(controller.getAllParticipants)// get all participant associations

// Manage a single user's participation
router
    .route("/:user_id")
    .get(controller.getConversations)//get all a user's conversations
    .post(controller.addToConversation)// add a user to an existing conversation

module.exports = router;