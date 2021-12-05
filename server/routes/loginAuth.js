const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const logger = require("../logger");

require("./loginStrategies/googleStrategy");
require("./loginStrategies/facebookStrategy");
const loginUtils = require("./loginStrategies/loginUtils");

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get("/google/app", async (req, res) => {
    const { user } = JSON.parse(req.headers["x-access-token"]);

    try {
        // try to retrieve the user from the database, or create a new user and signinOption
        // using the information retrieved from the social login, along with the service name
        let userFromDb = await loginUtils.getSigninOption({
            email: user.email,
            serviceName: "Google",
            firstName: user.givenName,
            lastName: user.familyName,
            imageUrl: user.photoUrl
        });

        // store the returned message (success or error)
        let msg = userFromDb["msg"];
        let userInfo = null;

        // if the message contains "success"
        // (if user exists and was retrieved or new user and signinOption were created)
        // extract the returned user information
        if (msg.includes("success")) {
            userInfo = userFromDb["user"];
            logger.info(`[${userInfo.userId}] Successfully signed in using ${userInfo.serviceName}`);
        } else
            logger.error(userInfo.userId + ":" + msg);

        // Creates a cookie with the user's login information
        createCookie(JSON.stringify(userInfo), res).status(200).send({
            msg: "Logged in successfully"
        });
    } catch (err) {
        logger.error(err);
        res.status(501).send({
            msg: "An error occurred while signing in to boop from google"
        });
    }
});

const createCookie = (user, res) => {
    // Creates a cookie with the user's login information
    res.cookie("loginCookie", user, {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(1, "month").toDate(),
    });
    return res;
};

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
