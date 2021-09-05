const db = require("../models");
const Participant = db.Participant;

// Retrieve all Participant associations in the database
module.exports.getAllParticipants = async (req, res) => {
    let participants = await Participant.findAll();
    return res.send(participants);
}

// Get all a user's conversations
module.exports.getConversations = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    let conversations = await Participant.findAll({//get all user's conversations (participant associations)
        where: {
            user_id: user_id
        },
    });

    if (!conversations) return res.status(404).send("conversations not found");
    return res.send({conversations: conversations});
}

// Add a user to an existing conversation
module.exports.addToConversation = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    // Validate request
    if (
        !user_id
        || !req.body.conversation_id
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let participant = await Participant.create({
        user_id : user_id,
        conversation_id: req.body.conversation_id
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while adding the user to the conversation."
        });
    });
    return res.send({message:"User successfully added to the conversation!", participant});//return a success message + the newly participant association;
}