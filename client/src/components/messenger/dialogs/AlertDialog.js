import { React, useState } from "react";

import Modal from "./Modal";

const AlertType = { Success: 0, Warning: 1, Info: 2, Error: 3 };

const style = [
    { name: "success", icon: require("../../../assets/icons/check").default },
    { name: "warning", icon: require("../../../assets/icons/warning").default },
    { name: "info", icon: require("../../../assets/icons/info").default },
    { name: "error", icon: require("../../../assets/icons/exclamation").default }
];

const AlertDialog = ({ handleClose, title, message, closeMessage="Okay", type, cb }) => {
    const close = () =>  {
        if (cb)
            cb();
        handleClose();
    };

    return (
        <Modal onClose={close} center>
            <div id="alert-dialog">
                <header className={style[type].name}>
                    <span>{title}</span>
                    { style[type].icon({ className: style[type].name }) }
                    <span className="xbutton alert" onClick={close}>&times;</span>
                </header>
                <main>{message}</main>
                <footer>
                    <button autoFocus onClick={close}>{closeMessage}</button>
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
        type: AlertType.Info,
        cb: null
    });

    return {
        display: args => setMessageDialog({ ...args, open: true }),
        ...messageDialog,
        close: () => {
            setMessageDialog({
                title: "",
                message: "",
                open: false,
                type: AlertType.Info,
                cb: null
            });
        }
    };
};

export {
    AlertDialog,
    useAlertDialog,
    AlertType
};