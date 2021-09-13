import "../styles/buttons.css";

import React from "react";

const FacebookButton = ({text="Sign up with Facebook", handler}) => {
    return (
        <span className="facebook">
            <button className="facebook" type="button" onClick={handler} disabled>
                {text}
            </button>
        </span>
    );
};

export default FacebookButton;