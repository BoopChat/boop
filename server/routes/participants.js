var express = require('express');
var router = express.Router();
var controller = require("../controllers/participants");

// Manage a single user's participation
router
    .route("/:user_id")
    //get all a user's conversations
    .get(controller.getConversations)
    // add a user to an existing conversation
    .post(controller.addToConversation)

module.exports = router;