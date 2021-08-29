import "../../styles/login.css"

import GoogleButton from "../GoogleButton.js"
import FacebookButton from "../FacebookButton.js"
import TwitterButton from "../TwitterButton.js"

import { Link } from "react-router-dom";

const Signup = () => {    
    return (
      <div className="sign-up-container">
        <h1>Create Account</h1>
        <div className="sign_btns">
            <GoogleButton/>
            <FacebookButton/>
            <TwitterButton/>
        </div>
        <hr/>
        <span className="switch">Already have an account? <Link to="/signin">Sign in</Link></span>
      </div>
    );
}

export default Signup;
  