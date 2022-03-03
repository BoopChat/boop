import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import Chat from "../../assets/icons/chat";
import Contacts from "../../assets/icons/contacts";
import Settings from "../../assets/icons/settings";
import Arrow from "../../assets/icons/arrow";

import useThemeSwitcher from "./hooks/useThemeSwitcher";
import useLogout from "./hooks/useLogout";

import logout from "../../assets/icons/logout.svg";
import "../../styles/navbar.css";

const OptionsNav = () => {
    const { handleLogOut } = useLogout();
    const { toggleTheme, themeIcon, isDark } = useThemeSwitcher();

    return (
        <div id="options_popup" onClick={(e) => e.stopPropagation()}>
            <button id="toggleTheme" onClick={toggleTheme} title="toggle theme">
                <img src={themeIcon} alt="toggle theme" />
                {isDark ? "Light" : "Dark"}
            </button>
            <button id="logout" onClick={handleLogOut} title="logout">
                <img src={logout} alt="logout" /> Logout
            </button>
        </div>
    );
};

const Navbar = () => {
    const [showOptions, setShowOptions] = useState(false);

    return (
        <div id="nav_container">
            <div className="nav">
                <NavLink to="/conversations" activeClassName="active"> <Chat/> </NavLink>
                <NavLink to="/contacts" activeClassName="active"> <Contacts/> </NavLink>
                <NavLink to="/settings" activeClassName="active"> <Settings/> </NavLink>
                <button className="more" onClick={() => setShowOptions(!showOptions)}>
                    { showOptions && <OptionsNav/> }
                    <Arrow/>
                </button>
            </div>
        </div>
    );
};

export default Navbar;