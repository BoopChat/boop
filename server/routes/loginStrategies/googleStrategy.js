const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const utils = require("../loginStrategies/utils");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/login/auth/google/callback",
        },
        async function (accessToken, refreshToken, profile, cb) {

            // try to retrieve the user from the database, or create a new user and signinOption
            // using the information retrieved from the social login, along with the service name
            let user_from_db = await utils.getSigninOption({
                email: profile.emails[0].value,
                service_name: "Google",
                first_name: profile.name.givenName,
                last_name: profile.name.familyName,
                image_url: profile.photos[0].value
            });

            // store the returned message (success or error)
            let msg = user_from_db["msg"];
            var user = null;

            //if the message contains "success"
            // (if user exists and was retrieved or new user and signinOption were created)
            // extract the returned user information
            if (msg.includes("success")){
                user = user_from_db["user"];
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