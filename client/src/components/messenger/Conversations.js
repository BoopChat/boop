import {useEffect, useState, React} from "react";

import ConversationItem from "./ConversationItem";


const getConversations = async () => {
    // make request for the conversations of user with id 1 and wait for the json response
    const data = await (await fetch("/api/conversations/1", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })).json();
    // get the list of conversations if successful
    return data ? data.conversationList : [];
};

const evaluateDate = (lastDate) => {
    // decide whether to return the date as (d/mm/yy) or as time(\d{2}:\d{2} (A|P)M)
    // if lastDate within the last 23 hrs display time else use date format
    lastDate = new Date(lastDate);
    let diff = Date.now() - lastDate.getTime();

    const getDate = () => lastDate.getDate() + "/" + (lastDate.getMonth() + 1) + lastDate.getFullYear().substring(2);
    const getTime = () => {
        let hr = lastDate.getHours() % 12 || 12; // convert 24hr to 12hr
        // pad minutes with 0 to maintain 2 digits in mins section
        let min = (lastDate.getMinutes() < 10 ? "0" : "") + lastDate.getMinutes();
        let period = lastDate.getHours() < 11 ? "AM" : "PM"; // convert 24hr to am/pm
        return hr + ":" + min + " " + period;
    };
    return diff > (23 * 60 * 60 * 1000) ? getDate() : getTime();
};

const Conversations = ({selectConversation}) => {
    const [conversations, setConversations] = useState([]);
    const [init, setInit] = useState(false);

    useEffect(() => {
        // if this is the first time rendering, get user conversations from server
        if (!init) {
            (async () => setConversations(await getConversations()))();
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
                        lastDate={evaluateDate(chat.lastDate)}
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