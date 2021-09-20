import "../../styles/login.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logIn, setToken, setUserInfo } from "./userSlice";
import { useSelector } from "react-redux";
import React from "react";

import GoogleButton from "../GoogleButton.js";
import FacebookButton from "../FacebookButton.js";
import TwitterButton from "../TwitterButton.js";
import Messenger from "../messenger/Messenger";

const Login = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    // Checks if the user has successfully logged in using a provider
    // Dispatches the logIn action to change the user's login state if true;
    // UseEffect executes everytime this login page loads or reloads.
    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("/api/login/auth/cookie", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            const { success } = data;

            if (success) {
                const { token, userInfo } = data;
                // Store the user Information and access token in the redux store.
                dispatch(setUserInfo({...userInfo}));
                dispatch(setToken(token));
                // Logs in the user.
                dispatch(logIn());
            }
        };

        fetchData();
    });
    return (
        isLoggedIn ? <Messenger/> : (
            <div className="sign-in-container">
                <h1>Boop Chat</h1>
                <div className="sign_btns">
                    <GoogleButton text="Continue with Google" />
                    <FacebookButton text="Continue with facebook" />
                    <TwitterButton text="Continue with twitter" />
                </div>
            </div>
        )
    );
};

export default Login;
