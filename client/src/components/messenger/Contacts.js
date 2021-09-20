import plus from "../../assets/plus.svg";
import ContactItem from "./ContactItem";
import { ContactsController } from "./controllers.js/Contacts";

import {React, useState, useEffect} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { useSelector } from "react-redux";

const AddContactDialog = ({open, onClose}) => {
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

const Contacts = ({selectConversation}) => {
    const [addOpen, setAddOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [init, setInit] = useState(false);

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        if (!init) { // if this is the first time rendering, get user contacts from server
            (async () => setContacts(await ContactsController.getContacts( token )))();
            setInit(true);
        }
    }, [init]);

    const handleClickAdd = () => setAddOpen(true);

    const addContact = (email) => {
        setAddOpen(false); // close add dialog
        // ask the server to add the user with this email to user's contacts
        if (email)
            (async () => {
                let result = ContactsController.addContact(token, email);
                if (result.success)
                    setContacts(contacts.length > 0 ? [...contacts, result.contact]: [result.contact]);
                else // display error message
                    alert(result.msg);
            })();
    };

    const switchConvo = contactId => {
        const {id, title} = ContactsController.startConvo(contactId);

        if (id) {
            // update the conversation panel to display messages by passing the convo id
            // and title returned by the server
            selectConversation(id, title);
        }
    };

    return (
        <div id="contact_container">
            <div className="main_panel_header">
                <h1>Contacts</h1>
                <button className="options" title="options" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options"/>
                </button>
                <AddContactDialog open={addOpen} onClose={addContact} />
            </div>
            <div id="contacts">
                {contacts.length > 0 ? contacts.map((contact, i) =>
                    <ContactItem
                        img={contact.contactInfo.imageUrl}
                        username={contact.contactInfo.displayName}
                        status={ContactsController.evaluateStatus(contact.contactInfo.lastActive)}
                        key={i}
                        onClick={() => switchConvo(contact.contactInfo.contactId)}
                    />
                ) : <span>You have no contacts :(</span>}
            </div>
        </div>
    );
};

export default Contacts;
