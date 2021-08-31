import Login from "./components/login/Login";
import Messenger from "./components/messenger/Messenger";
import { useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";

function App() {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

    return (
        <BrowserRouter>
            <div className="App">{!isLoggedIn ? <Login /> : <Messenger />}</div>
        </BrowserRouter>
    );
}

export default App;
