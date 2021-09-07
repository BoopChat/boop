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

    // Creates an access jwt token and stores it inside a cookie.
    const token = jwt.sign({ id: req.user.id }, process.env.TOKEN_SECRET);
    res.cookie("tokenCookie", token, {
        secure: false,
        httpOnly: true,
    });

    // Both cookies sent to users browser on redirect.
    res.status(301).redirect("http://localhost:3000");
});

// Logs in users using the login information cookie if available.
router.get("/cookie", (req, res) => {
    // If the cookie with users login information exists, use it to log in user.
    if (req.cookies.loginCookie) {
        // Extracts user id from the cookie with users log in information.
        const { id } = JSON.parse(req.cookies.loginCookie);

        //validate id in the database

        // Create an access jwt token using the user id.
        const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET);

        // Store created jwt in a cookie.
        res.cookie("tokenCookie", token, {
            secure: false,
            httpOnly: true,
        });

        // Send the cookie containing the access token to the users browser.
        return res.status(200).json({
            success: true,
            msg: "User Authenticated",
            //user data could be send here.
        });
    }

    // If the cookie with the users login information does not exist
    // return a login status of false
    res.status(200).json({
        success: false,
        msg: "Login with social provider",
    });
});

// Verifies that the user has successfully logged in by checking for the cookie that contains the jwt access token.
router.get("/success", (req, res) => {
    // If the access cookie does not exist the user is not logged in.
    if (!req.cookies.tokenCookie) {
        return res.status(200).json({
            success: false,
            msg: "Not Authenticated",
        });
    }

    // If the access cookie exist then the user is logged in.
    res.status(200).json({
        success: true,
        msg: "User Authenticated",
    });
});

// logs the user out.
router.get("/logout", (req, res) => {
    // Deletes the cookie containing the access token.
    res.clearCookie("tokenCookie");
    res.status(200).json({
        success: true,
        msg: "Logged Out",
    });
});

module.exports = router;
