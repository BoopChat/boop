import { Route, Switch, useLocation } from "react-router";
import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../login/userSlice";

import Conversations from "./Conversations";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

import "../../styles/messenger.css";

const Messenger = () => {
    const location = useLocation();
    const dispatch = useDispatch();

    const [currentConvo, setCurrentConvo] = useState({});
    const changeConvo = (id, title) => {
        setCurrentConvo({ id, title });
    };

    const userInfo = useSelector((state) => state.user.userInfo);

    const updateUser = (userInfo) => dispatch(setUserInfo(userInfo));

    return (
        <div className="container">
            <Sidebar username={userInfo.displayName} userPic={userInfo.imageUrl} userName={userInfo.firstName} />
            <div id="main_panel">
                <Switch location={location} key={location.pathname}>
                    <Route path="/conversations">
                        <Conversations selectConversation={changeConvo}/>
                    </Route>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/settings" component={Settings}>
                        <Settings userInfo={userInfo} updateUser={updateUser}/>
                    </Route>
                    <Route path="/">
                        <Conversations selectConversation={changeConvo}/>
                    </Route>
                </Switch>
            </div>
            <div id="chat_panel">
                <Chat conversationId={currentConvo.id} title={currentConvo.title} />
            </div>
        </div>
    );
};

export default Messenger;
