import { Route, Switch, useLocation } from "react-router";
import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../login/userSlice";
import { io } from "socket.io-client";

import Conversations from "./Conversations";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

import "../../styles/main_panel.css";

const Messenger = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const [currentConvo, setCurrentConvo] = useState({});
    const changeConvo = (id, title, participants) => {
        setCurrentConvo({ id, title, participants });
    };

    const userInfo = useSelector((state) => state.user.userInfo);
    const token = useSelector((state) => state.user.token);

    const updateUser = (userInfo) => dispatch(setUserInfo(userInfo));

    const [socket] = useState(() => {
        let soc = io({
            auth: {
                token,
            },
        });
        return soc;
    });

    return (
        <div className="container">
            <Sidebar username={userInfo.displayName} userPic={userInfo.imageUrl} />
            <div id="panels">
                <div id="main_panel">
                    <div id="search">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" name="searchIcon">
                            <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8
                                13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 174.6
                                178.9c53.8 7.189 104.3-6.236 145.7-33.46l119.7 119.7c15.62 15.62 41.95 15.62 56.57
                                0C515.9 484.7 515.9 459.3 501.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42
                                128 128c0 70.58-57.42 127-128 128S79.1 278.6 79.1 208z"/>
                        </svg>
                        <input type="text" placeholder="Search" readOnly className="searchBox"/>
                    </div>
                    <Switch location={location} key={location.pathname}>
                        <Route path="/conversations">
                            <Conversations selectConversation={changeConvo} socket={socket} />
                        </Route>
                        <Route path="/contacts" component={Contacts} />
                        <Route path="/settings">
                            <Settings userInfo={userInfo} updateUser={updateUser} />
                        </Route>
                        <Route path="/">
                            <Conversations selectConversation={changeConvo} socket={socket} />
                        </Route>
                    </Switch>
                </div>
                <div id="chat_panel">
                    {currentConvo.id ?
                        <Chat
                            conversationId={currentConvo.id}
                            title={currentConvo.title}
                            participants={currentConvo.participants}
                            socket={socket}
                        />
                        : <></>
                    }
                </div>
            </div>
        </div>
    );
};

export default Messenger;
