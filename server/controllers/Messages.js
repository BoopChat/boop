const db = require("../models");
const Participant = db.Participant;
const Message = db.Message;

// Retrieve all Messages in the database
module.exports.getAllMessages = async (req, res) => {
    let messages = await Message.findAll();
    return res.send(messages);
}

// get all messages from a conversation
module.exports.getMessages = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url
    let conversation_id = req.params.conversation_id;//temporarily getting the conversation_id from the url

    let is_participant = await Participant.findOne({ //check if the user is a participant of the conversation
        where: {
            user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant) return res.status(404).send("user is not a participant of conversation");

    let messages = await Message.findAll({//get all messages from the conversation
        where: {
            conversation_id: conversation_id
        }
    });

    if (!messages) return res.status(404).send("messages not found");
    return res.send({messages: messages});
}

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url
    let conversation_id = req.params.conversation_id;//temporarily getting the conversation_id from the url

    // Validate request
    if (
            !req.body.content
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let is_participant = await Participant.findOne({ //check if the user is a participant of the conversation
        where: {
            user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant) return res.status(404).send("user is not a participant of conversation");


    let msg = await Message.create({// create the message with the neccessary values
        sender_id : user_id,
        conversation_id: conversation_id,
        content: req.body.content
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the message."
        });
    });
    return res.send({message:"Message successfully added to the conversation!", msg});//return a success message + the newly created msg;
}