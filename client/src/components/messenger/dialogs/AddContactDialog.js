import React, { useState } from "react";

import Modal from "./Modal";
import { ContactsController } from "../controllers/Contacts";

const AddContactDialog = ({ onAddAction, token }) => {
    const [email, setEmail] = useState("");

    const handleChange = (e) => setEmail(e.target.value);

    const addContact = btnClicked => {
        if (!btnClicked) return onAddAction({}); // user clicked outside the dialog (i.e. didnt click add)

        // ask the server to add the user with this email to user's contacts
        if (email) {
            const runAsync = async () => {
                let result = await ContactsController.addContact(token, email);
                if (result.success)
                    onAddAction({ contact: result.contact });
                else // return error
                    onAddAction({ error: result.msg });
            };
            runAsync();
        } else
            onAddAction({ error: "You need to enter an email to add a contact" });
    };

    return (
        <Modal onClose={() => addContact(false)} center>
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
                    <button onClick={() => addContact(true)} name="add" className="addContact">Add</button>
                </main>
            </div>
        </Modal>
    );
};

export default AddContactDialog;