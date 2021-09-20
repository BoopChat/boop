import { Route, Switch, useLocation } from "react-router";
import { useState, React } from "react";

import Conversations from "./Conversations";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import Chat from "./Chat";

import "../../styles/messenger.css";

const Messenger = () => {
    const location = useLocation();

    const [currentConvo, setCurrentConvo] = useState({});
    const changeConvo = (id, title) => {
        setCurrentConvo({ id, title });
    };

    return (
        <div className="container">
            <Sidebar username="James Clarke" user_pic="https://picsum.photos/200" user_email="james243@live.com" />
            <div id="main_panel">
                <Switch location={location} key={location.pathname}>
                    <Route path="/conversations">
                        <Conversations selectConversation={changeConvo}/>
                    </Route>
                    <Route path="/contacts" component={Contacts}/>
                    <Route path="/settings" component={Settings} />
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
