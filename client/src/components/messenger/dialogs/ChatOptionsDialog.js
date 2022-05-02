import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Modal from "./Modal";
import ViewContactDialog from "./ViewContactDialog";
import { AlertType, useAlertDialogContext } from "./AlertDialog";

import { ContactsController } from "../controllers/Contacts";

const optionsEnum = {
    noAction: 0,
    leave: 1
};

const ChatOptionsDialog = ({ onClose, img, title, participants, addUsers }) => {
    const [participantDialog, setParticipantDialog] = useState({ img: "", username: "", booptag: "", open: false });
    const [contacts, setContacts] = useState([]);

    const { token, userInfo: { id } } = useSelector((state) => state.user);

    const { display: displayDialog } = useAlertDialogContext();

    useEffect(() => {
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            setContacts(contacts.success ? contacts.contactList : []);
        };
        runAsync();
    }, []);

    const handleClickContact = (participant) => {
        setParticipantDialog({
            img: participant.imageUrl,
            username: participant.displayName,
            booptag: participant.booptag,
            open: true
        });
    };

    const closeContactImage = () => setParticipantDialog({ img: "", username: "", booptag: "", open: false });

    const handleClose = value => onClose(value);

    const isInContacts = participant =>
        !((participant.id === id) || contacts.find(contact => contact.contactId === participant.id));

    const addContact = (booptag) => {
        const runAsync = async () => {
            let result = await ContactsController.addContact(token, booptag);

            if (result.success) {
                const { contact } = result;
                setContacts(contacts.length > 0 ? [...contacts, contact]: [contact]);
                displayDialog({
                    title: "Success",
                    message: contact.contactInfo.displayName + " added successfully",
                    type: AlertType.Success
                });
            } else displayDialog({ title: "Error", message: result.msg, type: AlertType.Error });
        };
        runAsync();
    };

    return (
        <Modal onClose={() => handleClose(optionsEnum.noAction)}>
            <div id="chat_options_dialog">
                <header>
                    <span>{title}</span>
                    <span className="xbutton" onClick={() => handleClose(optionsEnum.noAction)}>&times;</span>
                </header>
                <main>
                    <img src={img} alt="chat" className="chat_image_options" />
                    <p></p>
                    <hr />
                    <section className="participants_description">
                        <span className="participant_label">Participants</span>
                        <span className="participants_count">{participants.length}</span>
                    </section>
                    { participantDialog.open ?
                        <ViewContactDialog onClose={closeContactImage} img={participantDialog.img}
                            username={participantDialog.username} booptag={participantDialog.booptag}/> :
                        <></>
                    }
                    <section className="participants">{
                        participants.map((participant, key) =>
                            <div className="contact_item" key={key}
                                title={`${participant.displayName} (${participant.booptag})`}>
                                <div className="img_and_name" onClick={() => handleClickContact(participant)}>
                                    <img src={participant.imageUrl} alt="participant_img" />
                                    <span className="displayName">{participant.displayName}</span>
                                </div>
                                <div>{ isInContacts(participant) ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20"
                                        height="20" className="green addContact"
                                        onClick={() => addContact(participant.booptag)}>
                                        <path d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96
                                            128S153.3 254 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5
                                            15.52 512 34.66 512h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304
                                            274.7 304zM616 200h-48v-48C568 138.8 556.3 128 544 128s-24 10.75-24
                                            24v48h-48C458.8 200 448 210.8 446 224s10.75 24 24 24h48v48C520 309.3 530.8
                                            320 544 320s24-10.75 24-24v-48h48C629.3 248 642 237.3 640 224S629.3
                                            200 616 200z"/>
                                    </svg> : <></>
                                } { participant.Participant.isAdmin ?
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="28"
                                        className="adminCrown">
                                        <path d="M576 136c0 22.09-17.91 40-40 40c-.248 0-.4551-.1266-.7031-.1305l-50.54
                                            277.9C482 468.9 468.8 480 453.3 480H122.7c-15.44
                                            0-28.72-11.06-31.48-26.27L40.71 175.9C40.46 175.9 50.25 176 39.1 176c-22.09
                                            0-40-17.91-40-40S17.91 96 39.1 96s40 17.91 40 40c0 8.998-3.521 16.89-8.537
                                            23.57l89.63 71.7c15.91 12.73 39.5 7.544 48.61-10.68l57.6-115.2C255.1 100.34
                                            247.1 86.34 247.1 72C247.1 49.91 265.9 32 288 32s39.1 17.91 39.1 40c0
                                            14.34-7.963 26.34-19.3 33.4l57.6 115.2c9.112 18.22 32.71 23.4 48.61
                                            10.68l89.63-71.7C499.5 152.9 496 144.1 496 136C496 113.9 513.9 96 535 96S576
                                            113.9 576 136z"/>
                                    </svg>
                                    : <></>
                                }
                                </div>
                            </div>
                        )
                    }</section>
                    <hr />
                    <p></p>
                </main>
                <button onClick={addUsers} className="addUsersBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20">
                        <path d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 254 224
                            256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5 15.52 512 34.66 512h378.7C432.5 512
                            448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM616 200h-48v-48C568 138.8 556.3 128 544
                            128s-24 10.75-24 24v48h-48C458.8 200 448 210.8 446 224s10.75 24 24 24h48v48C520 309.3 530.8
                            320 544 320s24-10.75 24-24v-48h48C629.3 248 642 237.3 640 224S629.3 200 616 200z"/></svg>
                    Add Users</button>
                <footer>
                    <button className="btn_leave"
                        onClick={() => handleClose(optionsEnum.leave)}>Leave Conversation</button>
                    <p></p>
                </footer>
            </div>
        </Modal>
    );
};

export { optionsEnum, ChatOptionsDialog };