const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const utils = require("../loginStrategies/utils");

passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/login/auth/facebook/callback",
            profileFields: ["first_name", "last_name", "photos", "email"],
        },
        async function (accessToken, refreshToken, profile, cb) {
            // try to retrieve the user from the database, or create a new user and signinOption
            // using the information retrieved from the social login, along with the service name
            let userFromDb = await utils.getSigninOption({
                email: profile._json.email,
                serviceName: "Facebook",
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                imageUrl: profile.photos[0].value
            });

            // store the returned message (success or error)
            let msg = userFromDb["msg"];
            var user = null;

            //if the message contains "success"
            // (if user exists and was retrieved or new user and signinOption were created)
            // extract the returned user information
            if (msg.includes("success")){
                user = userFromDb["user"];
            }
            else{
                //deal with error messages
            }

            //this send the google profile to the callback url (/api/login/auth/google/callback)
            //on the req.user property.

            cb(null, user);
        }
    )
);
