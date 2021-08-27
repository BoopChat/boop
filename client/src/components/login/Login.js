import { GoogleLogin } from "react-google-login";

const Login = () => {
  const handleLogin = async (googleData) => {
    try {
      const res = await fetch("http://localhost:8000/auth/google", {
        method: "POST",
        body: JSON.stringify({
          token: googleData.tokenId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const user = await res.json();
      console.log(user);
    } catch (err) {
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
