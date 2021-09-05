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

// THIS OPERATION CAN BE MOVED TO THE CONVERSATIONS CONTROLLER
// Add a user to an existing conversation
module.exports.addToConversation = async (req, res) => {
    let user_id = req.params.user_id;

    // Need to check that user_id belongs to a valid user and matches the id of the requesting user
    

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
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while adding the user to the conversation."
        });
    });
    //return a success message + the newly participant association;
    return res.send({message:"User successfully added to the conversation!", participant});
}