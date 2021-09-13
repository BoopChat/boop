const db = require("../models");
const Conversation = db.Conversation;
const Participant = db.Participant;
const User = db.User;

// create a conversation
module.exports.addConversation = async (req, res) => {
    let userId = req.params.userId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!userId) {
        res.status(400).send({ msg: "Content can not be empty!" });
        return;
    }

    // create the conversation with the input attributes
    let conversation = await Conversation.create({
        title: req.body.title,
        imageUrl: req.body.imageUrl,
        // if the options were null set their values to false else use the input values
        userEditableImage: req.body.userEditableImage==null ? false :  req.body.userEditableImage,
        userEditableTitle: req.body.userEditableTitle==null ? false :  req.body.userEditableTitle,
    }).catch(err => { // catch any errors
        res.status(500).send({
            msg: err.message || "Some error occurred while creating the Conversation."
        });
    });

    // the participants' userIds will be passed in an array
    let participants = req.body.participants;

    // add user creating convo as admin
    Participant.create({
        userId: userId,
        conversationId: conversation.id,
        isAdmin: true
    });

    // add all other users in the participants array as participants in the conversation
    let isAdmin = participants.length == 1;
    participants.forEach(async (participant) => {
        // create the association between the user and the conversation
        Participant.create({
            userId : participant,
            conversationId: conversation.id,
            isAdmin: isAdmin
        });
    });

    //return a success message + the newly created conversation
    return res.status(201).send({msg:"Conversation successfully created!", conversation});
};

// Attempting to create a conversation using transactions
// module.exports.addConversation = async (req, res) => {
//     let userId = req.params.userId;
//     // Need to check that userId belongs to a valid user and
//     // matches the id of the requesting user

//     // Validate request
//     if (!userId) {
//         res.status(400).send({ msg: "Content can not be empty!" });
//         return;
//     }

//     try {
//         // Managed Transaction
//         let transaction = await db.sequelize.transaction();

//         //create the conversation with the input attributes
//         let conversation = await Conversation.create({
//             title: req.body.title,
//             imageUrl: req.body.imageUrl,
//             // if the options were null set their values to false else use the input values
//             userEditableImage: req.body.userEditableImage==null ? false :  req.body.userEditableImage,
//             userEditableTitle: req.body.userEditableTitle==null ? false :  req.body.userEditableTitle,
//         }, { transaction });

//         // the participants' userIds will be passed in an array
//         let participants = req.body.participants;

//         // add user creating convo as admin
//         await Participant.create({
//             userId: userId,
//             conversationId: conversation.id,
//             isAdmin: true
//         }, { transaction });

//         // add all other users in the participants array as participants in the conversation
//         let isAdmin = participants.length == 1;

//         try{
//             let transaction2 = await db.sequelize.transaction(); // Managed Transaction
//             participants.forEach(async (participant) => {
//                 // create the association between the user and the conversation
//                 await Participant.create({
//                     userId: participant,
//                     conversationId: conversation.id,
//                     isAdmin: isAdmin
//                 },
//                 { transaction: transaction2}).catch(err => {
//                     // transaction2.rollback()
//                     // transaction.rollback()
//                     return res.status(500).send({
//                         msg:
//                         err.message || "Some error occurred while creating the Conversation."
//                     });
//                 });
//             });
//             // everything worked as planned - commit the changes
//             // await transaction2.commit()
//         } catch (err){
//             // await transaction2.rollback()
//             // await transaction.rollback()

//             return res.status(500).send({
//                 msg:
//                 err.message || "Some error occurred while creating the Conversation."
//             });
//         }

//         // everything worked as planned - commit the changes
//         // await transaction.commit()
//         //return a success message + the newly created conversation
//         return res.status(201).send({msg:"Conversation successfully created!", conversation});
//     } catch (err){
//         // await transaction.rollback()

//         return res.status(500).send({
//             msg:
//             err.message || "Some error occurred while creating the Conversation."
//         });
//     }
// };

module.exports.getConversations = async (req, res) => {
    let userId = req.params.userId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    //get user and all conversations (where Participants.deletedAt is null)
    let user = await User.findByPk(userId,{
        // get the conversation info
        include: {
            model: Conversation,
            as: "conversationList",
            // specify what atributes you want returned
            attributes:["id", "title", "imageUrl"],
            // Prevent the belongs-to-many mapping object (Participant)
            // from being returned
            through: {attributes: []},
            // get each conversation's participants' info from the Users table
            include: {
                model: User,
                as: "participants",
                // specify what atributes you want returned
                attributes:["displayName"],
                // Prevents the entire belongs-to-many mapping object (Participant)
                // from being returned
                through: {attributes: []}
            }
        }
    });

    if (!user) return res.status(404).send({msg:"User not found"});
    return res.send({conversationList:user["conversationList"]});
};

// remove a user from a conversation
module.exports.leaveConversation = async (req, res) => {
    let userId = req.params.userId;
    // get the conversationId and id of the successor admin (successorId)) from the request body
    let conversationId = req.body.conversationId;
    let successorId = req.body.successorId;
    // Need to check that userId belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!userId|| !conversationId) {
        res.status(400).send({
            msg: "Content can not be empty!"
        });
        return;
    }

    // Get the participants' user ids and isAdmin values, along with the number of participants
    let participantsInfo = await Participant.findAndCountAll({
        where:{
            conversationId: conversationId
        },
        attributes:["userId", "isAdmin"],
        include:{
            model: User,
            as: "participantInfo",
            attributes: ["displayName"]
        }
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
        if(participant.isAdmin == true){
            adminsCount += 1;
        }
        // check if user is a participant
        if(participant.userId == userId){
            userIsParticipant = true;
            //if the user's an admin set userIsAdmin to true
            if(participant.isAdmin == true){
                userIsAdmin =true;
            }
        }
        // check if successor is a participant
        if(participant.userId == successorId){
            successorIsParticipant = true;
        }
    }

    // if the user isn't a participant return an error message
    if(!userIsParticipant){
        return res.status(404).send({msg: "Requesting user is not a participant of the conversation"});
    }

    // if this is the only participant delete the conversation, all messages and participants
    if(participantsCount == 1){
        let deletedConversationRow = await Conversation.destroy({
            where:{
                id: conversationId
            }
        }).catch(err => {//catch any errors
            res.status(500).send({
                msg:
                err.message || "Some error occurred while deleting the conversation."
            });
        });

        if(!deletedConversationRow){
            return res.send({msg:"Conversation couldn't be deleted. Probably didn't exist."});
        }


        //return a success msg
        return res.send({
            msg:"Conversation successfully deleted!"
        });
    }

    if(userIsAdmin == true){
        // if this is the last admin and they haven't chosen a successor
        if(adminsCount == 1 && !successorId){
            // return a msg letting the user know they must choose a successor and the list of participants
            return res.send({
                msg: "You're the only admin. You must choose a successor.",
                participants: participants
            });
        }

        // if this is the last admin and they chose a successor that's not a participant
        if(adminsCount == 1 && !successorIsParticipant){
            // return a msg letting the user know they must choose a successor that's a participant
            // and the list of participants
            return res.send({
                msg: "You must choose a successor that's a participant.",
                participants: participants
            });
        }

        // if a successor was chosen
        if(successorId){
            // set successor's isAdmin value to true
            Participant.update({
                isAdmin: true
            },
            {
                where:{
                    userId: successorId
                }
            }).catch(err => {// catch any errors
                res.status(500).send({
                    msg: err.message || "Some error occurred while making successor an admin."
                });
            });
        }
    }

    let deletedParticipantRow = await Participant.destroy({
        where:{
            userId : userId,
            conversationId: conversationId
        }
    }).catch(err => {// catch any errors
        res.status(500).send({
            msg:
            err.message || "Some error occurred while removing the user from the conversation."
        });
    });

    if(!deletedParticipantRow){
        return res.send({msg:"User couldn't be removed from conversation. Probably wasn't a participant."});
    }


    //return a success msg
    return res.send({
        msg:"User successfully removed from the conversation!"
    });
};
