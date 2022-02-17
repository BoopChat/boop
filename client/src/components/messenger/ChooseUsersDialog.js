import { React, useEffect, useState } from "react";

import { ContactsController } from "./controllers/Contacts";
import Modal from "../Modal";

const ChooseUsersDialog = ({ onClose, token, filterContacts }) => {
    const [list, setList] = useState([]);
    const [contacts, setContacts] = useState([]);

    const handleClose = btnClicked => {
        onClose({
            list: list.map(({ id }) => id),
            btnClicked
        });
        setList([]);
    };

    const handleListChange = (e) => {
        // if checkbox is checked then add it to the list else remove it from the list
        let newList = e.target.checked
            ? [...list, { id: e.target.value, displayName: e.target.name }]
            : list.filter(item => item.id !== e.target.value);
        setList(newList);
    };

    useEffect(() => {
        // if this is the first time rendering, get user contacts from server
        const runAsync = async () => {
            let result = await ContactsController.getContacts(token);
            if (result.success) {
                // remove the contacts that are already in the conversation from list of available contacts to add
                setContacts(result.contactList.filter(({ contactId }) =>
                    !filterContacts.some(({ id }) => contactId === id)));
            } else setContacts([]);
        };
        runAsync();
    }, []);

    return (
        <Modal onClose={() => handleClose(false)} center>
            <div id="add-convo-dialog">
                <header>Select users to add to conversation</header>
                <main>
                    <ul className="add_participants">
                        {contacts.map((contact) => (
                            <li key={contact.contactId}>
                                <div className="img_and_name">
                                    <img src={contact.contactInfo.imageUrl} alt="contact_img" />
                                    <span>{contact.contactInfo.displayName}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    name={contact.contactInfo.displayName}
                                    value={contact.contactId}
                                    onChange={handleListChange}
                                />
                            </li>
                        ))}
                    </ul>
                </main>
                <footer>
                    <button onClick={() => handleClose(true)} name="update" className="addConversation">Add</button>
                </footer>
            </div>
        </Modal>
    );
};

export default ChooseUsersDialog;