var express = require("express");
var router = express.Router();

//Google auth client verifies the token sent from the front-end
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

//google authentication route
router.post("/google", async (req, res) => {
  //stores the token that was sent from the front-ent in the request body.
  const { token } = req.body;

  try {
    //google auth client verifies token and returns a ticket containing user information
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.client_ID,
    });

    //extract the relevant user information from the return ticket.
    const { given_name, family_name, email, picture } = ticket.getPayload();

    /*  here is where the returned user information + any other revelent information would
    be sent to database using an UPSERT REQUEST. TYhe created or updated user record from the datababe is returned and the database generated userId can be then used to 
    create a session cookie.
    */

    //Here is where the other return data information can be send back to the from end for dispaying names of images.

    //this is for testing : sample return data.
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
