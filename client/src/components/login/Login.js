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

        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText="Continue in with Google"
          onSuccess={handleLogin}
          onFailure={handleLogin}
          cookiePolicy={"single_host_origin"}
        />
        <div className="horizontal-line">
          <div></div>
          <span>or Sign in with Username</span>
          <div></div>
        </div>
        <form className="login-from">
          <div className="form-control">
            <span>
              <i className="fas fa-user"></i>
            </span>
            <input type="text" name="username" placeholder="Email" />
          </div>
          <div className="form-control">
            <span>
              <i className="fas fa-lock"></i>
            </span>
            <input type="password" name="password" placeholder="Password" />
          </div>
          <button className="btn">Login</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
