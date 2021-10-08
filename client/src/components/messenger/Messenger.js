import { Route, Switch, useLocation } from "react-router";
import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../login/userSlice";

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

    const updateUser = (userInfo) => dispatch(setUserInfo(userInfo));

    return (
        <div className="container">
            <Sidebar username={userInfo.displayName} userPic={userInfo.imageUrl} userName={userInfo.firstName} />
            <div id="panels">
                <div id="main_panel">
                    <Switch location={location} key={location.pathname}>
                        <Route path="/conversations">
                            <Conversations selectConversation={changeConvo}/>
                        </Route>
                        <Route path="/contacts" component={Contacts}/>
                        <Route path="/settings">
                            <Settings userInfo={userInfo} updateUser={updateUser}/>
                        </Route>
                        <Route path="/">
                            <Conversations selectConversation={changeConvo}/>
                        </Route>
                    </Switch>
                </div>
                <div id="chat_panel">
                    {currentConvo.id ?
                        <Chat
                            conversationId={currentConvo.id}
                            title={currentConvo.title}
                            participants={currentConvo.participants}
                        />
                        : <></>
                    }
                </div>
            </div>
        </div>
    );
};

export default Messenger;
