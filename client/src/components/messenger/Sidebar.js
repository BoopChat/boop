import chats from "../../assets/chats.svg"
import contacts from "../../assets/contacts.svg"
import logout from "../../assets/logout.svg"
import settings from "../../assets/settings.svg"
import "../../styles/sidebar.css"

import styled from 'styled-components';
import { NavLink } from "react-router-dom";
import { useState } from 'react';
import { useDispatch } from "react-redux";

import { logOut } from "../login/userSlice";

const Sidebar = ({username, user_pic, user_email}) => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);

    const [profileClick, setProfileClick] = useState(false);
    const handleProfileClick = () => setProfileClick(!profileClick);

    //used to send actions to the redux store to change its state
    const dispatch = useDispatch();
    
    const Button = styled.button`
        background-color: black;
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
    
        &::before, &::after {
            content: "";
            background-color: white;
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
            transform:${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
        }`;

    const SideItems = styled.ul`
        color: white;
        background-color: black;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 120px;
        left: 0;
        width: ${props => props.clicked ? "170px" : "56px"};
        transition: all 0.3s ease;
        border-radius: 0 30px 30px 0;
        padding: 16px 0;
    `;

    const Text = styled.span`
        width: ${props => props.clicked ? "100%" : "0"};
        overflow: hidden;
        margin-left: ${props => props.clicked ? "24px" : "0"};
        transition: all 0.3s ease;
    `;

    const Profile = styled.div`
        color: white;
        background-color: black;
        list-style: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: left;
        position: absolute;
        top: 10px;
        left: 0;
        max-width: ${props => props.clicked ? "440px" : "56px"};
        transition: all 0.3s ease;
        border-radius: 0 30px 30px 0;
        padding: 12px 4px;
    `;

    const Details = styled.div`
        display: ${props => props.clicked ? "flex" : "none"};
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

    return (
        <div>
            <Button clicked={click} onClick={() => handleClick()}></Button>
            <div id="sidebar_container">
                <Profile id="profile" clicked={profileClick}>
                    <img onClick={() => handleProfileClick()} src={user_pic} alt={username + " pic"}/>
                    <Details clicked={profileClick}>
                        <div>
                            <h4>{username}</h4>
                            <h5>{user_email}</h5>
                        </div>
                        <button id="logout" onClick={() => dispatch(logOut())}>
                            <img src={logout} alt="logout"/>
                        </button>
                    </Details>
                </Profile>
                <SideItems clicked={click}>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/chats">
                        <img src={chats} alt="chats"/>
                        <Text clicked={click}>Chats</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/contacts">
                        <img src={contacts} alt="contacts" />
                        <Text clicked={click}>Contacts</Text>
                    </NavLink>
                    <NavLink onClick={() => setClick(false)} activeClassName="active" to="/settings">
                        <img src={settings} alt="settings"/>
                        <Text clicked={click}>Settings</Text>
                    </NavLink>
                </SideItems>
            </div>
        </div>
    )
}

export default Sidebar;