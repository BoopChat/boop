import React, { useState, useContext } from "react";

import Modal from "./Modal";

const AlertType = { Success: 0, Warning: 1, Info: 2, Error: 3 };

const AlertDialogContext = React.createContext();
const useAlertDialogContext = () => useContext(AlertDialogContext);

const AlertDialogProvider = ({ children }) => {
    const [messageDialog, setMessageDialog] = useState({});
    const defaultArgs = { open: false, title: "", message: "", closeMessage: "Okay", type: AlertType.Info, cb: null };

    const display = args => setMessageDialog({ ...defaultArgs, ...args, open: true });
    const close = () => setMessageDialog({ ...defaultArgs, open: false });

    return (
        <AlertDialogContext.Provider value={{ display, close, messageDialog }}>
            { children }
        </AlertDialogContext.Provider>
    );
};

const style = [
    { name: "success", icon: require("../../../assets/icons/check").default },
    { name: "warning", icon: require("../../../assets/icons/warning").default },
    { name: "info", icon: require("../../../assets/icons/info").default },
    { name: "error", icon: require("../../../assets/icons/exclamation").default }
];

const AlertDialog = () => {
    const { messageDialog: { open, title, message, closeMessage, type, cb },
        close: handleClose } = useAlertDialogContext();

    const close = () =>  {
        if (cb)
            cb();
        handleClose();
    };

    return (
        open ? <Modal onClose={close} center>
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
        </Modal> : <></>
    );
};

export {
    AlertDialog,
    useAlertDialogContext,
    AlertDialogProvider,
    AlertType
};