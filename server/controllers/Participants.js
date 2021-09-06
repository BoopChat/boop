const db = require("../models");
const Participant = db.Participant;


// Get all a user's conversations
module.exports.getConversations = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and matches the id of the requesting user

    //get all user's conversations (participant associations)
    let conversations = await Participant.findAll({
        where: {
            user_id: user_id
        },
    });

    if (!conversations) return res.status(404).send("conversations not found");
    return res.send({conversations: conversations});
}