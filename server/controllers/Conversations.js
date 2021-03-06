const logger = require("../logger").setup();
const db = require("../models");
const { Conversation, Participant, User, Message } = db;

// Attempting to create a conversation using a transaction
module.exports.addConversation = async (req, res) => {
    let userId = req.user.id;
    // the participants' userIds will be passed in an array
    let participants = req.body.participants;

    // Validate request
    if (!participants || !participants.length) {
        logger.error(userId + " tried creating a conversation with no participants");
        res.status(400).send({ msg: "You must add participants to the conversation" });
        return;
    }

    // Managed Transaction
    let t = await db.sequelize.transaction();

    try {
        //create the conversation with the input attributes
        let conversationInfo = await Conversation.create(
            {
                title: req.body.title,
                imageUrl: req.body.imageUrl,
                // if the options were null set their values to false else use the input values
                userEditableImage: req.body.userEditableImage == null ? false : req.body.userEditableImage,
                userEditableTitle: req.body.userEditableTitle == null ? false : req.body.userEditableTitle,
            },
            { transaction: t }
        );

        // add user creating convo as admin
        await Participant.create(
            {
                userId: userId,
                conversationId: conversationInfo.id,
                isAdmin: true,
            },
            { transaction: t }
        );

        // add all other users in the participants array as participants in the conversation
        let isAdmin = participants.length === 1;

        const promises = participants.map(async (participant) => {
            await Participant.create(
                {
                    userId: participant,
                    conversationId: conversationInfo.id,
                    isAdmin: isAdmin,
                },
                { transaction: t }
            );
        });

        await Promise.all(promises);

        // everything worked as planned - commit the changes
        await t.commit();
        // retrieve the newly created conversation with it's participants' info
        let conversation = await getConvo(conversationInfo.id);
        //return a success message + the newly created conversation
        let msg = "Conversation successfully created";
        logger.info(msg + ":" + conversation.id);
        // convert array of participants string ids to numbers
        const participantIds = participants.map((id) => Number(id));
        // Emit the new conversation to all participants and the sender
        global.io.to([...participantIds, userId]).emit("newConversation", { conversation });
        return res.status(201).send({ id: conversation.id });
    } catch (err) {
        await t.rollback();

        if (err.message.includes("insert or update on table")) {
            logger.error(`At least one of the participants were invalid when trying to create the
                conversation: ${userId} - ${participants}`);
            return res.status(404).send({
                msg: "At least one of your participants isn't a valid user",
            });
        }

        let msg = err.message || "Some error occurred while creating the Conversation.";
        logger.error(msg);
        return res.status(500).send({ msg });
    }
};

module.exports.getConversations = async (req, res) => {
    let userId = req.user.id;

    //get user and all conversations (where Participants.deletedAt is null)
    let user = await User.findByPk(userId, {
        // get the conversation info
        include: {
            model: Conversation,
            as: "conversationList",
            // specify what atributes you want returned
            attributes: ["id", "title", "imageUrl", "createdAt"],
            // Prevent the belongs-to-many mapping object (Participant)
            // from being returned
            through: { attributes: [] },
            // get each conversation's participants' info from the Users table
            include: [{
                model: User,
                as: "participants",
                // exclude the requesting user's info from the participants list
                // where: {
                //     [db.Sequelize.Op.not]: [{ id: userId }],
                // },
                // specify what atributes you want returned
                attributes: ["displayName", "imageUrl", "id", "booptag"],
                // Prevents the entire belongs-to-many mapping object (Participant)
                // from being returned
                through: { attributes: ["isAdmin"] },
            }, {
                model: Message,
                as: "messages",
                attributes: ["id", "content", "senderId", "createdAt", "updatedAt"],
                order: [["createdAt", "DESC"]],
                limit: 1,
            }]
        },
    });

    if (!user) {
        let msg = "User not found";
        logger.error(msg);
        return res.status(404).send({ msg });
    } else {
        logger.info("Returned conversation list");
        return res.status(200).send({ conversationList: user["conversationList"] });
    }
};

// remove a user from a conversation
module.exports.leaveConversation = async (req, res) => {
    let userId = req.user.id;
    // get the conversationId and id of the successor admin (successorId)) from the request body
    let conversationId = req.body.conversationId;
    let successorId = req.body.successorId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!conversationId) {
        logger.error(userId + " did not select the conversation they wanted to leave");
        res.status(400).send({ msg: "No conversation selected" });
        return;
    }

    // Get the participants' user ids and isAdmin values, along with the number of participants
    let participantsInfo = await Participant.findAndCountAll({
        where: {
            conversationId: conversationId,
        },
        attributes: ["userId", "isAdmin"],
        include: {
            model: User,
            as: "participantInfo",
            attributes: ["displayName"],
        },
    });

    // The number of participants
    var participantsCount = participantsInfo.count;
    // The participants' user ids and isAdmin values
    var participants = participantsInfo.rows;
    // the number of admins
    var adminsCount = 0;
    // whether or not the user is a participant
    var userIsParticipant = false;
    // whether or not the user is an admin
    var userIsAdmin = false;
    // whether or not the successor is a participant
    var successorIsParticipant = false;

    // Get the number of admins (count how many participants have isAdmin set to true)
    for (let participant of participants) {
        if (participant.isAdmin === true) {
            adminsCount += 1;
        }
        // check if user is a participant
        if (participant.userId === userId) {
            userIsParticipant = true;
            //if the user's an admin set userIsAdmin to true
            if (participant.isAdmin === true) {
                userIsAdmin = true;
            }
        }
        // check if successor is a participant
        if (participant.userId === successorId) {
            successorIsParticipant = true;
        }
    }

    // if the user isn't a participant return an error message
    if (!userIsParticipant) {
        let msg = "Requesting user is not a participant of the conversation";
        logger.error(msg);
        return res.status(404).send({ msg });
    }

    // if this is the only participant delete the conversation, all messages and participants
    if (participantsCount === 1) {
        let deletedConversationRow = await Conversation.destroy({
            where: {
                id: conversationId,
            }
        }).catch((err) => {
            //catch any errors
            let msg = err.message || "Some error occurred while deleting the conversation.";
            logger.error(msg + `${userId} - ${conversationId}`);
            res.status(500).send({ msg });
        });

        // delete associated participant (has to be done manually because participant's soft delete breaks cascade)
        await Participant.destroy({
            where: {
                conversationId: conversationId,
            },
            force: true
        }).catch((err) => {
            //catch any errors
            let msg = err.message || "Some error occurred while deleting the conversation.";
            logger.error(msg + `${userId} - ${conversationId}`);
            res.status(500).send({ msg });
        });

        // delete associated messages (has to be done manually because participant's soft delete breaks cascade)
        await Message.destroy({
            where: {
                conversationId: conversationId,
            }
        }).catch((err) => {
            //catch any errors
            let msg = err.message || "Some error occurred while deleting the conversation.";
            logger.error(msg + `${userId} - ${conversationId}`);
            res.status(500).send({ msg });
        });

        if (!deletedConversationRow) {
            let msg = "Conversation couldn't be deleted. Probably didn't exist.";
            logger.error(msg + `${userId} - ${conversationId}`);
            return res.status(500).send({ msg });
        }

        // return a success msg
        let msg = "Conversation successfully deleted!";
        logger.info(msg + `${userId} - ${conversationId}`);
        return res.send({ msg });
    }

    if (userIsAdmin === true) {
        // Remove the user's info from the list of participants
        participants = participants.filter((participant) => participant.id !== userId);

        // if this is the last admin and they haven't chosen a successor
        if (adminsCount === 1 && !successorId) {
            // return a msg letting the user know they must choose a successor and the list of participants
            logger.error("No successor was chosen " + `${userId} - ${conversationId}`);
            return res.status(400).send({
                msg: "You're the only admin. You must choose a successor.",
                participants: participants,
            });
        }

        // if this is the last admin and they chose a successor that's not a participant
        if (adminsCount === 1 && !successorIsParticipant) {
            // return a msg letting the user know they must choose a successor that's a participant
            // and the list of participants
            logger.error("Successor was not a participant " + `${userId} - ${conversationId} - ${successorId}`);
            return res.status(400).send({
                msg: "You must choose a successor that's a participant.",
                participants: participants,
            });
        }

        // if a successor was chosen
        if (successorId) {
            // set successor's isAdmin value to true
            Participant.update(
                {
                    isAdmin: true,
                },
                {
                    where: {
                        userId: successorId,
                    },
                }
            ).catch((err) => {
                // catch any errors
                let msg = err.message || "Some error occurred while making successor an admin.";
                logger.error(msg + `${userId} - ${conversationId} - ${successorId}`);
                res.status(500).send({ msg });
            });
        }
    }

    let deletedParticipantRow = await Participant.destroy({
        where: {
            userId: userId,
            conversationId: conversationId,
        },
    }).catch((err) => {
        // catch any errors
        let msg = err.message || "Some error occurred while removing the user from the conversation.";
        logger.error(msg + `${userId} - ${conversationId}`);
        res.status(500).send({ msg });
    });

    if (!deletedParticipantRow) {
        let msg = "User couldn't be removed from conversation. Probably wasn't a participant.";
        logger.error(msg`${userId} - ${conversationId}`);
        return res.status(404).send({ msg });
    }

    // Retrieve the updated conversation with it's participants' info
    let conversation = await getConvo(conversationId);
    const participantIds = conversation.participants.map(({ id }) => Number(id));
    // Update participant list for the remaining participants.
    if (participantIds.length >= 1) {
        global.io.to([...participantIds]).emit("leaveConversation", { conversation });
    }

    //return a success msg
    let msg = "User successfully removed from the conversation!";
    logger.info(msg + `${userId} - ${conversationId}`);
    return res.status(200).send({ msg });
};

module.exports.addUserToConversation = async (req, res) => {
    const { user: { id: userId } } = req;
    const { newParticipants, conversationId } = req.body;
    // verify all data required has been provided
    if (newParticipants?.length < 1) {
        logger.error(userId + " failed to provide new participants to add to the conversation");
        return res.status(400).send({ msg: "No new participants" });
    }

    if (!conversationId) {
        logger.error(userId + " tried to add participants to a conversation without providing the conversation id");
        return res.status(400).send({ msg: "Conversation not provided" });
    }

    let t = await db.sequelize.transaction();
    try {
        // add the user ids passed as users in the conversation
        await Promise.all(newParticipants.map(async (id) =>
            await Participant.create({ userId: id, conversationId, isAdmin: false }, { transaction: t })));

        await t.commit();

        // retrieve the updated conversation with it's participants' info
        let conversation = await getConvo(conversationId);

        const newParticipantsIds = newParticipants.map( id => Number(id));
        const participantIds = conversation.participants.map(({ id }) => Number(id));
        // Send the new conversation emit to the new participants.
        global.io.to([...newParticipantsIds]).emit("newConversation", { conversation });
        // Send Update conversation to the current participants.
        global.io.to([...participantIds]).emit("newConversationParticipants", { conversation });

        // return a success message
        const msg = "Conversation successfully updated";
        logger.info(msg + ":" + conversationId);
        return res.status(201).send({ msg });
    } catch (e) {
        // abort transaction due to error
        await t.rollback();

        if (e.message.includes("insert or update on table")) {
            logger.error(`At least one of the participants were invalid when trying to create the
                conversation: ${userId} - ${newParticipants}`);
            return res.status(404).send({ msg: "At least one of your participants isn't a valid user" });
        }

        const msg = e.message || "Some error occurred while updating the Conversation.";
        logger.error(msg);
        return res.status(500).send({ msg });
    }
};

/**
 *
 * @param {Number} conversationId
 * @returns the conversation's info including participants list (w/ isAdmin values)
 */
const getConvo = async(conversationId) => {
    return await Conversation.findByPk(conversationId, {
        attributes: ["id", "title", "imageUrl", "createdAt"],
        // get each participant's info from the Users table
        include: {
            model: User,
            as: "participants",
            // specify what atributes you want returned
            attributes: ["displayName", "imageUrl", "id", "booptag"],
            // Prevents the entire belongs-to-many mapping object (Participant)
            // from being returned
            through: { attributes: ["isAdmin"] },
        },
    });
};