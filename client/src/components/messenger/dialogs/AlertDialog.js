import { React, useState } from "react";

import Modal from "./Modal";

const AlertType = { Success: 0, Warning: 1, Info: 2, Error: 3 };

const style = [
    { name: "success", icon: require("../../../assets/icons/check").default },
    { name: "warning", icon: require("../../../assets/icons/warning").default },
    { name: "info", icon: require("../../../assets/icons/info").default },
    { name: "error", icon: require("../../../assets/icons/exclamation").default }
];

const AlertDialog = ({ handleClose, title, message, closeMessage="Okay", type }) => {

    return (
        <Modal onClose={handleClose} center>
            <div id="alert-dialog">
                <header className={style[type].name}>
                    <span>{title}</span>
                    { style[type].icon({ className: style[type].name }) }
                    <span className="xbutton alert" onClick={handleClose}>&times;</span>
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
        message: "",
        type: AlertType.Info
    });

    return {
        display: args => setMessageDialog({ ...args, open: true }),
        ...messageDialog,
        close: () => {
            setMessageDialog({
                title: "",
                message: "",
                open: false,
                type: AlertType.Info
            });
        }
    };
};

export {
    AlertDialog,
    useAlertDialog,
    AlertType
};