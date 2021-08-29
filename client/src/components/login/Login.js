import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { logIn } from "./userSlice";

import "../../styles/login.css"

import FacebookButton from "../FacebookButton.js"
import TwitterButton from "../TwitterButton.js"

const Login = () => {
    //send action to redux store to change states
    const dispatch = useDispatch();
    //handles google login process
    const handleLogin = async (googleData) => {
        const res = await fetch("http://localhost:5000/login/auth/google", {
            method: "POST",
            body: JSON.stringify({
                token: googleData.tokenId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        //extract json data from server response
        const data = await res.json();

        if (!data.error) {
            //sends the login action to the redux store to change user login state
            dispatch(logIn());
        }
    };
    return (
        <div className="sign-in-container">
            <h1>Boop Chat</h1>
            <div className="sign_btns">
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Continue with Google"
                    onSuccess={handleLogin}
                    onFailure={handleLogin}
                    cookiePolicy={"single_host_origin"}
                />
                <FacebookButton text="Continue with facebook" />
                <TwitterButton text="Continue with twitter" />
            </div>
        </div>
    );
};

export default Login;