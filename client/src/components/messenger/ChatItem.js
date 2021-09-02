const ChatItem = ({name, img, lastMsg, lastDate, unread}) => {

    return (
        <div className="chat_item">
            <div className="img_and_name">
                <img src={img} alt="chat_img"/>
                <div className="name_and_msg">
                    <span class="chat_name">{name}</span>
                    <span class="chat_msg">{lastMsg}</span>
                </div>
            </div>
            <div class="time_and_badge">
                <span>{lastDate}</span>
                {unread > 0 ? <div class='unread'>{unread}</div> : ""}
            </div>
        </div>
    )
}

export default ChatItem;