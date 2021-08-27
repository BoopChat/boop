var express = require("express");
var router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.client_ID,
    });

    const { given_name, family_name, email, picture } = ticket.getPayload();

    /* send data to database using UPSERT REQUEST
    this will create a record in the db or update at existing one and
    return the record with the generated userID for the db. user id will then
    be user to setup the session cookie login in the user
    */

    //this is for testing
    const user = {
      userId: "aiaosiud87564",
      firstName: given_name,
      lastName: family_name,
      email: email,
      picture,
    };

    //create user session (maybe)
    // req.session.userId = user.userId;

    res.status(200).json(user);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
