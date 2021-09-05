var express = require('express');
var router = express.Router();
var controller = require("../controllers/conversations");

// Manage a single user's conversations
router
    .route("/:user_id")
    // get all a user's conversations
    .get(controller.getConversations)
    // create a new conversation
    .post(controller.addConversation)


module.exports = router;