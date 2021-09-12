const db = require("../models");
const Conversation = db.Conversation;
const Participant = db.Participant;
const User = db.User;

// Create and Save a new Conversation
module.exports.addConversation = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!user_id) {
        res.status(400).send({ msg: "Content can not be empty!" });
        return;
    }

    //create the conversation with the input attributes
    let conversation = await Conversation.create({
        title: req.body.title,
        image_url: req.body.image_url,
        // if the options were null set their values to false else use the input values
        user_editable_image: req.body.user_editable_image==null ? false :  req.body.user_editable_image,
        user_editable_title: req.body.user_editable_title==null ? false :  req.body.user_editable_title,
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            msg: err.message || "Some error occurred while creating the Conversation."
        });
    });

    // the participants' user_ids will be passed in an array
    let participants = req.body.participants;

    // add user creating convo as admin
    Participant.create({
        user_id: user_id,
        conversation_id: conversation.id,
        is_admin: true
    })

    // add all other users in the participants array as participants in the conversation
    let is_admin = participants.length == 1;
    await Promise.all(participants.map(async (participant) => {
        // create the association between the user and the conversation
        Participant.create({
            user_id : participant,
            conversation_id: conversation.id,
            is_admin: is_admin
        })
    }));

    //return a success message + the newly created conversation
    return res.status(201).send({msg:"Conversation successfully created!", conversation});
};

// get all a user's conversations
module.exports.getConversations = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    //get user and all conversations (where Participants.deleted_at is null)
    let user = await User.findByPk(user_id,{
        // get the conversation info
        include: {
            model: Conversation,
            as: "conversationList",
            // specify what atributes you want returned
            attributes:["id", "title", "image_url"],
            // Prevent the belongs-to-many mapping object (Participant)
            // from being returned
            through: {attributes: []},
            // get each conversation's participants' info from the Users table
            include: {
                model: User,
                as: "participants",
                // specify what atributes you want returned
                attributes:["display_name"],
                // Prevents the entire belongs-to-many mapping object (Participant)
                // from being returned
                through: {attributes: []}
            }
        }
    });

    if (!user) return res.status(404).send({msg:"User not found"});
    return res.send({conversationList:user["conversationList"]});
}

// remove a user from a conversation
module.exports.leaveConversation = async (req, res) => {
    let user_id = req.params.user_id;
    // get the conversation_id and id of the successor admin (successor_id)) from the request body
    let conversation_id = req.body.conversation_id;
    let successor_id = req.body.successor_id
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!user_id|| !conversation_id) {
        res.status(400).send({
        msg: "Content can not be empty!"
        });
        return;
    }

    // Get the participants' user ids and is_admin values, along with the number of participants
    let participants_info = await Participant.findAndCountAll({
        where:{
            conversation_id: conversation_id
        },
        attributes:["user_id", "is_admin"],
        include:{
            model: User,
            as: "participantInfo",
            attributes: ["display_name"]
        }
    })

    // The number of participants
    var participants_count = participants_info.count;
    // The participants' user ids and is_admin values
    var participants = participants_info.rows;
    // the number of admins
    var admins_count = 0;
    // whether or not the user is a participant
    var user_is_participant = false;
    // whether or not the user is an admin
    var user_is_admin = false;
    // whether or not the successor is a participant
    var successor_is_participant = false;

    // Get the number of admins (count how many participants have is_admin set to true)
    for (let participant of participants) {
        if(participant.is_admin == true){
            admins_count += 1;
        }
        // check if user is a participant
        if(participant.user_id == user_id){
            user_is_participant = true;
            //if the user's an admin set user_is_admin to true
            if(participant.is_admin == true){
                user_is_admin =true
            }
        }
        // check if successor is a participant
        if(participant.user_id == successor_id){
            successor_is_participant = true;
        }
    };

    // if the user isn't a participant return an error message
    if(!user_is_participant){
        return res.status(404).send({msg: "Requesting user is not a participant of the conversation"});
    }

    // if this is the only participant delete the conversation, all messages and participants
    if(participants_count == 1){
        let deleted_conversation_row = await Conversation.destroy({
            where:{
                id: conversation_id
            }
        })
        //catch any errors
        .catch(err => {
            res.status(500).send({
                msg:
                err.message || "Some error occurred while deleting the conversation."
            });
        });

        if(!deleted_conversation_row){
            return res.send({msg:"Conversation couldn't be deleted. Probably didn't exist."})
        }


        //return a success msg
        return res.send({
            msg:"Conversation successfully deleted!"
        });
    }

    if(user_is_admin == true){
        // if this is the last admin and they haven't chosen a successor
        if(admins_count == 1 && !successor_id){
            // return a msg letting the user know they must choose a successor and the list of participants
            return res.send({
                msg: "You're the only admin. You must choose a successor.",
                participants: participants
            });
        }

        // if this is the last admin and they chose a successor that's not a participant
        if(admins_count == 1 && !successor_is_participant){
            // return a msg letting the user know they must choose a successor that's a participant
            // and the list of participants
            return res.send({
                msg: "You must choose a successor that's a participant.",
                participants: participants
            });
        }

        // if a successor was chosen
        if(successor_id){
            // set successor's is_admin value to true
            let successor = Participant.update({
                is_admin: true
            },
            {
                where:{
                    user_id: successor_id
                }
            })
            //catch any errors
            .catch(err => {
                res.status(500).send({
                    msg: err.message || "Some error occurred while making successor an admin."
                });
            });
        }
    }

    let deleted_participant_row = await Participant.destroy({
        where:{
            user_id : user_id,
            conversation_id: conversation_id
        }
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            msg:
            err.message || "Some error occurred while removing the user from the conversation."
        });
    });

    if(!deleted_participant_row){
        return res.send({msg:"User couldn't be removed from conversation. Probably wasn't a participant."})
    }


    //return a success msg
    return res.send({
        msg:"User successfully removed from the conversation!"
    });
}
