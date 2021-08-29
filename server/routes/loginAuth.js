const router = require("express").Router();

//json web token
const jwt = require("jsonwebtoken");

//google authentication client for token verification
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });

    const { given_name, family_name, email, picture } = ticket.getPayload();

    //send info to data base using an upsert requests
    //return created or updated record so user id can be used for JWT.

    //testing data of return record
    const user = {
      id: "aslkdjhjd7363",
      first_name: given_name,
      last_name: family_name,
      email,
      picture,
    };

    const authToken = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);

    res.status(200).header("auth-token", authToken).json({
      status: "success",
      authToken,
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      error: err,
    });
  }
});

module.exports = router;
