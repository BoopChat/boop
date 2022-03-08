const logger = require("../logger");
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
            conversationId: conversationId,
        },
    });
    if (!isParticipant) {
        logger.error(`Cant get messages because user [${userId}]
            is not a participant of the conversation ${conversationId}`);
        return res.status(404).send({ msg: "You are not a participant in this conversation" });
    }

    //get all messages from the conversation
    let messages = await Message.findAll({
        where: {
            conversationId: conversationId,
        },
        attributes: ["id", "content", "senderId", "createdAt", "updatedAt"],
        order: [["createdAt", "DESC"]],
        include: [
            {
                model: User,
                as: "sender",
                // specify what atributes you want returned
                attributes: ["displayName", "imageUrl"],
            },
            {
                model: Conversation,
                as: "conversation",
                // specify what atributes you want returned
                attributes: ["id", "title", "imageUrl"],
            },
        ],
    });

    if (!messages) {
        let msg = "Messages not found";
        logger.error(msg + userId + " - " + conversationId);
        return res.status(404).send({ msg });
    } else {
        logger.info("Returned messages " + userId + " - " + conversationId);
        return res.status(200).send({ messages: messages });
    }
};

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!req.body.content) {
        let msg = "Message content cannot be empty";
        logger.error(msg + userId);
        res.status(400).send({ msg });
        return;
    }

    //check if the user is a participant of the conversation
    let isParticipant = await Participant.findOne({
        where: {
            userId: userId,
            conversationId: conversationId,
        },
    });

    if (!isParticipant) {
        logger.error(`User [${userId}] tried adding a message to a conversation
            they are not a participant of: ${conversationId}`);
        return res.status(404).send({ msg: "You are not a participant in this conversation" });
    }

    // create the message with the neccessary values
    let newMessage = await Message.create({
        senderId: userId,
        conversationId: conversationId,
        content: req.body.content,
    }).catch((err) => {
        //catch any errors
        let msg = err.message || "Some error occurred while creating the message.";
        logger.error(msg + userId + " - " + conversationId);
        res.status(500).send({ msg });
    });

    newMessage = {
        id: newMessage.id,
        content: newMessage.content,
        senderId: newMessage.senderId,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt,
        conversation: { id: newMessage.conversationId },
        sender: { displayName: req.user.displayName, imageUrl: req.user.imageUrl }
    };

    //return a success message + the newly created msg;
    let msg = "Message successfully added to the conversation";
    logger.info(msg);
    // Emit message to specific conversationId
    global.io.to(conversationId).emit("newMessage", { newMessage });
    return res.status(201).send({
        msg,
    });
};
