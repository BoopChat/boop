import plus from "../../assets/plus.svg";

import {React, useState, useEffect} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

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

const getContacts = async () => {
    // make request for the contacts of user with id 1 and wait for the json response
    const data = await (await fetch("/api/contacts/1", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })).json();
    // get the list of contacts if successful
    return data ? data.contactList : [];
};

const evaluateStatus = (lastActive) => {
    // for now status is either online or offline
    // if user not active within the last 5mins - offline
    let diff = Date.now() - (new Date(lastActive)).getTime();
    return diff > (5 * 60 * 1000) ? "offline": "online";
};

const Contacts = () => {
    const [addOpen, setAddOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (!init) { // if this is the first time rendering, get user contacts from server
            (async () => setContacts(await getContacts()))();
            setInit(true);
        }
    }, [init]);

    const handleClickAdd = () => setAddOpen(true);

    const handleClose = (email) => {
        setAddOpen(false); // close add dialog
        // ask the server to add the user with this email to user's contacts
        if (email)
            (async () => {
                const res = await fetch("/api/contacts/1", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contactEmail: email
                    })
                });

                const result = await res.json();
                if (res.status !== 201)
                    alert(result.message); // contact was not added ... display why
                else // add new contact to the back of the list
                    setContacts(contacts.length > 0 ? [...contacts, result.contact]: [result.contact]);
            })();
    };

    return (
        <div id="contact_container">
            <div className="main_panel_header">
                <h1>Contacts</h1>
                <button className="options" title="options" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options"/>
                </button>
                <AddContactDialog open={addOpen} onClose={handleClose} />
            </div>
            <div id="contacts">
                {contacts.length > 0 ? contacts.map((contact, i) =>
                    <ContactItem
                        img={contact.contactInfo.image_url}
                        username={contact.contactInfo.display_name}
                        user_id={contact.contact_id}
                        status={evaluateStatus(contact.contactInfo.last_active)}
                        key={i}
                    />
                ) : <span>You have no contacts :(</span>}
            </div>
        </div>
    );
};

export default Contacts;