import "../../styles/login.css"

import GoogleButton from "../GoogleButton.js"
import FacebookButton from "../FacebookButton.js"
import TwitterButton from "../TwitterButton.js"

const Login = () => {
    return (
        <div className="sign-in-container">
            <h1>Boop Chat</h1>
            <div className="sign_btns">
                <GoogleButton text="Continue with google"/>
                <FacebookButton text="Continue with facebook"/>
                <TwitterButton text="Continue with twitter"/>
            </div>
        </div>
    );
}

export default Login;
  