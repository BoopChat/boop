import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { logIn } from "./userSlice";

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
    <div className="container center">
      <div className="login">
        <h3 className="title">BOOP MESSENGER</h3>
        <div className="hr-line">
          <div></div>
          <span>Login</span>
          <div></div>
        </div>
        <div className="login-btns">
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Continue with Google"
            onSuccess={handleLogin}
            onFailure={handleLogin}
            cookiePolicy={"single_host_origin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
