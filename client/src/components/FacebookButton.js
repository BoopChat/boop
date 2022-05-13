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
        <button className="facebook" type="button" onClick={handleLogin}>
            <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path
                    d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                    fill="#FFF"
                />
            </svg>
            <span>{text}</span>
        </button>
    );
};

export default FacebookButton;