import {useState, useEffect, React} from "react";
import { useSelector } from "react-redux";

const getMessages = async (conversationId) => {
    if (conversationId) {
        // make request for the messages of conversationid and wait for the json response
        const data = await (await fetch("/api/messages/" + conversationId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })).json();
        // get the list of messages if successful
        return data ? data.messages : [];
    } else
        return [];
};

const evaluateElapsed = (sent) => {
    // convert timestamp into an elapsed message
    let diff = Date.now() - (new Date(sent)).getTime();
    let min = 60 * 1000;
    if (diff < min)
        return "Less than a min ago";
    else if (diff < 60 * min) {
        let mins = Math.floor(diff / 60 / 1000);
        return mins + " min" + (mins !== 1 ? "s" : "") + " ago";
    } else if (diff <  60 * min * 24) {
        let hrs = Math.floor(diff / 60 / 60 / 1000);
        return hrs + " hr" + (hrs !== 1 ? "s" : "") + " ago";
    } else {
        let days = Math.floor(diff / 24 / 60 / 60 / 1000);
        return days + " day" + (days !== 1 ? "s" : "") + " ago";
    }
};

const Chat = ({conversationId, title}) => {
    const [messages, setMessages] = useState([]);
    const { userId } = useSelector((state) => state.user.userInfo);

    useEffect(() => { // will call this at a defined interval later
        (async () => setMessages(await getMessages(conversationId)))();
    }, []);

    return (
        <div className="chat_container">
            {title ? <header className="chat_title">{title}</header> : <></>}
            {messages && messages.length > 0 ? (
                <ul className="chat_section">
                    {
                        messages.map((msg, key) => {
                            return (
                                <li key={key} className={"message " + (msg.senderId == userId ? "author_message" : "friend_message")}>
                                    <div className="info">
                                        <span className="user">{msg.displayName}</span>
                                        <span className="time">{() => evaluateElapsed(msg.createdAt)}</span>
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