const db = require("../models");
const Participant = db.Participant;
const Message = db.Message;

// THIS FUNCTIONALITY COULD BE FOLDED INTO THE GETCONVERSATION METHOD (IN AN INCLUDE STATMENT) IN THE CONVERSATIONS CONTROLLER

// get all messages from a conversation
module.exports.getMessages = async (req, res) => {
    let user_id = req.params.user_id;
    let conversation_id = req.params.conversation_id;

    // Need to check that user_id belongs to a valid user and matches the id of the requesting user
    

    //check if the user is a participant of the conversation
    let is_participant = await Participant.findOne({ 
        where: {
            user_id: user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant) return res.status(404).send("user is not a participant of conversation");

    //get all messages from the conversation
    let messages = await Message.findAll({
        where: {
            conversation_id: conversation_id
        }
    });

    if (!messages) return res.status(404).send("messages not found");
    return res.send({messages: messages});
}

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let user_id = req.params.user_id;
    let conversation_id = req.params.conversation_id;

    // Need to check that user_id belongs to a valid user and matches the id of the requesting user
    

    // Validate request
    if (!req.body.content) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    //check if the user is a participant of the conversation
    let is_participant = await Participant.findOne({ 
        where: {
            user_id: user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant) return res.status(404).send("user is not a participant of conversation");

    // create the message with the neccessary values
    let new_message = await Message.create({
        sender_id : user_id,
        conversation_id: conversation_id,
        content: req.body.content
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the message."
        });
    });
    //return a success message + the newly created msg;
    return res.send({message:"Message successfully added to the conversation!", new_message});
}