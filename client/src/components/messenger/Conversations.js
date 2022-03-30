import { useEffect, useState, React, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AlertType, useAlertDialogContext } from "./dialogs/AlertDialog";
import AddConversationDialog from "./dialogs/AddConversationDialog";
import AddContactDialog from "./dialogs/AddContactDialog";
import { useSearchContext } from "./hooks/SearchContext";

import Plus from "../../assets/icons/plus";
import ConversationItem from "./ConversationItem";
import { ConversationsController } from "./controllers/Conversations";
import { ContactsController } from "./controllers/Contacts";
import SearchBox from "./SearchBox";

import { setConversations, setCurrentConversation } from "../../redux-store/conversationSlice";
import SocketContext from "../../socketContext";

const Conversations = () => {
    const dispatch = useDispatch();
    const [addContactDialogOpen, setAddContactDialogOpen] = useState(false);
    const [addConversationDialogOpen, setAddConversationDialogOpen] = useState(false);
    const { search } = useSearchContext();
    const socket = useContext(SocketContext);
    const { display: displayDialog } = useAlertDialogContext();

    const [contacts, setContacts] = useState([]);

    // Get the token and userInfo from the users global state.
    const { token, userInfo: { displayName, imageUrl } } = useSelector((state) => state.user);

    // get the currently selected conversation
    const { id: currentlySelectedConvo } = useSelector(state => state.conversations.currentConversation);

    useEffect(() => {
        const runAsync = async () => {
            const result = await ConversationsController.getConversations(token, socket);
            if (!result.success) {
                displayDialog({
                    title: "Error",
                    message: "There was an error retrieving your conversations",
                    type: AlertType.Error
                });
            }
            dispatch(setConversations(result.conversations));
        };
        runAsync();
    }, []);

    const addContact = ({ contact, error }) => {
        setAddContactDialogOpen(false); // close add dialog

        if (contact) {
            setContacts([contact]);
            // open the dialog to create a conversation by selecting participants from current contact list
            // which at this point will only have 1 person
            setAddConversationDialogOpen(true);
        }

        if (error) // if an error occured, display it
            displayDialog({ title: "Error", message: error, type: AlertType.Error });
    };

    const handleClickAdd = async () => {
        let result = await ContactsController.getContacts(token);

        if (!result.success) {
            displayDialog({
                title: "Error",
                message: "There was an error retrieving your contacts",
                type: AlertType.Error
            });
            return;
        }

        // if contact list is empty, prompt the user to add a contact
        if (result.contactList.length < 1)
            setAddContactDialogOpen(true);
        else { // open the dialog to create a conversation by selecting participants from current contact list
            setContacts(result.contactList);
            setAddConversationDialogOpen(true);
        }
    };

    const addNewConversation = (conversationDetails) => {
        setAddConversationDialogOpen(false); // close add dialog
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
                    displayDialog({
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
                const { success, id } = await ConversationsController.createConversation(
                    token, list.map(i => i.id), title);
                if (!success) {
                    displayDialog({
                        title: "Error",
                        message: "An error occurred trying to create the conversation",
                        type: AlertType.Error
                    });
                } else dispatch(setCurrentConversation(id));
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

    const sortConversations = (a, b) => {
        if (search === "") { // sort by most recent activity
            // get the timestamp of the most recent message from the conversation for comparison
            // if conversation has no messages use the timestamp of the creation of the conversation
            const timestampA = a.messages?.length > 0 ? a.messages[0].createdAt : a.createdAt;
            const timestampB = b.messages?.length > 0 ? b.messages[0].createdAt : b.createdAt;
            return (new Date(timestampB).getTime()) - (new Date(timestampA).getTime());
        } else return getRelevancy(b) - getRelevancy(a); // sort by search relevance
    };

    return (
        <div id="conversations_container">
            <div className="main_panel_header">
                <div className="img_and_title">
                    <img src={imageUrl} alt={displayName} className="profile_img_mobile"/>
                    <h1>Chats</h1>
                </div>
                <button className="options" title="create conversation" onClick={() => handleClickAdd()}>
                    <Plus/>
                </button>
                { addContactDialogOpen ? <AddContactDialog onAddAction={addContact} token={token} /> : <></> }
                { addConversationDialogOpen ?
                    <AddConversationDialog onClose={addNewConversation} contacts={contacts} /> : <></> }
            </div>
            <SearchBox id="search_mobile"/>
            <div id="conversations">
                {
                    useSelector((state) => state.conversations.conversations)?.filter(filterConversations)
                        .sort(sortConversations).map((chat, i) => (
                            <ConversationItem
                                name={chat.title}
                                img={chat.imgUrl ?? "https://picsum.photos/400?id=" + chat.title}
                                lastMsg={ConversationsController.getLastMessage(chat)}
                                lastDate={ConversationsController.getLastMessageDate(chat)}
                                unread={chat.unread}
                                key={i}
                                onClick={() => dispatch(setCurrentConversation(chat.id))}
                                active={currentlySelectedConvo === chat.id}
                            />
                        ))}
            </div>
        </div>
    );
};

export default Conversations;
