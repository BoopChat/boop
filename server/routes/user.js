const express = require("express");
const router = express.Router();
const controller = require("../controllers/User");

// Manage a single user
router
    .route("/")
    .patch(controller.updateUser);

module.exports = router;