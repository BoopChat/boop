import edit_icon from "../../assets/icons/icons8-edit.svg";

import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../redux-store/userSlice";

import { SettingsController } from "./controllers/Settings";
import { AlertType, useAlertDialogContext } from "./dialogs/AlertDialog";

const Settings = () => {
    // Updating the image url is still not yet implemented

    const dispatch = useDispatch();
    const token = useSelector((state) => state.user.token);
    const { userInfo } = useSelector((state) => state.user);
    const updateUser = (updatedInfo) => dispatch(setUserInfo({ ...updatedInfo }));

    const { display: displayDialog } = useAlertDialogContext();

    const [Name, setName] = useState({
        firstname: userInfo.firstName,
        lastname: userInfo.lastName,
        editing: false, // determines whether name is being edited
    });

    const handleNameChange = (e) => {
        const { name, value } = e.target;
        setName({ ...Name, [name]: value });
    };

    const [displayName, setDisplayName] = useState({
        displayname: userInfo.displayName,
        editing: false, // determines whether displayname is being edited
    });

    const handleDNameChange = (e) => {
        const { name, value } = e.target;
        setDisplayName({ ...displayName, [name]: value });
    };

    const handleEditName = async () => {
        if (!Name.editing)
            setName({ ...Name, editing: true });
        else {
            if (Name.firstname.length < 1 || Name.lastname.length < 1) {
                displayDialog({
                    title: "Error",
                    message: "First name or Last name should not be empty",
                    type: AlertType.Error
                });
                return;
            }

            const { success, msg } = await SettingsController.updateUser({
                userInfo: { firstName: Name.firstname, lastName: Name.lastname }, token });

            if (success) {
                updateUser({ ...userInfo,   firstName: Name.firstname, lastName: Name.lastname });
                setName({ ...Name, editing: false });
                displayDialog({
                    title: "Success",
                    message: msg,
                    type: AlertType.Success
                });
            } else {
                displayDialog({
                    title: "Error",
                    message: msg || "An Error occurred updating your name",
                    type: AlertType.Error
                });
            }
        }
    };

    const handleEditDName = async () => {
        if (!displayName.editing)
            setDisplayName({ ...displayName, editing: true });
        else {
            if (displayName.displayname.length < 1) {
                displayDialog({
                    title: "Error",
                    message: "Display name cannot be empty",
                    type: AlertType.Error
                });
                return;
            }
            const { success, msg } = await SettingsController.updateUser({
                userInfo: { displayName: displayName.displayname }, token });

            if (success) {
                updateUser({ ...userInfo,  displayName: displayName.displayname });
                setDisplayName({ ...displayName, editing: false });
                displayDialog({
                    title: "Success",
                    message: msg,
                    type: AlertType.Success
                });
            } else {
                displayDialog({
                    title: "Error",
                    message: msg || "An Error occurred updating your display name",
                    type: AlertType.Error
                });
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
                        :   <span>{userInfo.displayName}</span>
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