import React from "react";

const ConversationItem = ({ name, img, lastMsg, lastDate, unread, onClick, active }) => {

    return (
        <div className={"chat_item " + (active ? "selected" : "")} onClick={onClick}>
            <div className="img_and_name">
                <img src={img} className="skeleton" alt=""/>
                <div className="name_and_msg">
                    <span className="chat_name">{name}</span>
                    <span className="chat_msg">{lastMsg ? lastMsg : ""}</span>
                </div>
            </div>
            <div className="time_and_badge">
                <span>{lastDate ? lastDate : ""}</span>
                {unread > 0 ? <div className='unread'>{unread}</div> : ""}
            </div>
        </div>
    );
};

export default ConversationItem;