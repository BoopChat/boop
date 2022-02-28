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
    background-color: var(--raven_coat);
    border: none;
    width: 50px;
    height: 50px;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;
    margin: 20px 0 0 0px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before,
    &::after {
        content: "";
        background-color: var(--white);
        height: 4px;
        width: 25px;
        position: absolute;
        transition: all 0.3s ease;
        margin-top: 5px;
        margin-left: -5px;
    }

    &::before {
        top: ${(props) => (props.clicked ? "24" : "14px")};
        transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
    }

    &::after {
        top: ${(props) => (props.clicked ? "18" : "24px")};
        transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
    }
`;

const SideItems = styled.ul`
    color: var(--white);
    background-color: transparent;
    list-style: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: ${(props) => (props.clicked ? "170px" : "60px")};
    transition: all 0.3s ease;
    border-radius: 0 30px 30px 0;
    padding: 16px 0;
    z-index: 1;
`;

const Text = styled.span`
    width: "fit-content";
    overflow: hidden;
    margin-left: 16px;
    transition: all 0.3s ease;
    padding: 0 5px;
    display: ${(props) => (props.clicked ? "block" : "none")};
`;

const Profile = styled.div`
    color: var(--white);
    background-color: transparent;
    max-width: 56px;
    border-radius: 0 26px 0px 0;
    padding: 14px 5px;
`;

const Sidebar = ({ username, userPic }) => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

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
                <Profile id="profile">
                    <img src={userPic} alt={username} />
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
                <button id="logout" onClick={handleLogOut}>
                    <img src={logout} alt="logout" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
