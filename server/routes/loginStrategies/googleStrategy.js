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
        async function (accessToken, refreshToken, profile, done) {

            try {
                // try to retrieve the user from the database, or create a new user and signinOption
                // using the information retrieved from the social login, along with the service name
                let userFromDb = await utils.getSigninOption({
                    email: profile.emails[0].value,
                    serviceName: "Google",
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    imageUrl: profile.photos[0].value
                });

                // store the returned message (success or error)
                let msg = userFromDb["msg"];
                var user = null;

                // if the message contains "success"
                // (if user exists and was retrieved or new user and signinOption were created)
                // extract the returned user information
                if (msg.includes("success")){
                    user = userFromDb["user"];
                    //this send the google profile to the callback url (/api/login/auth/google/callback)
                    //on the req.user property.
                    done(null, user);
                }
                else{
                    // Displays a blank page with the error message.
                    done(msg, null);
                }
            } catch (err) {
                done(err, null);
            }
        }
    )
);
