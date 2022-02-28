import "../../styles/login.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logIn, setToken, setUserInfo } from "./userSlice";
import { useSelector } from "react-redux";
import React from "react";

import Messenger from "../messenger/Messenger";
import Loader from "./Loader";

import GoogleButton from "../GoogleButton.js";
import FacebookButton from "../FacebookButton.js";
import TwitterButton from "../TwitterButton.js";

import logo from "../../assets/bg.png";

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
                <img src={logo} alt=" " className="logo"/>
                <h1>Boop Chat</h1>
                <div className="sign_btns">
                    { loginService.google && <GoogleButton text="Continue with Google" /> }
                    { loginService.facebook && <FacebookButton text="Continue with facebook" /> }
                    { loginService.twitter && <TwitterButton text="Continue with twitter" /> }
                </div>
            </div>
        );
    };

    return (
        isLoading() ?
            <Loader text="Getting everything set for you"/> :
            (
                isLoggedIn ? <Messenger/> : <LoginForm/>
            )
    );
};

export default Login;