import edit_icon from "../../assets/icons8-edit.svg";

import { useState, React } from "react";

const Settings = ({ userInfo, updateUser }) => {
    // The data is updated locally, but changes are not pushed to the server for now

    const [Name, setName] = useState({
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        editing: false, // determines whether name is being edited
        editLock: false,
    });

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setName({ ...Name, [name]: value });
    };

    const [displayName, setDisplayName] = useState({
        displayname: userInfo.displayName,
        editing: false, // determines whether displayname is being edited
        editLock: false, // locks if user has entered invalid data
    });

    const handleDNameChange = (e) => {
        const { name, value } = e.target;
        setDisplayName({ ...displayName, [name]: value });
    };

    const handleEditName = () => {
        if (!Name.editing)
            setName({ ...Name, editing: true });
        else {
            if (!Name.editLock) { // ignore validation for now
                // commit changes
                updateUser({
                    ...userInfo,
                    firstName: Name.firstname,
                    lastName: Name.lastname,
                });
                setName({ ...Name, editing: false });
            }
        }
    };

    const handleEditDName = () => {
        if (!displayName.editing)
            setDisplayName({ ...displayName, editing: true });
        else {
            if (!displayName.editLock) { // ignore validation for now
                // commit changes
                updateUser({ ...userInfo,  displayName: displayName.displayname });
                setDisplayName({ ...displayName, editing: false });
            }
        }
    };

    return (
        <div id="settings_container">
            <h1>Settings</h1>
            <div className="setting_item">
                <div>
                    <span className="attribute">Name</span>
                    {Name.editing ? (
                        <div>
                            <input
                                value={Name.firstname}
                                placeholder="First Name"
                                name="firstname"
                                type="text"
                                onChange={(e) => handleNameChange(e)}
                            />
                            <input
                                value={Name.lastname}
                                placeholder="Last Name"
                                name="lastname"
                                type="text"
                                onChange={(e) => handleNameChange(e)}
                            />
                        </div>
                    ) : <span>
                        {Name.firstname + " " + Name.lastname}
                    </span>
                    }
                </div>
                <button title="edit name" className="edit" onClick={() => handleEditName()}>
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Display Name</span>
                    {displayName.editing ?
                        <input
                            value={displayName.displayname}
                            placeholder="Display Name"
                            name="displayname"
                            type="text"
                            onChange={(e) => handleDNameChange(e)}
                        />
                        :   <span>{displayName.displayname}</span>
                    }
                </div>
                <button title="edit display name" className="edit" onClick={() => handleEditDName()}>
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Profile Image</span>
                    <img className="profile_img skeleton" src={userInfo.imageUrl} alt=""/>
                </div>
                <button className="edit">
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>
        </div>
    );
};

export default Settings;