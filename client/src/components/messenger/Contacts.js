import plus from "../../assets/plus.svg";
import ContactItem from "./ContactItem";
import { ContactsController } from "./controllers/Contacts";
import { AlertDialog, useAlertDialog } from "./dialogs/AlertDialog";
import Modal from "./dialogs/Modal";

import { React, useState, useEffect } from "react";

import { useSelector } from "react-redux";

const AddContactDialog = ({ onClose }) => {
    const [email, setEmail] = useState("");

    const handleClose = () => onClose(email);
    const handleChange = (e) => setEmail(e.target.value);

    return (
        <Modal onClose={handleClose} center>
            <div id="add-contact-dialog">
                <header>Add a contact by email</header>
                <main>
                    <input
                        type="email"
                        name="email"
                        placeholder="email..."
                        value={email}
                        onChange={handleChange}
                        className="addContact"
                    />
                    <button onClick={() => handleClose()} name="add" className="addContact">Add</button>
                </main>
            </div>
        </Modal>
    );
};

const Contacts = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const alertDialog = useAlertDialog();

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
            if (!contacts.success) {
                alertDialog.display({
                    title: "Error",
                    message: "There was an error retrieving your contacts"
                });
            }
        };
        runAsync();
    }, []);

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
                        message: result.msg
                    });
            };
            runAsync();
        }
    };

    return (
        <div id="contact_container">
            { alertDialog.open ?
                <AlertDialog
                    handleClose={alertDialog.close}
                    title={alertDialog.title}
                    message={alertDialog.message}
                /> :<></>
            }
            <div className="main_panel_header">
                <h1>Contacts</h1>
                <button className="options" title="add contact" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options"/>
                </button>
                { dialogOpen ? <AddContactDialog onClose={addContact}/> : <></> }
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
