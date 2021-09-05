var express = require('express');
var router = express.Router();
var controller = require("../controllers/contacts");

// Manage a single user's contacts
router
    .route("/:user_id")
    // get all a user's contacts
    .get(controller.getContacts)
    // add a contact
    .post(controller.addContact)

// delete a contact
router
    .route("/:user_id/:contact_id")
    .delete(controller.deleteContact);


// router
//     .route("/:user_id/is_contact")// Determines if user is a contact of this user
//     .get(controller.isContact)


module.exports = router;