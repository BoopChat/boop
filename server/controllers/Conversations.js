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
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    //create the conversation with the input attributes
    let conversation = await Conversation.create({
        title: req.body.title,
        image_url: req.body.image_url,
        user_editable_image: req.body.user_editable_image,
        user_editable_title: req.body.user_editable_title,
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Conversation."
        });
    });

    // the participants' user_ids will be passed in an array
    let participants = req.body.participants;
    //add the user to the array of participants
    participants.push(user_id);

    // add all users in the participants array as participants in the conversation
    await Promise.all(participants.map(async (participant) => {
        // if this is the user that created the chat make them the admin
        var is_admin = (participant == user_id) ?  true : false;

        // create the association between the user and the conversation
        Participant.create({
            user_id : participant,
            conversation_id: conversation.id,
            is_admin: is_admin
        })
    }));

    //return a success message + the newly created conversation
    return res.send({message:"Conversation successfully created!", conversation});
};

module.exports.getConversations = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    //get user and all conversations
    let user = await User.findByPk(user_id,{
        // get the conversation info
        include: {
            model: Conversation,
            as: "conversationList",
            // specify what atributes you want returned
            attributes:["id", "title", "image_url", "user_editable_image",
                        "user_editable_title"],
            // Prevent the belongs-to-many mapping object (Participant)
            // from being returned
            through: {attributes: []},
            // get each conversation's participants' info from the Users table
            include: {
                model: User,
                as: "participants",
                // specify what atributes you want returned
                attributes:["id", "display_name", "image_url"],
                // Prevents the entire belongs-to-many mapping object (Participant)
                // from being returned, just returns Participant -> is_admin
                through: {attributes: ["is_admin"]}
            }
        }
    });

    if (!user) return res.status(404).send("user not found");
    return res.send(user);
}

// Add a user to an existing conversation
module.exports.addParticipantToConversation = async (req, res) => {
    let user_id = req.params.user_id;
    //get the conversation_id and the id of the user being added to the
    // conversation (participant_id) from the request body
    let conversation_id = req.body.conversation_id;
    let participant_id = req.body.participant_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!user_id|| !conversation_id || !participant_id) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    //check if the requesting user is a participant of the conversation
    let is_participant = await Participant.findOne({
        where: {
            user_id: user_id,
            conversation_id: conversation_id
        }
    })
    if (!is_participant)
        return res.status(404).send("requesting user is not a participant of \
                                    conversation");

    // add the new participant to the conversation using participant_id
    // passed in the body of the request
    let participant = await Participant.create({
        user_id : participant_id,
        conversation_id: conversation_id
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while adding the \
                user to the conversation."
        });
    });
    //return a success message + the newly participant association;
    return res.send({
        message:"User successfully added to the conversation!", participant
    });
}