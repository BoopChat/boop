import { useState, useEffect, React } from "react";
import { useSelector } from "react-redux";
import { ChatController } from "./controllers/Chat";
import AlertDialog from "../AlertDialog";


const Chat = ({ conversationId, title }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [updater, setUpdater] = useState(null);
    const { id } = useSelector((state) => state.user.userInfo);
    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    const [messageDialog, setMessageDialog] = useState({
        open: false,
        title: "",
        message: ""
    });

    const handleText = (e) => {
        if (conversationId) // if a conversation is not active, disable text box
            setText(e.target.value);
    };

    const handleSend = async () => {
        // if a conversation is not active, disable send button
        if (!conversationId)
            return;
        // if text box is empty dont bother trying to send message
        if (text?.length < 1)
            return;
        let result = await ChatController.sendMessage(token, conversationId, text);
        if (result.success) {
            setText(""); // clear the text box
            refresh(); // refresh the chat immediately to see the newly sent message
        } else // display error message
            setMessageDialog({
                title: "Error",
                message: result.msg,
                open: true
            });
    };

    const refresh = async () => {
        setMessages((await ChatController.getMessages(token, conversationId)).reverse());
    };

    useEffect(() => {
        // refresh every 5 seconds
        setUpdater(setInterval(() => refresh(), 5000));
        refresh(); // refresh right away
        return () => clearInterval(updater); // have component run this after unmounting as cleanup
    }, []);

    useEffect(() => {
        clearInterval(updater); // clear previous refresher (which was for a diff convo)
        // refresh every 5 seconds
        setUpdater(setInterval(() => refresh(), 5000));
        refresh(); // refresh right away
        return () => clearInterval(updater); // have component run this after unmounting as cleanup
    }, conversationId);

    const closeAlert = () => {
        setMessageDialog({
            title: "",
            message: "",
            open: false
        });
    };

    return (
        <div className="chat_container">
            {title ? <header className="chat_title">{title}</header> : <></>}
            {messages && messages.length > 0 ? (
                <ul className="chat_section">
                    {messages.map((msg, key) =>
                        <li
                            key={key}
                            className={"message " + (msg.senderId === id ? "author": "friend") + "_message"}
                        >
                            <div className="info">
                                <span className="user">{msg.displayName}</span>
                                <span className="time">{ChatController.evaluateElapsed(msg.createdAt)}</span>
                            </div>
                            <div className="avatar" href="/">
                                <img alt="user avatar" src={msg.imageUrl} width="35"/>
                            </div>
                            <p>{msg.content}</p>
                        </li>
                    )}
                </ul>
            ) : <div></div>
            }
            <AlertDialog
                open={messageDialog.open}
                handleClose={closeAlert}
                title={messageDialog.title}
                message={messageDialog.message}
            />
            <div className="interactions">
                <input type="text" name="chat_box" placeholder="chat" value={text} onChange={handleText} />
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

export default Chat;