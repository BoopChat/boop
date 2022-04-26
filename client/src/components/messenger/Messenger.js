import { Route, Switch, useLocation } from "react-router";
import { React, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../redux-store/userSlice";
import { SearchProvider } from "./hooks/SearchContext";
import { setShowChat, updateCurrentConversation } from "../../redux-store/conversationSlice";

import Conversations from "./Conversations";
import Contacts from "./Contacts";
import Settings from "./Settings";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import SearchBox from "./SearchBox";
import Navbar from "./Navbar";
import { AlertDialogProvider, AlertDialog } from "./dialogs/AlertDialog";

import useThemeSwitcher from "./hooks/useThemeSwitcher";

import "../../styles/main_panel.css";

import SocketContext from "../../socketContext";
import { SocketController } from "./controllers/Socket";

const Messenger = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { toggleTheme, themeIcon, isDark } = useThemeSwitcher();
    const userInfo = useSelector((state) => state.user.userInfo);
    const updateUser = (userInfo) => dispatch(setUserInfo(userInfo));
    // Get currently selected conversation from global state.
    const currentConvo = useSelector((state) => state.conversations.currentConversation);

    const socket = useContext(SocketContext);
    SocketController.initListeners(socket);

    const accessSupport = () => {
        const newWindow = window.open("https://discord.gg/pxBjfESPDJ", "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
    };

    const closeChat = () => {
        dispatch(setShowChat(false));
        dispatch(updateCurrentConversation(-1));
    };

    return (
        <div className="container">
            <Sidebar username={userInfo.displayName} userPic={userInfo.imageUrl} toggleTheme={toggleTheme}
                themeIcon={themeIcon} accessSupport={accessSupport}/>
            <Navbar toggleTheme={toggleTheme} themeIcon={themeIcon} isDark={isDark} accessSupport={accessSupport}/>
            <AlertDialogProvider>
                <div id="panels">
                    <div id="main_panel">
                        <SearchProvider>
                            <SearchBox id="search"/>
                            <Switch location={location} key={location.pathname}>
                                <Route path="/conversations">
                                    <Conversations />
                                </Route>
                                <Route path="/contacts" component={Contacts} />
                                <Route path="/settings">
                                    <Settings userInfo={userInfo} updateUser={updateUser} />
                                </Route>
                                <Route path="/">
                                    <Conversations />
                                </Route>
                            </Switch>
                        </SearchProvider>
                    </div>
                    <AlertDialog/>
                    <div id="chat_panel" className={useSelector(state => state.conversations.showChat)? "" : "hidden"}>
                        {currentConvo.id ?
                            <Chat
                                conversationId={currentConvo.id}
                                title={currentConvo.title}
                                participants={currentConvo.participants}
                                closeChat={closeChat}
                                isDark={isDark}
                            />
                            : <></>
                        }
                    </div>
                </div>
            </AlertDialogProvider>
        </div>
    );
};

export default Messenger;