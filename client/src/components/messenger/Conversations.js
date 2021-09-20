import {useEffect, useState, React} from "react";
import { useSelector } from "react-redux";

import ConversationItem from "./ConversationItem";
import { ConversationsController } from "./controllers.js/Conversations";


const Conversations = ({selectConversation}) => {
    const [conversations, setConversations] = useState([]);
    const [init, setInit] = useState(false);

    // Get the token from the users global state.
    const token = useSelector((state) => state.user.token);

    useEffect(() => {
        // if this is the first time rendering, get user conversations from server
        if (!init) {
            (async () => setConversations(await ConversationsController.getConversations(token)))();
            setInit(true);
        }
    }, [init]);

    return (
        <div id="chat_container">
            <h1>Conversations</h1>
            <div id="chats">
                {conversations.map((chat, i) =>
                    <ConversationItem
                        name={chat.title}
                        img={chat.imgUrl}
                        lastMsg={chat.lastMsg}
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