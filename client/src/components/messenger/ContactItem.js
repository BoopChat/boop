import { React, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";

import { ContactsController } from "./controllers/Contacts";
import { Alert } from "../AlertDialog";
import trash from "../../assets/trash.svg";

const ContactMenuDialog = ({ open, onClose, img, username }) => {

    const handleClose = () => onClose();

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle style={ { textAlign: "center" } } id="simple-dialog-title">{username}</DialogTitle>
            <img src={img} alt="user image"/>
        </Dialog>
    );
};

const ConfirmDialog = ({ open, onClose, username }) => {

    const handleClose = confirm => onClose(confirm);

    return (
        <Dialog onClose={() => handleClose(false)} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle style={ { textAlign: "center" } } id="simple-dialog-title">
                <b>Delete contact</b> {username} ?
                <hr/>
                <button className="btn_confirm" onClick={() => handleClose(true)}>Yes</button>
                <br/>
                <button className="btn_deny" onClick={() => handleClose(false)}>Cancel</button>
            </DialogTitle>
        </Dialog>
    );
};

const ContactItem = ({ img, username, status="offline", id, triggerRefresh }) => {

    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const handleClickContact = () => setImageDialogOpen(true);
    const closeContactImage = () => setImageDialogOpen(false);

    const alertDialog = Alert.useAlertDialog();

    const token = useSelector((state) => state.user.token);

    const confirmDelete = () => setConfirmDialogOpen(true);

    const deleteContact = confirm => {
        setConfirmDialogOpen(false); // close confirm dialog
        if (confirm) { // if user confirmed to delete the contact
            const runAsync = async () => {
                let result = await ContactsController.deleteContact(token, id);
                alertDialog.display({
                    title: result.success ? "Success" : "Error",
                    message: result.msg,
                    open: true
                });
            };
            runAsync();
            triggerRefresh();
        }
    };

    return (
        <div className="contact_item">

            <ContactMenuDialog open={imageDialogOpen} onClose={closeContactImage} img={img} username={username}/>
            <ConfirmDialog open={confirmDialogOpen} onClose={deleteContact} username={username}/>
            <div className="img_and_name">
                <img onClick={handleClickContact} src={img} alt="contact_img"/>
                <span>{username}</span>
            </div>

            <Alert.AlertDialog
                open={alertDialog.open}
                handleClose={alertDialog.close}
                title={alertDialog.title}
                message={alertDialog.message}
            />

            <div className="trash_and_status">
                <div className={"status status_" + status}></div>
                <button className="trash_btn" id="deleteButton" onClick={confirmDelete}>
                    <img src={trash} alt="Delete"/>
                </button>
            </div>
        </div>
    );
};

export default ContactItem;
