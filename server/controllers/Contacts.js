const logger = require("../logger").setup();
const db = require("../models");
const Contact = db.Contact;
const User = db.User;

// Create and Save a new Contact
module.exports.addContact = async (req, res) => {
    let userId = req.user.id;

    // Validate request
    if (!req.body.contactDisplayName || !req.body.contactId) {
        logger.error(userId + " tried adding a contact without a display name or id");
        res.status(400).send({
            msg: "Cannot add a contact without their display name and id"
        });
        return;
    }

    // try to retrive contact's info
    let contactData = await User.findOne({
        where: {
            id: req.body.contactId,
            displayName: req.body.contactDisplayName
        },
        // specify what attributes you want returned
        attributes: ["id", "displayName", "imageUrl", "lastActive"]
    });

    // return an error message if the contact isn't a valid user
    if (!contactData) {
        logger.error(`${userId} tried adding invalid user: ${req.body.contactDisplayName}#${req.body.id}`);
        return res.status(404).send({ msg: `${req.body.contactDisplayName}#${req.body.id} is not a valid user.` });
    }

    //get the userId for the contact
    var contactId = contactData.id;

    // creating the requested contact association
    await Contact.create({
        userId: userId,
        contactId: contactId
    }).catch(err => { //catch any errors
        let msg = err.message || "Some error occurred while creating the Contact";
        logger.error(msg + `${userId} - ${contactId}`);
        res.status(500).send({ msg });
    });

    //return a success message + the newly created contact's info
    logger.info(`Contact successfully created for ${userId} - ${contactData.displayName}#${contactData.id}`);
    return res.status(201).send({ msg: "Contact successfully created!", contact: { contactId, contactData } });
};

module.exports.getContacts = async (req, res) => {
    let userId = req.user.id;

    try {
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
    } catch (e) {
        logger.error(e.message);
        return res.status(500).send({ msg: "A critical error occurred while fetching contacts" });
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
            res.status(200).send({ msg: "Contact deleted successfully" });
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