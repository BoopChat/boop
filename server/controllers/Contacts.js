const logger = require("../logger");
const db = require("../models");
const Contact = db.Contact;
const SigninOption = db.SigninOption;
const User = db.User;

// Create and Save a new Contact
module.exports.addContact = async (req, res) => {
    let userId = req.user.id;

    // Validate request (need to add check to ensure user exists) +
    // (prevent user from adding self as contact????)
    if (!req.body.contactEmail) {
        logger.error(userId + " tried adding a contact with an email");
        res.status(400).send({
            msg: "Cannot add a contact without their email"
        });
        return;
    }

    //get user's id so it can be used as the contactId
    let contactData = await SigninOption.findOne({
        where: {
            email: req.body.contactEmail
        }
    });

    // return an error message if the contact isn't a valid user
    if (!contactData) {
        logger.error(userId + " tried adding invalid user: " + req.body.contactEmail);
        return res.status(404).send({ msg: `${req.body.contactEmail} is not a valid user.` });
    }

    //get the userId for the contact
    var contactId = contactData.userId;

    // creating the requested contact association
    await Contact.create({
        userId: userId,
        contactId: contactId
    }).catch(err => { //catch any errors
        let msg = err.message || "Some error occurred while creating the Contact";
        logger.error(msg + `${userId} - ${contactId}`);
        res.status(500).send({ msg });
    });

    // retrieve the contact's info
    let contactInfo = await User.findByPk(contactId, {
        // specify what attributes you want returned
        attributes: ["displayName", "imageUrl", "lastActive"]
    }).catch(err => { //catch any errors
        let msg = err.message || "Some error occurred while retieving the Contact's info";
        logger.error(msg + `${userId} - ${contactId}`);
        res.status(500).send({ msg });
    });

    //return a success message + the newly created contact's info
    logger.info(`Contact successfully created for ${userId} - ${contactInfo.displayName}`);
    return res.status(201).send({ msg: "Contact successfully created!", contact: { contactInfo: contactInfo } });
};

module.exports.getContacts = async (req, res) => {
    let userId = req.user.id;

    //get user and all contacts
    let user = await User.findByPk(userId, {
        include: {
            model: Contact,
            as: "contactList",
            // specify what attributes you want returned
            attributes: ["contactId"],
            // get each contact's info from the Users table
            include: {
                model: User,
                as: "contactInfo",
                // specify what attributes you want returned
                attributes: ["displayName", "imageUrl", "lastActive"]
            }
        }
    });

    if (!user) {
        logger.error("Couldn't get contacts for user [" + userId + "] because user not found");
        return res.status(404).send("We couldn't get your contacts because you shouldn't be here");
    } else {
        logger.info("Returned contact list for: " + userId);
        return res.status(200).send({ "contactList": user.contactList });
    }
};

// Delete a Contact
module.exports.deleteContact = async (req, res) => {
    let userId = req.user.id;
    let contactId = req.body.contactId;

    // Validate request
    if (!contactId) {
        logger.error(userId + " tried deleting a contact without their id");
        res.status(400).send({ msg: "Unable to delete contact" });
        return;
    }

    await Contact.destroy({
        where: {
            userId: userId,
            contactId: contactId
        }
    }).then(affectedRows => {
        if (affectedRows === 1) {
            logger.info("Contact was deleted successfully: " + contactId + " - " + userId);
            res.send({ msg: "Contact deleted successfully" });
        } else {
            let msg = `Cannot delete Contact association with userId=${userId} and
            contactId=${contactId}. Maybe Contact association was not found!`;
            logger.error(msg);
            res.status(404).send({ msg: "Unable to delete contact" });
        }
    }).catch(() => {
        let msg = `Could not delete Contact association with userId=${userId}
        and contactId=${contactId}`;
        logger.error(msg);
        res.status(500).send({ msg: "Unable to delete contact" });
    });
};