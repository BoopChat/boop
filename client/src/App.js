import Login from "./components/login/Login";
import Messenger from "./components/messenger/Messenger";
import { useSelector } from "react-redux";

function App() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  return <div className="App">{!isLoggedIn ? <Login /> : <Messenger />}</div>;
}

export default App;
