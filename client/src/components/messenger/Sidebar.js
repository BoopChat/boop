import chats from "../../assets/chats.svg";
import contacts from "../../assets/contacts.svg";
import logout from "../../assets/logout.svg";
import settings from "../../assets/settings.svg";
import sun from "../../assets/sun.svg";
import moon from "../../assets/moon.svg";
import "../../styles/sidebar.css";

import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useState, React } from "react";
import { useDispatch } from "react-redux";

import { logOut } from "../login/userSlice";

const MenuButton = styled.button`
    background-color: var(--panel);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 8px 0 0 2px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before,
    &::after {
        content: "";
        background-color: var(--white);
        height: 2px;
        width: 16px;
        position: absolute;
        transition: all 0.3s ease;
    }

    &::before {
        top: ${(props) => (props.clicked ? "24" : "16px")};
        transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
    }

    &::after {
        top: ${(props) => (props.clicked ? "18" : "24px")};
        transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
    }
`;

const SideItems = styled.ul`
    color: var(--white);
    background-color: inherit;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 90px;
    left: 0;
    width: ${(props) => (props.clicked ? "170px" : "56px")};
    transition: all 0.3s ease;
    border-radius: 0 30px 30px 0;
    padding: 16px 0;
    z-index: 1;
`;

const Text = styled.span`
    width: ${(props) => (props.clicked ? "100%" : "0")};
    overflow: hidden;
    margin-left: ${(props) => (props.clicked ? "24px" : "0")};
    transition: all 0.3s ease;
`;

const Profile = styled.div`
    color: var(--white);
    background-color: var(--panel);
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
    position: absolute;
    top: 0;
    left: 0;
    max-width: ${(props) => (props.clicked ? "440px" : "56px")};
    transition: all 0.3s ease;
    border-radius: 0 26px ${(props) => (props.clicked ? "26px" : "0px")} 0;
    padding: 14px 5px;
`;

const Details = styled.div`
    display: ${(props) => (props.clicked ? "flex" : "none")};
    justify-content: space-between;
    align-items: center;

    div {
        padding: 0 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h4 {
        display: inline-block;
    }
`;

const Sidebar = ({ username, userPic, userName }) => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const [profileClick, setProfileClick] = useState(false);
    const handleProfileClick = () => setProfileClick(!profileClick);

    const [themeIcon, setThemeIcon] = useState(() => {
        return document.getElementsByTagName("body")[0].classList[0] === "dark" ? sun : moon;
    });

    // Used to send actions to the redux store to change its state
    const dispatch = useDispatch();

    // handles logout
    // deletes access token cookie from browser
    // dispatches logOut action
    const handleLogOut = async () => {
        const res = await fetch("/api/login/auth/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();
        const { success } = data;

        if (success) {
            // Logs the user out.
            dispatch(logOut());
        }
    };

    const toggleTheme = () => {
        let body = document.getElementsByTagName("body")[0];
        if (body.classList[0] === "light") {
            body.classList.replace("light", "dark");
            localStorage.setItem("theme", "dark");
            setThemeIcon(sun);
        } else {
            body.classList.replace("dark", "light");
            localStorage.setItem("theme", "light");
            setThemeIcon(moon);
        }
    };

    return (
        <div>
            <MenuButton title="Menu" clicked={click} onClick={() => handleClick()}></MenuButton>
            <div id="sidebar_container">
                <Profile id="profile" clicked={profileClick}>
                    <img onClick={() => handleProfileClick()} src={userPic} alt={username + " pic"} />
                    <Details clicked={profileClick}>
                        <div>
                            <h4>{username}</h4>
                            <h5>{userName}</h5>
                        </div>
                        <button id="logout" onClick={handleLogOut}>
                            <img src={logout} alt="logout" />
                        </button>
                    </Details>
                </Profile>
                <SideItems clicked={click}>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/conversations">
                        <img src={chats} alt="conversations" />
                        <Text clicked={click}>Chats</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/contacts">
                        <img src={contacts} alt="contacts" />
                        <Text clicked={click}>Contacts</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/settings">
                        <img src={settings} alt="settings" />
                        <Text clicked={click}>Settings</Text>
                    </NavLink>
                </SideItems>
                <button id="toggleTheme" onClick={toggleTheme}>
                    <img src={themeIcon} alt="toggle theme" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
