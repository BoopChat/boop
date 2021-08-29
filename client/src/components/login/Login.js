import "../../styles/login.css"

import GoogleButton from "../GoogleButton.js"
import FacebookButton from "../FacebookButton.js"
import TwitterButton from "../TwitterButton.js"

import { Link } from "react-router-dom";

const Login = () => {
    return (
        <div className="sign-up-container">
            <h1>Welcome back</h1>
            <div className="sign_btns">
                <GoogleButton text="Continue with google"/>
                <FacebookButton text="Continue with facebook"/>
                <TwitterButton text="Continue with twitter"/>
            </div>
            <hr/>
            <span className="switch">Dont have an account? <Link to="/signup">Sign up</Link></span>
        </div>
    );
}

export default Login;
  