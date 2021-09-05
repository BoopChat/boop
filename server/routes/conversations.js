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


// POTENTIALLY USEFUL ROUTES

// router 
//     .route("/:id")
//     // get a conversation's information
//     .get(controller.getConversation)
//     //update a conversation's information (title, image, user permissions)
//     .put(controller.updateConversation)

// // Get a conversation's participants
// router
//     .route("/participants/:id")
//     .get(controller.getParticipants)
//     // update a participant (give/remove admin permissions by updating is_admin value)
//     .put(controller.updateParticipant)

// // Get a conversation's messages
// router
//     .route("/messages/:id")
//     .get(controller.getMessages)


module.exports = router;