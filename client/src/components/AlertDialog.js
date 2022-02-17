import { React, useState } from "react";

import Modal from "./Modal";

const AlertDialog = ({ handleClose, title, message, closeMessage="Okay" }) => {
    return (
        <Modal onClose={handleClose} center>
            <div id="alert-dialog">
                <header>
                    <span>{title}</span>
                    <span className="xbutton" onClick={handleClose}>&times;</span>
                </header>
                <main>{message}</main>
                <footer>
                    <button autoFocus onClick={handleClose}>{closeMessage}</button>
                </footer>
            </div>
        </Modal>
    );
};

const useAlertDialog = () => {
    const [messageDialog, setMessageDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    return {
        display: args => setMessageDialog({ ...args, open: true }),
        ...messageDialog,
        close: () => {
            setMessageDialog({
                title: "",
                message: "",
                open: false
            });
        }
    };
};

export {
    AlertDialog,
    useAlertDialog
};