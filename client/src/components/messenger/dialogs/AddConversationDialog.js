import React, { useState } from "react";

import Modal from "./Modal";

const AddConversationDialog = ({ onClose, contacts }) => {
    const [details, setDetails] = useState({
        list: [],
        title: "",
    });

    const handleClose = btnClicked => {
        onClose({ ...details, btnClicked });
        setDetails({ // reset details
            list: [],
            title: "",
        });
    };
    const handleListChange = (e) => {
        // if checkbox is checked then add it to the list else remove it from the list
        let newList = e.target.checked
            ? [...details.list, { id: e.target.value, displayName: e.target.name }]
            : details.list.filter(item => item.id !== e.target.value);
        setDetails({ ...details, list: newList });
    };
    const handleTitleChange = (e) => setDetails({ ...details, title: e.target.value });

    return (
        <Modal onClose={() => handleClose(false)} center>
            <div id="add-convo-dialog">
                <header>Create a conversation</header>
                <main>
                    <input
                        type="text"
                        placeholder="Conversation Title"
                        value={details.title}
                        onChange={handleTitleChange}
                        className="addConversation"
                    />
                    <ul className="add_participants">
                        {contacts.map((contact) => (
                            <li key={contact.contactId}
                                title={contact.contactInfo.displayName + "#" + contact.contactId}>
                                <div className="img_and_name">
                                    <img src={contact.contactInfo.imageUrl} alt="contact_img" />
                                    <div>
                                        <span className="displayName">{contact.contactInfo.displayName}</span>
                                        <span className="id">{"#" + contact.contactId}</span>
                                    </div>
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
                    <button onClick={() => handleClose(true)} name="create" className="addConversation">Create</button>
                </footer>
            </div>
        </Modal>
    );
};

export default AddConversationDialog;