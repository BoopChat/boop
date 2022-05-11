import copy_icon from "../assets/icons/copy.svg";
import ClipboardCheck from "../assets/icons/clipboardCheck.js";

import React, { useState } from "react";

const Clipboard = ({ name, value }) => {

    const [showCheck, setShowCheck] = useState(false);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1500);
    };

    return (
        <button title={`copy ${name} to clipboard`} id="clipboard" onClick={copyToClipboard}>
            { showCheck ? <ClipboardCheck className="green"/> : <img src={copy_icon} alt="copy" /> }
        </button>
    );

};

export default Clipboard;