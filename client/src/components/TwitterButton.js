import "../styles/login_buttons.css";

import React from "react";

const TwitterButton = ({ text="sign up with twitter", handler }) => {
    return (
        <button className="twitter" type="button" onClick={handler} disabled>{text}</button>
    );
};

export default TwitterButton;