import copy_icon from "../assets/icons/copy.svg";
import ClipboardCheck from "../assets/icons/clipboardCheck.js";

import { useState, React } from "react";

const Clipboard = ({ name, value }) => {

    const [showCheck, setShowCheck] = useState(false);


    const copyToClipboard = () => {
        navigator.clipboard.writeText(value);
        setShowCheck(true);
        setTimeout(() => setShowCheck(false), 1500);
    };

    return (
        <button className="edit">
            <button title={`copy ${name} to clipboard`} className="edit" onClick={copyToClipboard}>
                { showCheck ? <ClipboardCheck className="green"/> : <img src={copy_icon} alt="copy" /> }
            </button>
        </button>
    );

};

export default Clipboard;