let messages = [
    {
        author: true,
        username: "John",
        elapsed: "1 hour ago",
        content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Amet quidem dolores ipsam, ad magnam recusandae?",
        avatar: "https://picsum.photos/200?random=1"
    }, {
        author: false,
        username: "Jane",
        elapsed: "1 hour ago",
        content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, accusantium.",
        avatar: "https://picsum.photos/200?random=2"
    }, {
        author: false,
        username: "Jane",
        elapsed: "5 mins ago",
        content: "Lorem ipsum dolor sit amet.",
        avatar: "https://picsum.photos/200?random=2"
    }, {
        author: true,
        username: "John",
        elapsed: "4 mins ago",
        content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Labore quia aut provident pariatur accusantium.",
        avatar: "https://picsum.photos/200?random=1"
    }
]

const Chat = () => {
    return (
        <div className="chat_container">
            <ul className="chat_section">
                {
                    messages.map((msg, key) => {
                        return (
                            <li key={key} className={"message " + (msg.author ? "author_message" : "friend_message")}>
                                <div className="info">
                                    <span className="user">{msg.username}</span>
                                    <span className="time">{msg.elapsed}</span>
                                </div>
                                <div className="avatar" href="/">
                                    <img alt="user avatar" src={msg.avatar} width="35"/>
                                </div>
                                <p>{msg.content}</p>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="interactions">
                <input type="text" name="chat_box" placeholder="chat" value="" />
                <button>Send</button>
            </div>
        </div>
    )
}

export default Chat;