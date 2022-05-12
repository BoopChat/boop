import React from "react";

import Modal from "./Modal";
import { ChatController } from "../controllers/Chat";

const MessageInfoDialog = ({ onClose, participants, message }) => {
    const getUnreadParticipants = participant => {
        return !message.readBy.includes(participant.id) && participant.id !== message.senderId;
    };

    const getReadParticipants = participant => {
        return message.readBy.includes(participant.id) && participant.id !== message.senderId;
    };

    return (
        <Modal onClose={onClose} center>
            <div id="message-info-dialog">
                <header>
                    <span>Message Info</span>
                    <span className="xbutton" onClick={onClose}>&times;</span>
                </header>
                <p>{ message.content }</p>
                <main>
                    <section>
                        <div className="participant_group_title">
                            <span>Sent {ChatController.evaluateElapsed(message.createdAt)} by</span>
                        </div>
                        { participants
                            .filter(participant => participant.id === message.senderId)
                            .map(participant => (
                                <div className="contact_item" key={participant.id}>
                                    <div className="img_and_name">
                                        <img src={participant.imageUrl} alt="participant" />
                                        <span>{participant.displayName}</span>
                                    </div>
                                </div>
                            ))}
                    </section>
                    <section>
                        <div className="participant_group_title">
                            <span>Read by</span>
                            <div className="circle_icon participants_read"></div>
                        </div>
                        { participants
                            .filter(getReadParticipants)
                            .map(participant => (
                                <div className="contact_item" key={participant.id}>
                                    <div className="img_and_name">
                                        <img src={participant.imageUrl} alt="participant" />
                                        <span>{participant.displayName}</span>
                                    </div>
                                </div>
                            ))}
                    </section>

                    <section>
                        <div className="participant_group_title">
                            <span>Awaiting</span>
                            <div className="circle_icon participants_unread"></div>
                        </div>
                        { participants
                            .filter(getUnreadParticipants)
                            .map(participant => (
                                <div className="contact_item" key={participant.id}>
                                    <div className="img_and_name">
                                        <img src={participant.imageUrl} alt="participant" />
                                        <span>{participant.displayName}</span>
                                    </div>
                                </div>
                            ))}
                    </section>
                </main>
            </div>
        </Modal>
    );
};

export default MessageInfoDialog;