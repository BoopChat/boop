import { useEffect, useState, React } from "react";
import { useSelector } from "react-redux";
import { AlertDialog, useAlertDialog, AlertType } from "./dialogs/AlertDialog";
import { useSearchContext } from "./hooks/SearchContext";

import Plus from "../../assets/icons/plus";
import ConversationItem from "./ConversationItem";
import { ConversationsController } from "./controllers/Conversations";
import { ContactsController } from "./controllers/Contacts";
import Modal from "./dialogs/Modal";
import SearchBox from "./SearchBox";

const AddConversationDialog = ({ onClose, token }) => {
    const [details, setDetails] = useState({
        list: [],
        title: "",
    });
    const [contacts, setContacts] = useState([]);
    const alertDialog = useAlertDialog();

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
        // if this is the first time rendering, get user contacts from server
        const runAsync = async () => {
            let contacts = await ContactsController.getContacts(token);
            if (contacts.success)
                setContacts(contacts.contactList);
            else {
                alertDialog.display({
                    title: "Error",
                    message: "There was an error retrieving your contacts",
                    type: AlertType.Error
                });
                setContacts([]);
            }
        };
        runAsync();
    }, []);

    return (
        <Modal onClose={() => handleClose(false)} center>
            { alertDialog.open ?
                <AlertDialog
                    handleClose={alertDialog.close}
                    title={alertDialog.title}
                    message={alertDialog.message}
                    type={alertDialog.type}
                /> :<></>
            }
            <div id="add-convo-dialog">
                <header>Create a conversation</header>
                <main>
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
                                <div className="img_and_name">
                                    <img src={contact.contactInfo.imageUrl} alt="contact_img" />
                                    <span>{contact.contactInfo.displayName}</span>
                                </div>
                                <input
                                    type="checkbox"
                                    name={contact.contactInfo.displayName}
                                    value={contact.contactId}
                                    onChange={handleListChange}
                                />
                            </li>
                        ))}
                    </ul>
                </main>
                <footer>
                    <button onClick={() => handleClose(true)} name="create" className="addConversation">Create</button>
                </footer>
            </div>
        </Modal>
    );
};

const Conversations = ({ selectConversation, socket }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const alertDialog = useAlertDialog();
    const { search } = useSearchContext();

    // Get the token and userInfo from the users global state.
    const { token, userInfo: { displayName, imageUrl } } = useSelector((state) => state.user);

    const updateConversations = (newConversation) => {
        setConversations((conversations) => {
            return newConversation.length > 0 ? [...newConversation, ...conversations] : [...newConversation];
        });
    };

    useEffect(() => {
        // send a request to the server to get conversations and setup socket to listen
        // for conversations changes
        ConversationsController.init(socket);
        const runAsync = async () => {
            const result = await ConversationsController.getConversations(token, updateConversations);
            if (!result.success) {
                alertDialog.display({
                    title: "Error",
                    message: "There was an error retrieving your conversations",
                    type: AlertType.Error
                });
            }
            setConversations(result.conversations);
        };
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
                if (list.length < 1) {
                    alertDialog.display({
                        title: "Error",
                        message: "You need to add participants to the conversation",
                        type: AlertType.Error
                    });
                    return;
                }
                if (title.length < 1) {
                    // create a title from the chosen participants' names
                    title = list
                        .map((i) => i.displayName)
                        .reduce((prevValue, curValue) => prevValue + curValue + ", ", "You, ")
                        .substring(0, 25);
                }
                const success = await ConversationsController.createConversation(
                    token, list.map(i => i.id), title, updateConversations);
                if (!success) {
                    alertDialog.display({
                        title: "Error",
                        message: "An error occurred trying to create the conversation",
                        type: AlertType.Error
                    });
                }
            };
            runAsync();
        }
    };

    const filterConversations = ({ title }) => search === "" || title.toLowerCase().includes(search.toLowerCase());

    const getRelevancy = ({ title }) => {
        if (search === title) // highest relevance, search matches conversation (even in case)
            return 4;
        else if (search.toLowerCase() === title.toLowerCase()) // search matches (but not case)
            return 3;
        else if (title.startsWith(search)) // search is first part of the conversations's name (case matched)
            return 2;
        else if (title.toLowerCase().startsWith(search.toLowerCase()))
            return 1; // search is first part of the conversations's name (case not matched)
        else return 0;
    };

    const sortConversations = (a, b) => getRelevancy(b) - getRelevancy(a);

    return (
        <div id="conversations_container">
            { alertDialog.open ?
                <AlertDialog
                    handleClose={alertDialog.close}
                    title={alertDialog.title}
                    message={alertDialog.message}
                    type={alertDialog.type}
                /> :<></>
            }
            <div className="main_panel_header">
                <div className="img_and_title">
                    <img src={imageUrl} alt={displayName} className="profile_img_mobile"/>
                    <h1>Chats</h1>
                </div>
                <button className="options" title="create conversation" onClick={() => handleClickAdd()}>
                    <Plus/>
                </button>
                { dialogOpen ? <AddConversationDialog onClose={addConversation} token={token} /> : <></> }
            </div>
            <SearchBox id="search_mobile"/>
            <div id="conversations">
                {conversations?.filter(filterConversations).sort(sortConversations).map((chat, i) => (
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
