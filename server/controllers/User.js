const logger = require("../logger").setup();
const db = require("../models");
const User = db.User;
const { createCookie } = require("../routes/loginStrategies/loginUtils");

// Update user editable info
module.exports.updateUser = async (req, res) => {
    const { user: { id } } = req; // get id of the user requesting an update
    const { userInfo } = req.body;

    if (!userInfo) {
        logger.error(id + " tried updating their info without sending data");
        return res.status(400).send({ msg: "Missing user info" });
    }

    // select user from db to fill in missing attributes not sent by client
    const originalUserInfo = await User.findByPk(id);

    // merge the existing info with info to be updated
    const updatedUserInfo = {
        firstName: userInfo.firstName ?? originalUserInfo.firstName,
        lastName: userInfo.lastName ?? originalUserInfo.lastName,
        displayName: userInfo.displayName ?? originalUserInfo.displayName
    };

    // save the update
    User.update(updatedUserInfo, { where: { id } })
        .then(user => {
            // update the local values for req.user (doesn't update the global value for req.user)
            req.user.firstName = userInfo.firstName ?? originalUserInfo.firstName;
            req.user.lastName = userInfo.lastName ?? originalUserInfo.lastName;
            req.user.displayName = userInfo.displayName ?? originalUserInfo.displayName;

            logger.info("User info for " + user + " updated successfully");
            // update the cookie with the new local req.user info and send back a success message
            createCookie(JSON.stringify(req.user), res).status(200).send({ msg: "Successfully updated your info" });
        }).catch(err => {
            let msg = err.message || "Some error occurred while updating user info";
            logger.error(msg + " for " + id);
            res.status(500).send({ msg });
        });
};