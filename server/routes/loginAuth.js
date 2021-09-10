const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");

require("./loginStrategies/googleStrategy");

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

// after successful login with google strategy, user db record will be sent here in the req.user property.
router.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
    // Creates a cookie with the user's login information
    res.cookie("loginCookie", JSON.stringify(req.user), {
        secure: false,
        httpOnly: true,
        expires: dayjs().add(1, "year").toDate(),
    });

    // Redirects to the login page and stores the login cookie in the users browser.
    res.status(301).redirect("http://localhost:3000");
});

// Creates a jwt access token if the cookie with the users login information exists.
router.get("/cookie", (req, res) => {
    // If the cookie with users login information exists, create jwt and send to user.
    if (req.cookies.loginCookie) {
        // Extracts user id from the cookie with the users login information.
        const { id } = JSON.parse(req.cookies.loginCookie);

        // Creates an access jwt token using the user id.
        const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET);

        // Returns the jwt access token.
        return res.status(200).json({
            success: true,
            msg: "User Authenticated",
            token,
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
    res.status(200).json({
        success: true,
        msg: "Logged Out",
    });
});

module.exports = router;
