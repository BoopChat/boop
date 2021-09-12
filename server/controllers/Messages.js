const db = require("../models");
const Participant = db.Participant;
const Message = db.Message;
const User = db.User;
const Conversation = db.Conversation;

// get all messages from a conversation
module.exports.getMessages = async (req, res) => {
    let user_id = req.params.user_id;
    let conversation_id = req.params.conversation_id;

    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user


    //check if the user is a participant of the conversation
    let is_participant = await Participant.findOne({
        where: {
            user_id: user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant)
        return res.status(404).send({msg: "User is not a participant of conversation"});

    //get all messages from the conversation
    let messages = await Message.findAll({
        where: {
            conversation_id: conversation_id
        },
        attributes: ["id", "content", "sender_id", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
        include: {
            model: User,
            as: "sender",
            // specify what atributes you want returned
            attributes:["display_name", "image_url"],
        },
        include: {
            model: Conversation,
            as: "conversation",
            // specify what atributes you want returned
            attributes:["id", "title", "image_url"],
        }
    });

    if (!messages) return res.status(404).send({msg: "Messages not found"});
    return res.send({messages: messages});
}

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let user_id = req.params.user_id;
    let conversation_id = req.params.conversation_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!req.body.content) {
        res.status(400).send({
            msg: "Content can not be empty!"
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
    if (!is_participant)
        return res.status(404).send({msg:"User is not a participant of conversation"});

    // create the message with the neccessary values
    let new_message = await Message.create({
        sender_id : user_id,
        conversation_id: conversation_id,
        content: req.body.content
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            msg:
            err.message || "Some error occurred while creating the message."
        });
    });
    //return a success message + the newly created msg;
    return res.status(201).send({
        msg:"Message successfully added to the conversation!", new_message
    });
}