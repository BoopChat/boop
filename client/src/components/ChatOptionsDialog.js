import React from "react";

import Modal from "./Modal";

const optionsEnum = {
    noAction: 0,
    successor: 1,
    leave: 2
};

const ChatOptionsDialog = ({ onClose, img, title, participants, addUsers }) => {

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
                <button onClick={addUsers} className="addUsersBtn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20">
                        <path d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 254 224
                            256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3C0 496.5 15.52 512 34.66 512h378.7C432.5 512
                            448 496.5 448 477.3C448 381.6 370.4 304 274.7 304zM616 200h-48v-48C568 138.8 556.3 128 544
                            128s-24 10.75-24 24v48h-48C458.8 200 448 210.8 446 224s10.75 24 24 24h48v48C520 309.3 530.8
                            320 544 320s24-10.75 24-24v-48h48C629.3 248 642 237.3 640 224S629.3 200 616 200z"/></svg>
                    Add Users</button>
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