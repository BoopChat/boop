import edit_icon from "../../assets/icons8-edit.svg"

import { useState } from 'react';

// this is just test data
// this data should really be fetched
// and then posted when updated and validated
let user_data = {
    display_name: "Cassie",
    first_name: "Cassandra",
    last_name: "Stevens",
    image_url: "https://picsum.photos/200"
}

const Settings = () => {
    const [Name, setName] = useState({
        firstname: user_data.first_name,
        lastname: user_data.last_name,
        editing: false, // determines whether name is being edited
        editLock: false,
    });

    const handleNameChange = (e) => {
        const { name, value } = e.target
        setName({ ...Name, [name]: value })
    }

    const [displayName, setDisplayName] = useState({
        displayname: user_data.display_name,
        editing: false, // determines whether displayname is being edited
        editLock: false, // locks if user has entered invalid data
    });

    const handleDNameChange = (e) => {
        const { name, value } = e.target
        setDisplayName({ ...displayName, [name]: value })
    }

    const handleEditName = () => {
        if (!Name.editing)
            setName({ ...Name, editing: true });
        else {
            if (!Name.editLock) { // ignore validation for now
                // commit changes
                user_data.first_name = Name.firstname;
                user_data.last_name = Name.lastname;
                setName({ ...Name, editing: false })
            }
        }
    }

    const handleEditDName = () => {
        if (!displayName.editing)
            setDisplayName({ ...displayName, editing: true });
        else {
            if (!displayName.editLock) { // ignore validation for now
                // commit changes
                user_data.display_name = displayName.displayname
                setDisplayName({ ...displayName, editing: false });
            }
        }
    }

    return (
        <div>
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
                                {user_data.first_name + " " + user_data.last_name}
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
                        :   <span>{user_data.display_name}</span>
                    }
                </div>
                <button title="edit display name" className="edit" onClick={() => handleEditDName()}>
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>

            <div className="setting_item">
                <div>
                    <span className="attribute">Profile Image</span>
                    <img className="profile_img" src={user_data.image_url} alt="profile"/>
                </div>
                <button className="edit">
                    <img src={edit_icon} alt="edit"/>
                </button>
            </div>
        </div>
    )
}

export default Settings;