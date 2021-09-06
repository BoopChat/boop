var express = require('express');
var router = express.Router();
var controller = require("../controllers/SigninOptions");
// These routes could probably be moved to the login/auth router

// Manage a single signinOption
router
    .route("/:email/:service_name")
    .get(controller.getSigninOption)

router
    .route("/:user_id")
    // get all a user's signinOptions using their user_id
    .get(controller.getSigninOptionsByUserID)
    // useful for adding more than 1 signin option for 1 user
    .post(controller.createSigninOption);

module.exports = router;