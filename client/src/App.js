import Login from "./components/login/Login";
import { BrowserRouter } from "react-router-dom";
import store from "./redux-store/store";
import { Provider } from "react-redux";

function App() {

    return (
        <Provider store={store}>
            <BrowserRouter>
                <div className="App"><Login /></div>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
