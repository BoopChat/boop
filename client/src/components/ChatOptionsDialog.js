import React from "react";

import Modal from "./Modal";

const optionsEnum = {
    noAction: 0,
    successor: 1,
    leave: 2
};

const ChatOptionsDialog = ({ onClose, img, title, participants }) => {

    const handleClose = value => onClose(value);

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
                    <span className="participant_label">{participants.length} participants</span>
                    {
                        participants.map((participant, key) =>
                            <div className="contact_item" key={key}>
                                <div className="img_and_name">
                                    <img src={participant.imageUrl} alt="participant_img" />
                                    <span>{participant.displayName}</span>
                                </div>
                            </div>
                        )
                    }
                    <hr />
                    <p></p>
                </main>
                <footer>
                    <button className="btn_positive"
                        onClick={() => handleClose(optionsEnum.successor)}>Set Successor</button>
                    <button className="btn_leave"
                        onClick={() => handleClose(optionsEnum.leave)}>Leave Conversation</button>
                    <p></p>
                </footer>
            </div>
        </Modal>
    );
};

export { optionsEnum, ChatOptionsDialog };