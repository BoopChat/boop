import { useState, useEffect, useRef, React } from "react";
import { useSelector } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Toolbar from "@mui/material/Toolbar";

import { ChatController } from "./controllers/Chat";
import { ConversationsController } from "./controllers/Conversations";
import { Alert } from "../AlertDialog";

import "../../styles/chat.css";
import options from "../../assets/options.svg";

const optionsEnum = {
    noAction: 0,
    successor: 1,
    leave: 2,
};

const OptionsDialog = ({ open, onClose, img, title, participants }) => {
    const handleClose = (value) => onClose(value);

    return (
        <div>
            <Dialog fullScreen open={open} onClose={() => handleClose(optionsEnum.noAction)}>
                <AppBar sx={{ position: "relative" }}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => handleClose(optionsEnum.noAction)}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {title}
                        </Typography>
                        <Button autoFocus color="inherit" onClick={() => handleClose(optionsEnum.noAction)}>
                            save
                        </Button>
                    </Toolbar>
                </AppBar>
                <img src={img} alt="chat" className="chat_image_options" />
                <p></p>
                <hr />
                <span className="participant_label">{participants.length} participants</span>
                {participants.map((participant, key) => (
                    <div className="contact_item" key={key}>
                        <div className="img_and_name">
                            <img src={participant.imageUrl} alt="participant_img" />
                            <span>{participant.displayName}</span>
                        </div>
                    </div>
                ))}
                <hr />
                <p></p>
                <button className="btn_positive" onClick={() => handleClose(optionsEnum.successor)}>
                    Set Successor
                </button>
                <button className="btn_leave" onClick={() => handleClose(optionsEnum.leave)}>
                    Leave Conversation
                </button>
            </Dialog>
        </div>
    );
};

const Chat = ({ conversationId, title, participants, socket }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const chatbox = useRef();

    const [optionsDialog, setOptionsDialog] = useState(false);
    const alertDialog = Alert.useAlertDialog();

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);
    const { id, displayName, imageUrl } = useSelector((state) => state.user.userInfo);

    const handleText = (e) => {
        if (conversationId)
            // if a conversation is not active, disable text box
            setText(e.target.value);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        // if a conversation is not active, disable send button
        if (!conversationId) return;
        // if text box is empty dont bother trying to send message
        if (text?.length < 1) return;
        let result = await ChatController.sendMessage(token, conversationId, text);
        if (result.success) setText("");
        // clear the text box
        else {
            // display error message
            alertDialog.display({
                title: "Error",
                message: result.msg,
            });
        }
        // scroll to the bottom of the chat where new message has been rendered
        chatbox.current.scrollTop = chatbox.current.scrollHeight;
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
        setMessages(prevMessages => prevMessages.length > 1 ? [...prevMessages, ...add] : add);
    };

    useEffect(() => {
        setMessages([]); // if switching conversations, clear the ui from previous messages
        ChatController.init(socket);
        ChatController.clear(); // clear previous listener if exist
        // as new messages come in from the server add them to messages list
        ChatController.listen((message) => {
            // if the new message is a message for the currently opened chat
            // if not simply ignore it in the ui
            if (message.newMessage.conversationId === conversationId.toString())
                addNewMessages([message.newMessage]);
        });

        // get all messages (this will include any live messages caught by above code)
        const runAsync = async () => {
            addNewMessages((await ChatController.getMessages(token, conversationId))?.reverse());
        };
        runAsync();
    }, [conversationId]);

    const showChatOptions = () => setOptionsDialog(true);

    const onDialogClose = async (action) => {
        setOptionsDialog(false);
        let result;
        switch (action) {
            case optionsEnum.leave:
                if (participants.length === 1)
                    // if 1 on 1 conversation, simply leave
                    result = await ConversationsController.leaveConversation(token, conversationId);
                else {
                    // check if user is admin
                    // currently cant check so try to leave and fail if admin
                    result = await ConversationsController.leaveConversation(token, conversationId);
                }
                break;
        }
        if (result) {
            alertDialog.display({
                title: result.success ? "Success" : "Error",
                message: result.msg,
            });
        }
    };

    return (
        <div className="chat_container">
            <header className="chat_title">
                <img src="https://picsum.photos/400" className="skeleton" alt="chat" />
                <span>{title || "Untitled Chat"}</span>
                <img src={options} alt="options" onClick={showChatOptions} className="chat_options" />
            </header>
            <OptionsDialog
                open={optionsDialog}
                onClose={onDialogClose}
                img="https://picsum.photos/400"
                title={title}
                participants={[{ displayName, imageUrl }, ...participants]}
            />
            {messages && messages.length > 0 ? (
                <ul className="chat_section" ref={chatbox}>
                    {messages.map((msg) => (
                        <li
                            key={msg.id}
                            className={"message " + (msg.senderId === id ? "author" : "friend") + "_message"}
                        >
                            <div className="info">
                                <span className="user" title={msg.sender?.displayName}>
                                    {msg.sender?.displayName}
                                </span>
                                <span className="time">{ChatController.evaluateElapsed(msg.createdAt)}</span>
                            </div>
                            <div className="avatar" href="/">
                                <img
                                    alt="user avatar"
                                    src={msg.sender?.imageUrl}
                                    title={msg.sender?.displayName}
                                    width="35"
                                />
                            </div>
                            <p>{msg.content}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <div></div>
            )}
            <Alert.AlertDialog
                open={alertDialog.open}
                handleClose={alertDialog.close}
                title={alertDialog.title}
                message={alertDialog.message}
            />
            <form className="interactions" onSubmit={handleSend}>
                <input type="text" name="chat_box" placeholder="chat" value={text} onChange={handleText} />
                <button onClick={handleSend}>Send</button>
            </form>
        </div>
    );
};

export default Chat;
