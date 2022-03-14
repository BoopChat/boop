import "../styles/login_buttons.css";
import { useDispatch } from "react-redux";
import { logIn } from "../redux-store/userSlice";
import React from "react";

const FacebookButton = ({ text="Sign up with Facebook" }) => {
    //send action to redux store to change states
    const dispatch = useDispatch();

    //Handler function for Facebook login button
    const handleLogin = async () => {
        //sends request to api which checks for the login cookie
        const data = await fetch("/api/login/auth/cookie", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json());

        //login with cookie else redirect to social provider
        data.success ? dispatch(logIn()) : window.location.replace("/api/login/auth/facebook", "_self");
    };

    return (
        <span className="facebook">
            <button className="facebook" type="button" onClick={handleLogin}>
                {text}
            </button>
        </span>
    );
};

export default FacebookButton;