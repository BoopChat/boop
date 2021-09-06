var express = require('express');
var router = express.Router();
var controller = require("../controllers/users");

// Manage a single user
router
    .route("/:id")
    .get(controller.getUser)
    .put(controller.updateUser)

module.exports = router;
