const db = require("../models");
const Contact = db.Contact;
const SigninOption = db.SigninOption;
const User = db.User;

// Create and Save a new Contact
module.exports.addContact = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request (need to add check to ensure user exists) +
    // (prevent user from adding self as contact????)
    if (!req.body.contactEmail) {
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

    // return an error messageif the contact isn't a valid user
    if (!contact_info) {
        return res.status(404).send({
                message: `${req.body.contactEmail} is not a valid user.`
            });
    }

    //get the user_id for the contact
    var contact_id = contact_info.user_id;


    // creating the requested contact association
    let contact = await Contact.create({
        user_id: user_id,
        contact_id: contact_id
    })
    //catch any errors
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Contact."
        });
    });

    //return a success message + the newly created contact
    return res.send({message:"Contact successfully created!", contact});
};

module.exports.getContacts = async (req, res) => {
    let user_id = req.params.user_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    //get user and all contacts
    let user = await User.findByPk(user_id,{
        include: {
            model: Contact,
            as: "contactList",
            // get each contact's info from the Users table
            include: {
                model: User,
                as: "contactInfo"
            }
        }
    });

    if (!user) return res.status(404).send("user not found");
    return res.send(user);
}

// Delete a Contact
exports.deleteContact = async (req, res) => {
    let user_id = req.params.user_id;
    let contact_id = req.params.contact_id;
    // Need to check that user_id belongs to a valid user and
    // matches the id of the requesting user

    // Validate request
    if (!user_id || !contact_id) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
        return;
    }

    await Contact.destroy({
        where: {
            user_id: user_id,
            contact_id: contact_id
        }
    })
    .then(affectedRows => {
        if (affectedRows == 1) {
            res.send({
                message: "Contact was deleted successfully!"
            });
        } else {
            res.status(404).send({
                message: `Cannot delete Contact association with user_id=${user_id} and
                    contact_id=${contact_id}. Maybe Contact association was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: `Could not delete Contact association with user_id=${user_id}
                and contact_id=${contact_id}`
        });
    });
};

