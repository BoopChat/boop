const db = require("../models");
const Contact = db.Contact;
const SigninOption = db.SigninOption;
const User = db.User;
const Op = db.Sequelize.Op;

// Retrieve all Contact relationships in the database
module.exports.getAllContacts = async (req, res) => {
    let contacts = await Contact.findAll();
    return res.send(contacts);
}

// Create and Save a new Contact
module.exports.addContact = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    // Validate request (need to add check to ensure user exists) + (prevent user from adding self as contact????)
    if (
        !req.body.contactEmail 
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    //get user's id so it can be used as the contact_id
    let contact_info = await SigninOption.findOne({
        where: {
            email: req.body.contactEmail
        }
    });
    var contact_id = contact_info.user_id;


    // creating the requested contact association
    let contact = await Contact.create({
        user_id: user_id,
        contact_id: contact_id
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Contact."
        });
    });

    return res.send({message:"Contact successfully created!", contact});//return a success message + the newly created contact
};

module.exports.getContacts = async (req, res) => {
    let user_id = req.params.user_id;//temporarily getting the user_id from the url

    let user = await User.findByPk(user_id,{//get user and all contacts
        include: {
            model: Contact,
            as: "contactList",
            include: { // get each contact's info from the Users table
                model: User,
                as: "contactInfo"
            }
        }
    });

    if (!user) return res.status(404).send("user not found");
    return res.send(user);
}

