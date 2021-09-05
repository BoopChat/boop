const db = require("../models");
const Conversation = db.Conversation;
const Participant = db.Participant;
const User = db.User;

// Retrieve all Conversations in the database
module.exports.getAllConversations = async (req, res) => {
    let conversations = await Conversation.findAll();
    return res.send(conversations);
}


// Create and Save a new Conversation
module.exports.addConversation = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    // Validate request
    if (
        !user_id
        ) {
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
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Conversation."
        });
    });
    
    let participants = req.body.participants
    participants.push(user_id)//add the user to the array of participants
    
    async function addParticipants () { // function that adds all users in the participants array as participants in the conversation
        await Promise.all(participants.map(async (participant) => {
            var is_admin = (participant == user_id) ?  true : false;// if this is the user that created the chat make them the admin
            Participant.create({ // create the association between the user and the conversation
                user_id : participant,
                conversation_id: conversation.id,
                is_admin: is_admin
            })
        }));
    }

    addParticipants();// add the participants

    return res.send({message:"Conversation successfully created!", conversation});//return a success message + the newly created conversation
};

module.exports.getConversations = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    let user = await User.findByPk(user_id,{//get user and all conversations
        include: {// get the conversation info
            model: Conversation,
            as: "conversationList",
            attributes:["id", "title", "image_url", "user_editable_image", "user_editable_title"], // specify what atributes you want returned
            through: {attributes: []}, // Prevents the belongs-to-many mapping object (Participant) from being returned
            include: { // get each conversation's participants' info from the Users table
                model: User,
                as: "participants",
                attributes:["id", "display_name", "image_url"], // specify what atributes you want returned
                through: {attributes: ["is_admin"]} // Prevents the entire belongs-to-many mapping object (Participant) from being returned, just returns Participant -> is_admin
            }
        }
    });

    if (!user) return res.status(404).send("user not found");
    return res.send(user);
}