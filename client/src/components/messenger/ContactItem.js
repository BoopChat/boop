import React from "react";

const ContactItem = ({ img, username, status="offline", onClick }) => {

    return (
        <div className="contact_item" onClick={onClick}>
            <div className="img_and_name">
                <img src={img} alt="contact_img"/>
                <span>{username}</span>
            </div>
            <div className={"status status_" + status}></div>
        </div>
    );
};

export default ContactItem;