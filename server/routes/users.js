var express = require('express');
var router = express.Router();
var controller = require("../controllers/users");

//Manage all users
router//just for testing in development. creation will happen in signinOptions controller if the signinOption doesn't already exist
    .route("/")
    .get(controller.getAllUsers)
    .post(controller.createUser);

// Manage a single user
router
    .route("/:id")
    .get(controller.getUser)
    .put(controller.updateUser)
    // .delete(controller.deleteUser);

module.exports = router;
