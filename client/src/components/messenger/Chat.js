import { useState, useEffect, useRef, React } from "react";
import { useSelector } from "react-redux";
import "emoji-mart/css/emoji-mart.css";
import { Picker, Emoji } from "emoji-mart";

import { ChatController } from "./controllers/Chat";
import { ConversationsController } from "./controllers/Conversations";
import { ChatOptionsDialog, optionsEnum } from "./dialogs/ChatOptionsDialog";
import { AlertDialog, AlertType, useAlertDialog,  } from "./dialogs/AlertDialog";
import ChooseUsersDialog from "./dialogs/ChooseUsersDialog";
import ChooseAdminDialog from "./dialogs/ChooseAdminDialog";

import "../../styles/chat.css";
import Options from "../../assets/icons/options.js";
import Arrow from "../../assets/icons/arrow";

const Chat = ({ conversationId, title, participants, socket, closeChat, isDark }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [cursorPosition, setCursorPosition] = useState(0);
    const chatbox = useRef();
    const textbox = useRef();

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [optionsDialog, setOptionsDialog] = useState(false);
    const [addUsersDialog, setAddUsersDialog] = useState(false);
    const [chooseAdminDialog, setChooseAdminDialog] = useState(false);
    const alertDialog = useAlertDialog();

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);
    const { id } = useSelector((state) => state.user.userInfo);

    const handleText = (e) => {
        if (conversationId)
            // if a conversation is not active, disable text box
            setText(e.target.value);
    };

    const onEmojiClick = (emojiObj) => {
        textbox.current.focus();

        // split the text in 2 parts... left side and right side of the cursor
        const leftSplit = text.substring(0, textbox.current.selectionStart);
        const rightSplit = text.substring(textbox.current.selectionStart);

        // insert the emoji between the text on either side of the cursor
        setText(leftSplit + emojiObj.native + rightSplit);

        // update the cursor position behind the newly inserted emoji
        setCursorPosition(textbox.current.selectionStart + emojiObj.native.length);
    };

    useEffect(() => textbox.current.selectionEnd = cursorPosition, [cursorPosition]);

    const handleSend = async (e) => {
        e.preventDefault();
        setShowEmojiPicker(false); // close the emoji picker
        // if a conversation is not active, disable send button
        if (!conversationId) return;
        // if text box is empty dont bother trying to send message
        if (text?.length < 1) return;
        let result = await ChatController.sendMessage(token, conversationId, text);
        if (result.success)
            setText(""); // clear the text box
        else {
            // display error message
            alertDialog.display({
                title: "Error",
                message: result.msg,
                type: AlertType.Error
            });
        }
        // scroll to the bottom of the chat where new message has been rendered
        chatbox.current.scrollTop = chatbox?.current?.scrollHeight;
    };

    const onOptionsDialogClose = async action => {
        setOptionsDialog(false);
        let result = null;
        switch (action) {
            case optionsEnum.leave:
                if (participants.length === 1) // if 1 on 1 conversation, simply leave
                    result = await ConversationsController.leaveConversation(token, conversationId);
                else {
                    // check if user is admin
                    console.log(participants.filter(p => p.id === id)[0]);
                    const { Participant: { isAdmin } } = participants.filter(p => p.id === id)[0];

                    if (isAdmin) {
                        let admins = 0;
                        for (let i = 0; i < participants.length; i++) {
                            admins += participants[i].Participant.isAdmin ? 1 : 0;
                            if (admins === 2)
                                break;
                        }

                        // if at least one other admin is in the conversation, the current user (who is an admin)
                        // can simply leave the conversation
                        if (admins === 2)
                            result = await ConversationsController.leaveConversation(token, conversationId);
                        else // else make the current user choose a new admin
                            setChooseAdminDialog(true);
                    } else // user is not an admin, simply leave
                        result = await ConversationsController.leaveConversation(token, conversationId);
                }
                break;
        }
        if (result !== null) {
            alertDialog.display({
                title: result.success ? "Success" : "Error",
                message: result.msg,
                type: result.success ? AlertType.Success : AlertType.Error
            });
        }
    };

    const onChooseDialogClose = async ({ list, btnClicked }) => {
        setAddUsersDialog(false);

        // if user simply clicked outside of the dialog ie.
        // didn't really want to add new participants to the conversation,
        // or simply wanted to cancel then dont make a request to the server
        if (btnClicked) {
            // ask the server to add new participants to this conversation
            if (list?.length < 1) {
                // display error message for no new participants
                alertDialog.display(
                    {
                        title: "Error",
                        message: "No new participants added",
                        type: AlertType.Error
                    });
            } else {
                const result = await ConversationsController.addUserToConversation(token, conversationId, list);
                alertDialog.display({
                    title: result.success ? "Success": "Error",
                    message: result.msg,
                    type: result.success ? AlertType.Success : AlertType.Error
                });
            }
        }
    };

    const onChooseAdminDialogClose = async ({ choosen, btnClicked }) => {
        setChooseAdminDialog(false);

        // if user simply clicked outside of the dialog ie.
        // didn't actually set a new admin then dont make a request to the server
        if (btnClicked) {
            // ask the server to set the choosen user as an admin
            if (!choosen) { // display error message for no new admin
                alertDialog.display({ title: "Error", message: "No new admin selected", type: AlertType.Error });
            } else {
                // request that the user leave the conversation and send the id of the chosen successor
                const result = await ConversationsController.leaveConversation(token, conversationId, Number(choosen));
                alertDialog.display({
                    title: result.success ? "Success": "Error",
                    message: result.msg,
                    type: result.success ? AlertType.Success : AlertType.Error
                });
            }
        }
    };

    const addNewMessages = (messageList) => {
        // instead of repeatly calling setMessages, add valid messages to list and then call setMessages once
        let add = [];
        messageList.forEach(msg => {
            // if message is not already in the list, mark it for adding
            // reduce the search space by only search the last messageList.length - 1 messages
            if (!messages.slice(-messageList.length-1).find(({ id }) => id === msg.id))
                add.push(msg);
        });
        setMessages(prevMessages => prevMessages.length > 0 ? [...prevMessages, ...add] : add);
    };

    useEffect(() => {
        setMessages([]); // if switching conversations, clear the ui from previous messages
        ChatController.init(socket);
        ChatController.clear(); // clear previous listener if exist
        // as new messages come in from the server add them to messages list
        ChatController.listen((message) => {
            // if the new message is a message for the currently opened chat
            // if not simply ignore it in the ui
            if (message.newMessage.conversation.id === conversationId.toString())
                addNewMessages([message.newMessage]);
        });

        // get all messages (this will include any live messages caught by above code)
        const runAsync = async () => {
            const result = await ChatController.getMessages(token, conversationId);
            if (!result.success) {
                alertDialog.display({
                    title: "Error",
                    message: "Could not retrieve messages for this chat",
                    type: AlertType.Error
                });
            }
            const { messages } = result;
            addNewMessages(messages.reverse());
        };
        runAsync();
    }, [conversationId]);

    const showChatOptions = () => setOptionsDialog(true);

    return (
        <div className="chat_container">
            <header className="chat_title">
                <div className="img_and_back">
                    <Arrow onClick={closeChat}/>
                    <img src={"https://picsum.photos/400?id=" + title} className="skeleton" alt="chat" />
                </div>
                <span>{title || "Untitled Chat"}</span>
                <Options action={showChatOptions} />
            </header>
            { optionsDialog ?
                <ChatOptionsDialog
                    onClose={onOptionsDialogClose}
                    img={"https://picsum.photos/400?id=" + title}
                    title={title}
                    participants={participants}
                    addUsers={() => setAddUsersDialog(true)}
                />
                : <></>
            }
            { addUsersDialog ?
                <ChooseUsersDialog onClose={onChooseDialogClose} token={token} filterContacts={participants}/>
                : <></>
            }
            { chooseAdminDialog ?
                <ChooseAdminDialog onClose={onChooseAdminDialogClose} participants={participants} id={id}/>
                : <></>
            }
            {messages && messages.length > 0 ? (
                <ul className="chat_section" ref={chatbox}>
                    {messages.map(msg =>
                        <li
                            key={msg.id}
                            className={"message " + (msg.senderId === id ? "author" : "friend") + "_message"}
                        >
                            <div className="info">
                                <span className="user" title={msg.sender?.displayName}>{msg.sender?.displayName}</span>
                                <span className="time">{ChatController.evaluateElapsed(msg.createdAt)}</span>
                            </div>
                            <div className="avatar">
                                <img alt="user avatar" src={msg.sender?.imageUrl} title={msg.sender?.displayName}/>
                                <span className="time">{ChatController.evaluateElapsed(msg.createdAt)}</span>
                            </div>
                            <p>{msg.content}</p>
                        </li>
                    )}
                </ul>
            ) : (
                <div></div>
            )}
            { alertDialog.open ?
                <AlertDialog
                    handleClose={alertDialog.close}
                    title={alertDialog.title}
                    message={alertDialog.message}
                    type={alertDialog.type}
                /> :<></>
            }
            <form className="interactions" onSubmit={handleSend}>
                <input type="text" name="chat_box" placeholder="chat" value={text} onChange={handleText}
                    className="textBox" ref={textbox}/>
                <Emoji emoji="smiley" skin={4} size={20} onClick={() => setShowEmojiPicker(!showEmojiPicker)}/>
                <button className="enterBtn" onClick={handleSend} title="send"> <Arrow/> </button>
            </form>
            { showEmojiPicker && <Picker title="Spice it up" emoji="point_up" onClick={onEmojiClick}
                defaultSkin={4} theme={isDark ? "dark": "light"} sheetSize={32} color="#0066ec"/> }
        </div>
    );
};

export default Chat;
