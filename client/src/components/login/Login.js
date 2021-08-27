import { GoogleLogin } from "react-google-login";

const Login = () => {
  /*when the user clicks the google sign in button and logs into google, it returns
  data which contains web token to be verified on the server.
  */
  const handleLogin = async (googleData) => {
    try {
      /*Sends the recieved web token to the server to be verified. If verified,
      some user data is returned e.g username, email, imageUrl.
      */
      const res = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      //extract user data from the Object the the fetch command returns
      const user = await res.json();

      //For testing: to be delete.
      console.log(user);
    } catch (err) {
      //For testing: to be delete.
      console.log(err);
    }

    //const data = await res.json();

    //stored the return user come how
  };

  return (
    <section className="container container-center">
      <div className="login">
        <h3>boop messenger</h3>
        <div className="horizontal-line">
          <div></div>
          <span>Login</span>
          <div></div>
        </div>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Continue in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={"single_host_origin"}
        />
      </div>
    </section>
  );
};

export default Login;
