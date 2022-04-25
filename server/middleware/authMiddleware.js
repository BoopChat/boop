const logger = require("../logger").setup();
const db = require("../models");
const Participant = db.Participant;

module.exports.isParticipant = async (req, res, next) => {
    let userId = req.user.id;
    let conversationId = req.params.conversationId;

    //check if the user is a participant of the conversation
    let isParticipant = await Participant.findOne({
        where: {
            userId: userId,
            conversationId: conversationId,
        },
    });

    if (!isParticipant) {
        switch (req.method) {
            case "GET":
                logger.error(`Cant get messages because user [${userId}]
                is not a participant of the conversation ${conversationId}`);

                break;

            case "POST":
                logger.error(`User [${userId}] tried adding a message to a conversation
                    they are not a participant of: ${conversationId}`);
                break;

            default:
                console.log("method isn't GET or POST");
                break;
        }
        return res.status(404).send({ msg: "You are not a participant in this conversation" });
    }

    next();
};