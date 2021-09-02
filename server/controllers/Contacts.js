const db = require("../models");
const Contact = db.Contact;
const SigninOption = db.SigninOption;
const User = db.User;
const Op = db.Sequelize.Op;

// Create and Save a new User
module.exports.addContact = async (req, res) => {
    let user_id = req.params.user_id;//temporariry getting the user_id from the url

    // Validate request (need to add check to ensure user exists)
    if (
        !req.body.contactEmail 
        ) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    let contact = await SigninOption.findOne({//get user's id so it can be used as the contact_id
        where: {
            email: req.body.contactEmail
        }
    });
    var contact_id = contact.user_id;

    // console.log(`user_id = ${user_id}`);
    // console.log(`contact_id = ${contact_id}`);
    
    let contact1 = await Contact.create({// creating the original requested contact association
        user_id: user_id,
        contact_id: contact_id
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Contact."
        });
    });

    let contact2 = await Contact.create({// adding the user to their new contact's contact list
        user_id: contact_id,
        contact_id: user_id
    })
    .catch(err => {//catch any errors
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Contact."
        });
    });
    return res.send({message:"Contact successfully created!", contact1});//return a success message + the newly created contact
};

module.exports.getContacts = async (req, res) => {
    let user_id = req.params.user_id;//temporariry getting the user_id from the url

    let user = await User.findByPk(user_id,{//get user and all contacts
        include: {
            model: Contact,
            as: "contactList",
            include: {
                model: User,
                as: "contactInfo"
            }
        }
    });

    if (!user) return res.status(404).send("user not found");
    return res.send(user);
}

