import React, { useRef } from "react";

import "../../../styles/dialog.css";

const Modal = ({ children, onClose, center, important }) => {
    const modal = useRef();

    const shouldClose = e => {
        if (e.target === modal.current && onClose)
            onClose();
    };

    return (
        <div className={"modal" + (important ? " high": "")} style={center ? { alignItems: "center" } : {}}
            onClick={shouldClose} ref={modal}>
            { children }
        </div>
    );
};

export default Modal;