const logger = require("../logger").setup();
const db = require("../models");
const Message = db.Message;
const User = db.User;
const Conversation = db.Conversation;
const { Op, fn, col } = require("sequelize");

// get all messages from a conversation
module.exports.getMessages = async (req, res) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;

    // mark unread messages as read
    let updated = await Message.update(
        {
            readBy: fn("array_append", col("read_by"), userId)
        },
        {
            where: {
                conversationId: conversationId,
                [Op.not]: {
                    readBy: {
                        [Op.contains]: [userId],
                    },
                },
            },
            returning: true
        }
    );

    let firstMarked = -1;
    let readMessages = [];

    if (updated[0] > 0){
        updated[1].sort((a, b) => a.dataValues.createdAt - b.dataValues.createdAt);
        firstMarked = updated[1][0].id;
        updated[1].forEach((message) => readMessages.push(message.dataValues));
        
        // Emit newly read messages to specific conversationId
        global.io.to(conversationId).emit("readMessages", { readMessages });
    }

    //get all messages from the conversation
    let messages = await Message.findAll({
        where: {
            conversationId: conversationId,
        },
        attributes: ["id", "content", "senderId", "createdAt", "updatedAt", "readBy"],
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
        return res.status(200).send({ messages: messages, firstMarked });
    }
};

// Create a new message in the conversation
module.exports.addMessage = async (req, res) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;

    // Validate request
    if (!req.body.content) {
        let msg = "Message content cannot be empty";
        logger.error(msg + userId);
        res.status(400).send({ msg });
        return;
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
