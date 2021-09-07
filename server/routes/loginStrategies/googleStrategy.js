const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/login/auth/google/callback",
        },
        function (accessToken, refreshToken, profile, cb) {
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //   return cb(err, user);
            // });
            //find or create a user in the db and return the user record

            //testing record;
            const user = {
                id: profile.id,
                fname: profile.name.givenName,
                lname: profile.name.familyName,
                photo: profile.photos[0].value,
                email: profile.emails[0].value,
            };

            //this send the google profile to the callback url (/login/auth/google/callback)
            //on the req.user property.
            cb(null, user);
        }
    )
);
