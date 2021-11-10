import React, { useEffect, useRef } from "react";

const Loader = ({ text }) => {
    const container = useRef();

    useEffect(() => {
        let dots = Array.from(container.current.lastChild.childNodes);
        let secs = 0;
        dots.forEach(dot => {
            dot.style.animationDelay = secs + "s";
            secs += 0.2;
        });
    }, []);

    return (
        <div className="loader" ref={container}>
            <span className="loader-text">{text}</span>
            <div className="dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
};

export default Loader;