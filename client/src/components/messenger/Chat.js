import {useState, useEffect, React} from "react";
import { useSelector } from "react-redux";
import { ChatController } from "./controllers/Chat";


const Chat = ({conversationId, title}) => {
    const [messages, setMessages] = useState([]);
    const { userId } = useSelector((state) => state.user.userInfo);
    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => { // will call this at a defined interval later
        (async () => setMessages(await ChatController.getMessages(token, conversationId)))();
    }, []);

    return (
        <div className="chat_container">
            {title ? <header className="chat_title">{title}</header> : <></>}
            {messages && messages.length > 0 ? (
                <ul className="chat_section">
                    {
                        messages.map((msg, key) => {
                            return (
                                <li
                                    key={key}
                                    className={"message " + (msg.senderId === userId ? "author": "friend" + "_message")}
                                >
                                    <div className="info">
                                        <span className="user">{msg.displayName}</span>
                                        <span className="time">
                                            {() => ChatController.evaluateElapsed(msg.createdAt)}
                                        </span>
                                    </div>
                                    <div className="avatar" href="/">
                                        <img alt="user avatar" src={msg.imageUrl} width="35"/>
                                    </div>
                                    <p>{msg.content}</p>
                                </li>
                            );
                        })
                    }
                </ul>
            ) : <div></div>
            }
            <div className="interactions">
                <input type="text" name="chat_box" placeholder="chat" readOnly />
                <button>Send</button>
            </div>
        </div>
    );
};

export default Chat;