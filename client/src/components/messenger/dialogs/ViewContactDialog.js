import React from "react";

import Modal from "./Modal";
import Clipboard from "../../Clipboard";

const ViewContactDialog = ({ onClose, img, username, booptag }) => {
    const handleClose = () => onClose();

    return (
        <Modal onClose={handleClose} center>
            <div id="view-contact-dialog">
                <header>
                    <span>{username}</span>
                    <div>
                        <span className="booptag">{booptag}</span>
                        <Clipboard name="booptag" value={booptag} />
                    </div>
                </header>
                <img src={img} alt="user"/>
            </div>
        </Modal>
    );
};

export default ViewContactDialog;