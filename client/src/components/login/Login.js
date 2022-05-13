import "../../styles/login.css";
import "../../styles/login_buttons.css";

import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logIn, setToken, setUserInfo } from "../../redux-store/userSlice";
import { useSelector } from "react-redux";
import React from "react";

import Messenger from "../messenger/Messenger";
import Loader from "./Loader";

import GoogleButton from "../GoogleButton.js";
import FacebookButton from "../FacebookButton.js";
import TwitterButton from "../TwitterButton.js";

import { io } from "socket.io-client";
import SocketContext from "../../socketContext";

const Login = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const [loading, setLoading] = useState({
        fetched: false,
        animated: false
    });
    const [loginService, setLoginService] = useState({
        google: false,
        facebook: false,
        twitter: false
    });
    const [socket, setsocket] = useState(null);

    // Checks if the user has successfully logged in using a provider
    // Dispatches the logIn action to change the user's login state if true;
    // UseEffect executes everytime this login page loads or reloads.
    useEffect(() => {
        // have the loading screen run for at least 1.5s
        setTimeout(() => setLoading((prev) => { return { ...prev, animated: true }; }), 1500);

        // Get the configured login services from the server
        const fetchLoginService = async () => {
            const res = await fetch("/api/login/auth/services", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            if (data.success) {
                setLoginService((prev) => {
                    return {
                        ...prev,
                        ...data.configuredServices
                    };
                });
            }
        };

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
                dispatch(setUserInfo({ ...userInfo }));
                dispatch(setToken(token));
                // Logs in the user.
                dispatch(logIn());
                // create socket
                const socket = io({
                    auth: {
                        token
                    }
                });
                setsocket(socket);
            }
            // indicate that the fetch for login status is complete
            setLoading((prev) => { return { ...prev, fetched: true }; });
        };

        fetchLoginService();
        fetchData();
    }, []);

    const isLoading = () => {
        // loading state is only complete when both the fetch is complete
        // and the animation has run for at least 1.5 secs
        return !(loading.animated && loading.fetched);
    };

    const LoginForm = () => {
        return (
            <div className="sign-in-container">
                <header className="booptext">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="chat_logo">
                        <path d="M416 176C416 78.8 322.9 0 208 0S0 78.8 0 176c0 39.57 15.62 75.96 41.67 105.4c-16.39
                            32.76-39.23 57.32-39.59 57.68c-2.1 2.205-2.67 5.475-1.441 8.354C1.9 350.3 4.602 352 7.66
                            352c38.35 0 70.76-11.12 95.74-24.04C134.2 343.1 169.8 352 208 352C322.9 352 416 273.2 416
                            176zM599.6 443.7C624.8 413.9 640 376.6 640 336C640 238.8 554 160 448 160c-.3145 0-.6191
                            .041-.9336 .043C447.5 165.3 448 170.6 448 176c0 98.62-79.68 181.2-186.1 202.5C282.7 455.1
                            357.1 512 448 512c33.69 0 65.32-8.008 92.85-21.98C565.2 502 596.1 512 632.3 512c3.059 0
                            5.76-1.725 7.02-4.605c1.229-2.879 .6582-6.148-1.441-8.354C637.6 498.7 615.9 475.3 599.6
                            443.7z"/>
                    </svg>
                    <h1>
                        <span className="blue">Boop</span>Chat
                    </h1>
                </header>
                <div className="sign_btns">
                    { loginService.google && <GoogleButton text="Continue with Google" /> }
                    { loginService.facebook && <FacebookButton text="Continue with Facebook" /> }
                    { loginService.twitter && <TwitterButton text="Continue with Twitter" /> }
                </div>
            </div>
        );
    };

    return (
        isLoading() ?
            <Loader text="Getting everything set for you"/> :
            (
                isLoggedIn ?
                    <SocketContext.Provider value={socket}>
                        <Messenger />
                    </SocketContext.Provider>
                    : <LoginForm/>
            )
    );
};

export default Login;