import Plus from "../../assets/icons/plus";
import ContactItem from "./ContactItem";
import { ContactsController } from "./controllers/Contacts";
import { AlertType, useAlertDialogContext } from "./dialogs/AlertDialog";
import Modal from "./dialogs/Modal";
import SearchBox from "./SearchBox";
import { useSearchContext } from "./hooks/SearchContext";

import { React, useState, useEffect } from "react";

import { useSelector } from "react-redux";

const AddContactDialog = ({ onClose }) => {
    const [email, setEmail] = useState("");

    const handleClose = btnClicked => onClose(email, btnClicked);
    const handleChange = (e) => setEmail(e.target.value);

    return (
        <Modal onClose={() => handleClose(false)} center>
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
                    <button onClick={() => handleClose(true)} name="add" className="addContact">Add</button>
                </main>
            </div>
        </Modal>
    );
};

const Contacts = () => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const { display: displayDialog } = useAlertDialogContext();
    const { search } = useSearchContext();

    // Get the token and userInfo from the users global state.
    const { token, userInfo: { displayName, imageUrl } } = useSelector((state) => state.user);

    useEffect(() => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
            if (!contacts.success) {
                displayDialog({
                    title: "Error",
                    message: "There was an error retrieving your contacts",
                    type: AlertType.Error
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

    const addContact = (email, btnClicked) => {
        setDialogOpen(false); // close add dialog

        if (!btnClicked) return; // user clicked outside the dialog (i.e. didnt click add)

        // ask the server to add the user with this email to user's contacts
        if (email) {
            const runAsync = async () => {
                let result = await ContactsController.addContact(token, email);
                if (result.success) // add new contact to the back of the list
                    setContacts(contacts.length > 0 ? [...contacts, result.contact]: [result.contact]);
                else // display error message
                    displayDialog({
                        title: "Error",
                        message: result.msg,
                        type: AlertType.Error
                    });
            };
            runAsync();
        } else {
            displayDialog({
                title: "Error",
                message: "You need to enter an email to add a contact",
                type: AlertType.Error
            });
        }
    };

    const filterContacts = ({ contactInfo: { displayName } }) => {
        return search === "" || displayName.toLowerCase().includes(search.toLowerCase());
    };

    const getRelevancy = ({ contactInfo: { displayName } }) => {
        if (search === displayName) // highest relevance, search matches contact (even in case)
            return 4;
        else if (search.toLowerCase() === displayName.toLowerCase()) // search matches (but not case)
            return 3;
        else if (displayName.startsWith(search)) // search is first part of the contact's name (case matched)
            return 2;
        else if (displayName.toLowerCase().startsWith(search.toLowerCase()))
            return 1; // search is first part of the contact's name (case not matched)
        else return 0;
    };

    const sortContacts = (a, b) => getRelevancy(b) - getRelevancy(a);

    return (
        <div id="contact_container">
            <div className="main_panel_header">
                <div className="img_and_title">
                    <img src={imageUrl} alt={displayName} className="profile_img_mobile"/>
                    <h1>Contacts</h1>
                </div>
                <button className="options" title="add contact" onClick={() => handleClickAdd()}>
                    <Plus/>
                </button>
                { dialogOpen ? <AddContactDialog onClose={addContact}/> : <></> }
            </div>
            <SearchBox id="search_mobile"/>
            <div id="contacts">
                {contacts.length > 0 ? contacts.filter(filterContacts).sort(sortContacts).map((contact, i) =>
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
