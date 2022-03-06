import { Route, Switch, useLocation } from "react-router";
import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../login/userSlice";
import { io } from "socket.io-client";
import { SearchProvider } from "./hooks/SearchContext";

import Conversations from "./Conversations";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import SearchBox from "./SearchBox";
import Navbar from "./Navbar";

import "../../styles/main_panel.css";

const Messenger = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const [showChat, setShowChat] = useState(false);
    const [currentConvo, setCurrentConvo] = useState({});
    const changeConvo = (id, title, participants) => {
        setCurrentConvo({ id, title, participants });
        setShowChat(true);
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
            <Navbar/>
            <div id="panels">
                <div id="main_panel">
                    <SearchProvider>
                        <SearchBox id="search"/>
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
                    </SearchProvider>
                </div>
                <div id="chat_panel" className={showChat ? "" : "hidden"}>
                    {currentConvo.id ?
                        <Chat
                            conversationId={currentConvo.id}
                            title={currentConvo.title}
                            participants={currentConvo.participants}
                            socket={socket}
                            closeChat={() => setShowChat(false)}
                        />
                        : <></>
                    }
                </div>
            </div>
        </div>
    );
};

export default Messenger;