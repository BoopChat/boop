import plus from "../../assets/plus.svg";
import ContactItem from "./ContactItem";
import { ContactsController } from "./controllers/Contacts";
import { Alert } from "../AlertDialog";

import { React, useState, useEffect } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { useSelector } from "react-redux";

const AddContactDialog = ({ open, onClose }) => {
    const [email, setEmail] = useState("");

    const handleClose = () => onClose(email);
    const handleChange = (e) => setEmail(e.target.value);

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Add a contact by email</DialogTitle>
            <input
                type="email"
                name="email"
                placeholder="email..."
                value={email}
                onChange={(e) => handleChange(e)}
                className="addContact"
            />
            <button onClick={() => handleClose()} name="add" className="addContact">Add</button>
        </Dialog>
    );
};

const Contacts = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [init, setInit] = useState(false);
    const alertDialog = Alert.useAlertDialog();

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (!init) { // if this is the first time rendering, get user contacts from server
            const runAsync = async () => {
                let contacts = await ContactsController.getContacts(token);
                setContacts(contacts.success ? contacts.contactList : []);
            };
            runAsync();
            setInit(true);
        }
    }, [init]);

    const refreshContactList = () => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
        };
        runAsync();
    };

    const handleClickAdd = () => setDialogOpen(true);

    const addContact = (email) => {
        setDialogOpen(false); // close add dialog
        // ask the server to add the user with this email to user's contacts
        if (email) {
            const runAsync = async () => {
                let result = await ContactsController.addContact(token, email);
                if (result.success) // add new contact to the back of the list
                    setContacts(contacts.length > 0 ? [...contacts, result.contact]: [result.contact]);
                else // display error message
                    alertDialog.display({
                        title: "Error",
                        message: result.msg,
                        open: true
                    });
            };
            runAsync();
        }
    };

    return (
        <div id="contact_container">
            <Alert.AlertDialog
                open={alertDialog.open}
                handleClose={alertDialog.close}
                title={alertDialog.title}
                message={alertDialog.message}
            />
            <div className="main_panel_header">
                <h1>Contacts</h1>
                <button className="options" title="options" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options"/>
                </button>
                <AddContactDialog open={dialogOpen} onClose={addContact} />
            </div>
            <div id="contacts">
                {contacts.length > 0 ? contacts.map((contact, i) =>
                    <ContactItem
                        img={contact.contactInfo.imageUrl}
                        username={contact.contactInfo.displayName}
                        status={ContactsController.evaluateStatus(contact.contactInfo.lastActive)}
                        id={contact.contactId}
                        triggerRefresh={refreshContactList}
                        key={i}
                    />
                ) : <span>You have no contacts :(</span>}
            </div>
        </div>
    );
};

export default Contacts;
