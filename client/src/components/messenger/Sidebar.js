import Chat from "../../assets/icons/chat";
import Contacts from "../../assets/icons/contacts";
import Settings from "../../assets/icons/settings";
import logout from "../../assets/icons/logout.svg";
import "../../styles/sidebar.css";

import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useState, React } from "react";

import useThemeSwitcher from "./hooks/useThemeSwitcher";
import useLogout from "./hooks/useLogout";

const MenuButton = styled.button`
    background-color: var(--raven_coat_glass);
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

    const { handleLogOut } = useLogout();
    const { toggleTheme, themeIcon } = useThemeSwitcher();

    return (
        <div id="sidebar">
            <MenuButton title="Menu" clicked={click} onClick={() => handleClick()}></MenuButton>
            <div id="sidebar_container">
                <Profile id="profile">
                    <img src={userPic} alt={username} />
                </Profile>
                <SideItems clicked={click}>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/conversations">
                        <Chat/>
                        <Text clicked={click}>Chats</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/contacts">
                        <Contacts/>
                        <Text clicked={click}>Contacts</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/settings">
                        <Settings/>
                        <Text clicked={click}>Settings</Text>
                    </NavLink>
                </SideItems>
                <button id="toggleTheme" onClick={toggleTheme} title="toggle theme">
                    <img src={themeIcon} alt="toggle theme" />
                </button>
                <button id="logout" onClick={handleLogOut} title="logout">
                    <img src={logout} alt="logout" />
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
