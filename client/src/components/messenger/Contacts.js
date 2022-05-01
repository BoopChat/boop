import Plus from "../../assets/icons/plus";
import ContactItem from "./ContactItem";
import { ContactsController } from "./controllers/Contacts";
import { AlertType, useAlertDialogContext } from "./dialogs/AlertDialog";
import AddContactDialog from "./dialogs/AddContactDialog";
import SearchBox from "./SearchBox";
import { useSearchContext } from "./hooks/SearchContext";

import { React, useState, useEffect } from "react";

import { useSelector } from "react-redux";

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

    const addContact = ({ contact, error }) => {
        setDialogOpen(false); // close add dialog

        if (contact) { // add new contact to the back of the list
            setContacts(contacts.length > 0 ? [...contacts, contact]: [contact]);
            displayDialog({
                title: "Success",
                message: contact.contactInfo.displayName + " added successfully",
                type: AlertType.Success
            });
        }

        if (error) // if an error occured, display it
            displayDialog({ title: "Error", message: error, type: AlertType.Error });
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
                { dialogOpen ? <AddContactDialog onAddAction={addContact} token={token}/> : <></> }
            </div>
            <SearchBox id="search_mobile"/>
            <div id="contacts">
                {contacts.length > 0 ? contacts.filter(filterContacts).sort(sortContacts).map((contact, i) =>
                    <ContactItem
                        img={contact.contactInfo.imageUrl}
                        username={contact.contactInfo.displayName}
                        booptag={contact.contactInfo.booptag}
                        status={ContactsController.evaluateStatus(contact.contactInfo.lastActive)}
                        id={contact.contactId}
                        triggerRefresh={refreshContactList}
                        key={i}
                    />
                ) : <span className="empty">You don&apos;t have any contacts :(</span>}
            </div>
        </div>
    );
};

export default Contacts;
