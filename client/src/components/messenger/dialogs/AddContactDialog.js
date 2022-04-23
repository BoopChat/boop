import React, { useState } from "react";

import Modal from "./Modal";
import { AlertType, useAlertDialogContext } from "./AlertDialog";
import { ContactsController } from "../controllers/Contacts";

const AddContactDialog = ({ onAddAction, token }) => {
    const [displayNameTag, setDisplayNameTag] = useState("");
    const { display: displayDialog } = useAlertDialogContext();

    const handleChange = (e) => setDisplayNameTag(e.target.value);

    const addContact = btnClicked => {
        if (!btnClicked) return onAddAction({}); // user clicked outside the dialog (i.e. didnt click add)

        // ask the server to add the user with this display tag to user's contacts
        if (displayNameTag) {
            const runAsync = async ({ displayName, id }) => {
                let result = await ContactsController.addContact(token, displayName, id);
                if (result.success)
                    onAddAction({ contact: result.contact });
                else // return error
                    onAddAction({ error: result.msg });
            };
            const { displayName, id, valid } = ContactsController.validateDisplayName(displayNameTag);
            if (valid)
                runAsync({ displayName, id });
            else onAddAction({ error: "You need to enter a valid boopchat tag (DisplayName#0000)." });
        } else
            onAddAction({ error: "You need to enter a boopchat tag to add a contact" });
    };

    const displayInfo = () => {
        displayDialog({
            title: "Boopchat Tag",
            message: `A user's boopchat tag is their display name along with their assigned id. Ask your friend
                to find their boopchat tag in settings under Display Name to add them`,
            type: AlertType.Info
        });
    };

    return (
        <Modal onClose={() => addContact(false)} center>
            <div id="add-contact-dialog">
                <header>Add a contact by their
                    <span className="info" onClick={() => displayInfo()}> boopchat tag</span></header>
                <main>
                    <input
                        type="text"
                        name="displayName"
                        placeholder="Enter a boopchat tag..."
                        value={displayNameTag}
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