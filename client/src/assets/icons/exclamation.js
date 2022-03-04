import React from "react";

const Exclamation = ({ className }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 512" className={className}>
            <path d="M64 352c17.69 0 32-14.32 32-31.1V64.01c0-17.67-14.31-32.01-32-32.01S32 46.34 32 64.01v255.1C32
                337.7 46.31 352 64 352zM64 400c-22.09 0-40 17.91-40 40s17.91 39.1 40 39.1s40-17.9 40-39.1S86.09 400
                64 400z"/>
        </svg>
    );
};

export default Exclamation;