import { React, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : <></>}
        </DialogTitle>
    );
};

const AlertDialog = ({ open, handleClose, title, message, closeMessage = "Okay" }) => {
    return (
        <div>
            <Dialog id="alert-dialog" onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    {title}
                </BootstrapDialogTitle>
                <DialogContent dividers>
                    <Typography gutterBottom>
                        {message}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        {closeMessage}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
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

export const Alert = {
    AlertDialog,
    useAlertDialog
};