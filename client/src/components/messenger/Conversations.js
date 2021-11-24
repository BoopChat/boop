import { useEffect, useState, React } from "react";
import { useSelector } from "react-redux";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { Alert } from "../AlertDialog";

import plus from "../../assets/plus.svg";
import ConversationItem from "./ConversationItem";
import { ConversationsController } from "./controllers/Conversations";
import { ContactsController } from "./controllers/Contacts";

const AddConversationDialog = ({ open, onClose, token }) => {
    const [details, setDetails] = useState({
        list: [],
        title: "",
    });
    const [contacts, setContacts] = useState([]);
    const [init, setInit] = useState(false);

    const handleClose = btnClicked => {
        onClose({ ...details, btnClicked });
        setDetails({ // reset details
            list: [],
            title: "",
        });
    };
    const handleListChange = (e) => {
        // if checkbox is checked then add it to the list else remove it from the list
        let newList = e.target.checked
            ? [...details.list, { id: e.target.value, displayName: e.target.name }]
            : details.list.filter(item => item.id !== e.target.value);
        setDetails({ ...details, list: newList });
    };
    const handleTitleChange = (e) => setDetails({ ...details, title: e.target.value });

    useEffect(() => {
        if (!init) {
            // if this is the first time rendering, get user contacts from server
            const runAsync = async () => {
                let contacts = await ContactsController.getContacts(token);
                setContacts(contacts.success ? contacts.contactList : []);
            };
            runAsync();
            setInit(true);
        }
    }, [init]);

    return (
        <Dialog
            id="add-convo-dialog"
            onClose={() => handleClose(false)}
            aria-labelledby="simple-dialog-title"
            open={open}
        >
            <DialogTitle id="simple-dialog-title">Create a conversation</DialogTitle>
            <input
                type="text"
                placeholder="Conversation Title"
                value={details.title}
                onChange={handleTitleChange}
                className="addConversation"
            />
            <ul className="add_participants">
                {contacts.map((contact) => (
                    <li key={contact.contactId}>
                        <img src={contact.contactInfo.imageUrl} alt="contact_img" />
                        <span>{contact.contactInfo.displayName}</span>
                        <input
                            type="checkbox"
                            name={contact.contactInfo.displayName}
                            value={contact.contactId}
                            onChange={handleListChange}
                        />
                    </li>
                ))}
            </ul>
            <button onClick={() => handleClose(true)} name="create" className="addConversation">Create</button>
        </Dialog>
    );
};

const Conversations = ({ selectConversation, socket }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const alertDialog = Alert.useAlertDialog();

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);
    //const { id } = useSelector((state) => state.user.userInfo);

    const updateConversations = (newConversation) => {
        setConversations((conversations) => {
            return newConversation.length > 0 ? [...newConversation, ...conversations] : [...newConversation];
        });
    };

    useEffect(() => {
        // send a request to the server to get conversations and setup socket to listen
        // for conversations changes
        ConversationsController.init(socket);
        const runAsync = async () =>
            setConversations(await ConversationsController.getConversations(token, updateConversations));
        runAsync();
    }, []);

    const handleClickAdd = () => setDialogOpen(true);
    const addConversation = (conversationDetails) => {
        setDialogOpen(false); // close add dialog
        // ask the server to create a new conversation with the list participants (and title)
        if (conversationDetails) {
            // if user simply clicked outside of the dialog ie.
            // didn't really want to create a conversation, or simply
            // wanted to cancel then dont make a request to the server
            if (!conversationDetails.btnClicked)
                return;
            const runAsync = async () => {
                let { title, list } = conversationDetails;
                if (title.length < 1) {
                    // create a title from the chosen participants' names
                    title = list
                        .map((i) => i.displayName)
                        .reduce((prevValue, curValue) => prevValue + curValue + ", ", "You, ")
                        .substring(0, 25);
                }
                await ConversationsController.createConversation(
                    token, list.map(i => i.id), title, updateConversations);
            };
            runAsync();
        }
    };

    return (
        <div id="conversations_container">
            <Alert.AlertDialog
                open={alertDialog.open}
                handleClose={alertDialog.close}
                title={alertDialog.title}
                message={alertDialog.message}
            />
            <div className="main_panel_header">
                <h1>Conversations</h1>
                <button className="options" title="options" onClick={() => handleClickAdd()}>
                    <img src={plus} alt="options" />
                </button>
                <AddConversationDialog open={dialogOpen} onClose={addConversation} token={token} />
            </div>
            <div id="conversations">
                {conversations?.map((chat, i) => (
                    <ConversationItem
                        name={chat.title}
                        img={chat.imgUrl}
                        lastMsg={chat.lastMsg ?? ""}
                        lastDate={ConversationsController.evaluateDate(chat.lastDate)}
                        unread={chat.unread}
                        key={i}
                        onClick={() => selectConversation(chat.id, chat.title, chat.participants)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Conversations;
