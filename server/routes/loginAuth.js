const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const logger = require("../logger");

require("./loginStrategies/googleStrategy");
require("./loginStrategies/facebookStrategy");

const createCookie = (user, res) => {
    // Creates a cookie with the user's login information
    res.cookie("loginCookie", user, {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(1, "month").toDate(),
        sameSite: "Lax"
    });
    return res;
};

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// after successful login with google strategy, user db record will be sent here in the req.user property.
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    // Redirects to the login page and stores the login cookie in the users browser.
    logger.info("Redirected to login: " + req.user);
    createCookie(JSON.stringify(req.user), res).status(200).redirect(global.gConfig.homeUrl);
});

//Facebook login route
router.get("/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));

// after successful login with Facebook strategy, user db record will be sent here in the req.user property.
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }), (req, res) => {
    // Redirects to the login page and stores the login cookie in the users browser.
    logger.info("Redirected to login: " + req.user);
    createCookie(JSON.stringify(req.user), res).status(200).redirect(global.gConfig.homeUrl);
});

// Creates a jwt access token if the cookie with the users login information exists.
router.get("/cookie", (req, res) => {
    // If the cookie with users login information exists, create jwt and send to user.
    if (req.cookies.loginCookie) {
        // Extracts user id from the cookie with the users login information.
        const userInfo = JSON.parse(req.cookies.loginCookie);

        // Creates an access jwt token using the user id.
        const token = jwt.sign({ ...userInfo }, process.env.TOKEN_SECRET);

        // Returns the jwt access token and user information.
        logger.info("User [" + userInfo.id + "] Authenticated");
        return res.status(200).json({
            success: true,
            msg: "User Authenticated",
            token,
            userInfo,
        });
    }

    // If the cookie with the users login information does not exist
    // return a login status of false
    res.status(200).json({
        success: false,
        msg: "Login with social provider",
    });
});

// logs the user out.
router.get("/logout", (req, res) => {
    // Deletes the cookie containing the users login information.
    res.clearCookie("loginCookie");
    logger.info("Logged out user "+req.user);
    res.status(200).json({
        success: true,
        msg: "Logged Out",
    });
});

module.exports = router;
