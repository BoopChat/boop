var express = require('express');
var router = express.Router();
var controller = require("../controllers/signinOptions");

//Manage all signinOptions
router//just for testing in development.
    .route("/")
    .get(controller.getAllSigninOption)
    .post(controller.createSigninOption);// may be useful for adding more than 1 signin option for 1 user

// Manage a single signinOption
router
    .route("/:token")
    .get(controller.getSigninOption)
    // .put(controller.signinOptions)
    // .delete(controller.deleteUser);

router
    .route("/user/:user_id")
    .get(controller.getSigninOptionsByUserID)
    // .put(controller.signinOptions)
    // .delete(controller.deleteUser);

module.exports = router;