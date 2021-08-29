import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Login from "./components/login/Login.js"
import Signup from "./components/signup/Signup.js"

function App() {
    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/signin" component={Login}/>
                    <Route path="/signup" component={Signup}/>
                    <Route path="/" component={Signup}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
