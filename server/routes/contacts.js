var express = require("express");
var router = express.Router();
var controller = require("../controllers/Contacts");

// Manage a single user's contacts
router
    .route("/:user_id")
    // get all a user's contacts
    .get(controller.getContacts)
    // add a contact
    .post(controller.addContact)
    // delete a contact
    .delete(controller.deleteContact);

module.exports = router;