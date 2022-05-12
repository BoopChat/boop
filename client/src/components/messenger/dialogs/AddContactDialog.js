import React, { useState } from "react";

import Modal from "./Modal";
import { AlertType, useAlertDialogContext } from "./AlertDialog";
import { ContactsController } from "../controllers/Contacts";

const AddContactDialog = ({ onAddAction, token }) => {
    const [booptag, setBooptag] = useState("");
    const { display: displayDialog } = useAlertDialogContext();

    const handleChange = (e) => setBooptag(e.target.value);

    const addContact = btnClicked => {
        if (!btnClicked) return onAddAction({}); // user clicked outside the dialog (i.e. didnt click add)

        // ask the server to add the user with this booptag to user's contacts
        if (booptag) {
            const runAsync = async ({ booptag }) => {
                let result = await ContactsController.addContact(token, booptag);
                if (result.success)
                    onAddAction({ contact: result.contact });
                else // return error
                    onAddAction({ error: result.msg });
            };
            const { trimmedBooptag, valid, reason } = ContactsController.validateBooptag(booptag);
            if (valid)
                runAsync({ booptag: trimmedBooptag });
            else onAddAction({ error: reason });
        } else
            onAddAction({ error: "You need to enter a booptag to add a contact" });
    };

    const displayInfo = () => {
        displayDialog({
            title: "Booptag",
            message: `A user's booptag is their unique addable pin. Ask your friend
                to find their booptag in settings under Booptag to add them`,
            type: AlertType.Info
        });
    };

    return (
        <Modal onClose={() => addContact(false)} center>
            <div id="add-contact-dialog">
                <header>Add a contact by their
                    <span className="info" onClick={() => displayInfo()}> booptag</span></header>
                <main>
                    <input
                        type="text"
                        name="booptag"
                        placeholder="Enter a booptag..."
                        value={booptag}
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