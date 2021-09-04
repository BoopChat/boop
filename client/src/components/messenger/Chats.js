import ChatItem from "./ChatItem"

let chats = [
    {
        name: "John",
        img: "https://picsum.photos/200?random=1",
        lastMsg: "Whats up",
        lastDate: "11:00 AM",
        unread: 1,
    }, {
        name: "Jenny",
        img: "https://picsum.photos/200?random=2",
        lastMsg: "I missed you",
        lastDate: "5:00 PM",
        unread: 0,
    }, {
        name: "Unknown",
        img: "https://picsum.photos/200?random=3",
        lastMsg: "Lorem ipsum dolor sit amet.",
        lastDate: "Yesterday",
    }, {
        name: "Josh",
        img: "https://picsum.photos/200?random=4",
        lastMsg: "Lorem ipsum sit dolor amet.",
        lastDate: "8/28/21",
        unread: 4,
    }
]

const Chats = () => {
    return (
        <div id="chat_container">
            <h1>Chats</h1>
            <div id="chats">
                {chats.map(chat => 
                    <ChatItem
                        name={chat.name}
                        img={chat.img}
                        lastMsg={chat.lastMsg}
                        lastDate={chat.lastDate}
                        unread={chat.unread}
                    />
                )}
            </div>
        </div>
    )
}

export default Chats;