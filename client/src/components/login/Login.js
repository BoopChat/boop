import "../../styles/login.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logIn, setToken } from "./userSlice";

import GoogleButton from "../GoogleButton.js";
import FacebookButton from "../FacebookButton.js";
import TwitterButton from "../TwitterButton.js";

const Login = () => {
    const dispatch = useDispatch();

    //checks if the user has successfully logged in using a provider
    //dispatches the logIn action to change the user's login state if true;
    //useEffect executes everytime this login page loads or reloads.
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
                // Saves the access token in the redux store.
                dispatch(setToken(data.token));
                // Logs in the user.
                dispatch(logIn());
            }
        };

        fetchData();
    });
    return (
        <div className="sign-in-container">
            <h1>Boop Chat</h1>
            <div className="sign_btns">
                <GoogleButton text="Continue with Google" />
                <FacebookButton text="Continue with facebook" />
                <TwitterButton text="Continue with twitter" />
            </div>
        </div>
    );
};

export default Login;
