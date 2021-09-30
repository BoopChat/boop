const db = require("../models");
const Participant = db.Participant;
const Message = db.Message;
const User = db.User;
const Conversation = db.Conversation;

// get all messages from a conversation
module.exports.getMessages = async (req, res) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;

    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user


    //check if the user is a participant of the conversation
    let isParticipant = await Participant.findOne({
        where: {
            userId: userId,
            conversationId: conversationId
        }
    });
    if (!isParticipant)
        return res.status(404).send({ msg: "User is not a participant of conversation" });

    //get all messages from the conversation
    let messages = await Message.findAll({
        where: {
            conversationId: conversationId
        },
        attributes: ["id", "content", "senderId", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
        include: {
            model: User,
            as: "sender",
            // specify what atributes you want returned
            attributes: ["displayName", "imageUrl"],
        },
        include: {
            model: Conversation,
            as: "conversation",
            // specify what atributes you want returned
            attributes: ["id", "title", "imageUrl"],
        }
    });

    if (!messages) return res.status(404).send({ msg: "Messages not found" });
    return res.status(200).send({ messages: messages });
};

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!req.body.content) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }

    //check if the user is a participant of the conversation
    let isParticipant = await Participant.findOne({
        where: {
            userId: userId,
            conversationId: conversationId
        }
    });
    if (!isParticipant)
        return res.status(404).send({ msg: "User is not a participant of conversation" });

    // create the message with the neccessary values
    let newMessage = await Message.create({
        senderId: userId,
        conversationId: conversationId,
        content: req.body.content
    }).catch(err => { //catch any errors
        res.status(500).send({
            msg:
            err.message || "Some error occurred while creating the message."
        });
    });
    //return a success message + the newly created msg;
    return res.status(201).send({
        msg: "Message successfully added to the conversation!", newMessage
    });
};