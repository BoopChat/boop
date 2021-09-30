import { useEffect, useState, React } from "react";
import { useSelector } from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import AlertDialog from "../AlertDialog";

import plus from "../../assets/plus.svg";
import ConversationItem from "./ConversationItem";
import { ConversationsController } from "./controllers/Conversations";
import { ContactsController } from "./controllers/Contacts";

const AddConversationDialog = ({ open, onClose, token }) => {
    const [details, setDetails] = useState({
        list: [],
        title: ""
    });
    const [contacts, setContacts] = useState([]);
    const [init, setInit] = useState(false);

    const handleClose = () => {
        onClose(details);
        setDetails({ // reset details
            list: [],
            title: ""
        });
    };
    const handleListChange = (e) => {
        // if checkbox is checked then add it to the list else remove it from the list
        let newList = e.target.checked ?
            [...details.list, e.target.value] :
            details.list.filter(item => item !== e.target.value);
        setDetails({ ...details, list: newList });
    };
    const handleTitleChange = (e) => setDetails({ ...details, title: e.target.value });

    useEffect(() => {
        if (!init) { // if this is the first time rendering, get user contacts from server
            const runAsync = async () => {
                let contacts = await ContactsController.getContacts(token);
                setContacts(contacts.success ? contacts.contactList : []);
            };
            runAsync();
            setInit(true);
        }
    }, [init]);

    return (
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle id="simple-dialog-title">Create a conversation</DialogTitle>
            <input
                type="text"
                placeholder="Conversation Title"
                value={details.title} onChange={handleTitleChange}
                className="addConversation"
            />
            <ul className="add_participants">
                {contacts.map(contact =>
                    <li key={contact.contactId}>
                        <img src={contact.contactInfo.imageUrl} alt="contact_img"/>
                        <span>{contact.contactInfo.displayName}</span>
                        <input
                            type="checkbox"
                            name="participant"
                            value={contact.contactId}
                            onChange={handleListChange}
                        />
                    </li>
                )}
            </ul>
            <button onClick={() => handleClose()} name="create" className="addConversation">Create</button>
        </Dialog>
    );
};


const Conversations = ({ selectConversation }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [init, setInit] = useState(false);
    const [messageDialog, setMessageDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        // if this is the first time rendering, get user conversations from server
        if (!init) {
            const runAsync = async () => setConversations(await ConversationsController.getConversations(token));
            runAsync();
            setInit(true);
        }
    }, [init]);

    const handleClickAdd = () => setDialogOpen(true);
    const addConversation = conversationDetails => {
        setDialogOpen(false); // close add dialog
        // ask the server to create a new conversation with the list participants (and title)
        if (conversationDetails) {
            const runAsync = async () => {
                let { title, list } = conversationDetails;
                let result = await ConversationsController.createConversation(token, list, title);
                if (result.success) { // add new conversation to the back of the list
                    let { conversation } = result;
                    setConversations(conversations.length > 0 ? [...conversations, conversation]: [conversation]);
                    // auto open chat after creation
                    selectConversation(conversation.id, conversation.title);
                }
                else // display error message
                    setMessageDialog({
                        title: "Error",
                        message: result.msg,
                        open: true
                    });
            };
            runAsync();
        }
    };

    const closeAlert = () => {
        setMessageDialog({
            title: "",
            message: "",
            open: false
        });
    };

    return (
        <div id="chat_container">
            <AlertDialog
                open={messageDialog.open}
                handleClose={closeAlert}
                title={messageDialog.title}
                message={messageDialog.message}
            />
            <div className="main_panel_header">
                <h1>Conversations</h1>
                <button className="options" title="options" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options"/>
                </button>
                <AddConversationDialog open={dialogOpen} onClose={addConversation} token={token} />
            </div>
            <div id="chats">
                {conversations.map((chat, i) =>
                    <ConversationItem
                        name={chat.title}
                        img={chat.imgUrl}
                        lastMsg={chat.lastMsg ?? ""}
                        lastDate={ConversationsController.evaluateDate(chat.lastDate)}
                        unread={chat.unread}
                        key={i}
                        onClick={() => selectConversation(chat.id, chat.title)}
                    />
                )}
            </div>
        </div>
    );
};

export default Conversations;
